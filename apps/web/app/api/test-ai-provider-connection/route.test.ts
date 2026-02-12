import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
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
import { generateText } from 'ai';

function mockUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('POST /api/test-ai-provider-connection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('openai provider', () => {
    it('returns success when AI request succeeds', async () => {
      mockUser();

      vi.mocked(generateText).mockResolvedValueOnce({
        text: 'Hello!',
      } as never);

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'openai',
          apiKey: 'test-key',
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

    it('returns error when AI request fails', async () => {
      mockUser();

      vi.mocked(generateText).mockRejectedValueOnce(new Error('Invalid API key'));

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'openai',
          apiKey: 'invalid-key',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: false,
        error: {
          message: 'connectionError',
          params: { error: 'Invalid API key' },
        },
      });
    });

    it('trims whitespace from API key', async () => {
      mockUser();

      vi.mocked(generateText).mockResolvedValueOnce({
        text: 'Hello!',
      } as never);

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'openai',
          apiKey: '  test-key  ',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
    });
  });

  describe('anthropic provider', () => {
    it('returns success when AI request succeeds', async () => {
      mockUser();

      vi.mocked(generateText).mockResolvedValueOnce({
        text: 'Hello!',
      } as never);

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'anthropic',
          apiKey: 'test-key',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
    });

    it('returns error when AI request fails', async () => {
      mockUser();

      vi.mocked(generateText).mockRejectedValueOnce(new Error('Unauthorized'));

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'anthropic',
          apiKey: 'invalid-key',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: false,
        error: {
          message: 'connectionError',
          params: { error: 'Unauthorized' },
        },
      });
    });
  });

  describe('google provider', () => {
    it('returns success when AI request succeeds', async () => {
      mockUser();

      vi.mocked(generateText).mockResolvedValueOnce({
        text: 'Hello!',
      } as never);

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'google',
          apiKey: 'test-key',
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

      vi.mocked(generateText).mockResolvedValueOnce({
        text: 'Hello!',
      } as never);

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'ollama',
          apiKey: 'test-key',
          baseUrl: 'http://localhost:11434',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
    });

    it('returns error when baseUrl is missing', async () => {
      mockUser();

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'ollama',
          apiKey: 'test-key',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: false,
        error: {
          message: 'baseUrlRequired',
        },
      });
    });
  });

  describe('custom provider', () => {
    it('returns success when AI request succeeds', async () => {
      mockUser();

      vi.mocked(generateText).mockResolvedValueOnce({
        text: 'Hello!',
      } as never);

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'custom',
          apiKey: 'test-key',
          baseUrl: 'https://api.example.com',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
    });

    it('returns error when baseUrl is missing', async () => {
      mockUser();

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'custom',
          apiKey: 'test-key',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: false,
        error: {
          message: 'baseUrlRequired',
        },
      });
    });
  });

  describe('error handling', () => {
    it('returns error when AI request fails with network error', async () => {
      mockUser();

      vi.mocked(generateText).mockRejectedValueOnce(new Error('Network error'));

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'openai',
          apiKey: 'test-key',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: false,
        error: {
          message: 'connectionError',
          params: { error: 'Network error' },
        },
      });
    });

    it('validates provider is valid', async () => {
      mockUser();

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'invalid-provider',
          apiKey: 'test-key',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('invalidRequest');
    });

    it('validates apiKey is not empty', async () => {
      mockUser();

      const request = new NextRequest('http://localhost/api/test-ai-provider-connection', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'openai',
          apiKey: '',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('invalidRequest');
    });
  });
});
