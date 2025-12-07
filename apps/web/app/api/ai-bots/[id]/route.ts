import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { UpdateAiBotRequestSchema } from '@/lib/api/schemas/ai-bots';
import { authRoute } from '@/lib/api/route-wrapper';

// GET /api/ai-bots/[id] - Get AiBot by ID
export const GET = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    const bot = await prisma.aiBot.findFirst({
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
        systemPrompt: true,
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

    if (!bot) {
      return NextResponse.json(
        {
          error: 'aiBotNotFound',
          message: 'aiBotNotFound',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...bot,
      createdAt: bot.createdAt.toISOString(),
      updatedAt: bot.updatedAt.toISOString(),
    });
  },
  { errorLogPrefix: 'Get AI bot' }
);

// PATCH /api/ai-bots/[id] - Update AiBot (owner or WRITE permission)
export const PATCH = authRoute<typeof UpdateAiBotRequestSchema, { id: string }>(
  async ({ user, params, body }) => {
    // Check if bot exists and user has write access
    const existingBot = await prisma.aiBot.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: user.userId },
          {
            sharedWith: {
              some: {
                OR: [{ userId: user.userId }, { userId: null }],
                permission: 'WRITE',
              },
            },
          },
        ],
      },
    });

    if (!existingBot) {
      return NextResponse.json(
        {
          error: 'aiBotNotFound',
          message: 'aiBotNotFound',
        },
        { status: 404 }
      );
    }

    const { name, aiProviderId, systemPrompt } = body;

    // Check name uniqueness if changing
    if (name && name !== existingBot.name) {
      const duplicateName = await prisma.aiBot.findFirst({
        where: {
          ownerId: user.userId,
          name,
          id: { not: params.id },
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          {
            error: 'aiBotNameExists',
            message: 'aiBotNameExists',
            params: { name },
          },
          { status: 409 }
        );
      }
    }

    // Verify that the AI provider exists and belongs to the user if changing
    if (aiProviderId) {
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
    }

    // Build update data
    type UpdateData = {
      name?: string;
      aiProviderId?: string;
      systemPrompt?: string;
    };

    const updateData: UpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (aiProviderId !== undefined) updateData.aiProviderId = aiProviderId;
    if (systemPrompt !== undefined) updateData.systemPrompt = systemPrompt;

    // Update bot
    const bot = await prisma.aiBot.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        systemPrompt: true,
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

    return NextResponse.json({
      ...bot,
      createdAt: bot.createdAt.toISOString(),
      updatedAt: bot.updatedAt.toISOString(),
    });
  },
  {
    bodySchema: UpdateAiBotRequestSchema,
    errorLogPrefix: 'Update AI bot',
  }
);

// DELETE /api/ai-bots/[id] - Delete AiBot (owner only)
export const DELETE = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    // Check if bot exists and belongs to user
    const existingBot = await prisma.aiBot.findFirst({
      where: {
        id: params.id,
        ownerId: user.userId,
      },
    });

    if (!existingBot) {
      return NextResponse.json(
        {
          error: 'aiBotNotFound',
          message: 'aiBotNotFound',
        },
        { status: 404 }
      );
    }

    // Delete the bot
    await prisma.aiBot.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  },
  { errorLogPrefix: 'Delete AI bot' }
);
