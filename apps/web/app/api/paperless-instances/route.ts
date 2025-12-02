import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { CreatePaperlessInstanceRequestSchema } from '@/lib/api/schemas/paperless-instances';
import { ApiResponses } from '@/lib/api/responses';
import { encrypt } from '@/lib/crypto/encryption';

// GET /api/paperless-instances - List all PaperlessInstances (Admin only)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

    const instances = await prisma.paperlessInstance.findMany({
      where: {
        ownerId: authUser.userId,
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
        apiToken: '***', // Always mask
        createdAt: instance.createdAt.toISOString(),
        updatedAt: instance.updatedAt.toISOString(),
      })),
      total: instances.length,
    });
  } catch (error) {
    console.error('List paperless instances error:', error);
    return ApiResponses.serverError();
  }
}

// POST /api/paperless-instances - Create a new PaperlessInstance (Admin only)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

    const body = await request.json();
    const parsed = CreatePaperlessInstanceRequestSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponses.validationError();
    }

    const { name, apiUrl, apiToken } = parsed.data;

    // Check if name already exists for this owner
    const existing = await prisma.paperlessInstance.findFirst({
      where: {
        ownerId: authUser.userId,
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
        ownerId: authUser.userId,
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
        apiToken: '***', // Always mask
        createdAt: instance.createdAt.toISOString(),
        updatedAt: instance.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create paperless instance error:', error);
    return ApiResponses.serverError();
  }
}
