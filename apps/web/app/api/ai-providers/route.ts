import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { CreateAiProviderRequestSchema } from '@/lib/api/schemas/ai-providers';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/schemas/common';
import { authRoute } from '@/lib/api/route-wrapper';
import { encrypt } from '@/lib/crypto/encryption';

// GET /api/ai-providers - List all AiProviders (owned or shared with user)
export const GET = authRoute(
  async ({ user, request }) => {
    const { page, limit } = getPaginationParams(request);
    const skip = (page - 1) * limit;

    // Find providers the user owns OR has access to (via sharing)
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
          ownerId: true,
          createdAt: true,
          updatedAt: true,
          apiKey: false,
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
      prisma.aiProvider.count({ where }),
    ]);

    return NextResponse.json({
      items: providers.map((provider) => {
        const isOwner = provider.ownerId === user.userId;
        const sharedPermission = provider.sharedWith[0]?.permission;
        const canEdit = isOwner || sharedPermission === 'WRITE' || sharedPermission === 'FULL';
        const canShare = isOwner || sharedPermission === 'FULL';

        return {
          id: provider.id,
          name: provider.name,
          provider: provider.provider,
          model: provider.model,
          baseUrl: provider.baseUrl,
          isActive: provider.isActive,
          createdAt: provider.createdAt.toISOString(),
          updatedAt: provider.updatedAt.toISOString(),
          canEdit,
          canShare,
          isOwner,
        };
      }),
      ...getPaginationMeta(total, page, limit),
    });
  },
  { errorLogPrefix: 'List AI providers' }
);

// POST /api/ai-providers - Create a new AiProvider
export const POST = authRoute(
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
          message: 'aiProviderNameExists',
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
