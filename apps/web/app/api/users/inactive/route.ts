import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/schemas/common';
import { adminRoute } from '@/lib/api/route-wrapper';

// GET /api/users/inactive - List all inactive (soft-deleted) users (Admin only, paginated)
export const GET = adminRoute(
  async ({ request }) => {
    const { page, limit } = getPaginationParams(request);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { isActive: false },
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
      prisma.user.count({ where: { isActive: false } }),
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
  { errorLogPrefix: 'List inactive users' }
);
