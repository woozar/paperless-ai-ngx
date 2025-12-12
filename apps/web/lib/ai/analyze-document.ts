import { generateText, stepCountIs } from 'ai';
import { prisma, Prisma } from '@repo/database';
import { PaperlessClient } from '@repo/paperless-client';
import { decrypt } from '@/lib/crypto/encryption';
import { createAiSdkProvider } from './provider-factory';
import { createPaperlessTools } from './tools/paperless-tools';
import {
  DocumentAnalysisResultSchema,
  type DocumentAnalysisResult,
} from './schemas/document-analysis';
import {
  getSettingsDefaults,
  parseStoredSettingValue,
  type Settings,
} from '@/lib/api/schemas/settings';

export interface AnalyzeDocumentParams {
  documentId: string;
  aiBotId: string;
  userId: string;
}

/**
 * Get a single setting value from the database, falling back to default.
 */
async function getSetting<K extends keyof Settings>(key: K): Promise<Settings[K]> {
  const dbSetting = await prisma.setting.findUnique({
    where: { settingKey: key },
  });

  if (!dbSetting) {
    return getSettingsDefaults()[key];
  }

  return parseStoredSettingValue(key, dbSetting.settingValue) as Settings[K];
}

export interface AnalyzeDocumentResponse {
  success: true;
  result: DocumentAnalysisResult;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number | null;
}

/**
 * Analyzes a document using AI to suggest metadata (title, tags, correspondent, document type).
 * The AI has access to tools to query existing Paperless metadata.
 */
export async function analyzeDocument(
  params: AnalyzeDocumentParams
): Promise<AnalyzeDocumentResponse> {
  const { documentId, aiBotId, userId } = params;

  // Load document with its Paperless instance
  const document = await prisma.paperlessDocument.findUnique({
    where: { id: documentId },
    include: {
      paperlessInstance: true,
    },
  });

  if (!document) {
    throw new Error('Document not found');
  }

  // Load AI bot with its model and account
  const aiBot = await prisma.aiBot.findUnique({
    where: { id: aiBotId },
    include: {
      aiModel: {
        include: {
          aiAccount: true,
        },
      },
    },
  });

  if (!aiBot) {
    throw new Error('AI bot not found');
  }

  // Create Paperless client for tools
  const paperlessClient = new PaperlessClient({
    baseUrl: document.paperlessInstance.apiUrl,
    token: decrypt(document.paperlessInstance.apiToken),
  });

  // Create AI provider from the account
  const aiSdkProvider = createAiSdkProvider(aiBot.aiModel.aiAccount);
  const modelId = aiBot.aiModel.modelIdentifier;

  // Create tools for the AI
  const tools = createPaperlessTools(paperlessClient);

  // Load user identity from settings
  const userIdentity = await getSetting('ai.context.identity');

  // Build the prompt with document content
  // v8 ignore next -- @preserve - defensive fallback, responseLanguage has DB default
  const responseLanguage = (aiBot.responseLanguage as ResponseLanguage) || 'DOCUMENT';
  const prompt = buildAnalysisPrompt(
    document.title,
    document.content,
    responseLanguage,
    userIdentity
  );

  // Call the AI with tools enabled
  const response = await generateText({
    model: aiSdkProvider(modelId),
    system: aiBot.systemPrompt,
    tools,
    stopWhen: stepCountIs(5), // Allow multiple tool calls (up to 5 steps)
    prompt,
  });

  // Parse the final response to extract structured data
  const rawAnalysisResult = parseAnalysisResponse(response.text);

  // Validate and correct IDs against current Paperless data
  // (AI sometimes returns incorrect IDs for names)
  const correctedResult = await validateAndCorrectIds(rawAnalysisResult, paperlessClient);

  // Enrich tags with isAssigned flag based on document's current tags
  const documentTagIds = new Set(document.tagIds);
  const analysisResult = {
    ...correctedResult,
    suggestedTags: correctedResult.suggestedTags.map((tag) => ({
      ...tag,
      isAssigned: 'id' in tag ? documentTagIds.has(tag.id) : false,
    })),
  };

  // Calculate total tokens used
  const inputTokens = response.usage?.inputTokens ?? 0;
  const outputTokens = response.usage?.outputTokens ?? 0;
  const totalTokens = inputTokens + outputTokens;

  // Calculate estimated cost based on model pricing (per 1M tokens)
  const { inputTokenPrice, outputTokenPrice } = aiBot.aiModel;
  const estimatedCost =
    inputTokenPrice != null && outputTokenPrice != null
      ? (inputTokens * inputTokenPrice + outputTokens * outputTokenPrice) / 1_000_000
      : null;

  // Extract tool calls from all steps for transparency
  const allToolCalls = response.steps.flatMap((step) =>
    step.toolCalls.map((tc) => ({
      toolName: tc.toolName,
      input: tc.input as Record<string, unknown>,
    }))
  );

  // Track usage metrics
  await prisma.aiUsageMetric.create({
    data: {
      provider: aiBot.aiModel.aiAccount.provider,
      model: aiBot.aiModel.modelIdentifier,
      promptTokens: inputTokens,
      completionTokens: outputTokens,
      totalTokens,
      estimatedCost,
      documentId: document.paperlessId,
      userId,
      aiAccountId: aiBot.aiModel.aiAccount.id,
      aiModelId: aiBot.aiModel.id,
      aiBotId: aiBot.id,
    },
  });

  // Save processing result with tool calls
  await prisma.documentProcessingResult.create({
    data: {
      documentId: document.id,
      aiProvider: `${aiBot.aiModel.aiAccount.provider}/${aiBot.aiModel.modelIdentifier}`,
      inputTokens,
      outputTokens,
      estimatedCost,
      changes: analysisResult as object,
      toolCalls: allToolCalls as Prisma.InputJsonValue,
      originalTitle: document.title,
    },
  });

  return {
    success: true,
    result: analysisResult,
    inputTokens,
    outputTokens,
    estimatedCost,
  };
}

type ResponseLanguage = 'DOCUMENT' | 'GERMAN' | 'ENGLISH';

function getLanguageInstruction(responseLanguage: ResponseLanguage): string {
  const baseInstruction = `
NOTE: When matching tags, correspondents, and document types, match them regardless of their language.
The existing metadata in Paperless may be in any language - always try to find the best semantic match.
For example, if the document is about an "Invoice" and there's a tag "Rechnung" (German for invoice), use that tag.`;

  switch (responseLanguage) {
    case 'GERMAN':
      return `LANGUAGE: You MUST respond in German. The suggestedTitle and reasoning fields must be in German.
${baseInstruction}`;
    case 'ENGLISH':
      return `LANGUAGE: You MUST respond in English. The suggestedTitle and reasoning fields must be in English.
${baseInstruction}`;
    case 'DOCUMENT':
    default:
      return `LANGUAGE: Respond in the same language as the document content. The suggestedTitle and reasoning should match the document's language.
${baseInstruction}`;
  }
}

function buildAnalysisPrompt(
  title: string,
  content: string,
  responseLanguage: ResponseLanguage,
  userIdentity: string
): string {
  // Truncate content if too long
  const maxContentLength = 8000;
  const truncatedContent =
    content.length > maxContentLength ? content.substring(0, maxContentLength) + '...' : content;

  const languageInstruction = getLanguageInstruction(responseLanguage);

  // Build identity context if provided
  const identityContext = userIdentity.trim()
    ? `\nUSER IDENTITY: The document owner is "${userIdentity}". When analyzing contracts or correspondence, if this name appears as one of the parties, the OTHER party should be identified as the correspondent.\n`
    : '';

  return `Analyze the following document and suggest appropriate metadata.
${identityContext}

${languageInstruction}

IMPORTANT: Before making suggestions, you MUST use the available tools to:
1. Search for existing tags (searchTags)
2. Search for existing correspondents (searchCorrespondents)
3. Search for existing document types (searchDocumentTypes)

Prefer existing items in Paperless, but you may suggest new items to be created if no good match exists.

FIELD DEFINITIONS:
- suggestedTitle: A clear, descriptive title for the document. Do NOT include the sender/company name here - that belongs in the correspondent field. Good examples: "Rechnung Nr. 12345", "Vertrag vom 01.01.2024", "Stromabrechnung Q1 2024"
- suggestedCorrespondent: REQUIRED - The sender, company, or organization that created/sent this document. You MUST always provide a correspondent. Include "id" if an existing correspondent matches, omit "id" if suggesting a new one to be created. Never leave this empty or null.
- suggestedDocumentType: REQUIRED - The type/category of document. You MUST always provide a document type. Include "id" if an existing type matches, omit "id" if suggesting a new one to be created. Never leave this empty or null.
- suggestedTags: Relevant keywords/categories that help organize the document. Include "id" for existing tags, omit "id" for new tags to be created.
- suggestedDate: The document's primary date in ISO format (YYYY-MM-DD). This is the date most relevant to the document, e.g. invoice date, letter date, contract date. Return null if no clear date can be extracted.

Document Title: ${title}

Document Content:
${truncatedContent}

After using the tools, provide your analysis in the following JSON format:
{
  "suggestedTitle": "A clear, descriptive title WITHOUT the company name",
  "suggestedCorrespondent": { "id": 123, "name": "Existing Company" } OR { "name": "New Company to create" },
  "suggestedDocumentType": { "id": 123, "name": "Existing Type" } OR { "name": "New Type to create" },
  "suggestedTags": [{ "id": 123, "name": "Existing Tag" }, { "name": "New Tag to create" }],
  "suggestedDate": "2024-01-15" OR null,
  "confidence": 0.85,
  "reasoning": "Brief explanation of your suggestions"
}

REMINDER: suggestedCorrespondent and suggestedDocumentType are REQUIRED and must never be null or empty.`;
}

function parseAnalysisResponse(text: string): DocumentAnalysisResult {
  const jsonString = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  const parsed = JSON.parse(jsonString);
  return DocumentAnalysisResultSchema.parse(parsed);
}

/**
 * Validates and corrects IDs in the analysis result against current Paperless data.
 * The AI sometimes returns incorrect IDs for names, so we verify each ID matches its name.
 */
async function validateAndCorrectIds(
  result: DocumentAnalysisResult,
  paperlessClient: PaperlessClient
): Promise<DocumentAnalysisResult> {
  // Load all metadata from Paperless
  const [tagsResponse, correspondentsResponse, documentTypesResponse] = await Promise.all([
    paperlessClient.getTags(),
    paperlessClient.getCorrespondents(),
    paperlessClient.getDocumentTypes(),
  ]);

  // Build lookup maps: id -> name and name -> id
  const tagIdToName = new Map(tagsResponse.results.map((t) => [t.id, t.name]));
  const tagNameToId = new Map(tagsResponse.results.map((t) => [t.name.toLowerCase(), t.id]));

  const correspondentIdToName = new Map(correspondentsResponse.results.map((c) => [c.id, c.name]));
  const correspondentNameToId = new Map(
    correspondentsResponse.results.map((c) => [c.name.toLowerCase(), c.id])
  );

  const docTypeIdToName = new Map(documentTypesResponse.results.map((d) => [d.id, d.name]));
  const docTypeNameToId = new Map(
    documentTypesResponse.results.map((d) => [d.name.toLowerCase(), d.id])
  );

  // Helper to validate/correct a single item with id and name
  function correctItem(
    item: { id?: number; name: string },
    idToName: Map<number, string>,
    nameToId: Map<string, number>
  ): { id?: number; name: string } {
    if (item.id != null) {
      // Check if the ID matches the name
      const actualName = idToName.get(item.id);
      if (actualName?.toLowerCase() === item.name.toLowerCase()) {
        // ID and name match - all good
        return item;
      }
      // ID doesn't match name - look up correct ID by name
      const correctId = nameToId.get(item.name.toLowerCase());
      if (correctId != null) {
        return { id: correctId, name: item.name };
      }
      // Name doesn't exist in Paperless - remove ID (will be created)
      return { name: item.name };
    }

    // No ID provided - check if name exists and add ID
    const existingId = nameToId.get(item.name.toLowerCase());
    if (existingId != null) {
      return { id: existingId, name: item.name };
    }
    return item;
  }

  // Correct tags
  const correctedTags = result.suggestedTags.map((tag) => {
    if ('id' in tag && tag.id != null) {
      const actualName = tagIdToName.get(tag.id);
      if (actualName?.toLowerCase() === tag.name?.toLowerCase()) {
        return tag;
      }
      // ID doesn't match - look up by name
      const correctId = tag.name ? tagNameToId.get(tag.name.toLowerCase()) : undefined;
      if (correctId != null) {
        return { id: correctId, name: tag.name };
      }
      // Name doesn't exist - remove ID
      return { name: tag.name! };
    }
    // No ID - check if name exists
    // v8 ignore next -- @preserve (NewTagSchema requires name when no ID)
    if (tag.name) {
      const existingId = tagNameToId.get(tag.name.toLowerCase());
      if (existingId != null) {
        return { id: existingId, name: tag.name };
      }
    }
    return tag;
  });

  return {
    ...result,
    suggestedCorrespondent: correctItem(
      result.suggestedCorrespondent,
      correspondentIdToName,
      correspondentNameToId
    ),
    suggestedDocumentType: correctItem(
      result.suggestedDocumentType,
      docTypeIdToName,
      docTypeNameToId
    ),
    suggestedTags: correctedTags,
  };
}
