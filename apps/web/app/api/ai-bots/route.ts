import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { CreateAiBotRequestSchema } from '@/lib/api/schemas/ai-bots';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/schemas/common';
import { authRoute } from '@/lib/api/route-wrapper';

// GET /api/ai-bots - List all AiBots (owned or shared with user)
export const GET = authRoute(
  async ({ user, request }) => {
    const { page, limit } = getPaginationParams(request);
    const skip = (page - 1) * limit;

    // Find bots the user owns OR has access to (via sharing)
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

    const [bots, total] = await Promise.all([
      prisma.aiBot.findMany({
        where,
        select: {
          id: true,
          name: true,
          systemPrompt: true,
          responseLanguage: true,
          aiProviderId: true,
          ownerId: true,
          aiProvider: {
            select: {
              id: true,
              name: true,
              provider: true,
            },
          },
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
      prisma.aiBot.count({ where }),
    ]);

    return NextResponse.json({
      items: bots.map((bot) => {
        const isOwner = bot.ownerId === user.userId;
        const sharedPermission = bot.sharedWith[0]?.permission;
        const canEdit = isOwner || sharedPermission === 'WRITE' || sharedPermission === 'FULL';
        const canShare = isOwner || sharedPermission === 'FULL';

        return {
          id: bot.id,
          name: bot.name,
          systemPrompt: bot.systemPrompt,
          responseLanguage: bot.responseLanguage,
          aiProviderId: bot.aiProviderId,
          aiProvider: bot.aiProvider,
          createdAt: bot.createdAt.toISOString(),
          updatedAt: bot.updatedAt.toISOString(),
          canEdit,
          canShare,
          isOwner,
        };
      }),
      ...getPaginationMeta(total, page, limit),
    });
  },
  { errorLogPrefix: 'List AI bots' }
);

// POST /api/ai-bots - Create a new AiBot
export const POST = authRoute(
  async ({ user, body }) => {
    const { name, aiProviderId, systemPrompt, responseLanguage } = body;

    // Check if name already exists for this owner
    const existing = await prisma.aiBot.findFirst({
      where: {
        ownerId: user.userId,
        name,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: 'aiBotNameExists',
          message: 'aiBotNameExists',
          params: { name },
        },
        { status: 409 }
      );
    }

    // Verify that the AI provider exists and belongs to the user
    const provider = await prisma.aiProvider.findFirst({
      where: {
        id: aiProviderId,
        ownerId: user.userId,
      },
    });

    if (!provider) {
      return NextResponse.json(
        {
          error: 'aiProviderNotFound',
          message: 'aiProviderNotFound',
        },
        { status: 400 }
      );
    }

    // Create bot
    const bot = await prisma.aiBot.create({
      data: {
        name,
        systemPrompt,
        responseLanguage,
        aiProviderId,
        ownerId: user.userId,
      },
      select: {
        id: true,
        name: true,
        systemPrompt: true,
        responseLanguage: true,
        aiProviderId: true,
        aiProvider: {
          select: {
            id: true,
            name: true,
            provider: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        ...bot,
        createdAt: bot.createdAt.toISOString(),
        updatedAt: bot.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  },
  {
    bodySchema: CreateAiBotRequestSchema,
    errorLogPrefix: 'Create AI bot',
  }
);
