import { generateText, stepCountIs } from 'ai';
import { prisma, Prisma } from '@repo/database';
import { PaperlessClient } from '@repo/paperless-client';
import { decrypt } from '@/lib/crypto/encryption';
import { createAiSdkProvider, getModelId } from './provider-factory';
import { createPaperlessTools } from './tools/paperless-tools';
import {
  DocumentAnalysisResultSchema,
  type DocumentAnalysisResult,
} from './schemas/document-analysis';

export interface AnalyzeDocumentParams {
  documentId: string;
  aiBotId: string;
  userId: string;
}

export interface AnalyzeDocumentResponse {
  success: true;
  result: DocumentAnalysisResult;
  tokensUsed: number;
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

  // Load AI bot with its provider
  const aiBot = await prisma.aiBot.findUnique({
    where: { id: aiBotId },
    include: {
      aiProvider: true,
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

  // Create AI provider
  const aiSdkProvider = createAiSdkProvider(aiBot.aiProvider);
  const modelId = getModelId(aiBot.aiProvider);

  // Create tools for the AI
  const tools = createPaperlessTools(paperlessClient);

  // Build the prompt with document content
  const responseLanguage = (aiBot.responseLanguage as ResponseLanguage) ?? 'DOCUMENT';
  const prompt = buildAnalysisPrompt(document.title, document.content, responseLanguage);

  // Call the AI with tools enabled
  const response = await generateText({
    model: aiSdkProvider(modelId),
    system: aiBot.systemPrompt,
    tools,
    stopWhen: stepCountIs(5), // Allow multiple tool calls (up to 5 steps)
    prompt,
  });

  // Parse the final response to extract structured data
  const analysisResult = parseAnalysisResponse(response.text);

  // Calculate total tokens used
  const inputTokens = response.usage?.inputTokens ?? 0;
  const outputTokens = response.usage?.outputTokens ?? 0;
  const totalTokens = inputTokens + outputTokens;

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
      provider: aiBot.aiProvider.provider,
      model: aiBot.aiProvider.model,
      promptTokens: inputTokens,
      completionTokens: outputTokens,
      totalTokens,
      documentId: document.paperlessId,
      userId,
      aiProviderId: aiBot.aiProvider.id,
      aiBotId: aiBot.id,
    },
  });

  // Save processing result with tool calls
  await prisma.documentProcessingResult.create({
    data: {
      documentId: document.id,
      aiProvider: `${aiBot.aiProvider.provider}/${aiBot.aiProvider.model}`,
      tokensUsed: totalTokens,
      changes: analysisResult as object,
      toolCalls: allToolCalls as Prisma.InputJsonValue,
      originalTitle: document.title,
    },
  });

  return {
    success: true,
    result: analysisResult,
    tokensUsed: totalTokens,
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
  responseLanguage: ResponseLanguage
): string {
  // Truncate content if too long
  const maxContentLength = 8000;
  const truncatedContent =
    content.length > maxContentLength ? content.substring(0, maxContentLength) + '...' : content;

  const languageInstruction = getLanguageInstruction(responseLanguage);

  return `Analyze the following document and suggest appropriate metadata.

${languageInstruction}

IMPORTANT: Before making suggestions, you MUST use the available tools to:
1. Search for existing tags (searchTags)
2. Search for existing correspondents (searchCorrespondents)
3. Search for existing document types (searchDocumentTypes)

Only suggest items that exist in Paperless. Do not suggest new items.

FIELD DEFINITIONS:
- suggestedTitle: A clear, descriptive title for the document. Do NOT include the sender/company name here - that belongs in the correspondent field. Good examples: "Rechnung Nr. 12345", "Vertrag vom 01.01.2024", "Stromabrechnung Q1 2024"
- suggestedCorrespondent: REQUIRED - The sender, company, or organization that created/sent this document. You MUST always provide a correspondent. Include "id" if an existing correspondent matches, omit "id" if suggesting a new one to be created. Never leave this empty or null.
- suggestedDocumentType: REQUIRED - The type/category of document. You MUST always provide a document type. Include "id" if an existing type matches, omit "id" if suggesting a new one to be created. Never leave this empty or null.
- suggestedTags: Relevant keywords/categories that help organize the document (only existing tags with id)

Document Title: ${title}

Document Content:
${truncatedContent}

After using the tools, provide your analysis in the following JSON format:
{
  "suggestedTitle": "A clear, descriptive title WITHOUT the company name",
  "suggestedCorrespondent": { "id": 123, "name": "Existing Company" } OR { "name": "New Company to create" },
  "suggestedDocumentType": { "id": 123, "name": "Existing Type" } OR { "name": "New Type to create" },
  "suggestedTags": [{ "id": 123, "name": "Tag1" }, { "id": 456, "name": "Tag2" }],
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
