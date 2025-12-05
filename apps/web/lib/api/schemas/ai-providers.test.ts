import { describe, it, expect } from 'vitest';
import {
  AiProviderTypeSchema,
  AiProviderListItemSchema,
  CreateAiProviderRequestSchema,
  UpdateAiProviderRequestSchema,
} from './ai-providers';

describe('AiProviderTypeSchema', () => {
  it('validates openai provider', () => {
    const result = AiProviderTypeSchema.safeParse('openai');
    expect(result.success).toBe(true);
  });

  it('validates anthropic provider', () => {
    const result = AiProviderTypeSchema.safeParse('anthropic');
    expect(result.success).toBe(true);
  });

  it('validates google provider', () => {
    const result = AiProviderTypeSchema.safeParse('google');
    expect(result.success).toBe(true);
  });

  it('validates ollama provider', () => {
    const result = AiProviderTypeSchema.safeParse('ollama');
    expect(result.success).toBe(true);
  });

  it('validates custom provider', () => {
    const result = AiProviderTypeSchema.safeParse('custom');
    expect(result.success).toBe(true);
  });

  it('rejects invalid provider', () => {
    const result = AiProviderTypeSchema.safeParse('invalid');
    expect(result.success).toBe(false);
  });
});

describe('AiProviderListItemSchema', () => {
  it('validates correct provider item', () => {
    const result = AiProviderListItemSchema.safeParse({
      id: 'provider-1',
      name: 'My OpenAI',
      provider: 'openai',
      model: 'gpt-4',
      apiKey: '***',
      baseUrl: null,
      isActive: true,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('validates provider item with baseUrl', () => {
    const result = AiProviderListItemSchema.safeParse({
      id: 'provider-1',
      name: 'My Ollama',
      provider: 'ollama',
      model: 'llama2',
      apiKey: '***',
      baseUrl: 'https://ollama.example.com',
      isActive: true,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = AiProviderListItemSchema.safeParse({
      id: 'provider-1',
      name: 'My Provider',
    });
    expect(result.success).toBe(false);
  });
});

describe('CreateAiProviderRequestSchema', () => {
  it('validates correct create request for OpenAI', () => {
    const result = CreateAiProviderRequestSchema.safeParse({
      name: 'My OpenAI',
      provider: 'openai',
      model: 'gpt-4',
      apiKey: 'sk-1234',
    });
    expect(result.success).toBe(true);
  });

  it('validates create request for Ollama with baseUrl', () => {
    const result = CreateAiProviderRequestSchema.safeParse({
      name: 'My Ollama',
      provider: 'ollama',
      model: 'llama2',
      apiKey: 'dummy',
      baseUrl: 'https://ollama.example.com',
    });
    expect(result.success).toBe(true);
  });

  it('validates create request for custom provider with baseUrl', () => {
    const result = CreateAiProviderRequestSchema.safeParse({
      name: 'My Custom',
      provider: 'custom',
      model: 'custom-model',
      apiKey: 'api-key',
      baseUrl: 'https://api.example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects Ollama without baseUrl', () => {
    const result = CreateAiProviderRequestSchema.safeParse({
      name: 'My Ollama',
      provider: 'ollama',
      model: 'llama2',
      apiKey: 'dummy',
    });
    expect(result.success).toBe(false);
  });

  it('rejects custom provider without baseUrl', () => {
    const result = CreateAiProviderRequestSchema.safeParse({
      name: 'My Custom',
      provider: 'custom',
      model: 'custom-model',
      apiKey: 'api-key',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const result = CreateAiProviderRequestSchema.safeParse({
      name: '',
      provider: 'openai',
      model: 'gpt-4',
      apiKey: 'sk-1234',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only name', () => {
    const result = CreateAiProviderRequestSchema.safeParse({
      name: '   ',
      provider: 'openai',
      model: 'gpt-4',
      apiKey: 'sk-1234',
    });
    expect(result.success).toBe(false);
  });

  it('rejects name longer than 100 characters', () => {
    const result = CreateAiProviderRequestSchema.safeParse({
      name: 'a'.repeat(101),
      provider: 'openai',
      model: 'gpt-4',
      apiKey: 'sk-1234',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty model', () => {
    const result = CreateAiProviderRequestSchema.safeParse({
      name: 'My OpenAI',
      provider: 'openai',
      model: '',
      apiKey: 'sk-1234',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty apiKey', () => {
    const result = CreateAiProviderRequestSchema.safeParse({
      name: 'My OpenAI',
      provider: 'openai',
      model: 'gpt-4',
      apiKey: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid baseUrl format', () => {
    const result = CreateAiProviderRequestSchema.safeParse({
      name: 'My Ollama',
      provider: 'ollama',
      model: 'llama2',
      apiKey: 'dummy',
      baseUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('trims name before validation', () => {
    const result = CreateAiProviderRequestSchema.safeParse({
      name: '  My OpenAI  ',
      provider: 'openai',
      model: 'gpt-4',
      apiKey: 'sk-1234',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('My OpenAI');
    }
  });
});

describe('UpdateAiProviderRequestSchema', () => {
  it('validates update with name only', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({
      name: 'New Name',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with provider only', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({
      provider: 'anthropic',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with model only', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({
      model: 'gpt-4-turbo',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with apiKey only', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({
      apiKey: 'new-key',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with baseUrl only', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({
      baseUrl: 'https://new.api.com',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with null baseUrl', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({
      baseUrl: null,
    });
    expect(result.success).toBe(true);
  });

  it('validates update with isActive only', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('validates empty update request', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('validates update with multiple fields', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({
      name: 'New Name',
      model: 'gpt-4-turbo',
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name in update', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only name in update', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({
      name: '   ',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid baseUrl in update', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({
      baseUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('trims name in update', () => {
    const result = UpdateAiProviderRequestSchema.safeParse({
      name: '  Updated Name  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Updated Name');
    }
  });
});
