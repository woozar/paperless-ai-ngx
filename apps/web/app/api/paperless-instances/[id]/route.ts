import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { UpdatePaperlessInstanceRequestSchema } from '@/lib/api/schemas/paperless-instances';
import { adminRoute } from '@/lib/api/route-wrapper';
import { encrypt } from '@/lib/crypto/encryption';

// GET /api/paperless-instances/[id] - Get PaperlessInstance by ID (Admin only)
export const GET = adminRoute<never, { id: string }>(
  async ({ user, params }) => {
    const instance = await prisma.paperlessInstance.findFirst({
      where: {
        id: params.id,
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

    if (!instance) {
      return NextResponse.json(
        {
          error: 'paperlessInstanceNotFound',
          message: 'errors.paperlessInstanceNotFound',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...instance,
      apiToken: '***',
      createdAt: instance.createdAt.toISOString(),
      updatedAt: instance.updatedAt.toISOString(),
    });
  },
  { errorLogPrefix: 'Get paperless instance' }
);

// PATCH /api/paperless-instances/[id] - Update PaperlessInstance (Admin only)
export const PATCH = adminRoute<typeof UpdatePaperlessInstanceRequestSchema, { id: string }>(
  async ({ user, params, body }) => {
    // Check if instance exists and belongs to user
    const existingInstance = await prisma.paperlessInstance.findFirst({
      where: {
        id: params.id,
        ownerId: user.userId,
      },
    });

    if (!existingInstance) {
      return NextResponse.json(
        {
          error: 'paperlessInstanceNotFound',
          message: 'errors.paperlessInstanceNotFound',
        },
        { status: 404 }
      );
    }

    const { name, apiUrl, apiToken } = body;

    // Check name uniqueness if changing
    if (name && name !== existingInstance.name) {
      const duplicateName = await prisma.paperlessInstance.findFirst({
        where: {
          ownerId: user.userId,
          name,
          id: { not: params.id },
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          {
            error: 'paperlessInstanceNameExists',
            message: 'errors.paperlessInstanceNameExists',
            params: { name },
          },
          { status: 409 }
        );
      }
    }

    // Build update data
    type UpdateData = {
      name?: string;
      apiUrl?: string;
      apiToken?: string;
    };

    const updateData: UpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (apiUrl !== undefined) updateData.apiUrl = apiUrl;

    // Encrypt API token if provided
    if (apiToken) {
      updateData.apiToken = encrypt(apiToken);
    }

    // Update instance
    const instance = await prisma.paperlessInstance.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        apiUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ...instance,
      apiToken: '***',
      createdAt: instance.createdAt.toISOString(),
      updatedAt: instance.updatedAt.toISOString(),
    });
  },
  {
    bodySchema: UpdatePaperlessInstanceRequestSchema,
    errorLogPrefix: 'Update paperless instance',
  }
);

// DELETE /api/paperless-instances/[id] - Delete PaperlessInstance (Admin only)
export const DELETE = adminRoute<never, { id: string }>(
  async ({ user, params }) => {
    // Check if instance exists and belongs to user
    const existingInstance = await prisma.paperlessInstance.findFirst({
      where: {
        id: params.id,
        ownerId: user.userId,
      },
    });

    if (!existingInstance) {
      return NextResponse.json(
        {
          error: 'paperlessInstanceNotFound',
          message: 'errors.paperlessInstanceNotFound',
        },
        { status: 404 }
      );
    }

    // Delete instance
    await prisma.paperlessInstance.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  },
  { errorLogPrefix: 'Delete paperless instance' }
);
