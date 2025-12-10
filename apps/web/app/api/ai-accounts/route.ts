import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { CreateAiAccountRequestSchema } from '@/lib/api/schemas/ai-accounts';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/schemas/common';
import { authRoute } from '@/lib/api/route-wrapper';
import { encrypt } from '@/lib/crypto/encryption';

// GET /api/ai-accounts - List all AiAccounts (owned or shared with user)
export const GET = authRoute(
  async ({ user, request }) => {
    const { page, limit } = getPaginationParams(request);
    const skip = (page - 1) * limit;

    // Find accounts the user owns OR has access to (via sharing)
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

    const [accounts, total] = await Promise.all([
      prisma.aiAccount.findMany({
        where,
        select: {
          id: true,
          name: true,
          provider: true,
          baseUrl: true,
          isActive: true,
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
      prisma.aiAccount.count({ where }),
    ]);

    return NextResponse.json({
      items: accounts.map((account) => {
        const isOwner = account.ownerId === user.userId;
        const sharedPermission = account.sharedWith[0]?.permission;
        const canEdit = isOwner || sharedPermission === 'WRITE' || sharedPermission === 'FULL';
        const canShare = isOwner || sharedPermission === 'FULL';

        return {
          id: account.id,
          name: account.name,
          provider: account.provider,
          baseUrl: account.baseUrl,
          isActive: account.isActive,
          createdAt: account.createdAt.toISOString(),
          updatedAt: account.updatedAt.toISOString(),
          canEdit,
          canShare,
          isOwner,
        };
      }),
      ...getPaginationMeta(total, page, limit),
    });
  },
  { errorLogPrefix: 'List AI accounts' }
);

// POST /api/ai-accounts - Create a new AiAccount
export const POST = authRoute(
  async ({ user, body }) => {
    const { name, provider, apiKey, baseUrl } = body;

    // Check if name already exists for this owner
    const existing = await prisma.aiAccount.findFirst({
      where: {
        ownerId: user.userId,
        name,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: 'aiAccountNameExists',
          message: 'aiAccountNameExists',
          params: { name },
        },
        { status: 409 }
      );
    }

    // Encrypt API key
    const encryptedApiKey = encrypt(apiKey);

    // Create account
    const aiAccount = await prisma.aiAccount.create({
      data: {
        name,
        provider,
        apiKey: encryptedApiKey,
        baseUrl: baseUrl || null,
        ownerId: user.userId,
        isActive: true,
      },
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

    return NextResponse.json(
      {
        ...aiAccount,
        createdAt: aiAccount.createdAt.toISOString(),
        updatedAt: aiAccount.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  },
  {
    bodySchema: CreateAiAccountRequestSchema,
    errorLogPrefix: 'Create AI account',
  }
);
