import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';
import { ApiResponses } from '@/lib/api/responses';

export const DELETE = authRoute(
  async ({ user, params: { id } }) => {
    // Find credential and verify ownership
    const credential = await prisma.webAuthnCredential.findUnique({ where: { id } });

    if (!credential || credential.userId !== user.userId) {
      return ApiResponses.webauthnCredentialNotFound();
    }

    // Delete credential
    await prisma.webAuthnCredential.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  },
  {
    errorLogPrefix: 'Delete WebAuthn credential',
  }
);

const RenameBodySchema = z.object({
  name: z.string().min(1).max(100),
});

export const PATCH = authRoute(
  async ({ user, params: { id }, body }) => {
    // Find credential and verify ownership
    const credential = await prisma.webAuthnCredential.findUnique({ where: { id } });

    if (!credential || credential.userId !== user.userId) {
      return ApiResponses.webauthnCredentialNotFound();
    }

    // Update credential name
    const updated = await prisma.webAuthnCredential.update({
      where: { id },
      data: { name: body.name },
      select: {
        id: true,
        name: true,
        deviceType: true,
        backedUp: true,
        createdAt: true,
        lastUsedAt: true,
      },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      deviceType: updated.deviceType,
      backedUp: updated.backedUp,
      createdAt: updated.createdAt.toISOString(),
      lastUsedAt: updated.lastUsedAt?.toISOString() || null,
    });
  },
  {
    bodySchema: RenameBodySchema,
    errorLogPrefix: 'Rename WebAuthn credential',
  }
);
