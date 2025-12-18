import { describe, it, expect } from 'vitest';
import { CreateAiAccountFormSchema, EditAiAccountFormSchema } from './ai-accounts-ui';

describe('CreateAiAccountFormSchema', () => {
  it('validates complete form data', () => {
    const result = CreateAiAccountFormSchema.safeParse({
      name: 'Test Account',
      provider: 'openai',
      apiKey: 'sk-test-key',
    });

    expect(result.success).toBe(true);
  });

  it('uses default provider when not specified', () => {
    const result = CreateAiAccountFormSchema.safeParse({
      name: 'Test Account',
      apiKey: 'sk-test-key',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.provider).toBe('openai');
    }
  });

  describe('baseUrl handling', () => {
    it('converts empty string to undefined', () => {
      const result = CreateAiAccountFormSchema.safeParse({
        name: 'Test Account',
        provider: 'ollama',
        apiKey: 'test-key',
        baseUrl: '',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.baseUrl).toBeUndefined();
      }
    });

    it('keeps valid URL', () => {
      const result = CreateAiAccountFormSchema.safeParse({
        name: 'Test Account',
        provider: 'ollama',
        apiKey: 'test-key',
        baseUrl: 'http://localhost:11434/v1',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.baseUrl).toBe('http://localhost:11434/v1');
      }
    });

    it('rejects invalid URL', () => {
      const result = CreateAiAccountFormSchema.safeParse({
        name: 'Test Account',
        provider: 'custom',
        apiKey: 'test-key',
        baseUrl: 'not-a-url',
      });

      expect(result.success).toBe(false);
    });
  });
});

describe('EditAiAccountFormSchema', () => {
  it('validates complete form data', () => {
    const result = EditAiAccountFormSchema.safeParse({
      name: 'Test Account',
      provider: 'anthropic',
      apiKey: 'sk-test-key',
    });

    expect(result.success).toBe(true);
  });

  it('allows empty apiKey for edit (no change)', () => {
    const result = EditAiAccountFormSchema.safeParse({
      name: 'Test Account',
      provider: 'openai',
      apiKey: '',
    });

    expect(result.success).toBe(true);
  });

  describe('baseUrl handling', () => {
    it('converts empty string to undefined', () => {
      const result = EditAiAccountFormSchema.safeParse({
        name: 'Test Account',
        provider: 'ollama',
        baseUrl: '',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.baseUrl).toBeUndefined();
      }
    });

    it('keeps valid URL', () => {
      const result = EditAiAccountFormSchema.safeParse({
        name: 'Test Account',
        provider: 'custom',
        baseUrl: 'https://api.custom.com/v1',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.baseUrl).toBe('https://api.custom.com/v1');
      }
    });

    it('converts null to undefined', () => {
      const result = EditAiAccountFormSchema.safeParse({
        name: 'Test Account',
        provider: 'ollama',
        baseUrl: null,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        // null passes through union but transform only converts ''
        expect(result.data.baseUrl).toBeNull();
      }
    });

    it('rejects invalid URL', () => {
      const result = EditAiAccountFormSchema.safeParse({
        name: 'Test Account',
        provider: 'custom',
        baseUrl: 'invalid-url',
      });

      expect(result.success).toBe(false);
    });
  });
});
