import { NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';
import { WebAuthnRegisterOptionsRequestSchema } from '@/lib/api/schemas';
import { rpName, rpID, CHALLENGE_TTL_MS, parseTransports } from '@/lib/auth/webauthn';

export const POST = authRoute(
  async ({ user, body }) => {
    // Get existing credentials for this user to exclude
    const existingCredentials = await prisma.webAuthnCredential.findMany({
      where: { userId: user.userId },
      select: {
        credentialId: true,
        transports: true,
      },
    });

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userName: user.username,
      userDisplayName: user.username,
      attestationType: 'none',
      excludeCredentials: existingCredentials.map((cred) => ({
        // SimpleWebAuthn expects Base64URL string for id
        id: Buffer.from(cred.credentialId).toString('base64url'),
        transports: parseTransports(cred.transports),
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: body.authenticatorType,
      },
    });

    // Store challenge in database
    const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS);
    const challengeRecord = await prisma.webAuthnChallenge.create({
      data: {
        challenge: options.challenge,
        type: 'registration',
        userId: user.userId,
        expiresAt,
      },
    });

    return NextResponse.json({
      options,
      challengeId: challengeRecord.id,
    });
  },
  {
    bodySchema: WebAuthnRegisterOptionsRequestSchema,
    errorLogPrefix: 'WebAuthn registration options',
  }
);
