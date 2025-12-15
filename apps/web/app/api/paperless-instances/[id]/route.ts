import { NextResponse } from 'next/server';
import type { z } from 'zod';
import { prisma } from '@repo/database';
import { UpdatePaperlessInstanceRequestSchema } from '@/lib/api/schemas/paperless-instances';
import { authRoute } from '@/lib/api/route-wrapper';
import { encrypt } from '@/lib/crypto/encryption';
import { calculateNextScanTime, scheduler } from '@/lib/scheduler';

type UpdatePaperlessInstanceRequest = z.infer<typeof UpdatePaperlessInstanceRequestSchema>;

type ExistingInstance = {
  autoProcessEnabled: boolean;
  scanCronExpression: string;
};

type UpdateData = {
  name?: string;
  apiUrl?: string;
  apiToken?: string;
  importFilterTags?: number[];
  autoProcessEnabled?: boolean;
  scanCronExpression?: string;
  defaultAiBotId?: string | null;
  nextScanAt?: Date | null;
  autoApplyTitle?: boolean;
  autoApplyCorrespondent?: boolean;
  autoApplyDocumentType?: boolean;
  autoApplyTags?: boolean;
  autoApplyDate?: boolean;
};

function buildUpdateData(
  body: UpdatePaperlessInstanceRequest,
  existingInstance: ExistingInstance
): UpdateData {
  const updateData: UpdateData = {};

  // Simple field assignments
  const simpleFields = [
    'name',
    'apiUrl',
    'importFilterTags',
    'autoProcessEnabled',
    'defaultAiBotId',
    'autoApplyTitle',
    'autoApplyCorrespondent',
    'autoApplyDocumentType',
    'autoApplyTags',
    'autoApplyDate',
  ] as const;

  for (const field of simpleFields) {
    if (body[field] !== undefined) {
      (updateData as Record<string, unknown>)[field] = body[field];
    }
  }

  // Handle scanCronExpression with nextScanAt recalculation
  if (body.scanCronExpression !== undefined) {
    updateData.scanCronExpression = body.scanCronExpression;
    if (body.autoProcessEnabled || existingInstance.autoProcessEnabled) {
      updateData.nextScanAt = calculateNextScanTime(body.scanCronExpression);
    }
  }

  // Calculate nextScanAt when enabling auto-processing
  if (body.autoProcessEnabled === true && !existingInstance.autoProcessEnabled) {
    const cronExpr = body.scanCronExpression ?? existingInstance.scanCronExpression;
    updateData.nextScanAt = calculateNextScanTime(cronExpr);
  }

  // Clear nextScanAt when disabling
  if (body.autoProcessEnabled === false) {
    updateData.nextScanAt = null;
  }

  // Encrypt API token if provided
  if (body.apiToken) {
    updateData.apiToken = encrypt(body.apiToken);
  }

  return updateData;
}

function updateScheduler(
  instance: {
    id: string;
    name: string;
    scanCronExpression: string;
    nextScanAt: Date | null;
    autoProcessEnabled: boolean;
  },
  wasAutoProcessEnabled: boolean
): void {
  if (instance.autoProcessEnabled) {
    scheduler.scheduleInstance(
      instance.id,
      instance.name,
      instance.scanCronExpression,
      instance.nextScanAt
    );
  } else if (wasAutoProcessEnabled) {
    scheduler.unscheduleInstance(instance.id);
  }
}

// GET /api/paperless-instances/[id] - Get PaperlessInstance by ID
export const GET = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    const instance = await prisma.paperlessInstance.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: user.userId },
          {
            sharedWith: {
              some: {
                OR: [{ userId: user.userId }, { userId: null }],
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        apiUrl: true,
        importFilterTags: true,
        autoProcessEnabled: true,
        scanCronExpression: true,
        defaultAiBotId: true,
        lastScanAt: true,
        nextScanAt: true,
        autoApplyTitle: true,
        autoApplyCorrespondent: true,
        autoApplyDocumentType: true,
        autoApplyTags: true,
        autoApplyDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!instance) {
      return NextResponse.json(
        {
          error: 'paperlessInstanceNotFound',
          message: 'paperlessInstanceNotFound',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...instance,
      apiToken: '***',
      lastScanAt: instance.lastScanAt?.toISOString() ?? null,
      nextScanAt: instance.nextScanAt?.toISOString() ?? null,
      createdAt: instance.createdAt.toISOString(),
      updatedAt: instance.updatedAt.toISOString(),
    });
  },
  { errorLogPrefix: 'Get paperless instance' }
);

// PATCH /api/paperless-instances/[id] - Update PaperlessInstance (owner or WRITE permission)
export const PATCH = authRoute<typeof UpdatePaperlessInstanceRequestSchema, { id: string }>(
  async ({ user, params, body }) => {
    // Check if instance exists and user has write access (WRITE or FULL permission)
    const existingInstance = await prisma.paperlessInstance.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: user.userId },
          {
            sharedWith: {
              some: {
                OR: [{ userId: user.userId }, { userId: null }],
                permission: { in: ['WRITE', 'FULL'] },
              },
            },
          },
        ],
      },
    });

    if (!existingInstance) {
      return NextResponse.json(
        {
          error: 'paperlessInstanceNotFound',
          message: 'paperlessInstanceNotFound',
        },
        { status: 404 }
      );
    }

    // Check name uniqueness if changing
    if (body.name && body.name !== existingInstance.name) {
      const duplicateName = await prisma.paperlessInstance.findFirst({
        where: {
          ownerId: user.userId,
          name: body.name,
          id: { not: params.id },
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          {
            error: 'paperlessInstanceNameExists',
            message: 'paperlessInstanceNameExists',
            params: { name: body.name },
          },
          { status: 409 }
        );
      }
    }

    const updateData = buildUpdateData(body, existingInstance);

    // Update instance
    const instance = await prisma.paperlessInstance.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        apiUrl: true,
        importFilterTags: true,
        autoProcessEnabled: true,
        scanCronExpression: true,
        defaultAiBotId: true,
        lastScanAt: true,
        nextScanAt: true,
        autoApplyTitle: true,
        autoApplyCorrespondent: true,
        autoApplyDocumentType: true,
        autoApplyTags: true,
        autoApplyDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Update scheduler based on configuration changes
    updateScheduler(instance, existingInstance.autoProcessEnabled);

    return NextResponse.json({
      ...instance,
      apiToken: '***',
      lastScanAt: instance.lastScanAt?.toISOString() ?? null,
      nextScanAt: instance.nextScanAt?.toISOString() ?? null,
      createdAt: instance.createdAt.toISOString(),
      updatedAt: instance.updatedAt.toISOString(),
    });
  },
  {
    bodySchema: UpdatePaperlessInstanceRequestSchema,
    errorLogPrefix: 'Update paperless instance',
  }
);

// DELETE /api/paperless-instances/[id] - Delete PaperlessInstance (owner only)
export const DELETE = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    // Check if instance exists and belongs to user
    const existingInstance = await prisma.paperlessInstance.findFirst({
      where: {
        id: params.id,
        ownerId: user.userId,
      },
    });

    if (!existingInstance) {
      return NextResponse.json(
        {
          error: 'paperlessInstanceNotFound',
          message: 'paperlessInstanceNotFound',
        },
        { status: 404 }
      );
    }

    // Unschedule from scheduler before deletion
    scheduler.unscheduleInstance(params.id);

    // Delete instance
    await prisma.paperlessInstance.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  },
  { errorLogPrefix: 'Delete paperless instance' }
);
