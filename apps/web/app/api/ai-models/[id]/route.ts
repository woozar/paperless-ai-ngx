import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { UpdateAiModelRequestSchema } from '@/lib/api/schemas/ai-models';
import { authRoute } from '@/lib/api/route-wrapper';

// GET /api/ai-models/[id] - Get AiModel by ID
export const GET = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    const model = await prisma.aiModel.findFirst({
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
        modelIdentifier: true,
        inputTokenPrice: true,
        outputTokenPrice: true,
        isActive: true,
        aiAccountId: true,
        aiAccount: {
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

    if (!model) {
      return NextResponse.json(
        {
          error: 'aiModelNotFound',
          message: 'aiModelNotFound',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...model,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
    });
  },
  { errorLogPrefix: 'Get AI model' }
);

// PATCH /api/ai-models/[id] - Update AiModel (owner or WRITE permission)
export const PATCH = authRoute<typeof UpdateAiModelRequestSchema, { id: string }>(
  async ({ user, params, body }) => {
    // Check if model exists and user has write access (WRITE or FULL permission)
    const existingModel = await prisma.aiModel.findFirst({
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

    if (!existingModel) {
      return NextResponse.json(
        {
          error: 'aiModelNotFound',
          message: 'aiModelNotFound',
        },
        { status: 404 }
      );
    }

    const { name, modelIdentifier, aiAccountId, inputTokenPrice, outputTokenPrice, isActive } =
      body;

    // Check name uniqueness if changing
    if (name && name !== existingModel.name) {
      const duplicateName = await prisma.aiModel.findFirst({
        where: {
          ownerId: user.userId,
          name,
          id: { not: params.id },
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          {
            error: 'aiModelNameExists',
            message: 'aiModelNameExists',
            params: { name },
          },
          { status: 409 }
        );
      }
    }

    // If changing AI account, verify it exists and user has access
    if (aiAccountId && aiAccountId !== existingModel.aiAccountId) {
      const aiAccount = await prisma.aiAccount.findFirst({
        where: {
          id: aiAccountId,
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

      if (!aiAccount) {
        return NextResponse.json(
          {
            error: 'aiAccountNotFound',
            message: 'aiAccountNotFound',
          },
          { status: 404 }
        );
      }
    }

    // Build update data
    type UpdateData = {
      name?: string;
      modelIdentifier?: string;
      aiAccountId?: string;
      inputTokenPrice?: number | null;
      outputTokenPrice?: number | null;
      isActive?: boolean;
    };

    const updateData: UpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (modelIdentifier !== undefined) updateData.modelIdentifier = modelIdentifier;
    if (aiAccountId !== undefined) updateData.aiAccountId = aiAccountId;
    if (inputTokenPrice !== undefined) updateData.inputTokenPrice = inputTokenPrice;
    if (outputTokenPrice !== undefined) updateData.outputTokenPrice = outputTokenPrice;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update model
    const updatedModel = await prisma.aiModel.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        modelIdentifier: true,
        inputTokenPrice: true,
        outputTokenPrice: true,
        isActive: true,
        aiAccountId: true,
        aiAccount: {
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
      ...updatedModel,
      createdAt: updatedModel.createdAt.toISOString(),
      updatedAt: updatedModel.updatedAt.toISOString(),
    });
  },
  {
    bodySchema: UpdateAiModelRequestSchema,
    errorLogPrefix: 'Update AI model',
  }
);

// DELETE /api/ai-models/[id] - Delete AiModel (owner only)
export const DELETE = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    // Check if model exists and belongs to user
    const existingModel = await prisma.aiModel.findFirst({
      where: {
        id: params.id,
        ownerId: user.userId,
      },
    });

    if (!existingModel) {
      return NextResponse.json(
        {
          error: 'aiModelNotFound',
          message: 'aiModelNotFound',
        },
        { status: 404 }
      );
    }

    // Check if model is referenced by any bots
    const botCount = await prisma.aiBot.count({
      where: { aiModelId: params.id },
    });

    if (botCount > 0) {
      return NextResponse.json(
        {
          error: 'aiModelInUse',
          message: 'aiModelInUse',
          params: { count: botCount },
        },
        { status: 400 }
      );
    }

    // Delete model
    await prisma.aiModel.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  },
  { errorLogPrefix: 'Delete AI model' }
);
