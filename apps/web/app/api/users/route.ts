import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { hashPassword } from '@/lib/utilities/password';
import { getSalt } from '@/lib/bootstrap';
import { CreateUserRequestSchema } from '@/lib/api/schemas/users';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/schemas/common';
import { ApiResponses } from '@/lib/api/responses';
import { adminRoute } from '@/lib/api/route-wrapper';

// GET /api/users - List all users (Admin only, paginated)
export const GET = adminRoute(
  async ({ request }) => {
    const { page, limit } = getPaginationParams(request);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { isActive: true },
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
        skip,
        take: limit,
      }),
      prisma.user.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({
      items: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
      ...getPaginationMeta(total, page, limit),
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
