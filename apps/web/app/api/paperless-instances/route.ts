import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { CreatePaperlessInstanceRequestSchema } from '@/lib/api/schemas/paperless-instances';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/schemas/common';
import { adminRoute } from '@/lib/api/route-wrapper';
import { encrypt } from '@/lib/crypto/encryption';

// GET /api/paperless-instances - List all PaperlessInstances (Admin only, paginated)
export const GET = adminRoute(
  async ({ user, request }) => {
    const { page, limit } = getPaginationParams(request);
    const skip = (page - 1) * limit;
    const where = { ownerId: user.userId };

    const [instances, total] = await Promise.all([
      prisma.paperlessInstance.findMany({
        where,
        select: {
          id: true,
          name: true,
          apiUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.paperlessInstance.count({ where }),
    ]);

    return NextResponse.json({
      items: instances.map((instance) => ({
        ...instance,
        apiToken: '***',
        createdAt: instance.createdAt.toISOString(),
        updatedAt: instance.updatedAt.toISOString(),
      })),
      ...getPaginationMeta(total, page, limit),
    });
  },
  { errorLogPrefix: 'List paperless instances' }
);

// POST /api/paperless-instances - Create a new PaperlessInstance (Admin only)
export const POST = adminRoute(
  async ({ user, body }) => {
    const { name, apiUrl, apiToken } = body;

    // Check if name already exists for this owner
    const existing = await prisma.paperlessInstance.findFirst({
      where: {
        ownerId: user.userId,
        name,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: 'paperlessInstanceNameExists',
          message: 'errors.paperlessInstanceNameExists',
          params: { name },
        },
        { status: 409 }
      );
    }

    // Encrypt API token
    const encryptedToken = encrypt(apiToken);

    // Create instance
    const instance = await prisma.paperlessInstance.create({
      data: {
        name,
        apiUrl,
        apiToken: encryptedToken,
        ownerId: user.userId,
      },
      select: {
        id: true,
        name: true,
        apiUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        ...instance,
        apiToken: '***',
        createdAt: instance.createdAt.toISOString(),
        updatedAt: instance.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  },
  {
    bodySchema: CreatePaperlessInstanceRequestSchema,
    errorLogPrefix: 'Create paperless instance',
  }
);
