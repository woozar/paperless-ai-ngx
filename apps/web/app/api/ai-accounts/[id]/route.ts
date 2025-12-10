import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { UpdateAiAccountRequestSchema } from '@/lib/api/schemas/ai-accounts';
import { authRoute } from '@/lib/api/route-wrapper';
import { encrypt } from '@/lib/crypto/encryption';

// GET /api/ai-accounts/[id] - Get AiAccount by ID
export const GET = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    const account = await prisma.aiAccount.findFirst({
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
        baseUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        apiKey: false,
      },
    });

    if (!account) {
      return NextResponse.json(
        {
          error: 'aiAccountNotFound',
          message: 'aiAccountNotFound',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...account,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    });
  },
  { errorLogPrefix: 'Get AI account' }
);

// PATCH /api/ai-accounts/[id] - Update AiAccount (owner or WRITE permission)
export const PATCH = authRoute<typeof UpdateAiAccountRequestSchema, { id: string }>(
  async ({ user, params, body }) => {
    // Check if account exists and user has write access (WRITE or FULL permission)
    const existingAccount = await prisma.aiAccount.findFirst({
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

    if (!existingAccount) {
      return NextResponse.json(
        {
          error: 'aiAccountNotFound',
          message: 'aiAccountNotFound',
        },
        { status: 404 }
      );
    }

    const { name, provider, apiKey, baseUrl, isActive } = body;

    // Check name uniqueness if changing
    if (name && name !== existingAccount.name) {
      const duplicateName = await prisma.aiAccount.findFirst({
        where: {
          ownerId: user.userId,
          name,
          id: { not: params.id },
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          {
            error: 'aiAccountNameExists',
            message: 'aiAccountNameExists',
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
      apiKey?: string;
      baseUrl?: string | null;
      isActive?: boolean;
    };

    const updateData: UpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (provider !== undefined) updateData.provider = provider;
    if (baseUrl !== undefined) updateData.baseUrl = baseUrl;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Encrypt API key if provided
    if (apiKey) {
      updateData.apiKey = encrypt(apiKey);
    }

    // Update account
    const updatedAccount = await prisma.aiAccount.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        provider: true,
        baseUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ...updatedAccount,
      createdAt: updatedAccount.createdAt.toISOString(),
      updatedAt: updatedAccount.updatedAt.toISOString(),
    });
  },
  {
    bodySchema: UpdateAiAccountRequestSchema,
    errorLogPrefix: 'Update AI account',
  }
);

// DELETE /api/ai-accounts/[id] - Delete AiAccount (owner only)
export const DELETE = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    // Check if account exists and belongs to user
    const existingAccount = await prisma.aiAccount.findFirst({
      where: {
        id: params.id,
        ownerId: user.userId,
      },
    });

    if (!existingAccount) {
      return NextResponse.json(
        {
          error: 'aiAccountNotFound',
          message: 'aiAccountNotFound',
        },
        { status: 404 }
      );
    }

    // Check if account is referenced by any models
    const modelCount = await prisma.aiModel.count({
      where: { aiAccountId: params.id },
    });

    if (modelCount > 0) {
      return NextResponse.json(
        {
          error: 'aiAccountInUse',
          message: 'aiAccountInUse',
          params: { count: modelCount },
        },
        { status: 400 }
      );
    }

    // Delete account
    await prisma.aiAccount.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  },
  { errorLogPrefix: 'Delete AI account' }
);
