import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseTransports, uint8ArrayToBuffer, bufferToUint8Array } from './webauthn';

describe('webauthn utilities', () => {
  describe('parseTransports', () => {
    it('filters and returns valid transport values', () => {
      const result = parseTransports(['usb', 'ble', 'nfc', 'internal', 'hybrid']);
      expect(result).toEqual(['usb', 'ble', 'nfc', 'internal', 'hybrid']);
    });

    it('filters out invalid transport values', () => {
      const result = parseTransports(['usb', 'invalid', 'internal', 'unknown']);
      expect(result).toEqual(['usb', 'internal']);
    });

    it('returns empty array for all invalid values', () => {
      const result = parseTransports(['invalid', 'unknown', 'fake']);
      expect(result).toEqual([]);
    });

    it('returns empty array for empty input', () => {
      const result = parseTransports([]);
      expect(result).toEqual([]);
    });

    it('handles single valid transport', () => {
      const result = parseTransports(['internal']);
      expect(result).toEqual(['internal']);
    });

    it('handles mixed case values (case-sensitive - should filter them out)', () => {
      const result = parseTransports(['USB', 'Internal', 'usb']);
      expect(result).toEqual(['usb']);
    });
  });

  describe('uint8ArrayToBuffer', () => {
    it('converts Uint8Array to Buffer', () => {
      const input = new Uint8Array([1, 2, 3, 4, 5]);
      const result = uint8ArrayToBuffer(input);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result).toEqual(Buffer.from([1, 2, 3, 4, 5]));
    });

    it('handles empty Uint8Array', () => {
      const input = new Uint8Array([]);
      const result = uint8ArrayToBuffer(input);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('preserves data integrity for large arrays', () => {
      const input = new Uint8Array(256);
      for (let i = 0; i < 256; i++) {
        input[i] = i;
      }

      const result = uint8ArrayToBuffer(input);

      expect(result.length).toBe(256);
      for (let i = 0; i < 256; i++) {
        expect(result[i]).toBe(i);
      }
    });
  });

  describe('bufferToUint8Array', () => {
    it('converts Buffer to Uint8Array', () => {
      const input = Buffer.from([1, 2, 3, 4, 5]);
      const result = bufferToUint8Array(input);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(Array.from(result)).toEqual([1, 2, 3, 4, 5]);
    });

    it('handles empty Buffer', () => {
      const input = Buffer.from([]);
      const result = bufferToUint8Array(input);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(0);
    });

    it('preserves data integrity for large buffers', () => {
      const input = Buffer.alloc(256);
      for (let i = 0; i < 256; i++) {
        input[i] = i;
      }

      const result = bufferToUint8Array(input);

      expect(result.length).toBe(256);
      for (let i = 0; i < 256; i++) {
        expect(result[i]).toBe(i);
      }
    });
  });

  describe('round-trip conversion', () => {
    it('maintains data integrity through round-trip', () => {
      const original = new Uint8Array([10, 20, 30, 40, 50]);
      const buffer = uint8ArrayToBuffer(original);
      const result = bufferToUint8Array(buffer);

      expect(Array.from(result)).toEqual(Array.from(original));
    });
  });
});

describe('webauthn configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('uses default values when env vars are not set', async () => {
    delete process.env.WEBAUTHN_RP_ID;
    delete process.env.WEBAUTHN_ORIGIN;

    const { rpID, origin, rpName, CHALLENGE_TTL_MS } = await import('./webauthn');

    expect(rpID).toBe('localhost');
    expect(origin).toBe('http://localhost:3000');
    expect(rpName).toBe('Paperless AI NGX');
    expect(CHALLENGE_TTL_MS).toBe(5 * 60 * 1000);
  });

  it('uses custom env values when set', async () => {
    process.env.WEBAUTHN_RP_ID = 'example.com';
    process.env.WEBAUTHN_ORIGIN = 'https://example.com';

    const { rpID, origin } = await import('./webauthn');

    expect(rpID).toBe('example.com');
    expect(origin).toBe('https://example.com');
  });
});
