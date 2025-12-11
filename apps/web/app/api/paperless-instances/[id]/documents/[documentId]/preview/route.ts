import { NextResponse } from 'next/server';
import { PaperlessClient, PaperlessApiError } from '@repo/paperless-client';
import { authRoute } from '@/lib/api/route-wrapper';
import { decrypt } from '@/lib/crypto/encryption';
import {
  checkInstanceAccess,
  checkDocumentAccess,
  instanceNotFoundResponse,
  documentNotFoundResponse,
} from '@/lib/api/document-access';

// GET /api/paperless-instances/[id]/documents/[documentId]/preview - Get document preview (PDF)
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

    // Create Paperless client and fetch preview
    const client = new PaperlessClient({
      baseUrl: instance.apiUrl,
      token: decrypt(instance.apiToken),
    });

    try {
      const previewResponse = await client.getDocumentPreview(document.paperlessId);

      // Get content type from original response, default to PDF
      const contentType = previewResponse.headers.get('content-type') || 'application/pdf';

      // Stream the response through
      return new NextResponse(previewResponse.body, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${document.title || 'document'}.pdf"`,
        },
      });
    } catch (error) {
      if (error instanceof PaperlessApiError) {
        return NextResponse.json(
          { error: 'previewFetchFailed', message: 'previewFetchFailed' },
          { status: error.statusCode >= 500 ? 502 : error.statusCode }
        );
      }
      throw error;
    }
  },
  { errorLogPrefix: 'Get document preview' }
);
