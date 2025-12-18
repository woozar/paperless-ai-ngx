import { NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';
import { WebAuthnRegisterVerifyRequestSchema } from '@/lib/api/schemas';
import { ApiResponses } from '@/lib/api/responses';
import { rpID, origin } from '@/lib/auth/webauthn';

export const POST = authRoute(
  async ({ user, body }) => {
    // Retrieve and validate challenge
    const challenge = await prisma.webAuthnChallenge.findUnique({
      where: { id: body.challengeId },
    });

    if (!challenge) {
      return ApiResponses.webauthnChallengeNotFound();
    }

    if (challenge.expiresAt < new Date()) {
      // Delete expired challenge
      await prisma.webAuthnChallenge.delete({ where: { id: challenge.id } });
      return ApiResponses.webauthnChallengeExpired();
    }

    if (challenge.type !== 'registration' || challenge.userId !== user.userId) {
      return ApiResponses.webauthnChallengeNotFound();
    }

    let verification: Awaited<ReturnType<typeof verifyRegistrationResponse>>;
    try {
      verification = await verifyRegistrationResponse({
        response: body.response,
        expectedChallenge: challenge.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: false,
      });
    } catch {
      return ApiResponses.webauthnVerificationFailed();
    }

    if (!verification.verified || !verification.registrationInfo) {
      return ApiResponses.webauthnVerificationFailed();
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    // credential.id is a Base64URL string - decode to Buffer for storage
    const credentialIdBuffer = Buffer.from(credential.id, 'base64url');

    // Store credential in database
    const storedCredential = await prisma.webAuthnCredential.create({
      data: {
        userId: user.userId,
        credentialId: credentialIdBuffer,
        publicKey: Buffer.from(credential.publicKey),
        counter: BigInt(credential.counter),
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        // v8 ignore next -- @preserve (transports is always defined by simplewebauthn)
        transports: credential.transports || [],
        name: body.name || null,
      },
    });

    // Delete used challenge
    await prisma.webAuthnChallenge.delete({ where: { id: challenge.id } });

    return NextResponse.json({
      success: true,
      credential: {
        id: storedCredential.id,
        name: storedCredential.name,
        deviceType: storedCredential.deviceType,
        backedUp: storedCredential.backedUp,
        createdAt: storedCredential.createdAt.toISOString(),
        lastUsedAt: storedCredential.lastUsedAt?.toISOString() || null,
      },
    });
  },
  {
    bodySchema: WebAuthnRegisterVerifyRequestSchema,
    errorLogPrefix: 'WebAuthn registration verify',
  }
);
