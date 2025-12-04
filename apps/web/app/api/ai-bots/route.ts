import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { CreateAiBotRequestSchema } from '@/lib/api/schemas/ai-bots';
import { adminRoute } from '@/lib/api/route-wrapper';

// GET /api/ai-bots - List all AiBots (Admin only)
export const GET = adminRoute(
  async ({ user }) => {
    const bots = await prisma.aiBot.findMany({
      where: {
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
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      bots: bots.map((bot) => ({
        ...bot,
        createdAt: bot.createdAt.toISOString(),
        updatedAt: bot.updatedAt.toISOString(),
      })),
      total: bots.length,
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
