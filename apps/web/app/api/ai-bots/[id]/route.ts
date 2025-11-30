import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { UpdateAiBotRequestSchema } from '@/lib/api/schemas/ai-bots';
import { ApiResponses } from '@/lib/api/responses';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/ai-bots/[id] - Get AiBot by ID (Admin only)
export async function GET(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

    const bot = await prisma.aiBot.findFirst({
      where: {
        id,
        ownerId: authUser.userId,
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
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!bot) {
      return NextResponse.json(
        {
          error: 'aiBotNotFound',
          message: 'errors.aiBotNotFound',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...bot,
      createdAt: bot.createdAt.toISOString(),
      updatedAt: bot.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Get AI bot error:', error);
    return ApiResponses.serverError();
  }
}

// PATCH /api/ai-bots/[id] - Update AiBot (Admin only)
export async function PATCH(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

    const body = await request.json();
    const parsed = UpdateAiBotRequestSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponses.validationError();
    }

    // Check if bot exists and belongs to user
    const existingBot = await prisma.aiBot.findFirst({
      where: {
        id,
        ownerId: authUser.userId,
      },
    });

    if (!existingBot) {
      return NextResponse.json(
        {
          error: 'aiBotNotFound',
          message: 'errors.aiBotNotFound',
        },
        { status: 404 }
      );
    }

    const { name, aiProviderId, systemPrompt, isActive } = parsed.data;

    // Check name uniqueness if changing
    if (name && name !== existingBot.name) {
      const duplicateName = await prisma.aiBot.findFirst({
        where: {
          ownerId: authUser.userId,
          name,
          id: { not: id },
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          {
            error: 'aiBotNameExists',
            message: 'errors.aiBotNameExists',
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
          ownerId: authUser.userId,
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
    }

    // Build update data
    type UpdateData = {
      name?: string;
      aiProviderId?: string;
      systemPrompt?: string;
      isActive?: boolean;
    };

    const updateData: UpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (aiProviderId !== undefined) updateData.aiProviderId = aiProviderId;
    if (systemPrompt !== undefined) updateData.systemPrompt = systemPrompt;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update bot
    const bot = await prisma.aiBot.update({
      where: { id },
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
          },
        },
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ...bot,
      createdAt: bot.createdAt.toISOString(),
      updatedAt: bot.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Update AI bot error:', error);
    return ApiResponses.serverError();
  }
}

// DELETE /api/ai-bots/[id] - Delete AiBot (Admin only)
export async function DELETE(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

    // Check if bot exists and belongs to user
    const existingBot = await prisma.aiBot.findFirst({
      where: {
        id,
        ownerId: authUser.userId,
      },
    });

    if (!existingBot) {
      return NextResponse.json(
        {
          error: 'aiBotNotFound',
          message: 'errors.aiBotNotFound',
        },
        { status: 404 }
      );
    }

    // Delete bot
    await prisma.aiBot.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete AI bot error:', error);
    return ApiResponses.serverError();
  }
}
