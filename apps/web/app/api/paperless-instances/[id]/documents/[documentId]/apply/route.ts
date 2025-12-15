import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { PaperlessClient, PaperlessApiError } from '@repo/paperless-client';
import { authRoute } from '@/lib/api/route-wrapper';
import {
  checkInstanceAccess,
  checkDocumentAccess,
  instanceNotFoundResponse,
  documentNotFoundResponse,
  createPaperlessClient,
} from '@/lib/api/document-access';
import { ApplyFieldRequestSchema } from '@/lib/api/schemas/documents';
import type { DocumentAnalysisResult } from '@repo/api-client';
import {
  getOrCreateCorrespondent,
  getOrCreateDocumentType,
  getOrCreateTags,
} from '@/lib/paperless/apply-suggestions';

type ApplyField = 'title' | 'correspondent' | 'documentType' | 'tags' | 'date' | 'all';

interface SuggestedItem {
  id?: number;
  name: string;
}

// Update data types
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

// Helper to apply all fields from analysis result
async function applyAllFields(
  client: PaperlessClient,
  analysisResult: NonNullable<DocumentAnalysisResult>,
  updateData: PaperlessUpdateData,
  localUpdate: LocalUpdateData
): Promise<void> {
  // Title
  if (analysisResult.suggestedTitle) {
    updateData.title = analysisResult.suggestedTitle;
    localUpdate.title = analysisResult.suggestedTitle;
  }

  // Correspondent
  if (analysisResult.suggestedCorrespondent) {
    const correspondentId = await getOrCreateCorrespondent(
      client,
      analysisResult.suggestedCorrespondent
    );
    updateData.correspondent = correspondentId;
    localUpdate.correspondentId = correspondentId;
  }

  // Document Type
  if (analysisResult.suggestedDocumentType) {
    const documentTypeId = await getOrCreateDocumentType(
      client,
      analysisResult.suggestedDocumentType
    );
    updateData.document_type = documentTypeId;
  }

  // Tags
  if (analysisResult.suggestedTags && analysisResult.suggestedTags.length > 0) {
    const tagIds = await getOrCreateTags(client, analysisResult.suggestedTags);
    updateData.tags = tagIds;
    localUpdate.tagIds = tagIds;
  }

  // Date
  if (analysisResult.suggestedDate) {
    updateData.created = analysisResult.suggestedDate;
    localUpdate.documentDate = new Date(analysisResult.suggestedDate);
  }
}

// POST /api/paperless-instances/[id]/documents/[documentId]/apply - Apply AI suggestions to document
export const POST = authRoute(
  async ({ user, params, body }) => {
    const { id, documentId } = params as { id: string; documentId: string };
    const { field, value } = body as {
      field: ApplyField;
      value?: string | SuggestedItem | SuggestedItem[];
    };

    // Check instance access
    const instance = await checkInstanceAccess(id, user.userId);
    if (!instance) {
      return instanceNotFoundResponse();
    }

    // Check document exists and belongs to instance
    const document = await checkDocumentAccess(documentId, id);
    if (!document) {
      return documentNotFoundResponse();
    }

    const client = createPaperlessClient(instance);

    try {
      // For 'all' field, load the latest processing result
      let analysisResult: DocumentAnalysisResult | null = null;
      if (field === 'all') {
        const processingResult = await prisma.documentProcessingResult.findFirst({
          where: { documentId },
          orderBy: { processedAt: 'desc' },
        });
        if (!processingResult?.changes) {
          return NextResponse.json(
            { error: 'noProcessingResult', message: 'noProcessingResult' },
            { status: 404 }
          );
        }
        analysisResult = processingResult.changes as unknown as DocumentAnalysisResult;
      }

      // Build the update objects
      const updateData: PaperlessUpdateData = {};
      const localUpdate: LocalUpdateData = {};

      // Apply based on field
      switch (field) {
        case 'title': {
          const titleValue = value as string;
          updateData.title = titleValue;
          localUpdate.title = titleValue;
          break;
        }

        case 'correspondent': {
          const correspondentValue = value as SuggestedItem;
          const correspondentId = await getOrCreateCorrespondent(client, correspondentValue);
          updateData.correspondent = correspondentId;
          localUpdate.correspondentId = correspondentId;
          break;
        }

        case 'documentType': {
          const documentTypeValue = value as SuggestedItem;
          const documentTypeId = await getOrCreateDocumentType(client, documentTypeValue);
          updateData.document_type = documentTypeId;
          // Note: documentType is not stored in local DB, only in Paperless
          break;
        }

        case 'tags': {
          const tagsValue = value as Array<{ id: number } | { name: string }>;
          const tagIds = await getOrCreateTags(client, tagsValue);
          updateData.tags = tagIds;
          localUpdate.tagIds = tagIds;
          break;
        }

        case 'date': {
          const dateValue = value as string;
          updateData.created = dateValue;
          localUpdate.documentDate = new Date(dateValue);
          break;
        }

        case 'all': {
          // v8 ignore next -- @preserve (analysisResult is set when field='all', or we return 404 earlier)
          if (!analysisResult) break;
          await applyAllFields(client, analysisResult, updateData, localUpdate);
          break;
        }
      }

      // Update document in Paperless
      await client.updateDocument(document.paperlessId, updateData);

      // Update local database
      await prisma.paperlessDocument.update({
        where: { id: documentId },
        data: localUpdate,
      });

      return NextResponse.json({
        success: true,
        field,
        appliedValues: updateData,
      });
    } catch (error) {
      if (error instanceof PaperlessApiError) {
        console.error('Paperless API error:', error.message, 'Status:', error.statusCode);
        return NextResponse.json(
          { error: 'paperlessUpdateFailed', message: 'paperlessUpdateFailed' },
          { status: error.statusCode >= 500 ? 502 : error.statusCode }
        );
      }
      console.error('Apply error:', error);
      throw error;
    }
  },
  {
    bodySchema: ApplyFieldRequestSchema,
    errorLogPrefix: 'Apply document suggestions',
  }
);
