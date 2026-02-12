import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';
import { decrypt } from '@/lib/crypto/encryption';

const TestAiModelConnectionSchema = z.object({
  aiAccountId: z.string().min(1),
  modelIdentifier: z.string().min(1),
});

export const POST = authRoute(
  async ({ user, body }) => {
    const { aiAccountId, modelIdentifier } = body;

    // Load the AI account from database
    const account = await prisma.aiAccount.findFirst({
      where: {
        id: aiAccountId,
        OR: [
          { ownerId: user.userId },
          {
            sharedWith: {
              some: {
                OR: [{ userId: user.userId }, { userId: null }],
              },
            },
          },
        ],
      },
    });

    if (!account) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'aiAccountNotFound',
          },
        },
        { status: 200 }
      );
    }

    const provider = account.provider;
    const apiKey = decrypt(account.apiKey);
    const baseUrl = account.baseUrl;

    try {
      // Make a minimal AI request to test the model
      switch (provider) {
        case 'openai': {
          const openai = createOpenAI({ apiKey, baseURL: baseUrl || undefined });
          await generateText({
            model: openai(modelIdentifier),
            system: 'Answer as fast and short as possible.',
            prompt: 'hello',
            maxOutputTokens: 16,
          });
          break;
        }

        case 'anthropic': {
          const anthropic = createAnthropic({ apiKey, baseURL: baseUrl || undefined });
          await generateText({
            model: anthropic(modelIdentifier),
            system: 'Answer as fast and short as possible.',
            prompt: 'hello',
            maxOutputTokens: 16,
          });
          break;
        }

        case 'google': {
          const google = createGoogleGenerativeAI({ apiKey, baseURL: baseUrl || undefined });
          await generateText({
            model: google(modelIdentifier),
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
            model: ollama(modelIdentifier),
            system: 'Answer as fast and short as possible.',
            prompt: 'hello',
            maxOutputTokens: 16,
          });
          break;
        }

        case 'custom': {
          const custom = createOpenAI({ apiKey, baseURL: baseUrl || undefined });
          await generateText({
            model: custom(modelIdentifier),
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
      console.error(
        `Model connection test error for ${provider}/${modelIdentifier}:`,
        errorMessage
      );
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
    bodySchema: TestAiModelConnectionSchema,
    errorLogPrefix: 'Test AI model connection',
  }
);
