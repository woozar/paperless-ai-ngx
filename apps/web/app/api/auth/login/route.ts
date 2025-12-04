import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { verifyPassword } from '@/lib/utilities/password';
import { getSalt } from '@/lib/bootstrap';
import { generateToken } from '@/lib/auth/jwt';
import { LoginRequestSchema } from '@/lib/api/schemas/auth';
import { ApiResponses } from '@/lib/api/responses';
import { publicRoute } from '@/lib/api/route-wrapper';

export const POST = publicRoute(
  async ({ request }) => {
    const body = await request.json();
    const parsed = LoginRequestSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponses.invalidUsernameOrPassword();
    }

    const { username, password } = parsed.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        passwordHash: true,
        role: true,
        mustChangePassword: true,
        isActive: true,
      },
    });

    if (!user) {
      return ApiResponses.invalidCredentials();
    }

    // Check if user is active
    if (!user.isActive) {
      return ApiResponses.accountSuspended();
    }

    // Verify password
    const salt = await getSalt();
    if (!salt) {
      return ApiResponses.applicationNotConfigured();
    }

    const isValid = verifyPassword(password, salt, user.passwordHash);
    if (!isValid) {
      return ApiResponses.invalidCredentials();
    }

    // Generate JWT
    const token = await generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    });
  },
  { errorLogPrefix: 'Login' }
);
