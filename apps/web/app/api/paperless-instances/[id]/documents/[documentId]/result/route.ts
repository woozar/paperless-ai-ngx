import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { PaperlessClient } from '@repo/paperless-client';
import { authRoute } from '@/lib/api/route-wrapper';
import { decrypt } from '@/lib/crypto/encryption';
import {
  checkInstanceAccess,
  checkDocumentAccess,
  instanceNotFoundResponse,
  documentNotFoundResponse,
} from '@/lib/api/document-access';

// GET /api/paperless-instances/[id]/documents/[documentId]/result - Get latest processing result
export const GET = authRoute(
  async ({ user, params }) => {
    const { id, documentId } = params as { id: string; documentId: string };

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

    // Get latest processing result
    const result = await prisma.documentProcessingResult.findFirst({
      where: {
        documentId: documentId,
      },
      orderBy: {
        processedAt: 'desc',
      },
    });

    if (!result) {
      return NextResponse.json(
        {
          error: 'noResultFound',
          message: 'noResultFound',
        },
        { status: 404 }
      );
    }

    // Get changes if available
    const changes = result.changes as {
      suggestedTags?: Array<{ id?: number; name?: string }>;
    } | null;

    // If no changes, return early without enrichment
    if (!changes) {
      return NextResponse.json({
        id: result.id,
        processedAt: result.processedAt.toISOString(),
        aiProvider: result.aiProvider,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        estimatedCost: result.estimatedCost,
        changes: null,
        toolCalls: result.toolCalls,
        originalTitle: result.originalTitle,
      });
    }

    // Enrich tags with isAssigned/isRemoved flags based on document's current tags
    const documentTagIds = new Set(document.tagIds);

    // Load Paperless tags to validate/correct IDs and compute isAssigned
    // Old analysis results may have incorrect IDs for names
    const client = new PaperlessClient({
      baseUrl: instance.apiUrl,
      token: decrypt(instance.apiToken),
    });
    const paperlessTags = await client.getTags();
    const tagIdToName = new Map(paperlessTags.results.map((t) => [t.id, t.name]));
    const tagNameToId = new Map(paperlessTags.results.map((t) => [t.name.toLowerCase(), t.id]));

    // Collect all suggested tag IDs to identify removed tags
    const suggestedTagIds = new Set<number>();

    const enrichedSuggestedTags = changes.suggestedTags?.map((tag) => {
      if (tag.id != null && tag.name) {
        // Tag has ID and name - verify they match
        const actualName = tagIdToName.get(tag.id);
        if (actualName?.toLowerCase() === tag.name.toLowerCase()) {
          // ID matches name - use as-is
          suggestedTagIds.add(tag.id);
          return { ...tag, isAssigned: documentTagIds.has(tag.id) };
        }
        // ID doesn't match name - look up correct ID by name
        const correctId = tagNameToId.get(tag.name.toLowerCase());
        if (correctId != null) {
          suggestedTagIds.add(correctId);
          return { ...tag, id: correctId, isAssigned: documentTagIds.has(correctId) };
        }
        // Name doesn't exist in Paperless - remove ID (new tag)
        return { name: tag.name, isAssigned: false };
      } else if (tag.id != null) {
        // Only ID, no name - use ID directly
        suggestedTagIds.add(tag.id);
        return { ...tag, isAssigned: documentTagIds.has(tag.id) };
      } else if (tag.name) {
        // Only name, no ID - look up ID by name
        const existingId = tagNameToId.get(tag.name.toLowerCase());
        if (existingId != null) {
          suggestedTagIds.add(existingId);
          return { ...tag, id: existingId, isAssigned: documentTagIds.has(existingId) };
        }
      }
      // New tag that doesn't exist yet
      return { ...tag, isAssigned: false };
    });

    // Find tags on the document that are NOT suggested (will be removed)
    const removedTags = document.tagIds
      .filter((tagId) => !suggestedTagIds.has(tagId))
      .map((tagId) => ({
        id: tagId,
        name: tagIdToName.get(tagId),
        isAssigned: true,
        isRemoved: true,
      }));

    // Combine suggested tags with removed tags
    const allTags = [...(enrichedSuggestedTags ?? []), ...removedTags];

    const enrichedChanges = {
      ...changes,
      suggestedTags: allTags,
    };

    return NextResponse.json({
      id: result.id,
      processedAt: result.processedAt.toISOString(),
      aiProvider: result.aiProvider,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      estimatedCost: result.estimatedCost,
      changes: enrichedChanges,
      toolCalls: result.toolCalls,
      originalTitle: result.originalTitle,
    });
  },
  { errorLogPrefix: 'Get document result' }
);
