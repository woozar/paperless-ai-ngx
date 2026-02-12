import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authRoute } from '@/lib/api/route-wrapper';

const TestPaperlessConnectionSchema = z.object({
  apiUrl: z.url(),
  apiToken: z.string().min(1),
});

export const POST = authRoute(
  async ({ body }) => {
    const { apiUrl, apiToken } = body;

    try {
      // Test connection by fetching /api/documents/ with limit=1
      const response = await fetch(`${apiUrl}/api/documents/?page=1&page_size=1`, {
        headers: {
          Authorization: `Token ${apiToken}`,
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'connectionError',
              params: { status: response.status },
            },
          },
          { status: 200 }
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'connectionError',
            params: { error: errorMessage },
          },
        },
        { status: 200 }
      );
    }
  },
  {
    bodySchema: TestPaperlessConnectionSchema,
    errorLogPrefix: 'Test Paperless connection',
  }
);
