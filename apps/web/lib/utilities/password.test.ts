import { describe, it, expect } from 'vitest';
import { generateSalt, hashPassword, verifyPassword } from './password';

describe('Password utilities', () => {
  describe('generateSalt', () => {
    it('generates a salt of 30 characters', () => {
      const salt = generateSalt();
      expect(salt).toHaveLength(30);
    });

    it('generates alphanumeric characters only', () => {
      const salt = generateSalt();
      expect(salt).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('generates unique salts on each call', () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();
      expect(salt1).not.toBe(salt2);
    });
  });

  describe('hashPassword', () => {
    it('returns a 64-character hex string (SHA-256)', () => {
      const hash = hashPassword('password123', 'testsalt');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });

    it('returns the same hash for same password and salt', () => {
      const hash1 = hashPassword('password123', 'testsalt');
      const hash2 = hashPassword('password123', 'testsalt');
      expect(hash1).toBe(hash2);
    });

    it('returns different hashes for different passwords', () => {
      const hash1 = hashPassword('password123', 'testsalt');
      const hash2 = hashPassword('password456', 'testsalt');
      expect(hash1).not.toBe(hash2);
    });

    it('returns different hashes for different salts', () => {
      const hash1 = hashPassword('password123', 'salt1');
      const hash2 = hashPassword('password123', 'salt2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('returns true for correct password', () => {
      const salt = 'testsalt123';
      const password = 'mySecurePassword';
      const hash = hashPassword(password, salt);

      expect(verifyPassword(password, salt, hash)).toBe(true);
    });

    it('returns false for incorrect password', () => {
      const salt = 'testsalt123';
      const correctPassword = 'mySecurePassword';
      const wrongPassword = 'wrongPassword';
      const hash = hashPassword(correctPassword, salt);

      expect(verifyPassword(wrongPassword, salt, hash)).toBe(false);
    });

    it('returns false for incorrect salt', () => {
      const correctSalt = 'correctSalt';
      const wrongSalt = 'wrongSalt';
      const password = 'mySecurePassword';
      const hash = hashPassword(password, correctSalt);

      expect(verifyPassword(password, wrongSalt, hash)).toBe(false);
    });

    it('handles empty password', () => {
      const salt = 'testsalt';
      const hash = hashPassword('', salt);

      expect(verifyPassword('', salt, hash)).toBe(true);
      expect(verifyPassword('notEmpty', salt, hash)).toBe(false);
    });
  });
});
