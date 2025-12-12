import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

vi.mock('@/lib/crypto/encryption', () => ({
  decrypt: vi.fn((token: string) => `decrypted-${token}`),
}));

const mockGetTags = vi.fn();
vi.mock('@repo/paperless-client', () => {
  return {
    PaperlessClient: class MockPaperlessClient {
      getTags = mockGetTags;
    },
  };
});

import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  paperlessInstance: {
    findFirst: typeof prisma.paperlessInstance.findFirst;
  };
}>(prisma);

const mockContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

function mockUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('GET /api/paperless-instances/[id]/tags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/tags');
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns tags from Paperless instance', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'encrypted-token',
    });
    mockGetTags.mockResolvedValueOnce({
      results: [
        { id: 1, name: 'Invoice', document_count: 42 },
        { id: 2, name: 'Receipt', document_count: 15 },
      ],
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/tags');
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.tags).toHaveLength(2);
    expect(data.tags[0]).toEqual({ id: 1, name: 'Invoice', documentCount: 42 });
    expect(data.tags[1]).toEqual({ id: 2, name: 'Receipt', documentCount: 15 });
  });

  it('returns empty array when no tags exist', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'encrypted-token',
    });
    mockGetTags.mockResolvedValueOnce({
      results: [],
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/tags');
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.tags).toEqual([]);
  });
});
