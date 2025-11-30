import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { hashPassword } from '@/lib/utilities/password';
import { getSalt } from '@/lib/bootstrap';
import { UpdateUserRequestSchema } from '@/lib/api/schemas/users';
import { ApiResponses } from '@/lib/api/responses';

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdateData = {
  username?: string;
  role?: 'ADMIN' | 'DEFAULT';
  isActive?: boolean;
  passwordHash?: string;
  mustChangePassword?: boolean;
};

/**
 * Checks if the operation would demote or deactivate the last admin
 */
async function checkLastAdminProtection(
  existingUser: { role: string; isActive: boolean },
  role?: 'ADMIN' | 'DEFAULT',
  isActive?: boolean
): Promise<boolean> {
  if (existingUser.role === 'ADMIN' && (role === 'DEFAULT' || isActive === false)) {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN', isActive: true },
    });
    return adminCount <= 1;
  }
  return false;
}

/**
 * Checks if the username is already taken by another user
 */
async function checkUsernameTaken(username: string, userId: string): Promise<boolean> {
  const userWithUsername = await prisma.user.findUnique({ where: { username } });

  return !!userWithUsername && userWithUsername.id !== userId;
}

/**
 * Builds the update data object from the request data
 */
function buildUpdateData(data: {
  username?: string;
  role?: 'ADMIN' | 'DEFAULT';
  isActive?: boolean;
}): UpdateData {
  const updateData: UpdateData = {};

  if (data.username !== undefined) updateData.username = data.username;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return updateData;
}

/**
 * Hashes the password if resetPassword is provided
 */
async function hashPasswordIfNeeded(
  resetPassword: string | undefined,
  updateData: UpdateData
): Promise<NextResponse | null> {
  if (!resetPassword) return null;

  const salt = await getSalt();
  if (!salt) {
    return ApiResponses.applicationNotConfigured();
  }

  updateData.passwordHash = hashPassword(resetPassword, salt);
  updateData.mustChangePassword = true;

  return null;
}

// GET /api/users/[id] - Get user by ID (Admin only)
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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return ApiResponses.userNotFound();
    }

    return NextResponse.json({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Get user error:', error);
    return ApiResponses.serverError();
  }
}

// PATCH /api/users/[id] - Update user (Admin only)
export async function PATCH(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const authUser = await getAuthUser(request);
    if (!authUser) return ApiResponses.unauthorized();

    if (authUser.role !== 'ADMIN') return ApiResponses.forbidden();

    const body = await request.json();
    const parsed = UpdateUserRequestSchema.safeParse(body);

    if (!parsed.success) return ApiResponses.validationError();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) return ApiResponses.userNotFound();

    const { username, role, isActive, resetPassword } = parsed.data;

    // Prevent demoting or deactivating the last admin
    const isLastAdmin = await checkLastAdminProtection(existingUser, role, isActive);
    if (isLastAdmin) {
      return ApiResponses.lastAdmin();
    }

    // Check username uniqueness if changing
    if (username) {
      const usernameTaken = await checkUsernameTaken(username, existingUser.id);
      if (usernameTaken) {
        return ApiResponses.usernameExists();
      }
    }

    // Build update data
    const updateData = buildUpdateData({ username, role, isActive });

    // Hash password if needed
    const passwordError = await hashPasswordIfNeeded(resetPassword, updateData);
    if (passwordError) return passwordError;

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Update user error:', error);
    return ApiResponses.serverError();
  }
}

// DELETE /api/users/[id] - Delete user (Admin only)
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return ApiResponses.userNotFound();
    }

    // Prevent self-deletion
    if (existingUser.id === authUser.userId) {
      return ApiResponses.cannotDeleteSelf();
    }

    // Prevent deleting the last admin
    if (existingUser.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN', isActive: true },
      });

      if (adminCount <= 1) {
        return ApiResponses.lastAdmin();
      }
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete user error:', error);
    return ApiResponses.serverError();
  }
}
