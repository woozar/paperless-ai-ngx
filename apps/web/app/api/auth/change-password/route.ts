import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { verifyPassword, hashPassword } from '@/lib/utilities/password';
import { getSalt } from '@/lib/bootstrap';
import { getAuthUser } from '@/lib/auth/jwt';
import { ChangePasswordRequestSchema } from '@/lib/api/schemas/auth';
import { ApiResponses } from '@/lib/api/responses';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    const body = await request.json();
    const parsed = ChangePasswordRequestSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponses.invalidPasswordFormat();
    }

    const { currentPassword, newPassword } = parsed.data;

    // Get salt
    const salt = await getSalt();
    if (!salt) {
      return ApiResponses.applicationNotConfigured();
    }

    // Get user with current password hash
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return ApiResponses.userNotFound();
    }

    // Verify current password
    const isValid = verifyPassword(currentPassword, salt, user.passwordHash);
    if (!isValid) {
      return ApiResponses.currentPasswordIncorrect();
    }

    // Hash new password
    const newPasswordHash = hashPassword(newPassword, salt);

    // Update password and reset mustChangePassword flag
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password error:', error);
    return ApiResponses.serverError();
  }
}
