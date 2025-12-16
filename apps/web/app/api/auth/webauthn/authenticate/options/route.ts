import { NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server';
import { prisma } from '@repo/database';
import { publicRoute } from '@/lib/api/route-wrapper';
import { WebAuthnAuthenticateOptionsRequestSchema } from '@/lib/api/schemas';
import { rpID, CHALLENGE_TTL_MS, parseTransports } from '@/lib/auth/webauthn';

export const POST = publicRoute(
  async ({ body }) => {
    // If username provided, get credentials for that user
    let allowCredentials: { id: string; transports?: AuthenticatorTransportFuture[] }[] | undefined;

    if (body.username) {
      const user = await prisma.user.findUnique({
        where: { username: body.username },
        include: {
          webAuthnCredentials: {
            select: {
              credentialId: true,
              transports: true,
            },
          },
        },
      });

      if (user && user.webAuthnCredentials.length > 0) {
        allowCredentials = user.webAuthnCredentials.map((cred) => ({
          // Convert Buffer to Base64URL string for SimpleWebAuthn
          id: Buffer.from(cred.credentialId).toString('base64url'),
          transports: parseTransports(cred.transports),
        }));
      }
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials,
      userVerification: 'preferred',
    });

    // Store challenge in database
    const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS);
    const challengeRecord = await prisma.webAuthnChallenge.create({
      data: {
        challenge: options.challenge,
        type: 'authentication',
        expiresAt,
      },
    });

    return NextResponse.json({
      options,
      challengeId: challengeRecord.id,
    });
  },
  {
    bodySchema: WebAuthnAuthenticateOptionsRequestSchema,
    errorLogPrefix: 'WebAuthn authentication options',
  }
);
