import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { CreateAiModelRequestSchema } from '@/lib/api/schemas/ai-models';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/schemas/common';
import { authRoute } from '@/lib/api/route-wrapper';

// GET /api/ai-models - List all AiModels (owned or shared with user)
export const GET = authRoute(
  async ({ user, request }) => {
    const { page, limit } = getPaginationParams(request);
    const skip = (page - 1) * limit;

    // Find models the user owns OR has access to (via sharing)
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

    const [models, total] = await Promise.all([
      prisma.aiModel.findMany({
        where,
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
      prisma.aiModel.count({ where }),
    ]);

    return NextResponse.json({
      items: models.map((model) => {
        const isOwner = model.ownerId === user.userId;
        const sharedPermission = model.sharedWith[0]?.permission;
        const canEdit = isOwner || sharedPermission === 'WRITE' || sharedPermission === 'FULL';
        const canShare = isOwner || sharedPermission === 'FULL';

        return {
          id: model.id,
          name: model.name,
          modelIdentifier: model.modelIdentifier,
          inputTokenPrice: model.inputTokenPrice,
          outputTokenPrice: model.outputTokenPrice,
          isActive: model.isActive,
          aiAccountId: model.aiAccountId,
          aiAccount: model.aiAccount,
          createdAt: model.createdAt.toISOString(),
          updatedAt: model.updatedAt.toISOString(),
          canEdit,
          canShare,
          isOwner,
        };
      }),
      ...getPaginationMeta(total, page, limit),
    });
  },
  { errorLogPrefix: 'List AI models' }
);

// POST /api/ai-models - Create a new AiModel
export const POST = authRoute(
  async ({ user, body }) => {
    const { name, modelIdentifier, aiAccountId, inputTokenPrice, outputTokenPrice } = body;

    // Check if the AI account exists and user has access
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

    // Check if name already exists for this owner
    const existing = await prisma.aiModel.findFirst({
      where: {
        ownerId: user.userId,
        name,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: 'aiModelNameExists',
          message: 'aiModelNameExists',
          params: { name },
        },
        { status: 409 }
      );
    }

    // Create model
    const aiModel = await prisma.aiModel.create({
      data: {
        name,
        modelIdentifier,
        aiAccountId,
        inputTokenPrice: inputTokenPrice ?? null,
        outputTokenPrice: outputTokenPrice ?? null,
        ownerId: user.userId,
        isActive: true,
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

    return NextResponse.json(
      {
        ...aiModel,
        createdAt: aiModel.createdAt.toISOString(),
        updatedAt: aiModel.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  },
  {
    bodySchema: CreateAiModelRequestSchema,
    errorLogPrefix: 'Create AI model',
  }
);
