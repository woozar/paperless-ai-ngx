import { NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { prisma } from '@repo/database';
import { publicRoute } from '@/lib/api/route-wrapper';
import { WebAuthnAuthenticateVerifyRequestSchema } from '@/lib/api/schemas';
import { ApiResponses } from '@/lib/api/responses';
import { generateToken } from '@/lib/auth/jwt';
import { rpID, origin, parseTransports } from '@/lib/auth/webauthn';

export const POST = publicRoute(
  async ({ body }) => {
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

    if (challenge.type !== 'authentication') {
      return ApiResponses.webauthnChallengeNotFound();
    }

    // Find credential by ID from the response
    // body.response.id is a Base64URL string
    const credentialIdBase64 = body.response.id;
    const credentialIdBuffer = Buffer.from(credentialIdBase64, 'base64url');

    const credential = await prisma.webAuthnCredential.findUnique({
      where: { credentialId: credentialIdBuffer },
      include: { user: true },
    });

    if (!credential) {
      return ApiResponses.webauthnCredentialNotFound();
    }

    // Check if user is active
    if (!credential.user.isActive) {
      return ApiResponses.accountSuspended();
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: body.response,
        expectedChallenge: challenge.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: false,
        credential: {
          // SimpleWebAuthn expects Base64URL string for id
          id: Buffer.from(credential.credentialId).toString('base64url'),
          publicKey: new Uint8Array(credential.publicKey),
          counter: Number(credential.counter),
          transports: parseTransports(credential.transports),
        },
      });
    } catch {
      return ApiResponses.webauthnVerificationFailed();
    }

    if (!verification.verified) {
      return ApiResponses.webauthnVerificationFailed();
    }

    // Update credential counter and last used timestamp
    await prisma.webAuthnCredential.update({
      where: { id: credential.id },
      data: {
        counter: BigInt(verification.authenticationInfo.newCounter),
        lastUsedAt: new Date(),
      },
    });

    // Delete used challenge
    await prisma.webAuthnChallenge.delete({ where: { id: challenge.id } });

    // Generate JWT token
    const token = await generateToken({
      userId: credential.user.id,
      username: credential.user.username,
      role: credential.user.role,
    });

    return NextResponse.json({
      token,
      user: {
        id: credential.user.id,
        username: credential.user.username,
        role: credential.user.role,
        mustChangePassword: credential.user.mustChangePassword,
      },
    });
  },
  {
    bodySchema: WebAuthnAuthenticateVerifyRequestSchema,
    errorLogPrefix: 'WebAuthn authentication verify',
  }
);
