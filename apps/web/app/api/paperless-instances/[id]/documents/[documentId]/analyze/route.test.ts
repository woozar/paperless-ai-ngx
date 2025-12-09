import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
    },
    paperlessDocument: {
      findFirst: vi.fn(),
    },
    aiBot: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

const mockAnalyzeDocument = vi.fn();
vi.mock('@/lib/ai/analyze-document', () => ({
  analyzeDocument: (args: unknown) => mockAnalyzeDocument(args),
}));

import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  paperlessInstance: {
    findFirst: typeof prisma.paperlessInstance.findFirst;
  };
  paperlessDocument: {
    findFirst: typeof prisma.paperlessDocument.findFirst;
  };
  aiBot: {
    findFirst: typeof prisma.aiBot.findFirst;
  };
}>(prisma);

const mockContext = (id: string, documentId: string) => ({
  params: Promise.resolve({ id, documentId }),
});

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

function mockUser(userId = 'user-1') {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId,
    username: 'user',
    role: 'USER',
  });
}

const mockInstance = {
  id: 'instance-1',
  name: 'Test Instance',
  apiUrl: 'https://paperless.example.com',
  ownerId: 'admin-1',
};

const mockDocument = {
  id: 'doc-1',
  paperlessId: 100,
  title: 'Invoice 001',
  content: 'Invoice content',
  paperlessInstanceId: 'instance-1',
};

// Valid CUID format IDs for testing
const BOT_ID = 'cjld2cjxh0000qzrmn831i7rn';

const mockBot = {
  id: BOT_ID,
  name: 'GPT-4 Bot',
  systemPrompt: 'Analyze documents',
  ownerId: 'admin-1',
};

const mockAnalysisResult = {
  success: true,
  result: {
    suggestedTitle: 'Invoice from ACME',
    suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
    suggestedDocumentType: { id: 2, name: 'Invoice' },
    suggestedTags: [{ id: 10, name: 'Finance' }],
    confidence: 0.92,
    reasoning: 'Document shows invoice details.',
  },
  tokensUsed: 1500,
};

describe('POST /api/paperless-instances/[id]/documents/[documentId]/analyze', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/analyze',
      {
        method: 'POST',
        body: JSON.stringify({ aiBotId: BOT_ID }),
      }
    );
    const response = await POST(request, mockContext('instance-1', 'doc-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns 404 when document not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/analyze',
      {
        method: 'POST',
        body: JSON.stringify({ aiBotId: BOT_ID }),
      }
    );
    const response = await POST(request, mockContext('instance-1', 'doc-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('documentNotFound');
  });

  it('returns 404 when AI bot not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/analyze',
      {
        method: 'POST',
        body: JSON.stringify({ aiBotId: BOT_ID }),
      }
    );
    const response = await POST(request, mockContext('instance-1', 'doc-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiBotNotFound');
  });

  it('successfully analyzes document', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(mockBot);
    mockAnalyzeDocument.mockResolvedValueOnce(mockAnalysisResult);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/analyze',
      {
        method: 'POST',
        body: JSON.stringify({ aiBotId: BOT_ID }),
      }
    );
    const response = await POST(request, mockContext('instance-1', 'doc-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.result.suggestedTitle).toBe('Invoice from ACME');
    expect(data.tokensUsed).toBe(1500);
  });

  it('passes correct parameters to analyzeDocument', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(mockBot);
    mockAnalyzeDocument.mockResolvedValueOnce(mockAnalysisResult);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/analyze',
      {
        method: 'POST',
        body: JSON.stringify({ aiBotId: BOT_ID }),
      }
    );
    await POST(request, mockContext('instance-1', 'doc-1'));

    expect(mockAnalyzeDocument).toHaveBeenCalledWith({
      documentId: 'doc-1',
      aiBotId: BOT_ID,
      userId: 'admin-1',
    });
  });

  it('allows access to shared instances', async () => {
    mockUser('user-2');
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(mockBot);
    mockAnalyzeDocument.mockResolvedValueOnce(mockAnalysisResult);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/analyze',
      {
        method: 'POST',
        body: JSON.stringify({ aiBotId: BOT_ID }),
      }
    );
    const response = await POST(request, mockContext('instance-1', 'doc-1'));

    expect(response.status).toBe(200);
  });

  it('validates request body with schema', async () => {
    mockAdmin();

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/analyze',
      {
        method: 'POST',
        body: JSON.stringify({}),
      }
    );
    const response = await POST(request, mockContext('instance-1', 'doc-1'));

    expect(response.status).toBe(400);
  });
});
