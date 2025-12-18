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
        responseLanguage: true,
        documentMode: true,
        pdfMaxSizeMb: true,
        aiModelId: true,
        aiModel: {
          select: {
            id: true,
            name: true,
            modelIdentifier: true,
            aiAccount: {
              select: {
                id: true,
                name: true,
                provider: true,
              },
            },
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
    // Check if bot exists and user has write access (WRITE or FULL permission)
    const existingBot = await prisma.aiBot.findFirst({
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

    if (!existingBot) {
      return NextResponse.json(
        {
          error: 'aiBotNotFound',
          message: 'aiBotNotFound',
        },
        { status: 404 }
      );
    }

    const { name, aiModelId, systemPrompt, responseLanguage, documentMode, pdfMaxSizeMb } = body;

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

    // Verify that the AI model exists and user has access if changing
    if (aiModelId) {
      const model = await prisma.aiModel.findFirst({
        where: {
          id: aiModelId,
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
      });

      if (!model) {
        return NextResponse.json(
          {
            error: 'aiModelNotFound',
            message: 'aiModelNotFound',
          },
          { status: 400 }
        );
      }
    }

    // Build update data
    type UpdateData = {
      name?: string;
      aiModelId?: string;
      systemPrompt?: string;
      responseLanguage?: string;
      documentMode?: string;
      pdfMaxSizeMb?: number | null;
    };

    const updateData: UpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (aiModelId !== undefined) updateData.aiModelId = aiModelId;
    if (systemPrompt !== undefined) updateData.systemPrompt = systemPrompt;
    if (responseLanguage !== undefined) updateData.responseLanguage = responseLanguage;
    if (documentMode !== undefined) updateData.documentMode = documentMode;
    if (pdfMaxSizeMb !== undefined) updateData.pdfMaxSizeMb = pdfMaxSizeMb;

    // Update bot
    const bot = await prisma.aiBot.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        systemPrompt: true,
        responseLanguage: true,
        documentMode: true,
        pdfMaxSizeMb: true,
        aiModelId: true,
        aiModel: {
          select: {
            id: true,
            name: true,
            modelIdentifier: true,
            aiAccount: {
              select: {
                id: true,
                name: true,
                provider: true,
              },
            },
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
