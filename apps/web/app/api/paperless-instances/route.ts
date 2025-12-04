import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { CreatePaperlessInstanceRequestSchema } from '@/lib/api/schemas/paperless-instances';
import { adminRoute } from '@/lib/api/route-wrapper';
import { encrypt } from '@/lib/crypto/encryption';

// GET /api/paperless-instances - List all PaperlessInstances (Admin only)
export const GET = adminRoute(
  async ({ user }) => {
    const instances = await prisma.paperlessInstance.findMany({
      where: {
        ownerId: user.userId,
      },
      select: {
        id: true,
        name: true,
        apiUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      instances: instances.map((instance) => ({
        ...instance,
        apiToken: '***',
        createdAt: instance.createdAt.toISOString(),
        updatedAt: instance.updatedAt.toISOString(),
      })),
      total: instances.length,
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
