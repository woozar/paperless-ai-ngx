import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { verifyPassword, hashPassword } from '@/lib/utilities/password';
import { getSalt } from '@/lib/bootstrap';
import { ChangePasswordRequestSchema } from '@/lib/api/schemas/auth';
import { ApiResponses } from '@/lib/api/responses';
import { authRoute } from '@/lib/api/route-wrapper';

export const POST = authRoute(
  async ({ user, request }) => {
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
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!dbUser) {
      return ApiResponses.userNotFound();
    }

    // Verify current password
    const isValid = verifyPassword(currentPassword, salt, dbUser.passwordHash);
    if (!isValid) {
      return ApiResponses.currentPasswordIncorrect();
    }

    // Hash new password
    const newPasswordHash = hashPassword(newPassword, salt);

    // Update password and reset mustChangePassword flag
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword: false,
      },
    });

    return NextResponse.json({ success: true });
  },
  { errorLogPrefix: 'Change password' }
);
