import { NextResponse } from 'next/server';
import { authRoute } from '@/lib/api/route-wrapper';
import {
  checkInstanceAccess,
  instanceNotFoundResponse,
  createPaperlessClient,
} from '@/lib/api/document-access';

// GET /api/paperless-instances/[id]/tags - Get available tags from Paperless instance
export const GET = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    const instance = await checkInstanceAccess(params.id, user.userId);
    if (!instance) {
      return instanceNotFoundResponse();
    }

    const client = createPaperlessClient(instance);
    const tagsResponse = await client.getTags();

    return NextResponse.json({
      tags: tagsResponse.results.map((tag) => ({
        id: tag.id,
        name: tag.name,
        documentCount: tag.document_count,
      })),
    });
  },
  { errorLogPrefix: 'Get paperless tags' }
);
