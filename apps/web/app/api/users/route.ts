import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { hashPassword } from '@/lib/utilities/password';
import { getSalt } from '@/lib/bootstrap';
import { CreateUserRequestSchema } from '@/lib/api/schemas/users';
import { ApiResponses } from '@/lib/api/responses';
import { adminRoute } from '@/lib/api/route-wrapper';

// GET /api/users - List all users (Admin only)
export const GET = adminRoute(
  async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { username: 'asc' },
    });

    return NextResponse.json({
      users: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
      total: users.length,
    });
  },
  { errorLogPrefix: 'List users' }
);

// POST /api/users - Create a new user (Admin only)
export const POST = adminRoute(
  async ({ body }) => {
    const { username, password, role } = body;

    // Check if username already exists
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return ApiResponses.usernameExists();
    }

    // Get salt
    const salt = await getSalt();
    if (!salt) {
      return ApiResponses.applicationNotConfigured();
    }

    // Hash password
    const passwordHash = hashPassword(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role,
        mustChangePassword: true,
        isActive: true,
      },
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

    return NextResponse.json(
      {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  },
  {
    bodySchema: CreateUserRequestSchema,
    errorLogPrefix: 'Create user',
  }
);
