import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { CreateAiProviderRequestSchema } from '@/lib/api/schemas/ai-providers';
import { ApiResponses } from '@/lib/api/responses';
import { encrypt } from '@/lib/crypto/encryption';

// GET /api/ai-providers - List all AiProviders (Admin only)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

    const providers = await prisma.aiProvider.findMany({
      where: {
        ownerId: authUser.userId,
      },
      select: {
        id: true,
        name: true,
        provider: true,
        model: true,
        baseUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      providers: providers.map((provider) => ({
        ...provider,
        apiKey: '***', // Always mask
        createdAt: provider.createdAt.toISOString(),
        updatedAt: provider.updatedAt.toISOString(),
      })),
      total: providers.length,
    });
  } catch (error) {
    console.error('List AI providers error:', error);
    return ApiResponses.serverError();
  }
}

// POST /api/ai-providers - Create a new AiProvider (Admin only)
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
    const parsed = CreateAiProviderRequestSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponses.validationError();
    }

    const { name, provider, model, apiKey, baseUrl } = parsed.data;

    // Check if name already exists for this owner
    const existing = await prisma.aiProvider.findFirst({
      where: {
        ownerId: authUser.userId,
        name,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: 'aiProviderNameExists',
          message: 'errors.aiProviderNameExists',
          params: { name },
        },
        { status: 409 }
      );
    }

    // Encrypt API key
    const encryptedApiKey = encrypt(apiKey);

    // Create provider
    const aiProvider = await prisma.aiProvider.create({
      data: {
        name,
        provider,
        model,
        apiKey: encryptedApiKey,
        baseUrl: baseUrl || null,
        ownerId: authUser.userId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        provider: true,
        model: true,
        baseUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        ...aiProvider,
        apiKey: '***', // Always mask
        createdAt: aiProvider.createdAt.toISOString(),
        updatedAt: aiProvider.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create AI provider error:', error);
    return ApiResponses.serverError();
  }
}
