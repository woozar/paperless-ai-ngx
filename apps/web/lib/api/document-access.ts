import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { PaperlessClient } from '@repo/paperless-client';
import { decrypt } from '@/lib/crypto/encryption';

/**
 * Checks if a user has access to a Paperless instance.
 * Returns the instance if accessible, null otherwise.
 */
export async function checkInstanceAccess(instanceId: string, userId: string) {
  return prisma.paperlessInstance.findFirst({
    where: {
      id: instanceId,
      OR: [
        { ownerId: userId },
        {
          sharedWith: {
            some: {
              OR: [{ userId }, { userId: null }],
            },
          },
        },
      ],
    },
  });
}

/**
 * Checks if a document exists and belongs to the given instance.
 * Returns the document if found, null otherwise.
 */
export async function checkDocumentAccess(documentId: string, instanceId: string) {
  return prisma.paperlessDocument.findFirst({
    where: {
      id: documentId,
      paperlessInstanceId: instanceId,
    },
  });
}

/**
 * Returns a 404 response for instance not found.
 */
export function instanceNotFoundResponse() {
  return NextResponse.json(
    {
      error: 'paperlessInstanceNotFound',
      message: 'paperlessInstanceNotFound',
    },
    { status: 404 }
  );
}

/**
 * Returns a 404 response for document not found.
 */
export function documentNotFoundResponse() {
  return NextResponse.json(
    {
      error: 'documentNotFound',
      message: 'documentNotFound',
    },
    { status: 404 }
  );
}

/**
 * Creates a PaperlessClient from an instance with decrypted API token.
 */
export function createPaperlessClient(instance: { apiUrl: string; apiToken: string }) {
  return new PaperlessClient({
    baseUrl: instance.apiUrl,
    token: decrypt(instance.apiToken),
  });
}
