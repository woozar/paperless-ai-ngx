import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { CreateAiProviderRequestSchema } from '@/lib/api/schemas/ai-providers';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/schemas/common';
import { adminRoute } from '@/lib/api/route-wrapper';
import { encrypt } from '@/lib/crypto/encryption';

// GET /api/ai-providers - List all AiProviders (Admin only, paginated)
export const GET = adminRoute(
  async ({ user, request }) => {
    const { page, limit } = getPaginationParams(request);
    const skip = (page - 1) * limit;
    const where = { ownerId: user.userId };

    const [providers, total] = await Promise.all([
      prisma.aiProvider.findMany({
        where,
        select: {
          id: true,
          name: true,
          provider: true,
          model: true,
          baseUrl: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          apiKey: false,
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.aiProvider.count({ where }),
    ]);

    return NextResponse.json({
      items: providers.map((provider) => ({
        ...provider,
        createdAt: provider.createdAt.toISOString(),
        updatedAt: provider.updatedAt.toISOString(),
      })),
      ...getPaginationMeta(total, page, limit),
    });
  },
  { errorLogPrefix: 'List AI providers' }
);

// POST /api/ai-providers - Create a new AiProvider (Admin only)
export const POST = adminRoute(
  async ({ user, body }) => {
    const { name, provider, model, apiKey, baseUrl } = body;

    // Check if name already exists for this owner
    const existing = await prisma.aiProvider.findFirst({
      where: {
        ownerId: user.userId,
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
        ownerId: user.userId,
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
        apiKey: false,
      },
    });

    return NextResponse.json(
      {
        ...aiProvider,
        createdAt: aiProvider.createdAt.toISOString(),
        updatedAt: aiProvider.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  },
  {
    bodySchema: CreateAiProviderRequestSchema,
    errorLogPrefix: 'Create AI provider',
  }
);
