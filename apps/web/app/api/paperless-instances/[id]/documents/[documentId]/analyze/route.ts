import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';
import { analyzeDocument } from '@/lib/ai/analyze-document';
import { AnalyzeDocumentRequestSchema } from '@/lib/api/schemas';
import {
  checkInstanceAccess,
  checkDocumentAccess,
  instanceNotFoundResponse,
  documentNotFoundResponse,
} from '@/lib/api/document-access';

// POST /api/paperless-instances/[id]/documents/[documentId]/analyze - Analyze document with AI
export const POST = authRoute(
  async ({ user, params, body }) => {
    const { id, documentId } = params as { id: string; documentId: string };
    const { aiBotId } = body as { aiBotId: string };

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

    // Check AI bot access
    const aiBot = await prisma.aiBot.findFirst({
      where: {
        id: aiBotId,
        OR: [
          { ownerId: user.userId },
          {
            sharedWith: {
              some: {
                OR: [{ userId: user.userId }, { userId: null }],
              },
            },
          },
        ],
      },
    });

    if (!aiBot) {
      return NextResponse.json(
        {
          error: 'aiBotNotFound',
          message: 'aiBotNotFound',
        },
        { status: 404 }
      );
    }

    // Analyze the document
    const result = await analyzeDocument({
      documentId,
      aiBotId,
      userId: user.userId,
    });

    return NextResponse.json(result);
  },
  {
    bodySchema: AnalyzeDocumentRequestSchema,
    errorLogPrefix: 'Analyze document',
  }
);
