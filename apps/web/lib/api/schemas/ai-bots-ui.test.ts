import { describe, it, expect } from 'vitest';
import { CreateAiBotFormSchema, EditAiBotFormSchema } from './ai-bots-ui';

describe('CreateAiBotFormSchema', () => {
  it('validates complete form data', () => {
    const result = CreateAiBotFormSchema.safeParse({
      name: 'Test Bot',
      aiModelId: 'model-1',
      systemPrompt: 'You are a helpful assistant',
      responseLanguage: 'DOCUMENT',
      documentMode: 'text',
      pdfMaxSizeMb: 20,
    });

    expect(result.success).toBe(true);
  });

  it('uses default values for optional fields', () => {
    const result = CreateAiBotFormSchema.safeParse({
      name: 'Test Bot',
      aiModelId: 'model-1',
      systemPrompt: 'You are a helpful assistant',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.responseLanguage).toBe('DOCUMENT');
      expect(result.data.documentMode).toBe('text');
    }
  });

  describe('pdfMaxSizeMb handling', () => {
    it('converts empty string to null', () => {
      const result = CreateAiBotFormSchema.safeParse({
        name: 'Test Bot',
        aiModelId: 'model-1',
        systemPrompt: 'You are a helpful assistant',
        pdfMaxSizeMb: '',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pdfMaxSizeMb).toBeNull();
      }
    });

    it('converts undefined to null', () => {
      const result = CreateAiBotFormSchema.safeParse({
        name: 'Test Bot',
        aiModelId: 'model-1',
        systemPrompt: 'You are a helpful assistant',
        pdfMaxSizeMb: undefined,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pdfMaxSizeMb).toBeNull();
      }
    });

    it('keeps null as null', () => {
      const result = CreateAiBotFormSchema.safeParse({
        name: 'Test Bot',
        aiModelId: 'model-1',
        systemPrompt: 'You are a helpful assistant',
        pdfMaxSizeMb: null,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pdfMaxSizeMb).toBeNull();
      }
    });

    it('accepts valid number', () => {
      const result = CreateAiBotFormSchema.safeParse({
        name: 'Test Bot',
        aiModelId: 'model-1',
        systemPrompt: 'You are a helpful assistant',
        pdfMaxSizeMb: 50,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pdfMaxSizeMb).toBe(50);
      }
    });

    it('coerces string number to number', () => {
      const result = CreateAiBotFormSchema.safeParse({
        name: 'Test Bot',
        aiModelId: 'model-1',
        systemPrompt: 'You are a helpful assistant',
        pdfMaxSizeMb: '25',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pdfMaxSizeMb).toBe(25);
      }
    });

    it('rejects number below minimum', () => {
      const result = CreateAiBotFormSchema.safeParse({
        name: 'Test Bot',
        aiModelId: 'model-1',
        systemPrompt: 'You are a helpful assistant',
        pdfMaxSizeMb: 0,
      });

      expect(result.success).toBe(false);
    });

    it('rejects number above maximum', () => {
      const result = CreateAiBotFormSchema.safeParse({
        name: 'Test Bot',
        aiModelId: 'model-1',
        systemPrompt: 'You are a helpful assistant',
        pdfMaxSizeMb: 101,
      });

      expect(result.success).toBe(false);
    });
  });
});

describe('EditAiBotFormSchema', () => {
  it('validates complete form data', () => {
    const result = EditAiBotFormSchema.safeParse({
      name: 'Test Bot',
      aiModelId: 'model-1',
      systemPrompt: 'You are a helpful assistant',
      responseLanguage: 'GERMAN',
      documentMode: 'pdf',
      pdfMaxSizeMb: 30,
    });

    expect(result.success).toBe(true);
  });

  it('handles pdfMaxSizeMb empty string as null', () => {
    const result = EditAiBotFormSchema.safeParse({
      name: 'Test Bot',
      aiModelId: 'model-1',
      systemPrompt: 'You are a helpful assistant',
      responseLanguage: 'DOCUMENT',
      documentMode: 'text',
      pdfMaxSizeMb: '',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.pdfMaxSizeMb).toBeNull();
    }
  });
});
