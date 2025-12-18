import { describe, it, expect } from 'vitest';
import { AiBotListItemSchema, CreateAiBotRequestSchema, UpdateAiBotRequestSchema } from './ai-bots';

describe('AiBotListItemSchema', () => {
  it('validates correct bot item', () => {
    const result = AiBotListItemSchema.safeParse({
      id: 'bot-1',
      name: 'Document Analyzer',
      systemPrompt: 'You are a helpful assistant that analyzes documents',
      aiModelId: 'model-1',
      aiModel: {
        id: 'model-1',
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        aiAccount: {
          id: 'account-1',
          name: 'My OpenAI',
          provider: 'openai',
        },
      },
      responseLanguage: 'DOCUMENT',
      documentMode: 'text',
      pdfMaxSizeMb: null,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = AiBotListItemSchema.safeParse({
      id: 'bot-1',
      name: 'Document Analyzer',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing aiModel relation', () => {
    const result = AiBotListItemSchema.safeParse({
      id: 'bot-1',
      name: 'Document Analyzer',
      systemPrompt: 'You are a helpful assistant',
      aiModelId: 'model-1',
      isActive: true,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });
});

describe('CreateAiBotRequestSchema', () => {
  it('validates correct create request', () => {
    const result = CreateAiBotRequestSchema.safeParse({
      name: 'Document Analyzer',
      aiModelId: 'model-1',
      systemPrompt: 'You are a helpful assistant that analyzes documents',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = CreateAiBotRequestSchema.safeParse({
      name: '',
      aiModelId: 'model-1',
      systemPrompt: 'You are a helpful assistant',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only name', () => {
    const result = CreateAiBotRequestSchema.safeParse({
      name: '   ',
      aiModelId: 'model-1',
      systemPrompt: 'You are a helpful assistant',
    });
    expect(result.success).toBe(false);
  });

  it('rejects name longer than 100 characters', () => {
    const result = CreateAiBotRequestSchema.safeParse({
      name: 'a'.repeat(101),
      aiModelId: 'model-1',
      systemPrompt: 'You are a helpful assistant',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty aiModelId', () => {
    const result = CreateAiBotRequestSchema.safeParse({
      name: 'Document Analyzer',
      aiModelId: '',
      systemPrompt: 'You are a helpful assistant',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty systemPrompt', () => {
    const result = CreateAiBotRequestSchema.safeParse({
      name: 'Document Analyzer',
      aiModelId: 'model-1',
      systemPrompt: '',
    });
    expect(result.success).toBe(false);
  });

  it('trims name before validation', () => {
    const result = CreateAiBotRequestSchema.safeParse({
      name: '  Document Analyzer  ',
      aiModelId: 'model-1',
      systemPrompt: 'You are a helpful assistant',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Document Analyzer');
    }
  });
});

describe('UpdateAiBotRequestSchema', () => {
  it('validates update with name only', () => {
    const result = UpdateAiBotRequestSchema.safeParse({
      name: 'New Name',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with aiModelId only', () => {
    const result = UpdateAiBotRequestSchema.safeParse({
      aiModelId: 'model-2',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with systemPrompt only', () => {
    const result = UpdateAiBotRequestSchema.safeParse({
      systemPrompt: 'New system prompt',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with isActive only', () => {
    const result = UpdateAiBotRequestSchema.safeParse({
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('validates empty update request', () => {
    const result = UpdateAiBotRequestSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('validates update with multiple fields', () => {
    const result = UpdateAiBotRequestSchema.safeParse({
      name: 'New Name',
      systemPrompt: 'New prompt',
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name in update', () => {
    const result = UpdateAiBotRequestSchema.safeParse({
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only name in update', () => {
    const result = UpdateAiBotRequestSchema.safeParse({
      name: '   ',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty aiModelId in update', () => {
    const result = UpdateAiBotRequestSchema.safeParse({
      aiModelId: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty systemPrompt in update', () => {
    const result = UpdateAiBotRequestSchema.safeParse({
      systemPrompt: '',
    });
    expect(result.success).toBe(false);
  });

  it('trims name in update', () => {
    const result = UpdateAiBotRequestSchema.safeParse({
      name: '  Updated Name  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Updated Name');
    }
  });
});
