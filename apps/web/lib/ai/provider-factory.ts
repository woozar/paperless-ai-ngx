import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { Prisma } from '@repo/database';
import { decrypt } from '@/lib/crypto/encryption';

type AiAccount = Prisma.AiAccountGetPayload<object>;

export type ProviderType = 'openai' | 'anthropic' | 'google' | 'ollama' | 'custom';

// Providers that support PDF/multimodal input
const PDF_SUPPORTED_PROVIDERS = new Set<ProviderType>(['openai', 'anthropic', 'google']);

/**
 * Checks if a provider supports PDF/multimodal input.
 *
 * @param provider - The provider type string
 * @returns true if the provider supports PDF input
 */
export function providerSupportsPdf(provider: string): boolean {
  return PDF_SUPPORTED_PROVIDERS.has(provider as ProviderType);
}

/**
 * Creates a Vercel AI SDK provider instance based on the AiAccount configuration.
 *
 * @param account - The AiAccount from the database
 * @returns A configured AI SDK provider instance
 */
export function createAiSdkProvider(account: AiAccount) {
  const apiKey = decrypt(account.apiKey);
  const providerType = account.provider as ProviderType;

  switch (providerType) {
    case 'openai':
      return createOpenAI({
        apiKey,
        baseURL: account.baseUrl || undefined,
      });

    case 'anthropic':
      return createAnthropic({
        apiKey,
        baseURL: account.baseUrl || undefined,
      });

    case 'google':
      return createGoogleGenerativeAI({
        apiKey,
        baseURL: account.baseUrl || undefined,
      });

    case 'ollama':
      // Ollama uses OpenAI-compatible API
      return createOpenAI({
        // v8 ignore next -- @preserve
        apiKey: apiKey || 'ollama', // Ollama doesn't require API key
        baseURL: account.baseUrl || 'http://localhost:11434/v1',
      });

    case 'custom':
      // Custom providers use OpenAI-compatible API
      if (!account.baseUrl) {
        throw new Error('Custom providers require a baseUrl');
      }
      return createOpenAI({
        apiKey,
        baseURL: account.baseUrl,
      });

    default:
      throw new Error(`Unsupported provider type: ${providerType}`);
  }
}
