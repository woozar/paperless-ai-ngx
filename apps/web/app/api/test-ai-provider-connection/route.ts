import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { authRoute } from '@/lib/api/route-wrapper';
import { AiProviderTypeSchema } from '@/lib/api/schemas/ai-accounts-ui';

const TestAiProviderConnectionSchema = z.object({
  provider: AiProviderTypeSchema,
  apiKey: z.string().min(1),
  baseUrl: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.url().optional()),
});

export const POST = authRoute(
  async ({ body }) => {
    const { provider, baseUrl } = body;
    const apiKey = body.apiKey.trim();

    try {
      // Validate baseUrl for providers that require it
      if ((provider === 'ollama' || provider === 'custom') && !baseUrl) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'baseUrlRequired',
            },
          },
          { status: 200 }
        );
      }

      // Make a minimal AI request to test the connection using cheapest models
      switch (provider) {
        case 'openai': {
          const openai = createOpenAI({ apiKey, baseURL: baseUrl || undefined });
          await generateText({
            model: openai('gpt-4o-mini'),
            system: 'Answer as fast and short as possible.',
            prompt: 'hello',
            maxOutputTokens: 16,
          });
          break;
        }

        case 'anthropic': {
          const anthropic = createAnthropic({ apiKey, baseURL: baseUrl || undefined });
          await generateText({
            model: anthropic('claude-haiku-4-5-20241022'),
            system: 'Answer as fast and short as possible.',
            prompt: 'hello',
            maxOutputTokens: 16,
          });
          break;
        }

        case 'google': {
          const google = createGoogleGenerativeAI({ apiKey, baseURL: baseUrl || undefined });
          await generateText({
            model: google('gemini-2.0-flash-exp'),
            system: 'Answer as fast and short as possible.',
            prompt: 'hello',
            maxOutputTokens: 16,
          });
          break;
        }

        case 'ollama': {
          const ollama = createOpenAI({
            apiKey: apiKey || 'ollama',
            baseURL: baseUrl || 'http://localhost:11434/v1',
          });
          await generateText({
            model: ollama('llama3.2:latest'),
            system: 'Answer as fast and short as possible.',
            prompt: 'hello',
            maxOutputTokens: 16,
          });
          break;
        }

        case 'custom': {
          const custom = createOpenAI({ apiKey, baseURL: baseUrl });
          await generateText({
            model: custom('gpt-4o-mini'),
            system: 'Answer as fast and short as possible.',
            prompt: 'hello',
            maxOutputTokens: 16,
          });
          break;
        }
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Connection test error for ${provider}:`, errorMessage);
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'connectionError',
            params: { error: errorMessage },
          },
        },
        { status: 200 }
      );
    }
  },
  {
    bodySchema: TestAiProviderConnectionSchema,
    errorLogPrefix: 'Test AI provider connection',
  }
);
