import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
    },
    processingQueue: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
    paperlessDocument: {
      findUnique: vi.fn(),
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
  processingQueue: {
    findMany: typeof prisma.processingQueue.findMany;
    findFirst: typeof prisma.processingQueue.findFirst;
    count: typeof prisma.processingQueue.count;
    create: typeof prisma.processingQueue.create;
  };
  paperlessDocument: {
    findUnique: typeof prisma.paperlessDocument.findUnique;
  };
}>(prisma);

const mockContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

describe('GET /api/paperless-instances/[id]/queue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/queue');
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns queue items with stats', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findMany.mockResolvedValueOnce([
      {
        id: 'queue-1',
        paperlessDocumentId: 123,
        status: 'pending',
        priority: 10,
        attempts: 0,
        maxAttempts: 3,
        lastError: null,
        scheduledFor: new Date('2024-01-15T10:00:00Z'),
        startedAt: null,
        completedAt: null,
        createdAt: new Date('2024-01-15T09:00:00Z'),
        updatedAt: new Date('2024-01-15T09:00:00Z'),
        documentId: 'doc-1',
        document: { title: 'Test Document' },
        aiBotId: 'bot-1',
        aiBot: { name: 'Test Bot' },
      },
    ]);
    mockedPrisma.processingQueue.count
      .mockResolvedValueOnce(1) // total
      .mockResolvedValueOnce(1) // pending
      .mockResolvedValueOnce(0) // processing
      .mockResolvedValueOnce(0) // completed
      .mockResolvedValueOnce(0); // failed

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/queue');
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].id).toBe('queue-1');
    expect(data.items[0].documentTitle).toBe('Test Document');
    expect(data.items[0].aiBotName).toBe('Test Bot');
    expect(data.stats).toEqual({ pending: 1, processing: 0, completed: 0, failed: 0 });
    expect(data.page).toBe(1);
    expect(data.total).toBe(1);
  });

  it('filters by status when provided', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findMany.mockResolvedValueOnce([]);
    mockedPrisma.processingQueue.count
      .mockResolvedValueOnce(0) // total
      .mockResolvedValueOnce(0) // pending
      .mockResolvedValueOnce(0) // processing
      .mockResolvedValueOnce(0) // completed
      .mockResolvedValueOnce(0); // failed

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue?status=failed'
    );
    const response = await GET(request, mockContext('instance-1'));

    expect(response.status).toBe(200);
    expect(mockedPrisma.processingQueue.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'failed',
        }),
      })
    );
  });

  it('handles pagination parameters', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findMany.mockResolvedValueOnce([]);
    mockedPrisma.processingQueue.count
      .mockResolvedValueOnce(50) // total
      .mockResolvedValueOnce(20) // pending
      .mockResolvedValueOnce(10) // processing
      .mockResolvedValueOnce(15) // completed
      .mockResolvedValueOnce(5); // failed

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue?page=2&limit=10'
    );
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.page).toBe(2);
    expect(data.limit).toBe(10);
    expect(data.totalPages).toBe(5);
    expect(mockedPrisma.processingQueue.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 10,
        take: 10,
      })
    );
  });
});

describe('POST /api/paperless-instances/[id]/queue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paperlessDocumentId: 123 }),
    });
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns 409 when document already in queue', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      defaultAiBotId: 'bot-1',
    });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce({ id: 'existing' });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paperlessDocumentId: 123 }),
    });
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('documentAlreadyInQueue');
  });

  it('returns 400 when no AI bot configured', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      defaultAiBotId: null,
    });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.paperlessDocument.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paperlessDocumentId: 123 }),
    });
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('noAiBotConfigured');
  });

  it('creates queue item successfully with default priority of 10', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      defaultAiBotId: 'bot-1',
    });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.paperlessDocument.findUnique.mockResolvedValueOnce({ id: 'doc-1' });
    mockedPrisma.processingQueue.create.mockResolvedValueOnce({
      id: 'queue-1',
      paperlessDocumentId: 123,
      status: 'pending',
      priority: 10,
      attempts: 0,
      maxAttempts: 3,
      lastError: null,
      scheduledFor: new Date('2024-01-15T10:00:00Z'),
      startedAt: null,
      completedAt: null,
      createdAt: new Date('2024-01-15T09:00:00Z'),
      updatedAt: new Date('2024-01-15T09:00:00Z'),
      documentId: 'doc-1',
      document: { title: 'Test Document' },
      aiBotId: 'bot-1',
      aiBot: { name: 'Test Bot' },
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paperlessDocumentId: 123 }),
    });
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe('queue-1');
    expect(data.paperlessDocumentId).toBe(123);
    expect(data.status).toBe('pending');
    // Verify default priority of 10 is used when not provided
    expect(mockedPrisma.processingQueue.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          priority: 10,
        }),
      })
    );
  });

  it('uses provided aiBotId instead of default', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      defaultAiBotId: 'bot-1',
    });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.paperlessDocument.findUnique.mockResolvedValueOnce(null);
    mockedPrisma.processingQueue.create.mockResolvedValueOnce({
      id: 'queue-1',
      paperlessDocumentId: 123,
      status: 'pending',
      priority: 10,
      attempts: 0,
      maxAttempts: 3,
      lastError: null,
      scheduledFor: new Date(),
      startedAt: null,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      documentId: null,
      aiBotId: 'custom-bot',
      aiBot: { name: 'Custom Bot' },
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paperlessDocumentId: 123, aiBotId: 'custom-bot' }),
    });
    const response = await POST(request, mockContext('instance-1'));

    expect(response.status).toBe(201);
    expect(mockedPrisma.processingQueue.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          aiBotId: 'custom-bot',
        }),
      })
    );
  });

  it('uses custom priority when provided', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      defaultAiBotId: 'bot-1',
    });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.paperlessDocument.findUnique.mockResolvedValueOnce(null);
    mockedPrisma.processingQueue.create.mockResolvedValueOnce({
      id: 'queue-1',
      paperlessDocumentId: 456,
      status: 'pending',
      priority: 5,
      attempts: 0,
      maxAttempts: 3,
      lastError: null,
      scheduledFor: new Date(),
      startedAt: null,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      documentId: null,
      aiBotId: 'bot-1',
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paperlessDocumentId: 456, priority: 5 }),
    });
    await POST(request, mockContext('instance-1'));

    expect(mockedPrisma.processingQueue.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          priority: 5,
        }),
      })
    );
  });
});
