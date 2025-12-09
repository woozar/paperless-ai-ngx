import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAiSdkProvider, getModelId, type ProviderType } from './provider-factory';

const mockOpenAIProvider = vi.fn();
const mockAnthropicProvider = vi.fn();
const mockGoogleProvider = vi.fn();

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: (config: unknown) => {
    mockOpenAIProvider(config);
    return 'openai-provider';
  },
}));

vi.mock('@ai-sdk/anthropic', () => ({
  createAnthropic: (config: unknown) => {
    mockAnthropicProvider(config);
    return 'anthropic-provider';
  },
}));

vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: (config: unknown) => {
    mockGoogleProvider(config);
    return 'google-provider';
  },
}));

vi.mock('@/lib/crypto/encryption', () => ({
  decrypt: (value: string) => `decrypted-${value}`,
}));

interface MockProvider {
  id: string;
  provider: ProviderType;
  apiKey: string;
  baseUrl: string | null;
  model: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

function createMockProvider(overrides: Partial<MockProvider> = {}): MockProvider {
  return {
    id: 'provider-123',
    provider: 'openai',
    apiKey: 'encrypted-key',
    baseUrl: null,
    model: 'gpt-4',
    name: 'Test Provider',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('createAiSdkProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates OpenAI provider with decrypted API key', () => {
    const provider = createMockProvider({ provider: 'openai', apiKey: 'my-key' });

    createAiSdkProvider(provider);

    expect(mockOpenAIProvider).toHaveBeenCalledWith({
      apiKey: 'decrypted-my-key',
      baseURL: undefined,
    });
  });

  it('creates OpenAI provider with custom baseUrl', () => {
    const provider = createMockProvider({
      provider: 'openai',
      baseUrl: 'https://custom.openai.com',
    });

    createAiSdkProvider(provider);

    expect(mockOpenAIProvider).toHaveBeenCalledWith({
      apiKey: 'decrypted-encrypted-key',
      baseURL: 'https://custom.openai.com',
    });
  });

  it('creates Anthropic provider', () => {
    const provider = createMockProvider({ provider: 'anthropic' });

    createAiSdkProvider(provider);

    expect(mockAnthropicProvider).toHaveBeenCalledWith({
      apiKey: 'decrypted-encrypted-key',
      baseURL: undefined,
    });
  });

  it('creates Anthropic provider with custom baseUrl', () => {
    const provider = createMockProvider({
      provider: 'anthropic',
      baseUrl: 'https://custom.anthropic.com',
    });

    createAiSdkProvider(provider);

    expect(mockAnthropicProvider).toHaveBeenCalledWith({
      apiKey: 'decrypted-encrypted-key',
      baseURL: 'https://custom.anthropic.com',
    });
  });

  it('creates Google provider', () => {
    const provider = createMockProvider({ provider: 'google' });

    createAiSdkProvider(provider);

    expect(mockGoogleProvider).toHaveBeenCalledWith({
      apiKey: 'decrypted-encrypted-key',
      baseURL: undefined,
    });
  });

  it('creates Ollama provider using OpenAI-compatible API', () => {
    const provider = createMockProvider({ provider: 'ollama', apiKey: '' });

    createAiSdkProvider(provider);

    // The decrypted empty string ('decrypted-') is falsy check fails,
    // but since 'decrypted-' is truthy, it gets used as the API key
    expect(mockOpenAIProvider).toHaveBeenCalledWith({
      apiKey: 'decrypted-',
      baseURL: 'http://localhost:11434/v1',
    });
  });

  it('creates Ollama provider with custom baseUrl', () => {
    const provider = createMockProvider({
      provider: 'ollama',
      baseUrl: 'http://my-ollama:11434/v1',
    });

    createAiSdkProvider(provider);

    expect(mockOpenAIProvider).toHaveBeenCalledWith({
      apiKey: 'decrypted-encrypted-key',
      baseURL: 'http://my-ollama:11434/v1',
    });
  });

  it('creates custom provider using OpenAI-compatible API', () => {
    const provider = createMockProvider({
      provider: 'custom',
      baseUrl: 'https://my-llm-api.com/v1',
    });

    createAiSdkProvider(provider);

    expect(mockOpenAIProvider).toHaveBeenCalledWith({
      apiKey: 'decrypted-encrypted-key',
      baseURL: 'https://my-llm-api.com/v1',
    });
  });

  it('throws error for custom provider without baseUrl', () => {
    const provider = createMockProvider({
      provider: 'custom',
      baseUrl: null,
    });

    expect(() => createAiSdkProvider(provider)).toThrow('Custom providers require a baseUrl');
  });

  it('throws error for unsupported provider type', () => {
    const provider = createMockProvider({
      provider: 'unknown' as ProviderType,
    });

    expect(() => createAiSdkProvider(provider)).toThrow('Unsupported provider type: unknown');
  });
});

describe('getModelId', () => {
  it('returns the model from the provider', () => {
    const provider = createMockProvider({ model: 'gpt-4-turbo' });

    expect(getModelId(provider)).toBe('gpt-4-turbo');
  });
});
