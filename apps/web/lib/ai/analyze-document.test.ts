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
    setting: {
      findUnique: vi.fn(),
    },
  },
  Prisma: {},
}));

vi.mock('@repo/paperless-client', () => ({
  PaperlessClient: class MockPaperlessClient {
    // Return data that matches the AI response for validateAndCorrectIds
    getTags = vi.fn().mockResolvedValue({
      results: [{ id: 10, name: 'Finance' }],
    });
    getCorrespondents = vi.fn().mockResolvedValue({
      results: [{ id: 1, name: 'ACME Corp' }],
    });
    getDocumentTypes = vi.fn().mockResolvedValue({
      results: [{ id: 2, name: 'Invoice' }],
    });
    getDocument = vi.fn().mockResolvedValue({ tags: [10] }); // Same as mockDocument.tagIds
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
  documentDate: new Date('2024-01-15'),
  paperlessModified: new Date('2024-01-15'),
  createdAt: new Date(),
  updatedAt: new Date(),
  correspondentId: null,
  paperlessInstanceId: 'instance-1',
  tagIds: [10], // Document already has tag with id 10
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
  aiModelId: 'model-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  aiModel: {
    id: 'model-1',
    name: 'GPT-4',
    modelIdentifier: 'gpt-4',
    inputTokenPrice: null,
    outputTokenPrice: null,
    isActive: true,
    ownerId: 'admin-1',
    aiAccountId: 'account-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    aiAccount: {
      id: 'account-1',
      provider: 'openai',
      apiKey: 'encrypted-key',
      baseUrl: null,
      name: 'OpenAI',
      isActive: true,
      ownerId: 'admin-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};

const mockAiResponse = {
  text: JSON.stringify({
    suggestedTitle: 'Invoice from ACME Corp',
    suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
    suggestedDocumentType: { id: 2, name: 'Invoice' },
    suggestedTags: [{ id: 10, name: 'Finance' }],
    suggestedDate: '2024-01-15',
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
    vi.mocked(prisma.setting.findUnique).mockResolvedValue(null); // Default: no identity set
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

  it('returns input and output tokens separately', async () => {
    const result = await analyzeDocument(defaultParams);

    expect(result.inputTokens).toBe(500);
    expect(result.outputTokens).toBe(200);
  });

  it('calculates estimated cost when model has pricing', async () => {
    vi.mocked(prisma.aiBot.findUnique).mockResolvedValue({
      ...mockBot,
      aiModel: {
        ...mockBot.aiModel,
        inputTokenPrice: 3.0, // $3 per 1M input tokens
        outputTokenPrice: 15.0, // $15 per 1M output tokens
      },
    } as never);

    const result = await analyzeDocument(defaultParams);

    // (500 * 3 + 200 * 15) / 1_000_000 = (1500 + 3000) / 1_000_000 = 0.0045
    expect(result.estimatedCost).toBeCloseTo(0.0045);
  });

  it('returns null estimated cost when model pricing is not set', async () => {
    const result = await analyzeDocument(defaultParams);

    expect(result.estimatedCost).toBeNull();
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
        aiAccountId: 'account-1',
        aiModelId: 'model-1',
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
        inputTokens: 500,
        outputTokens: 200,
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

    expect(mockCreateAiSdkProvider).toHaveBeenCalledWith(mockBot.aiModel.aiAccount);
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

    expect(result.inputTokens).toBe(0);
    expect(result.outputTokens).toBe(0);
  });

  it('defaults to DOCUMENT language when responseLanguage is empty', async () => {
    vi.mocked(prisma.aiBot.findUnique).mockResolvedValue({
      ...mockBot,
      responseLanguage: '',
    });

    await analyzeDocument(defaultParams);

    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('Respond in the same language as the document'),
      })
    );
  });

  it('includes user identity in prompt when setting is configured', async () => {
    vi.mocked(prisma.setting.findUnique).mockResolvedValue({
      settingKey: 'ai.context.identity',
      settingValue: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await analyzeDocument(defaultParams);

    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('USER IDENTITY: The document owner is "John Doe"'),
      })
    );
  });

  it('does not include user identity in prompt when setting is empty', async () => {
    vi.mocked(prisma.setting.findUnique).mockResolvedValue({
      settingKey: 'ai.context.identity',
      settingValue: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await analyzeDocument(defaultParams);

    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.not.stringContaining('USER IDENTITY'),
      })
    );
  });

  it('does not include user identity in prompt when setting is whitespace only', async () => {
    vi.mocked(prisma.setting.findUnique).mockResolvedValue({
      settingKey: 'ai.context.identity',
      settingValue: '   ',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await analyzeDocument(defaultParams);

    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.not.stringContaining('USER IDENTITY'),
      })
    );
  });

  it('does not include user identity in prompt when setting does not exist', async () => {
    vi.mocked(prisma.setting.findUnique).mockResolvedValue(null);

    await analyzeDocument(defaultParams);

    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.not.stringContaining('USER IDENTITY'),
      })
    );
  });

  it('returns suggested tags from AI response', async () => {
    const result = await analyzeDocument(defaultParams);

    expect(result.result.suggestedTags).toHaveLength(1);
    expect(result.result.suggestedTags[0]).toEqual({
      id: 10,
      name: 'Finance',
      isAssigned: true, // Tag 10 is in document.tagIds
    });
  });

  it('handles both existing and new tags', async () => {
    // AI suggests existing tag (with id) and new tag (name only)
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      text: JSON.stringify({
        suggestedTitle: 'Invoice from ACME Corp',
        suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
        suggestedDocumentType: { id: 2, name: 'Invoice' },
        suggestedTags: [{ id: 10, name: 'Finance' }, { name: 'New Tag' }],
        suggestedDate: '2024-01-15',
        confidence: 0.92,
        reasoning: 'The document is an invoice.',
      }),
    });

    const result = await analyzeDocument(defaultParams);

    expect(result.result.suggestedTags).toEqual([
      { id: 10, name: 'Finance', isAssigned: true }, // Tag 10 is in document.tagIds
      { name: 'New Tag', isAssigned: false }, // New tags are never already assigned
    ]);
  });

  it('corrects tag ID when AI provides wrong ID but correct name', async () => {
    // AI suggests tag with wrong ID but name exists in Paperless
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      text: JSON.stringify({
        suggestedTitle: 'Invoice',
        suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
        suggestedDocumentType: { id: 2, name: 'Invoice' },
        suggestedTags: [{ id: 999, name: 'Finance' }], // Wrong ID 999, but 'Finance' exists as ID 10
        suggestedDate: '2024-01-15',
        confidence: 0.9,
        reasoning: 'Test',
      }),
    });

    const result = await analyzeDocument(defaultParams);

    expect(result.result.suggestedTags).toEqual([
      { id: 10, name: 'Finance', isAssigned: true }, // Corrected to ID 10
    ]);
  });

  it('removes tag ID when name does not exist in Paperless', async () => {
    // AI suggests tag with ID but the name doesn't exist in Paperless
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      text: JSON.stringify({
        suggestedTitle: 'Invoice',
        suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
        suggestedDocumentType: { id: 2, name: 'Invoice' },
        suggestedTags: [{ id: 10, name: 'NonExistentTag' }], // ID doesn't match name, name doesn't exist
        suggestedDate: '2024-01-15',
        confidence: 0.9,
        reasoning: 'Test',
      }),
    });

    const result = await analyzeDocument(defaultParams);

    expect(result.result.suggestedTags).toEqual([
      { name: 'NonExistentTag', isAssigned: false }, // ID removed, treated as new tag
    ]);
  });

  it('looks up tag ID by name when tag has no ID', async () => {
    // AI suggests tag by name only, but the tag exists in Paperless
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      text: JSON.stringify({
        suggestedTitle: 'Invoice',
        suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
        suggestedDocumentType: { id: 2, name: 'Invoice' },
        suggestedTags: [{ name: 'Finance' }], // No ID provided, but 'Finance' exists as ID 10
        suggestedDate: '2024-01-15',
        confidence: 0.9,
        reasoning: 'Test',
      }),
    });

    const result = await analyzeDocument(defaultParams);

    expect(result.result.suggestedTags).toEqual([
      { id: 10, name: 'Finance', isAssigned: true }, // ID looked up from name
    ]);
  });

  it('corrects correspondent ID when AI provides wrong ID but correct name', async () => {
    // AI suggests correspondent with wrong ID but name exists in Paperless
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      text: JSON.stringify({
        suggestedTitle: 'Invoice',
        suggestedCorrespondent: { id: 999, name: 'ACME Corp' }, // Wrong ID 999, but 'ACME Corp' exists as ID 1
        suggestedDocumentType: { id: 2, name: 'Invoice' },
        suggestedTags: [{ id: 10, name: 'Finance' }],
        suggestedDate: '2024-01-15',
        confidence: 0.9,
        reasoning: 'Test',
      }),
    });

    const result = await analyzeDocument(defaultParams);

    expect(result.result.suggestedCorrespondent).toEqual({ id: 1, name: 'ACME Corp' }); // Corrected to ID 1
  });

  it('removes correspondent ID when name does not exist in Paperless', async () => {
    // AI suggests correspondent with ID but the name doesn't exist in Paperless
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      text: JSON.stringify({
        suggestedTitle: 'Invoice',
        suggestedCorrespondent: { id: 1, name: 'NonExistent Corp' }, // ID doesn't match name, name doesn't exist
        suggestedDocumentType: { id: 2, name: 'Invoice' },
        suggestedTags: [{ id: 10, name: 'Finance' }],
        suggestedDate: '2024-01-15',
        confidence: 0.9,
        reasoning: 'Test',
      }),
    });

    const result = await analyzeDocument(defaultParams);

    expect(result.result.suggestedCorrespondent).toEqual({ name: 'NonExistent Corp' }); // ID removed
  });

  it('looks up correspondent ID by name when correspondent has no ID', async () => {
    // AI suggests correspondent by name only, but the correspondent exists in Paperless
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      text: JSON.stringify({
        suggestedTitle: 'Invoice',
        suggestedCorrespondent: { name: 'ACME Corp' }, // No ID provided, but 'ACME Corp' exists as ID 1
        suggestedDocumentType: { id: 2, name: 'Invoice' },
        suggestedTags: [{ id: 10, name: 'Finance' }],
        suggestedDate: '2024-01-15',
        confidence: 0.9,
        reasoning: 'Test',
      }),
    });

    const result = await analyzeDocument(defaultParams);

    expect(result.result.suggestedCorrespondent).toEqual({ id: 1, name: 'ACME Corp' }); // ID looked up from name
  });

  it('returns correspondent as-is when name does not exist and no ID provided', async () => {
    // AI suggests correspondent by name only, and the correspondent doesn't exist in Paperless
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      text: JSON.stringify({
        suggestedTitle: 'Invoice',
        suggestedCorrespondent: { name: 'Brand New Corp' }, // No ID, name doesn't exist
        suggestedDocumentType: { id: 2, name: 'Invoice' },
        suggestedTags: [{ id: 10, name: 'Finance' }],
        suggestedDate: '2024-01-15',
        confidence: 0.9,
        reasoning: 'Test',
      }),
    });

    const result = await analyzeDocument(defaultParams);

    expect(result.result.suggestedCorrespondent).toEqual({ name: 'Brand New Corp' }); // Returned as-is
  });

  it('handles tag with ID but no name', async () => {
    // Edge case: AI suggests tag with only ID (no name) - this is valid per ExistingTagSchema
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      text: JSON.stringify({
        suggestedTitle: 'Invoice',
        suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
        suggestedDocumentType: { id: 2, name: 'Invoice' },
        suggestedTags: [{ id: 10 }], // Only ID, no name - valid existing tag
        suggestedDate: '2024-01-15',
        confidence: 0.9,
        reasoning: 'Test',
      }),
    });

    const result = await analyzeDocument(defaultParams);

    // Tag has ID 10 which exists in Paperless as 'Finance', but no name provided
    // Since no name to compare, ID is kept and isAssigned is checked
    expect(result.result.suggestedTags).toEqual([{ name: undefined, isAssigned: false }]);
  });

  it('handles tag with unknown ID and no name', async () => {
    // Edge case: AI suggests tag with ID that doesn't exist in Paperless (and no name)
    mockGenerateText.mockResolvedValueOnce({
      ...mockAiResponse,
      text: JSON.stringify({
        suggestedTitle: 'Invoice',
        suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
        suggestedDocumentType: { id: 2, name: 'Invoice' },
        suggestedTags: [{ id: 999 }], // Unknown ID, no name
        suggestedDate: '2024-01-15',
        confidence: 0.9,
        reasoning: 'Test',
      }),
    });

    const result = await analyzeDocument(defaultParams);

    // Tag has ID 999 which doesn't exist in Paperless, and no name
    // Since actualName(undefined) === tagName(undefined), tag is kept as-is
    expect(result.result.suggestedTags).toEqual([{ id: 999, isAssigned: false }]);
  });
});
