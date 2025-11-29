import { createHash, randomBytes } from 'node:crypto';

const SALT_LENGTH = 30;
const SALT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a random salt string of 30 characters
 * consisting of uppercase, lowercase letters and digits
 */
export function generateSalt(): string {
  let salt = '';
  const randomBuffer = randomBytes(SALT_LENGTH);
  for (let i = 0; i < SALT_LENGTH; i++) {
    salt += SALT_CHARS[randomBuffer[i]! % SALT_CHARS.length];
  }
  return salt;
}

/**
 * Hashes a password with the given salt using SHA-256
 * @param password - The plain text password
 * @param salt - The salt to append to the password before hashing
 * @returns The hashed password as a hex string
 */
export function hashPassword(password: string, salt: string): string {
  return createHash('sha256').update(`${password}${salt}`).digest('hex');
}

/**
 * Verifies a password against a stored hash
 * @param password - The plain text password to verify
 * @param salt - The salt used for hashing
 * @param storedHash - The stored password hash
 * @returns True if the password matches, false otherwise
 */
export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const hash = hashPassword(password, salt);
  return hash === storedHash;
}
