import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { UpdateAiProviderRequestSchema } from '@/lib/api/schemas/ai-providers';
import { ApiResponses } from '@/lib/api/responses';
import { encrypt } from '@/lib/crypto/encryption';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/ai-providers/[id] - Get AiProvider by ID (Admin only)
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

    const provider = await prisma.aiProvider.findFirst({
      where: {
        id,
        ownerId: authUser.userId,
      },
      select: {
        id: true,
        name: true,
        provider: true,
        model: true,
        baseUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        apiKey: false,
      },
    });

    if (!provider) {
      return NextResponse.json(
        {
          error: 'aiProviderNotFound',
          message: 'errors.aiProviderNotFound',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...provider,
      createdAt: provider.createdAt.toISOString(),
      updatedAt: provider.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Get AI provider error:', error);
    return ApiResponses.serverError();
  }
}

// PATCH /api/ai-providers/[id] - Update AiProvider (Admin only)
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
    const parsed = UpdateAiProviderRequestSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponses.validationError();
    }

    // Check if provider exists and belongs to user
    const existingProvider = await prisma.aiProvider.findFirst({
      where: {
        id,
        ownerId: authUser.userId,
      },
    });

    if (!existingProvider) {
      return NextResponse.json(
        {
          error: 'aiProviderNotFound',
          message: 'errors.aiProviderNotFound',
        },
        { status: 404 }
      );
    }

    const { name, provider, model, apiKey, baseUrl, isActive } = parsed.data;

    // Check name uniqueness if changing
    if (name && name !== existingProvider.name) {
      const duplicateName = await prisma.aiProvider.findFirst({
        where: {
          ownerId: authUser.userId,
          name,
          id: { not: id },
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          {
            error: 'aiProviderNameExists',
            message: 'errors.aiProviderNameExists',
            params: { name },
          },
          { status: 409 }
        );
      }
    }

    // Build update data
    type UpdateData = {
      name?: string;
      provider?: 'openai' | 'anthropic' | 'ollama' | 'google' | 'custom';
      model?: string;
      apiKey?: string;
      baseUrl?: string | null;
      isActive?: boolean;
    };

    const updateData: UpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (provider !== undefined) updateData.provider = provider;
    if (model !== undefined) updateData.model = model;
    if (baseUrl !== undefined) updateData.baseUrl = baseUrl;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Encrypt API key if provided
    if (apiKey) {
      updateData.apiKey = encrypt(apiKey);
    }

    // Update provider
    const updatedProvider = await prisma.aiProvider.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        provider: true,
        model: true,
        baseUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ...updatedProvider,
      createdAt: updatedProvider.createdAt.toISOString(),
      updatedAt: updatedProvider.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Update AI provider error:', error);
    return ApiResponses.serverError();
  }
}

// DELETE /api/ai-providers/[id] - Delete AiProvider (Admin only)
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

    // Check if provider exists and belongs to user
    const existingProvider = await prisma.aiProvider.findFirst({
      where: {
        id,
        ownerId: authUser.userId,
      },
    });

    if (!existingProvider) {
      return NextResponse.json(
        {
          error: 'aiProviderNotFound',
          message: 'errors.aiProviderNotFound',
        },
        { status: 404 }
      );
    }

    // Check if provider is referenced by any bots
    const botCount = await prisma.aiBot.count({
      where: { aiProviderId: id },
    });

    if (botCount > 0) {
      return NextResponse.json(
        {
          error: 'aiProviderInUse',
          message: 'errors.aiProviderInUse',
          params: { count: botCount },
        },
        { status: 400 }
      );
    }

    // Delete provider
    await prisma.aiProvider.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete AI provider error:', error);
    return ApiResponses.serverError();
  }
}
