import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { UpdatePaperlessInstanceRequestSchema } from '@/lib/api/schemas/paperless-instances';
import { ApiResponses } from '@/lib/api/responses';
import { encrypt } from '@/lib/crypto/encryption';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/paperless-instances/[id] - Get PaperlessInstance by ID (Admin only)
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

    const instance = await prisma.paperlessInstance.findFirst({
      where: {
        id,
        ownerId: authUser.userId,
      },
      select: {
        id: true,
        name: true,
        apiUrl: true,
        isActive: true,
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
      apiToken: '***', // Always mask
      createdAt: instance.createdAt.toISOString(),
      updatedAt: instance.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Get paperless instance error:', error);
    return ApiResponses.serverError();
  }
}

// PATCH /api/paperless-instances/[id] - Update PaperlessInstance (Admin only)
export async function PATCH(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

    const body = await request.json();
    const parsed = UpdatePaperlessInstanceRequestSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponses.validationError();
    }

    // Check if instance exists and belongs to user
    const existingInstance = await prisma.paperlessInstance.findFirst({
      where: {
        id,
        ownerId: authUser.userId,
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

    const { name, apiUrl, apiToken, isActive } = parsed.data;

    // Check name uniqueness if changing
    if (name && name !== existingInstance.name) {
      const duplicateName = await prisma.paperlessInstance.findFirst({
        where: {
          ownerId: authUser.userId,
          name,
          id: { not: id },
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
      isActive?: boolean;
    };

    const updateData: UpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (apiUrl !== undefined) updateData.apiUrl = apiUrl;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Encrypt API token if provided
    if (apiToken) {
      updateData.apiToken = encrypt(apiToken);
    }

    // Update instance
    const instance = await prisma.paperlessInstance.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        apiUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ...instance,
      apiToken: '***', // Always mask
      createdAt: instance.createdAt.toISOString(),
      updatedAt: instance.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Update paperless instance error:', error);
    return ApiResponses.serverError();
  }
}

// DELETE /api/paperless-instances/[id] - Delete PaperlessInstance (Admin only)
export async function DELETE(request: NextRequest, context: RouteContext): Promise<NextResponse> {
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
    const existingInstance = await prisma.paperlessInstance.findFirst({
      where: {
        id,
        ownerId: authUser.userId,
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
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete paperless instance error:', error);
    return ApiResponses.serverError();
  }
}
