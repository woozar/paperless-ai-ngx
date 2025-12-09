import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';
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

    return NextResponse.json({
      id: result.id,
      processedAt: result.processedAt.toISOString(),
      aiProvider: result.aiProvider,
      tokensUsed: result.tokensUsed,
      changes: result.changes,
      toolCalls: result.toolCalls,
      originalTitle: result.originalTitle,
    });
  },
  { errorLogPrefix: 'Get document result' }
);
