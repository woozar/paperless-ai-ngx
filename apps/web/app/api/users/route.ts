import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { hashPassword } from '@/lib/utilities/password';
import { getSalt } from '@/lib/bootstrap';
import { CreateUserRequestSchema } from '@/lib/api/schemas/users';
import { ApiResponses } from '@/lib/api/responses';

// GET /api/users - List all users (Admin only)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

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
  } catch (error) {
    console.error('List users error:', error);
    return ApiResponses.serverError();
  }
}

// POST /api/users - Create a new user (Admin only)
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
    const parsed = CreateUserRequestSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponses.validationError();
    }

    const { username, password, role } = parsed.data;

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
        mustChangePassword: true, // New users must change password
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
  } catch (error) {
    console.error('Create user error:', error);
    return ApiResponses.serverError();
  }
}
