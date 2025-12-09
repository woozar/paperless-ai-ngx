import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { Prisma } from '@repo/database';
import { decrypt } from '@/lib/crypto/encryption';

type AiProvider = Prisma.AiProviderGetPayload<object>;

export type ProviderType = 'openai' | 'anthropic' | 'google' | 'ollama' | 'custom';

/**
 * Creates a Vercel AI SDK provider instance based on the AiProvider configuration.
 *
 * @param provider - The AiProvider from the database
 * @returns A configured AI SDK provider instance
 */
export function createAiSdkProvider(provider: AiProvider) {
  const apiKey = decrypt(provider.apiKey);
  const providerType = provider.provider as ProviderType;

  switch (providerType) {
    case 'openai':
      return createOpenAI({
        apiKey,
        baseURL: provider.baseUrl || undefined,
      });

    case 'anthropic':
      return createAnthropic({
        apiKey,
        baseURL: provider.baseUrl || undefined,
      });

    case 'google':
      return createGoogleGenerativeAI({
        apiKey,
        baseURL: provider.baseUrl || undefined,
      });

    case 'ollama':
      // Ollama uses OpenAI-compatible API
      return createOpenAI({
        // v8 ignore next -- @preserve
        apiKey: apiKey || 'ollama', // Ollama doesn't require API key
        baseURL: provider.baseUrl || 'http://localhost:11434/v1',
      });

    case 'custom':
      // Custom providers use OpenAI-compatible API
      if (!provider.baseUrl) {
        throw new Error('Custom providers require a baseUrl');
      }
      return createOpenAI({
        apiKey,
        baseURL: provider.baseUrl,
      });

    default:
      throw new Error(`Unsupported provider type: ${providerType}`);
  }
}

/**
 * Gets the model ID from the AiProvider configuration.
 */
export function getModelId(provider: AiProvider): string {
  return provider.model;
}
