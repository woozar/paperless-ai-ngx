import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { ApiResponses } from '@/lib/api/responses';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    // Get full user details
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        username: true,
        role: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });

    if (!user) {
      return ApiResponses.userNotFound();
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return ApiResponses.serverError();
  }
}
