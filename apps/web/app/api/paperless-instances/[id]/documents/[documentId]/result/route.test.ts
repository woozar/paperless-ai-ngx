import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
    },
    paperlessDocument: {
      findFirst: vi.fn(),
    },
    documentProcessingResult: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
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
  documentProcessingResult: {
    findFirst: typeof prisma.documentProcessingResult.findFirst;
  };
}>(prisma);

const mockContext = (id: string, documentId: string) => ({
  params: Promise.resolve({ id, documentId }),
});

function mockUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('GET /api/paperless-instances/[id]/documents/[documentId]/result', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/result'
    );
    const response = await GET(request, mockContext('instance-1', 'doc-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns 404 when document not found', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/result'
    );
    const response = await GET(request, mockContext('instance-1', 'doc-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('documentNotFound');
  });

  it('returns 404 when no processing result exists', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
      id: 'doc-1',
      paperlessId: 123,
      title: 'Test Document',
    });
    mockedPrisma.documentProcessingResult.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/result'
    );
    const response = await GET(request, mockContext('instance-1', 'doc-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('noResultFound');
  });

  it('returns processing result successfully', async () => {
    const mockDate = new Date('2024-01-15T12:00:00Z');
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
      id: 'doc-1',
      paperlessId: 123,
      title: 'Test Document',
    });
    mockedPrisma.documentProcessingResult.findFirst.mockResolvedValueOnce({
      id: 'result-1',
      processedAt: mockDate,
      aiProvider: 'OpenAI GPT-4',
      inputTokens: 1000,
      outputTokens: 500,
      estimatedCost: 0.0025,
      changes: {
        suggestedTitle: 'Invoice from ACME',
        suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
        suggestedDocumentType: { id: 2, name: 'Invoice' },
        suggestedTags: [{ id: 10, name: 'Finance' }],
        confidence: 0.92,
        reasoning: 'Document shows invoice details',
      },
      toolCalls: [{ toolName: 'searchTags', input: {} }],
      originalTitle: 'invoice-123.pdf',
    });

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/result'
    );
    const response = await GET(request, mockContext('instance-1', 'doc-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('result-1');
    expect(data.processedAt).toBe('2024-01-15T12:00:00.000Z');
    expect(data.aiProvider).toBe('OpenAI GPT-4');
    expect(data.inputTokens).toBe(1000);
    expect(data.outputTokens).toBe(500);
    expect(data.estimatedCost).toBe(0.0025);
    expect(data.changes.suggestedTitle).toBe('Invoice from ACME');
    expect(data.changes.suggestedCorrespondent.name).toBe('ACME Corp');
    expect(data.changes.confidence).toBe(0.92);
    expect(data.toolCalls).toHaveLength(1);
    expect(data.originalTitle).toBe('invoice-123.pdf');
  });

  it('returns result with null changes', async () => {
    const mockDate = new Date('2024-01-15T12:00:00Z');
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
      id: 'doc-1',
      paperlessId: 123,
      title: 'Test Document',
    });
    mockedPrisma.documentProcessingResult.findFirst.mockResolvedValueOnce({
      id: 'result-1',
      processedAt: mockDate,
      aiProvider: 'OpenAI GPT-4',
      inputTokens: 300,
      outputTokens: 200,
      estimatedCost: null,
      changes: null,
      toolCalls: null,
      originalTitle: null,
    });

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/result'
    );
    const response = await GET(request, mockContext('instance-1', 'doc-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.changes).toBeNull();
    expect(data.toolCalls).toBeNull();
    expect(data.originalTitle).toBeNull();
  });

  it('queries for the most recent result ordered by processedAt desc', async () => {
    const mockDate = new Date('2024-01-15T12:00:00Z');
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
      id: 'doc-1',
      paperlessId: 123,
      title: 'Test Document',
    });
    mockedPrisma.documentProcessingResult.findFirst.mockResolvedValueOnce({
      id: 'result-1',
      processedAt: mockDate,
      aiProvider: 'OpenAI GPT-4',
      inputTokens: 1000,
      outputTokens: 500,
      estimatedCost: 0.0025,
      changes: null,
      toolCalls: null,
      originalTitle: null,
    });

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/result'
    );
    await GET(request, mockContext('instance-1', 'doc-1'));

    expect(mockedPrisma.documentProcessingResult.findFirst).toHaveBeenCalledWith({
      where: { documentId: 'doc-1' },
      orderBy: { processedAt: 'desc' },
    });
  });

  it('checks instance access with owner or shared access', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
      id: 'doc-1',
      paperlessId: 123,
      title: 'Test Document',
    });
    mockedPrisma.documentProcessingResult.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/result'
    );
    await GET(request, mockContext('instance-1', 'doc-1'));

    expect(mockedPrisma.paperlessInstance.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'instance-1',
        OR: [
          { ownerId: 'user-1' },
          {
            sharedWith: {
              some: {
                OR: [{ userId: 'user-1' }, { userId: null }],
              },
            },
          },
        ],
      },
    });
  });

  it('verifies document belongs to the instance', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
      id: 'doc-1',
      paperlessId: 123,
      title: 'Test Document',
    });
    mockedPrisma.documentProcessingResult.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/result'
    );
    await GET(request, mockContext('instance-1', 'doc-1'));

    expect(mockedPrisma.paperlessDocument.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'doc-1',
        paperlessInstanceId: 'instance-1',
      },
    });
  });
});
