import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAiSdkProvider, type ProviderType } from './provider-factory';

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

interface MockAccount {
  id: string;
  provider: ProviderType;
  apiKey: string;
  baseUrl: string | null;
  name: string;
  isActive: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

function createMockAccount(overrides: Partial<MockAccount> = {}): MockAccount {
  return {
    id: 'account-123',
    provider: 'openai',
    apiKey: 'encrypted-key',
    baseUrl: null,
    name: 'Test Account',
    isActive: true,
    ownerId: 'user-1',
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
    const provider = createMockAccount({ provider: 'openai', apiKey: 'my-key' });

    createAiSdkProvider(provider);

    expect(mockOpenAIProvider).toHaveBeenCalledWith({
      apiKey: 'decrypted-my-key',
      baseURL: undefined,
    });
  });

  it('creates OpenAI provider with custom baseUrl', () => {
    const provider = createMockAccount({
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
    const provider = createMockAccount({ provider: 'anthropic' });

    createAiSdkProvider(provider);

    expect(mockAnthropicProvider).toHaveBeenCalledWith({
      apiKey: 'decrypted-encrypted-key',
      baseURL: undefined,
    });
  });

  it('creates Anthropic provider with custom baseUrl', () => {
    const provider = createMockAccount({
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
    const provider = createMockAccount({ provider: 'google' });

    createAiSdkProvider(provider);

    expect(mockGoogleProvider).toHaveBeenCalledWith({
      apiKey: 'decrypted-encrypted-key',
      baseURL: undefined,
    });
  });

  it('creates Ollama provider using OpenAI-compatible API', () => {
    const provider = createMockAccount({ provider: 'ollama', apiKey: '' });

    createAiSdkProvider(provider);

    // The decrypted empty string ('decrypted-') is falsy check fails,
    // but since 'decrypted-' is truthy, it gets used as the API key
    expect(mockOpenAIProvider).toHaveBeenCalledWith({
      apiKey: 'decrypted-',
      baseURL: 'http://localhost:11434/v1',
    });
  });

  it('creates Ollama provider with custom baseUrl', () => {
    const provider = createMockAccount({
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
    const provider = createMockAccount({
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
    const provider = createMockAccount({
      provider: 'custom',
      baseUrl: null,
    });

    expect(() => createAiSdkProvider(provider)).toThrow('Custom providers require a baseUrl');
  });

  it('throws error for unsupported provider type', () => {
    const provider = createMockAccount({
      provider: 'unknown' as ProviderType,
    });

    expect(() => createAiSdkProvider(provider)).toThrow('Unsupported provider type: unknown');
  });
});
