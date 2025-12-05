import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { CreateAiBotRequestSchema } from '@/lib/api/schemas/ai-bots';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/schemas/common';
import { adminRoute } from '@/lib/api/route-wrapper';

// GET /api/ai-bots - List all AiBots (Admin only, paginated)
export const GET = adminRoute(
  async ({ user, request }) => {
    const { page, limit } = getPaginationParams(request);
    const skip = (page - 1) * limit;
    const where = { ownerId: user.userId };

    const [bots, total] = await Promise.all([
      prisma.aiBot.findMany({
        where,
        select: {
          id: true,
          name: true,
          systemPrompt: true,
          aiProviderId: true,
          aiProvider: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.aiBot.count({ where }),
    ]);

    return NextResponse.json({
      items: bots.map((bot) => ({
        ...bot,
        createdAt: bot.createdAt.toISOString(),
        updatedAt: bot.updatedAt.toISOString(),
      })),
      ...getPaginationMeta(total, page, limit),
    });
  },
  { errorLogPrefix: 'List AI bots' }
);

// POST /api/ai-bots - Create a new AiBot (Admin only)
export const POST = adminRoute(
  async ({ user, body }) => {
    const { name, aiProviderId, systemPrompt } = body;

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
          message: 'errors.aiBotNameExists',
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
          message: 'errors.aiProviderNotFound',
        },
        { status: 400 }
      );
    }

    // Create bot
    const bot = await prisma.aiBot.create({
      data: {
        name,
        systemPrompt,
        aiProviderId,
        ownerId: user.userId,
      },
      select: {
        id: true,
        name: true,
        systemPrompt: true,
        aiProviderId: true,
        aiProvider: {
          select: {
            id: true,
            name: true,
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
