import { prisma } from '@repo/database';
import { PaperlessClient } from '@repo/paperless-client';
import type { DocumentAnalysisResult } from '@repo/api-client';

interface SuggestedItem {
  id?: number;
  name: string;
}

interface PaperlessUpdateData {
  title?: string;
  correspondent?: number;
  document_type?: number;
  tags?: number[];
  created?: string;
}

interface LocalUpdateData {
  title?: string;
  correspondentId?: number | null;
  tagIds?: number[];
  documentDate?: Date;
}

export interface AutoApplySettings {
  autoApplyTitle: boolean;
  autoApplyCorrespondent: boolean;
  autoApplyDocumentType: boolean;
  autoApplyTags: boolean;
  autoApplyDate: boolean;
}

export interface ApplySuggestionsParams {
  client: PaperlessClient;
  paperlessDocumentId: number;
  localDocumentId: string;
  analysisResult: NonNullable<DocumentAnalysisResult>;
  settings: AutoApplySettings;
}

export interface ApplySuggestionsResult {
  success: boolean;
  appliedFields: string[];
  error?: string;
}

// Helper to get or create correspondent
export async function getOrCreateCorrespondent(
  client: PaperlessClient,
  correspondent: SuggestedItem
): Promise<number> {
  if (correspondent.id) {
    return correspondent.id;
  }
  const created = await client.createCorrespondent(correspondent.name);
  return created.id;
}

// Helper to get or create document type
export async function getOrCreateDocumentType(
  client: PaperlessClient,
  documentType: SuggestedItem
): Promise<number> {
  if (documentType.id) {
    return documentType.id;
  }
  const created = await client.createDocumentType(documentType.name);
  return created.id;
}

// Helper to get or create tags
export async function getOrCreateTags(
  client: PaperlessClient,
  tags: Array<{ id: number } | { name: string }>
): Promise<number[]> {
  const tagIds: number[] = [];
  for (const tag of tags) {
    if ('id' in tag) {
      tagIds.push(tag.id);
    } else {
      // Schema guarantees name exists when id is missing
      const created = await client.createTag(tag.name);
      tagIds.push(created.id);
    }
  }
  return tagIds;
}

interface UpdateContext {
  client: PaperlessClient;
  analysisResult: NonNullable<DocumentAnalysisResult>;
  updateData: PaperlessUpdateData;
  localUpdate: LocalUpdateData;
  appliedFields: string[];
}

async function applyTitle(ctx: UpdateContext): Promise<void> {
  if (!ctx.analysisResult.suggestedTitle) return;
  ctx.updateData.title = ctx.analysisResult.suggestedTitle;
  ctx.localUpdate.title = ctx.analysisResult.suggestedTitle;
  ctx.appliedFields.push('title');
}

async function applyCorrespondent(ctx: UpdateContext): Promise<void> {
  if (!ctx.analysisResult.suggestedCorrespondent) return;
  const correspondentId = await getOrCreateCorrespondent(
    ctx.client,
    ctx.analysisResult.suggestedCorrespondent
  );
  ctx.updateData.correspondent = correspondentId;
  ctx.localUpdate.correspondentId = correspondentId;
  ctx.appliedFields.push('correspondent');
}

async function applyDocumentType(ctx: UpdateContext): Promise<void> {
  if (!ctx.analysisResult.suggestedDocumentType) return;
  const documentTypeId = await getOrCreateDocumentType(
    ctx.client,
    ctx.analysisResult.suggestedDocumentType
  );
  ctx.updateData.document_type = documentTypeId;
  ctx.appliedFields.push('documentType');
}

async function applyTags(ctx: UpdateContext): Promise<void> {
  if (!ctx.analysisResult.suggestedTags?.length) return;
  const tagIds = await getOrCreateTags(ctx.client, ctx.analysisResult.suggestedTags);
  ctx.updateData.tags = tagIds;
  ctx.localUpdate.tagIds = tagIds;
  ctx.appliedFields.push('tags');
}

async function applyDate(ctx: UpdateContext): Promise<void> {
  if (!ctx.analysisResult.suggestedDate) return;
  ctx.updateData.created = ctx.analysisResult.suggestedDate;
  ctx.localUpdate.documentDate = new Date(ctx.analysisResult.suggestedDate);
  ctx.appliedFields.push('date');
}

type FieldApplier = (ctx: UpdateContext) => Promise<void>;

const fieldAppliers: Array<{ setting: keyof AutoApplySettings; apply: FieldApplier }> = [
  { setting: 'autoApplyTitle', apply: applyTitle },
  { setting: 'autoApplyCorrespondent', apply: applyCorrespondent },
  { setting: 'autoApplyDocumentType', apply: applyDocumentType },
  { setting: 'autoApplyTags', apply: applyTags },
  { setting: 'autoApplyDate', apply: applyDate },
];

async function persistChanges(
  client: PaperlessClient,
  paperlessDocumentId: number,
  localDocumentId: string,
  updateData: PaperlessUpdateData,
  localUpdate: LocalUpdateData
): Promise<void> {
  await client.updateDocument(paperlessDocumentId, updateData);

  if (Object.keys(localUpdate).length > 0) {
    await prisma.paperlessDocument.update({
      where: { id: localDocumentId },
      data: localUpdate,
    });
  }
}

/**
 * Applies AI suggestions to a document based on auto-apply settings.
 * Used by both manual apply route and automated queue processing.
 */
export async function applySuggestions(
  params: ApplySuggestionsParams
): Promise<ApplySuggestionsResult> {
  const { client, paperlessDocumentId, localDocumentId, analysisResult, settings } = params;

  const ctx: UpdateContext = {
    client,
    analysisResult,
    updateData: {},
    localUpdate: {},
    appliedFields: [],
  };

  try {
    for (const { setting, apply } of fieldAppliers) {
      if (settings[setting]) {
        await apply(ctx);
      }
    }

    if (ctx.appliedFields.length > 0) {
      await persistChanges(
        client,
        paperlessDocumentId,
        localDocumentId,
        ctx.updateData,
        ctx.localUpdate
      );
    }

    return { success: true, appliedFields: ctx.appliedFields };
  } catch (error) {
    return {
      success: false,
      appliedFields: ctx.appliedFields,
      error: error instanceof Error ? error.message : 'Unknown error applying suggestions',
    };
  }
}

/**
 * Checks if any auto-apply setting is enabled.
 */
export function hasAutoApplyEnabled(settings: AutoApplySettings): boolean {
  return (
    settings.autoApplyTitle ||
    settings.autoApplyCorrespondent ||
    settings.autoApplyDocumentType ||
    settings.autoApplyTags ||
    settings.autoApplyDate
  );
}
