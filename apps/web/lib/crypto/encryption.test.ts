import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { encrypt, decrypt } from './encryption';

describe('encryption', () => {
  const originalEnv = process.env.ENCRYPTION_KEY;

  beforeEach(() => {
    process.env.ENCRYPTION_KEY = 'test-encryption-key-minimum-32-characters-long';
  });

  afterEach(() => {
    process.env.ENCRYPTION_KEY = originalEnv;
  });

  describe('encrypt', () => {
    it('should encrypt a string', () => {
      const text = 'my-secret-token';
      const encrypted = encrypt(text);

      expect(encrypted).toBeTruthy();
      expect(encrypted).not.toBe(text);
      expect(encrypted.split(':')).toHaveLength(3);
    });

    it('should produce different encrypted values for the same input', () => {
      const text = 'my-secret-token';
      const encrypted1 = encrypt(text);
      const encrypted2 = encrypt(text);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should encrypt empty string', () => {
      const text = '';
      const encrypted = encrypt(text);

      expect(encrypted).toBeTruthy();
      expect(encrypted.split(':')).toHaveLength(3);
    });

    it('should encrypt special characters', () => {
      const text = 'äöü!@#$%^&*()_+-=[]{}|;:,.<>?';
      const encrypted = encrypt(text);

      expect(encrypted).toBeTruthy();
      expect(encrypted.split(':')).toHaveLength(3);
    });

    it('should throw error when ENCRYPTION_KEY is not set', () => {
      delete process.env.ENCRYPTION_KEY;

      expect(() => encrypt('test')).toThrow('ENCRYPTION_KEY environment variable is not set');
    });
  });

  describe('decrypt', () => {
    it('should decrypt an encrypted string', () => {
      const original = 'my-secret-token';
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should decrypt empty string', () => {
      const original = '';
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should decrypt special characters', () => {
      const original = 'äöü!@#$%^&*()_+-=[]{}|;:,.<>?';
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should decrypt long strings', () => {
      const original = 'a'.repeat(1000);
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should throw error when ENCRYPTION_KEY is not set', () => {
      const encrypted = encrypt('test');
      delete process.env.ENCRYPTION_KEY;

      expect(() => decrypt(encrypted)).toThrow('ENCRYPTION_KEY environment variable is not set');
    });

    it('should throw error when encrypted string is invalid', () => {
      expect(() => decrypt('invalid-encrypted-string')).toThrow();
    });
  });

  describe('encrypt/decrypt roundtrip', () => {
    it('should handle various string lengths', () => {
      const testStrings = [
        '',
        'a',
        'short',
        'this is a medium length string',
        'a'.repeat(100),
        'a'.repeat(1000),
      ];

      testStrings.forEach((original) => {
        const encrypted = encrypt(original);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(original);
      });
    });

    it('should handle unicode characters', () => {
      const testStrings = ['你好世界', 'مرحبا بالعالم', 'Привет мир', '🎉🎊🎈', 'Emoji: 😀😃😄😁'];

      testStrings.forEach((original) => {
        const encrypted = encrypt(original);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(original);
      });
    });

    it('should handle API token-like strings', () => {
      const testStrings = [
        'sk-1234567890abcdef',
        'ghp_1234567890abcdefGHIJKLMNOPQRSTUVWXYZ',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
      ];

      testStrings.forEach((original) => {
        const encrypted = encrypt(original);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(original);
      });
    });
  });
});
