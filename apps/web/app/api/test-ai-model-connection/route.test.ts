import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

vi.mock('@repo/database', () => ({
  prisma: {
    aiAccount: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('@/lib/crypto/encryption', () => ({
  decrypt: vi.fn((val) => val),
}));

vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

// Mock AI SDK providers - they return a function that takes model name and returns model config
const mockModelFn = vi.fn((modelName: string) => ({ modelId: modelName }));

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(() => mockModelFn),
}));

vi.mock('@ai-sdk/anthropic', () => ({
  createAnthropic: vi.fn(() => mockModelFn),
}));

vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: vi.fn(() => mockModelFn),
}));

import { getAuthUser } from '@/lib/auth/jwt';
import { prisma } from '@repo/database';
import { generateText } from 'ai';

function mockUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

function mockAiAccount(provider: string, baseUrl: string | null = null) {
  vi.mocked(prisma.aiAccount.findFirst).mockResolvedValueOnce({
    id: 'account-1',
    name: 'Test Account',
    provider,
    apiKey: 'encrypted-key',
    baseUrl,
    isActive: true,
    ownerId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

describe('POST /api/test-ai-model-connection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('openai provider', () => {
    it('returns success when AI request succeeds with custom model', async () => {
      mockUser();
      mockAiAccount('openai');

      vi.mocked(generateText).mockResolvedValueOnce({
        text: 'Hello!',
      } as never);

      const request = new NextRequest('http://localhost/api/test-ai-model-connection', {
        method: 'POST',
        body: JSON.stringify({
          aiAccountId: 'account-1',
          modelIdentifier: 'gpt-4-turbo',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(vi.mocked(generateText)).toHaveBeenCalledWith(
        expect.objectContaining({
          system: 'Answer as fast and short as possible.',
          prompt: 'hello',
          maxOutputTokens: 16,
        })
      );
    });

    it('returns error when model does not exist', async () => {
      mockUser();
      mockAiAccount('openai');

      vi.mocked(generateText).mockRejectedValueOnce(new Error('Model not found'));

      const request = new NextRequest('http://localhost/api/test-ai-model-connection', {
        method: 'POST',
        body: JSON.stringify({
          aiAccountId: 'account-1',
          modelIdentifier: 'nonexistent-model',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: false,
        error: {
          message: 'connectionError',
          params: { error: 'Model not found' },
        },
      });
    });
  });

  describe('anthropic provider', () => {
    it('returns success when AI request succeeds', async () => {
      mockUser();
      mockAiAccount('anthropic');

      vi.mocked(generateText).mockResolvedValueOnce({
        text: 'Hello!',
      } as never);

      const request = new NextRequest('http://localhost/api/test-ai-model-connection', {
        method: 'POST',
        body: JSON.stringify({
          aiAccountId: 'account-1',
          modelIdentifier: 'claude-3-opus',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
    });
  });

  describe('google provider', () => {
    it('returns success when AI request succeeds', async () => {
      mockUser();
      mockAiAccount('google');

      vi.mocked(generateText).mockResolvedValueOnce({
        text: 'Hello!',
      } as never);

      const request = new NextRequest('http://localhost/api/test-ai-model-connection', {
        method: 'POST',
        body: JSON.stringify({
          aiAccountId: 'account-1',
          modelIdentifier: 'gemini-pro',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
    });
  });

  describe('ollama provider', () => {
    it('returns success when AI request succeeds', async () => {
      mockUser();
      mockAiAccount('ollama', 'http://localhost:11434');

      vi.mocked(generateText).mockResolvedValueOnce({
        text: 'Hello!',
      } as never);

      const request = new NextRequest('http://localhost/api/test-ai-model-connection', {
        method: 'POST',
        body: JSON.stringify({
          aiAccountId: 'account-1',
          modelIdentifier: 'llama2',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
    });
  });

  describe('custom provider', () => {
    it('returns success when AI request succeeds', async () => {
      mockUser();
      mockAiAccount('custom', 'https://api.example.com');

      vi.mocked(generateText).mockResolvedValueOnce({
        text: 'Hello!',
      } as never);

      const request = new NextRequest('http://localhost/api/test-ai-model-connection', {
        method: 'POST',
        body: JSON.stringify({
          aiAccountId: 'account-1',
          modelIdentifier: 'custom-model',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
    });
  });

  describe('error handling', () => {
    it('returns error when AI account not found', async () => {
      mockUser();
      vi.mocked(prisma.aiAccount.findFirst).mockResolvedValueOnce(null);

      const request = new NextRequest('http://localhost/api/test-ai-model-connection', {
        method: 'POST',
        body: JSON.stringify({
          aiAccountId: 'nonexistent-account',
          modelIdentifier: 'gpt-4',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: false,
        error: {
          message: 'aiAccountNotFound',
        },
      });
    });

    it('validates aiAccountId is not empty', async () => {
      mockUser();

      const request = new NextRequest('http://localhost/api/test-ai-model-connection', {
        method: 'POST',
        body: JSON.stringify({
          aiAccountId: '',
          modelIdentifier: 'gpt-4',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('invalidRequest');
    });

    it('validates modelIdentifier is not empty', async () => {
      mockUser();

      const request = new NextRequest('http://localhost/api/test-ai-model-connection', {
        method: 'POST',
        body: JSON.stringify({
          aiAccountId: 'account-1',
          modelIdentifier: '',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('invalidRequest');
    });
  });
});
