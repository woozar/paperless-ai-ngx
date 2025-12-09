import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeDocument, type AnalyzeDocumentParams } from './analyze-document';

const mockGenerateText = vi.fn();
vi.mock('ai', () => ({
  generateText: (args: unknown) => mockGenerateText(args),
  stepCountIs: (count: number) => ({ type: 'stopWhen', count }),
}));

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessDocument: {
      findUnique: vi.fn(),
    },
    aiBot: {
      findUnique: vi.fn(),
    },
    aiUsageMetric: {
      create: vi.fn(),
    },
    documentProcessingResult: {
      create: vi.fn(),
    },
  },
  Prisma: {},
}));

vi.mock('@repo/paperless-client', () => ({
  PaperlessClient: class MockPaperlessClient {
    getTags = vi.fn().mockResolvedValue({ results: [] });
    getCorrespondents = vi.fn().mockResolvedValue({ results: [] });
    getDocumentTypes = vi.fn().mockResolvedValue({ results: [] });
  },
}));

vi.mock('@/lib/crypto/encryption', () => ({
  decrypt: (value: string) => `decrypted-${value}`,
}));

const mockCreateAiSdkProvider = vi.fn().mockReturnValue(() => 'mock-model');
const mockGetModelId = vi.fn().mockReturnValue('gpt-4');
vi.mock('./provider-factory', () => ({
  createAiSdkProvider: (provider: unknown) => mockCreateAiSdkProvider(provider),
  getModelId: (provider: unknown) => mockGetModelId(provider),
}));

vi.mock('./tools/paperless-tools', () => ({
  createPaperlessTools: () => ({
    searchTags: { execute: vi.fn() },
    searchCorrespondents: { execute: vi.fn() },
    searchDocumentTypes: { execute: vi.fn() },
  }),
}));

import { prisma } from '@repo/database';

const mockDocument = {
  id: 'doc-1',
  paperlessId: 100,
  title: 'Invoice 001',
  content: 'This is an invoice from ACME Corp for $500.',
  importedAt: new Date(),
  paperlessInstanceId: 'instance-1',
  paperlessInstance: {
    id: 'instance-1',
    apiUrl: 'https://paperless.example.com',
    apiToken: 'encrypted-token',
    name: 'Test Instance',
    ownerId: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const mockBot = {
  id: 'bot-1',
  name: 'GPT-4 Bot',
  systemPrompt: 'Analyze documents',
  responseLanguage: 'DOCUMENT',
  ownerId: 'admin-1',
  aiProviderId: 'provider-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  aiProvider: {
    id: 'provider-1',
    provider: 'openai',
    model: 'gpt-4',
    apiKey: 'encrypted-key',
    baseUrl: null,
    name: 'OpenAI',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const mockAiResponse = {
  text: JSON.stringify({
    suggestedTitle: 'Invoice from ACME Corp',
    suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
    suggestedDocumentType: { id: 2, name: 'Invoice' },
    suggestedTags: [{ id: 10, name: 'Finance' }],
    confidence: 0.92,
    reasoning: 'The document is clearly an invoice from ACME Corp.',
  }),
  steps: [
    {
      toolCalls: [
        { toolName: 'searchCorrespondents', input: {} },
        { toolName: 'searchDocumentTypes', input: {} },
      ],
    },
  ],
  usage: {
    inputTokens: 500,
    outputTokens: 200,
  },
};

describe('analyzeDocument', () => {
  const defaultParams: AnalyzeDocumentParams = {
    documentId: 'doc-1',
    aiBotId: 'bot-1',
    userId: 'user-1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.paperlessDocument.findUnique).mockResolvedValue(mockDocument);
    vi.mocked(prisma.aiBot.findUnique).mockResolvedValue(mockBot);
    vi.mocked(prisma.aiUsageMetric.create).mockResolvedValue({} as never);
    vi.mocked(prisma.documentProcessingResult.create).mockResolvedValue({} as never);
    mockGenerateText.mockResolvedValue(mockAiResponse);
  });

  it('throws error when document not found', async () => {
    vi.mocked(prisma.paperlessDocument.findUnique).mockResolvedValue(null);

    await expect(analyzeDocument(defaultParams)).rejects.toThrow('Document not found');
  });

  it('throws error when AI bot not found', async () => {
    vi.mocked(prisma.aiBot.findUnique).mockResolvedValue(null);

    await expect(analyzeDocument(defaultParams)).rejects.toThrow('AI bot not found');
  });

  it('returns analysis result on success', async () => {
    const result = await analyzeDocument(defaultParams);

    expect(result.success).toBe(true);
    expect(result.result.suggestedTitle).toBe('Invoice from ACME Corp');
    expect(result.result.suggestedCorrespondent).toEqual({ id: 1, name: 'ACME Corp' });
    expect(result.result.suggestedDocumentType).toEqual({ id: 2, name: 'Invoice' });
    expect(result.result.suggestedTags).toHaveLength(1);
    expect(result.result.confidence).toBe(0.92);
  });

  it('calculates total tokens used', async () => {
    const result = await analyzeDocument(defaultParams);

    expect(result.tokensUsed).toBe(700);
  });

  it('creates AI usage metric', async () => {
    await analyzeDocument(defaultParams);

    expect(prisma.aiUsageMetric.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        provider: 'openai',
        model: 'gpt-4',
        promptTokens: 500,
        completionTokens: 200,
        totalTokens: 700,
        documentId: 100,
        userId: 'user-1',
        aiProviderId: 'provider-1',
        aiBotId: 'bot-1',
      }),
    });
  });

  it('creates document processing result', async () => {
    await analyzeDocument(defaultParams);

    expect(prisma.documentProcessingResult.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        documentId: 'doc-1',
        aiProvider: 'openai/gpt-4',
        tokensUsed: 700,
        originalTitle: 'Invoice 001',
      }),
    });
  });

  it('stores tool calls in processing result', async () => {
    await analyzeDocument(defaultParams);

    expect(prisma.documentProcessingResult.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        toolCalls: [
          { toolName: 'searchCorrespondents', input: {} },
          { toolName: 'searchDocumentTypes', input: {} },
        ],
      }),
    });
  });

  it('creates AI SDK provider with correct config', async () => {
    await analyzeDocument(defaultParams);

    expect(mockCreateAiSdkProvider).toHaveBeenCalledWith(mockBot.aiProvider);
  });

  it('handles response with JSON in text', async () => {
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      text: 'Here is my analysis:\n' + mockAiResponse.text + '\nHope this helps!',
    });

    const result = await analyzeDocument(defaultParams);

    expect(result.success).toBe(true);
    expect(result.result.suggestedTitle).toBe('Invoice from ACME Corp');
  });

  it('uses GERMAN language instruction when responseLanguage is GERMAN', async () => {
    vi.mocked(prisma.aiBot.findUnique).mockResolvedValue({
      ...mockBot,
      responseLanguage: 'GERMAN',
    });

    await analyzeDocument(defaultParams);

    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('LANGUAGE: You MUST respond in German'),
      })
    );
  });

  it('uses ENGLISH language instruction when responseLanguage is ENGLISH', async () => {
    vi.mocked(prisma.aiBot.findUnique).mockResolvedValue({
      ...mockBot,
      responseLanguage: 'ENGLISH',
    });

    await analyzeDocument(defaultParams);

    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('LANGUAGE: You MUST respond in English'),
      })
    );
  });

  it('uses DOCUMENT language instruction when responseLanguage is DOCUMENT', async () => {
    await analyzeDocument(defaultParams);

    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('Respond in the same language as the document'),
      })
    );
  });

  it('truncates content if too long', async () => {
    const longContent = 'x'.repeat(10000);
    vi.mocked(prisma.paperlessDocument.findUnique).mockResolvedValue({
      ...mockDocument,
      content: longContent,
    });

    await analyzeDocument(defaultParams);

    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('...'),
      })
    );
  });

  it('handles empty steps array', async () => {
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      steps: [],
    });

    const result = await analyzeDocument(defaultParams);

    expect(result.success).toBe(true);
  });

  it('handles missing usage data', async () => {
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      usage: undefined,
    });

    const result = await analyzeDocument(defaultParams);

    expect(result.tokensUsed).toBe(0);
  });

  it('defaults to DOCUMENT language when responseLanguage is null', async () => {
    vi.mocked(prisma.aiBot.findUnique).mockResolvedValue({
      ...mockBot,
      responseLanguage: null,
    });

    await analyzeDocument(defaultParams);

    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('Respond in the same language as the document'),
      })
    );
  });
});
