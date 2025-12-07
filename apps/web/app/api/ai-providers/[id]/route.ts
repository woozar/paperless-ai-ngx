import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { UpdateAiProviderRequestSchema } from '@/lib/api/schemas/ai-providers';
import { authRoute } from '@/lib/api/route-wrapper';
import { encrypt } from '@/lib/crypto/encryption';

// GET /api/ai-providers/[id] - Get AiProvider by ID
export const GET = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    const provider = await prisma.aiProvider.findFirst({
      where: {
        id: params.id,
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

    if (!provider) {
      return NextResponse.json(
        {
          error: 'aiProviderNotFound',
          message: 'aiProviderNotFound',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...provider,
      createdAt: provider.createdAt.toISOString(),
      updatedAt: provider.updatedAt.toISOString(),
    });
  },
  { errorLogPrefix: 'Get AI provider' }
);

// PATCH /api/ai-providers/[id] - Update AiProvider (owner or WRITE permission)
export const PATCH = authRoute<typeof UpdateAiProviderRequestSchema, { id: string }>(
  async ({ user, params, body }) => {
    // Check if provider exists and user has write access (WRITE or FULL permission)
    const existingProvider = await prisma.aiProvider.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: user.userId },
          {
            sharedWith: {
              some: {
                OR: [{ userId: user.userId }, { userId: null }],
                permission: { in: ['WRITE', 'FULL'] },
              },
            },
          },
        ],
      },
    });

    if (!existingProvider) {
      return NextResponse.json(
        {
          error: 'aiProviderNotFound',
          message: 'aiProviderNotFound',
        },
        { status: 404 }
      );
    }

    const { name, provider, model, apiKey, baseUrl, isActive } = body;

    // Check name uniqueness if changing
    if (name && name !== existingProvider.name) {
      const duplicateName = await prisma.aiProvider.findFirst({
        where: {
          ownerId: user.userId,
          name,
          id: { not: params.id },
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          {
            error: 'aiProviderNameExists',
            message: 'aiProviderNameExists',
            params: { name },
          },
          { status: 409 }
        );
      }
    }

    // Build update data
    type UpdateData = {
      name?: string;
      provider?: 'openai' | 'anthropic' | 'ollama' | 'google' | 'custom';
      model?: string;
      apiKey?: string;
      baseUrl?: string | null;
      isActive?: boolean;
    };

    const updateData: UpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (provider !== undefined) updateData.provider = provider;
    if (model !== undefined) updateData.model = model;
    if (baseUrl !== undefined) updateData.baseUrl = baseUrl;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Encrypt API key if provided
    if (apiKey) {
      updateData.apiKey = encrypt(apiKey);
    }

    // Update provider
    const updatedProvider = await prisma.aiProvider.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({
      ...updatedProvider,
      createdAt: updatedProvider.createdAt.toISOString(),
      updatedAt: updatedProvider.updatedAt.toISOString(),
    });
  },
  {
    bodySchema: UpdateAiProviderRequestSchema,
    errorLogPrefix: 'Update AI provider',
  }
);

// DELETE /api/ai-providers/[id] - Delete AiProvider (Admin only)
export const DELETE = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    // Check if provider exists and belongs to user
    const existingProvider = await prisma.aiProvider.findFirst({
      where: {
        id: params.id,
        ownerId: user.userId,
      },
    });

    if (!existingProvider) {
      return NextResponse.json(
        {
          error: 'aiProviderNotFound',
          message: 'aiProviderNotFound',
        },
        { status: 404 }
      );
    }

    // Check if provider is referenced by any bots
    const botCount = await prisma.aiBot.count({
      where: { aiProviderId: params.id },
    });

    if (botCount > 0) {
      return NextResponse.json(
        {
          error: 'aiProviderInUse',
          message: 'aiProviderInUse',
          params: { count: botCount },
        },
        { status: 400 }
      );
    }

    // Delete provider
    await prisma.aiProvider.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  },
  { errorLogPrefix: 'Delete AI provider' }
);
