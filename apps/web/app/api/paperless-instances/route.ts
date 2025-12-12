import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { CreatePaperlessInstanceRequestSchema } from '@/lib/api/schemas/paperless-instances';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/schemas/common';
import { authRoute } from '@/lib/api/route-wrapper';
import { encrypt } from '@/lib/crypto/encryption';

// GET /api/paperless-instances - List all PaperlessInstances (owned or shared with user)
export const GET = authRoute(
  async ({ user, request }) => {
    const { page, limit } = getPaginationParams(request);
    const skip = (page - 1) * limit;

    // Find instances the user owns OR has access to (via sharing)
    const where = {
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
    };

    const [instances, total] = await Promise.all([
      prisma.paperlessInstance.findMany({
        where,
        select: {
          id: true,
          name: true,
          apiUrl: true,
          importFilterTags: true,
          ownerId: true,
          createdAt: true,
          updatedAt: true,
          sharedWith: {
            where: {
              OR: [{ userId: user.userId }, { userId: null }],
            },
            select: {
              permission: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.paperlessInstance.count({ where }),
    ]);

    return NextResponse.json({
      items: instances.map((instance) => {
        const isOwner = instance.ownerId === user.userId;
        const sharedPermission = instance.sharedWith[0]?.permission;
        const canEdit = isOwner || sharedPermission === 'WRITE' || sharedPermission === 'FULL';
        const canShare = isOwner || sharedPermission === 'FULL';

        return {
          id: instance.id,
          name: instance.name,
          apiUrl: instance.apiUrl,
          apiToken: '***',
          importFilterTags: instance.importFilterTags,
          createdAt: instance.createdAt.toISOString(),
          updatedAt: instance.updatedAt.toISOString(),
          canEdit,
          canShare,
          isOwner,
        };
      }),
      ...getPaginationMeta(total, page, limit),
    });
  },
  { errorLogPrefix: 'List paperless instances' }
);

// POST /api/paperless-instances - Create a new PaperlessInstance
export const POST = authRoute(
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
          message: 'paperlessInstanceNameExists',
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
        importFilterTags: true,
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
