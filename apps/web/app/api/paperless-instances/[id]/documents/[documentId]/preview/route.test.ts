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
  },
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

// Mock decrypt to return the token as-is for testing
vi.mock('@/lib/crypto/encryption', () => ({
  decrypt: vi.fn((token: string) => token),
}));

const mockGetDocumentPreview = vi.fn();
vi.mock('@repo/paperless-client', () => ({
  PaperlessClient: vi.fn().mockImplementation(function () {
    return {
      getDocumentPreview: mockGetDocumentPreview,
    };
  }),
  PaperlessApiError: class PaperlessApiError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { PaperlessClient, PaperlessApiError } from '@repo/paperless-client';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  paperlessInstance: {
    findFirst: typeof prisma.paperlessInstance.findFirst;
  };
  paperlessDocument: {
    findFirst: typeof prisma.paperlessDocument.findFirst;
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

describe('GET /api/paperless-instances/[id]/documents/[documentId]/preview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetDocumentPreview.mockReset();
  });

  it('returns 404 when instance not found', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/preview'
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
      apiUrl: 'https://paperless.example.com',
      apiToken: 'test-token',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/preview'
    );
    const response = await GET(request, mockContext('instance-1', 'doc-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('documentNotFound');
  });

  it('returns PDF preview successfully', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'test-token',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
      id: 'doc-1',
      paperlessId: 123,
      title: 'Test Document',
    });

    const mockPdfBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
    const mockResponse = new Response(mockPdfBuffer, {
      headers: { 'content-type': 'application/pdf' },
    });
    mockGetDocumentPreview.mockResolvedValueOnce(mockResponse);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/preview'
    );
    const response = await GET(request, mockContext('instance-1', 'doc-1'));

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/pdf');
    expect(response.headers.get('content-disposition')).toContain('Test Document');
  });

  it('defaults to application/pdf when content-type header is missing', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'test-token',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
      id: 'doc-1',
      paperlessId: 123,
      title: 'Test Document',
    });

    const mockPdfBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
    // Response without content-type header
    const mockResponse = new Response(mockPdfBuffer);
    mockGetDocumentPreview.mockResolvedValueOnce(mockResponse);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/preview'
    );
    const response = await GET(request, mockContext('instance-1', 'doc-1'));

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/pdf');
  });

  it('creates PaperlessClient with correct credentials', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'test-token',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
      id: 'doc-1',
      paperlessId: 123,
      title: 'Test Document',
    });

    mockGetDocumentPreview.mockResolvedValueOnce(
      new Response(new Uint8Array([]), {
        headers: { 'content-type': 'application/pdf' },
      })
    );

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/preview'
    );
    await GET(request, mockContext('instance-1', 'doc-1'));

    expect(PaperlessClient).toHaveBeenCalledWith({
      baseUrl: 'https://paperless.example.com',
      token: 'test-token',
    });
  });

  it('calls getDocumentPreview with correct paperlessId', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'test-token',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
      id: 'doc-1',
      paperlessId: 456,
      title: 'Test Document',
    });

    mockGetDocumentPreview.mockResolvedValueOnce(
      new Response(new Uint8Array([]), {
        headers: { 'content-type': 'application/pdf' },
      })
    );

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/preview'
    );
    await GET(request, mockContext('instance-1', 'doc-1'));

    expect(mockGetDocumentPreview).toHaveBeenCalledWith(456);
  });

  it('uses fallback filename when document title is empty', async () => {
    mockUser();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'test-token',
    });
    mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
      id: 'doc-1',
      paperlessId: 123,
      title: '',
    });

    mockGetDocumentPreview.mockResolvedValueOnce(
      new Response(new Uint8Array([]), {
        headers: { 'content-type': 'application/pdf' },
      })
    );

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/preview'
    );
    const response = await GET(request, mockContext('instance-1', 'doc-1'));

    expect(response.headers.get('content-disposition')).toContain('document.pdf');
  });

  describe('error handling', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('returns 502 when Paperless API returns server error (>= 500)', async () => {
      mockUser();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
        id: 'instance-1',
        name: 'Test Instance',
        apiUrl: 'https://paperless.example.com',
        apiToken: 'test-token',
      });
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
        id: 'doc-1',
        paperlessId: 123,
        title: 'Test Document',
      });

      mockGetDocumentPreview.mockRejectedValueOnce(
        new PaperlessApiError('Internal Server Error', 500)
      );

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/preview'
      );
      const response = await GET(request, mockContext('instance-1', 'doc-1'));
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.error).toBe('previewFetchFailed');
    });

    it('returns original status code when Paperless API returns client error (< 500)', async () => {
      mockUser();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
        id: 'instance-1',
        name: 'Test Instance',
        apiUrl: 'https://paperless.example.com',
        apiToken: 'test-token',
      });
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
        id: 'doc-1',
        paperlessId: 123,
        title: 'Test Document',
      });

      mockGetDocumentPreview.mockRejectedValueOnce(new PaperlessApiError('Forbidden', 403));

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/preview'
      );
      const response = await GET(request, mockContext('instance-1', 'doc-1'));
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('previewFetchFailed');
    });

    it('rethrows non-PaperlessApiError errors', async () => {
      mockUser();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
        id: 'instance-1',
        name: 'Test Instance',
        apiUrl: 'https://paperless.example.com',
        apiToken: 'test-token',
      });
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce({
        id: 'doc-1',
        paperlessId: 123,
        title: 'Test Document',
      });

      mockGetDocumentPreview.mockRejectedValueOnce(new Error('Network error'));

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/preview'
      );
      const response = await GET(request, mockContext('instance-1', 'doc-1'));

      // The authRoute wrapper catches thrown errors and returns 500
      expect(response.status).toBe(500);
    });
  });
});
