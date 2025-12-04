import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { hashPassword } from '@/lib/utilities/password';
import { getSalt } from '@/lib/bootstrap';
import { UpdateUserRequestSchema } from '@/lib/api/schemas/users';
import { ApiResponses } from '@/lib/api/responses';
import { adminRoute } from '@/lib/api/route-wrapper';

type UpdateData = {
  username?: string;
  role?: 'ADMIN' | 'DEFAULT';
  isActive?: boolean;
  passwordHash?: string;
  mustChangePassword?: boolean;
};

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

async function checkUsernameTaken(username: string, userId: string): Promise<boolean> {
  const userWithUsername = await prisma.user.findUnique({ where: { username } });
  return !!userWithUsername && userWithUsername.id !== userId;
}

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
export const GET = adminRoute<never, { id: string }>(
  async ({ params }) => {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
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
  },
  { errorLogPrefix: 'Get user' }
);

// PATCH /api/users/[id] - Update user (Admin only)
export const PATCH = adminRoute<typeof UpdateUserRequestSchema, { id: string }>(
  async ({ params, body }) => {
    const existingUser = await prisma.user.findUnique({ where: { id: params.id } });
    if (!existingUser) return ApiResponses.userNotFound();

    const { username, role, isActive, resetPassword } = body;

    const isLastAdmin = await checkLastAdminProtection(existingUser, role, isActive);
    if (isLastAdmin) {
      return ApiResponses.lastAdmin();
    }

    if (username) {
      const usernameTaken = await checkUsernameTaken(username, existingUser.id);
      if (usernameTaken) {
        return ApiResponses.usernameExists();
      }
    }

    const updateData = buildUpdateData({ username, role, isActive });

    const passwordError = await hashPasswordIfNeeded(resetPassword, updateData);
    if (passwordError) return passwordError;

    const user = await prisma.user.update({
      where: { id: params.id },
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
  },
  {
    bodySchema: UpdateUserRequestSchema,
    errorLogPrefix: 'Update user',
  }
);

// DELETE /api/users/[id] - Delete user (Admin only)
export const DELETE = adminRoute<never, { id: string }>(
  async ({ user: authUser, params }) => {
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return ApiResponses.userNotFound();
    }

    if (existingUser.id === authUser.userId) {
      return ApiResponses.cannotDeleteSelf();
    }

    if (existingUser.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN', isActive: true },
      });

      if (adminCount <= 1) {
        return ApiResponses.lastAdmin();
      }
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  },
  { errorLogPrefix: 'Delete user' }
);
