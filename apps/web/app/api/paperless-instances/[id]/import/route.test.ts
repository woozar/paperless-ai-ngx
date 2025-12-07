import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
    },
    paperlessDocument: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

vi.mock('@/lib/crypto/encryption', () => ({
  decrypt: vi.fn(),
}));

const mockGetDocuments = vi.fn();

vi.mock('@repo/paperless-client', () => ({
  PaperlessClient: class MockPaperlessClient {
    constructor() {}
    getDocuments = mockGetDocuments;
  },
}));

import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { decrypt } from '@/lib/crypto/encryption';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  paperlessInstance: {
    findFirst: typeof prisma.paperlessInstance.findFirst;
  };
  paperlessDocument: {
    findMany: typeof prisma.paperlessDocument.findMany;
    create: typeof prisma.paperlessDocument.create;
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

// Mock data based on real Paperless API response
const mockPaperlessDocuments = {
  count: 425,
  next: 'http://paperless.example.com/api/documents/?page=2&page_size=10',
  previous: null,
  all: [362, 453],
  results: [
    {
      id: 362,
      correspondent: 125,
      document_type: 4,
      storage_path: null,
      title: 'WIZO Konzert in Nürnberg',
      content:
        'WIZO bringt das Licht nach Nürnberg!\nWann: 07.02.2026, 19.00 Uhr\nWo: Löwensaal in Nürnberg\nPreis: 44,00 EUR',
      tags: [17, 111],
      created: '2026-02-07',
      created_date: '2026-02-07',
      modified: '2025-05-20T21:40:03.069192+02:00',
      added: '2025-05-20T21:31:17.456006+02:00',
      deleted_at: null,
      archive_serial_number: null,
      original_file_name: 'E-Ticket-WIZO.pdf',
      archived_file_name: '2026-02-07 WIZO Konzert.pdf',
      owner: 3,
      user_can_change: true,
      is_shared_by_requester: false,
      notes: [],
      custom_fields: [],
      page_count: 1,
      mime_type: 'application/pdf',
    },
    {
      id: 453,
      correspondent: 166,
      document_type: 7,
      storage_path: null,
      title: 'Antrag auf Porsche Approved Reparaturkostenversicherung',
      content: 'Porsche Approved Reparaturkostenversicherung\n\nAntrag und Informationspaket',
      tags: [22, 45],
      created: '2025-01-09',
      created_date: '2025-01-09',
      modified: '2025-01-10T10:00:00.000000+02:00',
      added: '2025-01-09T12:00:00.000000+02:00',
      deleted_at: null,
      archive_serial_number: null,
      original_file_name: 'Porsche-Antrag.pdf',
      archived_file_name: '2025-01-09 Porsche Antrag.pdf',
      owner: 3,
      user_can_change: true,
      is_shared_by_requester: false,
      notes: [],
      custom_fields: [],
      page_count: 5,
      mime_type: 'application/pdf',
    },
  ],
};

describe('POST /api/paperless-instances/[id]/import', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetDocuments.mockReset();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/import', {
      method: 'POST',
    });
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('successfully imports documents from Paperless', async () => {
    mockAdmin();

    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'encrypted-token',
      ownerId: 'admin-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(decrypt).mockReturnValueOnce('decrypted-api-token');

    // Mock pagination - first page has documents, next is null (last page)
    mockGetDocuments.mockResolvedValueOnce({
      ...mockPaperlessDocuments,
      next: null, // No more pages
    });

    // No existing documents
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce([]);

    mockedPrisma.paperlessDocument.create
      .mockResolvedValueOnce({
        id: 'doc-1',
        paperlessId: 362,
        title: 'WIZO Konzert in Nürnberg',
        content: mockPaperlessDocuments.results[0]!.content,
        correspondentId: 125,
        tagIds: [17, 111],
        paperlessInstanceId: 'instance-1',
        importedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .mockResolvedValueOnce({
        id: 'doc-2',
        paperlessId: 453,
        title: 'Antrag auf Porsche Approved Reparaturkostenversicherung',
        content: mockPaperlessDocuments.results[1]!.content,
        correspondentId: 166,
        tagIds: [22, 45],
        paperlessInstanceId: 'instance-1',
        importedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/import', {
      method: 'POST',
    });
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.imported).toBe(2);
    expect(data.total).toBe(2);
    expect(data.skipped).toBe(0);

    expect(mockGetDocuments).toHaveBeenCalledWith({ page: 1, page_size: 100 });

    expect(mockedPrisma.paperlessDocument.create).toHaveBeenCalledTimes(2);
    expect(mockedPrisma.paperlessDocument.create).toHaveBeenCalledWith({
      data: {
        paperlessId: 362,
        title: 'WIZO Konzert in Nürnberg',
        content: mockPaperlessDocuments.results[0]!.content,
        correspondentId: 125,
        tagIds: [17, 111],
        paperlessInstanceId: 'instance-1',
      },
    });
  });

  it('handles documents with null correspondent', async () => {
    mockAdmin();

    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'encrypted-token',
      ownerId: 'admin-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(decrypt).mockReturnValueOnce('decrypted-api-token');

    const documentsWithNullCorrespondent = {
      ...mockPaperlessDocuments,
      next: null,
      results: [
        {
          ...mockPaperlessDocuments.results[0],
          correspondent: null,
        },
      ],
    };

    mockGetDocuments.mockResolvedValueOnce(documentsWithNullCorrespondent);

    // No existing documents
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce([]);

    mockedPrisma.paperlessDocument.create.mockResolvedValueOnce({
      id: 'doc-1',
      paperlessId: 362,
      title: 'WIZO Konzert in Nürnberg',
      content: mockPaperlessDocuments.results[0]!.content,
      correspondentId: null,
      tagIds: [17, 111],
      paperlessInstanceId: 'instance-1',
      importedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/import', {
      method: 'POST',
    });
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.imported).toBe(1);

    expect(mockedPrisma.paperlessDocument.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          correspondentId: null,
        }),
      })
    );
  });

  it('skips documents that already exist in database', async () => {
    mockAdmin();

    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'encrypted-token',
      ownerId: 'admin-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(decrypt).mockReturnValueOnce('decrypted-api-token');

    mockGetDocuments.mockResolvedValueOnce({
      ...mockPaperlessDocuments,
      next: null,
    });

    // Document 362 already exists in database
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce([{ paperlessId: 362 }]);

    // Only document 453 should be created
    mockedPrisma.paperlessDocument.create.mockResolvedValueOnce({
      id: 'doc-2',
      paperlessId: 453,
      title: 'Antrag auf Porsche Approved Reparaturkostenversicherung',
      content: mockPaperlessDocuments.results[1]!.content,
      correspondentId: 166,
      tagIds: [22, 45],
      paperlessInstanceId: 'instance-1',
      importedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/import', {
      method: 'POST',
    });
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.imported).toBe(1);
    expect(data.total).toBe(2);
    expect(data.skipped).toBe(1);

    expect(mockedPrisma.paperlessDocument.create).toHaveBeenCalledTimes(1);
    expect(mockedPrisma.paperlessDocument.create).toHaveBeenCalledWith({
      data: {
        paperlessId: 453,
        title: 'Antrag auf Porsche Approved Reparaturkostenversicherung',
        content: mockPaperlessDocuments.results[1]!.content,
        correspondentId: 166,
        tagIds: [22, 45],
        paperlessInstanceId: 'instance-1',
      },
    });
  });

  it('fetches all documents with pagination', async () => {
    mockAdmin();

    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'encrypted-token',
      ownerId: 'admin-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(decrypt).mockReturnValueOnce('decrypted-api-token');

    // First page has next URL
    mockGetDocuments
      .mockResolvedValueOnce({
        count: 2,
        next: 'http://paperless.example.com/api/documents/?page=2',
        previous: null,
        all: [362],
        results: [mockPaperlessDocuments.results[0]],
      })
      // Second page has no next URL
      .mockResolvedValueOnce({
        count: 2,
        next: null,
        previous: 'http://paperless.example.com/api/documents/?page=1',
        all: [453],
        results: [mockPaperlessDocuments.results[1]],
      });

    // No existing documents
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce([]);

    mockedPrisma.paperlessDocument.create
      .mockResolvedValueOnce({
        id: 'doc-1',
        paperlessId: 362,
        title: 'WIZO Konzert in Nürnberg',
        content: mockPaperlessDocuments.results[0]!.content,
        correspondentId: 125,
        tagIds: [17, 111],
        paperlessInstanceId: 'instance-1',
        importedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .mockResolvedValueOnce({
        id: 'doc-2',
        paperlessId: 453,
        title: 'Antrag auf Porsche Approved Reparaturkostenversicherung',
        content: mockPaperlessDocuments.results[1]!.content,
        correspondentId: 166,
        tagIds: [22, 45],
        paperlessInstanceId: 'instance-1',
        importedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/import', {
      method: 'POST',
    });
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.imported).toBe(2);
    expect(data.total).toBe(2);

    // Verify pagination was used
    expect(mockGetDocuments).toHaveBeenCalledTimes(2);
    expect(mockGetDocuments).toHaveBeenNthCalledWith(1, { page: 1, page_size: 100 });
    expect(mockGetDocuments).toHaveBeenNthCalledWith(2, { page: 2, page_size: 100 });

    expect(mockedPrisma.paperlessDocument.create).toHaveBeenCalledTimes(2);
  });

  it('returns 0 imported when all documents already exist', async () => {
    mockAdmin();

    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'encrypted-token',
      ownerId: 'admin-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(decrypt).mockReturnValueOnce('decrypted-api-token');

    mockGetDocuments.mockResolvedValueOnce({
      ...mockPaperlessDocuments,
      next: null,
    });

    // All documents already exist
    mockedPrisma.paperlessDocument.findMany.mockResolvedValueOnce([
      { paperlessId: 362 },
      { paperlessId: 453 },
    ]);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/import', {
      method: 'POST',
    });
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.imported).toBe(0);
    expect(data.total).toBe(2);
    expect(data.skipped).toBe(2);

    expect(mockedPrisma.paperlessDocument.create).not.toHaveBeenCalled();
  });
});
