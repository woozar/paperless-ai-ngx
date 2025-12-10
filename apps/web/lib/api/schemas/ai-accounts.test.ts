import { describe, it, expect } from 'vitest';
import {
  CreateAiAccountRequestSchema,
  UpdateAiAccountRequestSchema,
  AiAccountListItemSchema,
} from './ai-accounts';

describe('CreateAiAccountRequestSchema', () => {
  it('validates correct account with openai provider', () => {
    const result = CreateAiAccountRequestSchema.safeParse({
      name: 'My OpenAI',
      provider: 'openai',
      apiKey: 'sk-test-key',
    });
    expect(result.success).toBe(true);
  });

  it('validates correct account with baseUrl for ollama', () => {
    const result = CreateAiAccountRequestSchema.safeParse({
      name: 'My Ollama',
      provider: 'ollama',
      apiKey: 'test-key',
      baseUrl: 'http://localhost:11434',
    });
    expect(result.success).toBe(true);
  });

  it('validates correct account with baseUrl for custom provider', () => {
    const result = CreateAiAccountRequestSchema.safeParse({
      name: 'My Custom',
      provider: 'custom',
      apiKey: 'test-key',
      baseUrl: 'https://my-llm.example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects ollama provider without baseUrl', () => {
    const result = CreateAiAccountRequestSchema.safeParse({
      name: 'My Ollama',
      provider: 'ollama',
      apiKey: 'test-key',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Base URL is required for ollama and custom providers'
      );
    }
  });

  it('rejects custom provider without baseUrl', () => {
    const result = CreateAiAccountRequestSchema.safeParse({
      name: 'My Custom',
      provider: 'custom',
      apiKey: 'test-key',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Base URL is required for ollama and custom providers'
      );
    }
  });

  it('rejects empty name', () => {
    const result = CreateAiAccountRequestSchema.safeParse({
      name: '',
      provider: 'openai',
      apiKey: 'sk-test-key',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty apiKey', () => {
    const result = CreateAiAccountRequestSchema.safeParse({
      name: 'My Account',
      provider: 'openai',
      apiKey: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('UpdateAiAccountRequestSchema', () => {
  it('validates partial update with name only', () => {
    const result = UpdateAiAccountRequestSchema.safeParse({
      name: 'New Name',
    });
    expect(result.success).toBe(true);
  });

  it('validates partial update with isActive only', () => {
    const result = UpdateAiAccountRequestSchema.safeParse({
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('validates empty update request', () => {
    const result = UpdateAiAccountRequestSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('AiAccountListItemSchema', () => {
  it('validates correct account list item', () => {
    const result = AiAccountListItemSchema.safeParse({
      id: 'account-1',
      name: 'My Account',
      provider: 'openai',
      apiKey: '***',
      baseUrl: null,
      isActive: true,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });
});
