import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { CreateShareRequestSchema, type Permission } from '@/lib/api/schemas/sharing';
import { authRoute } from '@/lib/api/route-wrapper';

type ShareAccessRecord = {
  id: string;
  userId: string | null;
  permission: Permission;
  createdAt: Date;
  user: { id: string; username: string } | null;
};

type SharingConfig = {
  /** Error key when resource not found (e.g., 'aiBotNotFound') */
  notFoundError: string;
  /** Log prefix for error messages (e.g., 'AI bot') */
  logPrefix: string;
  /** Function to find the resource by id if user has sharing rights (owner or ADMIN permission) */
  findResource: (id: string, userId: string) => Promise<{ id: string } | null>;
  /** Function to find all shares for a resource */
  findShares: (resourceId: string) => Promise<ShareAccessRecord[]>;
  /** Function to find an existing share */
  findShare: (resourceId: string, userId: string | null) => Promise<{ id: string } | null>;
  /** Function to create a new share */
  createShare: (
    resourceId: string,
    userId: string | null,
    permission: Permission
  ) => Promise<ShareAccessRecord>;
  /** Function to update an existing share */
  updateShare: (shareId: string, permission: Permission) => Promise<ShareAccessRecord>;
};

function formatShareResponse(share: ShareAccessRecord) {
  return {
    id: share.id,
    userId: share.userId,
    username: share.user?.username ?? null,
    permission: share.permission,
    createdAt: share.createdAt.toISOString(),
  };
}

/**
 * Creates GET and POST handlers for sharing routes.
 * Reduces code duplication across ai-bots, ai-providers, and paperless-instances.
 */
export function createSharingRoutes(config: SharingConfig) {
  const GET = authRoute<never, { id: string }>(
    async ({ user, params }) => {
      const resource = await config.findResource(params.id, user.userId);

      if (!resource) {
        return NextResponse.json(
          {
            error: config.notFoundError,
            message: config.notFoundError,
          },
          { status: 404 }
        );
      }

      const shares = await config.findShares(params.id);

      return NextResponse.json({
        items: shares.map(formatShareResponse),
      });
    },
    { errorLogPrefix: `List ${config.logPrefix} shares` }
  );

  const POST = authRoute<typeof CreateShareRequestSchema, { id: string }>(
    async ({ user, params, body }) => {
      const resource = await config.findResource(params.id, user.userId);

      if (!resource) {
        return NextResponse.json(
          {
            error: config.notFoundError,
            message: config.notFoundError,
          },
          { status: 404 }
        );
      }

      const { userId, permission } = body;

      // If sharing with a specific user, verify they exist
      if (userId !== null) {
        const targetUser = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!targetUser) {
          return NextResponse.json(
            {
              error: 'userNotFound',
              message: 'userNotFound',
            },
            { status: 404 }
          );
        }

        // Cannot share with yourself
        if (userId === user.userId) {
          return NextResponse.json(
            {
              error: 'cannotShareWithSelf',
              message: 'cannotShareWithSelf',
            },
            { status: 400 }
          );
        }
      }

      // Check if share already exists
      const existingShare = await config.findShare(params.id, userId);

      if (existingShare) {
        // Update existing share
        const updatedShare = await config.updateShare(existingShare.id, permission);
        return NextResponse.json(formatShareResponse(updatedShare));
      }

      // Create new share
      const share = await config.createShare(params.id, userId, permission);

      return NextResponse.json(formatShareResponse(share), { status: 201 });
    },
    {
      bodySchema: CreateShareRequestSchema,
      errorLogPrefix: `Create ${config.logPrefix} share`,
    }
  );

  return { GET, POST };
}

// Pre-configured sharing routes for each resource type
const includeUser = {
  user: {
    select: {
      id: true,
      username: true,
    },
  },
};

export const aiBotSharingRoutes = createSharingRoutes({
  notFoundError: 'aiBotNotFound',
  logPrefix: 'AI bot',
  findResource: (id, userId) =>
    prisma.aiBot.findFirst({
      where: {
        id,
        OR: [{ ownerId: userId }, { sharedWith: { some: { userId, permission: 'FULL' } } }],
      },
    }),
  findShares: (aiBotId) =>
    prisma.userAiBotAccess.findMany({
      where: { aiBotId },
      include: includeUser,
      orderBy: { createdAt: 'desc' },
    }),
  findShare: (aiBotId, userId) =>
    prisma.userAiBotAccess.findFirst({
      where: { aiBotId, userId: userId ?? { equals: null } },
    }),
  createShare: (aiBotId, userId, permission) =>
    prisma.userAiBotAccess.create({
      data: { aiBotId, userId, permission },
      include: includeUser,
    }),
  updateShare: (id, permission) =>
    prisma.userAiBotAccess.update({
      where: { id },
      data: { permission },
      include: includeUser,
    }),
});

export const aiAccountSharingRoutes = createSharingRoutes({
  notFoundError: 'aiAccountNotFound',
  logPrefix: 'AI account',
  findResource: (id, userId) =>
    prisma.aiAccount.findFirst({
      where: {
        id,
        OR: [{ ownerId: userId }, { sharedWith: { some: { userId, permission: 'FULL' } } }],
      },
    }),
  findShares: (aiAccountId) =>
    prisma.userAiAccountAccess.findMany({
      where: { aiAccountId },
      include: includeUser,
      orderBy: { createdAt: 'desc' },
    }),
  findShare: (aiAccountId, userId) =>
    prisma.userAiAccountAccess.findFirst({
      where: {
        aiAccountId,
        userId: userId ?? { equals: null },
      },
    }),
  createShare: (aiAccountId, userId, permission) =>
    prisma.userAiAccountAccess.create({
      data: { aiAccountId, userId, permission },
      include: includeUser,
    }),
  updateShare: (id, permission) =>
    prisma.userAiAccountAccess.update({
      where: { id },
      data: { permission },
      include: includeUser,
    }),
});

export const aiModelSharingRoutes = createSharingRoutes({
  notFoundError: 'aiModelNotFound',
  logPrefix: 'AI model',
  findResource: (id, userId) =>
    prisma.aiModel.findFirst({
      where: {
        id,
        OR: [{ ownerId: userId }, { sharedWith: { some: { userId, permission: 'FULL' } } }],
      },
    }),
  findShares: (aiModelId) =>
    prisma.userAiModelAccess.findMany({
      where: { aiModelId },
      include: includeUser,
      orderBy: { createdAt: 'desc' },
    }),
  findShare: (aiModelId, userId) =>
    prisma.userAiModelAccess.findFirst({
      where: {
        aiModelId,
        userId: userId ?? { equals: null },
      },
    }),
  createShare: (aiModelId, userId, permission) =>
    prisma.userAiModelAccess.create({
      data: { aiModelId, userId, permission },
      include: includeUser,
    }),
  updateShare: (id, permission) =>
    prisma.userAiModelAccess.update({
      where: { id },
      data: { permission },
      include: includeUser,
    }),
});

export const paperlessInstanceSharingRoutes = createSharingRoutes({
  notFoundError: 'paperlessInstanceNotFound',
  logPrefix: 'Paperless instance',
  findResource: (id, userId) =>
    prisma.paperlessInstance.findFirst({
      where: {
        id,
        OR: [{ ownerId: userId }, { sharedWith: { some: { userId, permission: 'FULL' } } }],
      },
    }),
  findShares: (instanceId) =>
    prisma.userPaperlessInstanceAccess.findMany({
      where: { instanceId },
      include: includeUser,
      orderBy: { createdAt: 'desc' },
    }),
  findShare: (instanceId, userId) =>
    prisma.userPaperlessInstanceAccess.findFirst({
      where: { instanceId, userId: userId ?? { equals: null } },
    }),
  createShare: (instanceId, userId, permission) =>
    prisma.userPaperlessInstanceAccess.create({
      data: { instanceId, userId, permission },
      include: includeUser,
    }),
  updateShare: (id, permission) =>
    prisma.userPaperlessInstanceAccess.update({
      where: { id },
      data: { permission },
      include: includeUser,
    }),
});
