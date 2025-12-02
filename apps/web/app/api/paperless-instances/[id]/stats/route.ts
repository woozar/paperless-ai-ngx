import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { ApiResponses } from '@/lib/api/responses';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/paperless-instances/[id]/stats - Get document counts for a PaperlessInstance (Admin only)
export async function GET(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

    // Check if instance exists and belongs to user
    const instance = await prisma.paperlessInstance.findFirst({
      where: {
        id,
        ownerId: authUser.userId,
      },
      select: { id: true },
    });

    if (!instance) {
      return NextResponse.json(
        {
          error: 'paperlessInstanceNotFound',
          message: 'errors.paperlessInstanceNotFound',
        },
        { status: 404 }
      );
    }

    const [documents, processingQueue] = await Promise.all([
      prisma.paperlessDocument.count({ where: { paperlessInstanceId: id } }),
      prisma.processingQueue.count({ where: { paperlessInstanceId: id } }),
    ]);

    return NextResponse.json({
      documents,
      processingQueue,
    });
  } catch (error) {
    console.error('Get paperless instance stats error:', error);
    return ApiResponses.serverError();
  }
}
