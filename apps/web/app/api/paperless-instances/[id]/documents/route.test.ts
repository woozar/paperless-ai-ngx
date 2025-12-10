import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
    },
    paperlessDocument: {
      count: vi.fn(),
      findMany: vi.fn(),
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
    count: typeof prisma.paperlessDocument.count;
    findMany: typeof prisma.paperlessDocument.findMany;
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

function mockUser(userId = 'user-1') {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId,
    username: 'user',
    role: 'DEFAULT',
  });
}

const mockInstance = {
  id: 'instance-1',
  name: 'Test Instance',
  apiUrl: 'https://paperless.example.com',
  ownerId: 'admin-1',
};

const mockDocuments = [
  {
    id: 'doc-1',
    paperlessId: 100,
    title: 'Invoice 001',
    content: 'Content 1',
    importedAt: new Date('2024-01-10T10:00:00Z'),
    processingResults: [{ processedAt: new Date('2024-01-10T12:00:00Z') }],
  },
  {
    id: 'doc-2',
    paperlessId: 101,
    title: 'Contract 002',
    content: 'Content 2',
    importedAt: new Date('2024-01-11T10:00:00Z'),
    processingResults: [],
  },
];

describe('GET /api/paperless-instances/[id]/documents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents'
    );
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns paginated documents list', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.count.mockResolvedValueOnce(2);
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce(mockDocuments);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents'
    );
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(2);
    expect(data.total).toBe(2);
    expect(data.page).toBe(1);
  });

  it('maps document status based on processing results', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.count.mockResolvedValueOnce(2);
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce(mockDocuments);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents'
    );
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(data.items[0].status).toBe('processed');
    expect(data.items[0].lastProcessedAt).toBe('2024-01-10T12:00:00.000Z');
    expect(data.items[1].status).toBe('unprocessed');
    expect(data.items[1].lastProcessedAt).toBeNull();
  });

  it('supports pagination parameters', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.count.mockResolvedValueOnce(50);
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce(mockDocuments);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents?page=2&limit=10'
    );
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.page).toBe(2);
    expect(data.limit).toBe(10);
    expect(data.totalPages).toBe(5);
  });

  it('filters documents by status all', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.count.mockResolvedValueOnce(2);
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce(mockDocuments);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents?status=all'
    );
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(2);
  });

  it('filters documents by processed status', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.count.mockResolvedValueOnce(2);
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce(mockDocuments);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents?status=processed'
    );
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].status).toBe('processed');
  });

  it('filters documents by unprocessed status', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.count.mockResolvedValueOnce(2);
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce(mockDocuments);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents?status=unprocessed'
    );
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].status).toBe('unprocessed');
  });

  it('allows access to shared instances', async () => {
    mockUser('user-2');
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.count.mockResolvedValueOnce(1);
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce([mockDocuments[0]]);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents'
    );
    const response = await GET(request, mockContext('instance-1'));

    expect(response.status).toBe(200);
  });

  it('returns empty list when no documents', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
    mockedPrisma.paperlessDocument.count.mockResolvedValueOnce(0);
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce([]);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents'
    );
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(0);
    expect(data.total).toBe(0);
  });
});
