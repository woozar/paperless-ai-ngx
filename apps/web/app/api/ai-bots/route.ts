import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { CreateAiBotRequestSchema } from '@/lib/api/schemas/ai-bots';
import { ApiResponses } from '@/lib/api/responses';

// GET /api/ai-bots - List all AiBots (Admin only)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

    const bots = await prisma.aiBot.findMany({
      where: {
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
  } catch (error) {
    console.error('List AI bots error:', error);
    return ApiResponses.serverError();
  }
}

// POST /api/ai-bots - Create a new AiBot (Admin only)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

    const body = await request.json();
    const parsed = CreateAiBotRequestSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponses.validationError();
    }

    const { name, aiProviderId, systemPrompt } = parsed.data;

    // Check if name already exists for this owner
    const existing = await prisma.aiBot.findFirst({
      where: {
        ownerId: authUser.userId,
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

    // Create bot
    const bot = await prisma.aiBot.create({
      data: {
        name,
        systemPrompt,
        aiProviderId,
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
  } catch (error) {
    console.error('Create AI bot error:', error);
    return ApiResponses.serverError();
  }
}
