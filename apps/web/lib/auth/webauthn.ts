import type { AuthenticatorTransportFuture } from '@simplewebauthn/server';

// WebAuthn Relying Party configuration
export const rpName = 'Paperless AI NGX';
export const rpID = process.env.WEBAUTHN_RP_ID || 'localhost';
export const origin = process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000';

// Challenge expiration time in milliseconds (5 minutes)
export const CHALLENGE_TTL_MS = 5 * 60 * 1000;

// Convert database transports array to AuthenticatorTransportFuture[]
export function parseTransports(transports: string[]): AuthenticatorTransportFuture[] {
  const validTransports: Set<AuthenticatorTransportFuture> = new Set([
    'usb',
    'ble',
    'nfc',
    'internal',
    'hybrid',
  ]);
  return transports.filter((t): t is AuthenticatorTransportFuture =>
    validTransports.has(t as AuthenticatorTransportFuture)
  );
}

// Convert Uint8Array to Buffer for database storage
export function uint8ArrayToBuffer(arr: Uint8Array): Buffer {
  return Buffer.from(arr);
}

// Convert Buffer from database to Uint8Array for WebAuthn operations
export function bufferToUint8Array(buf: Buffer): Uint8Array {
  return new Uint8Array(buf);
}
