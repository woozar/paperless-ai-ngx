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
      update: vi.fn(),
    },
    documentProcessingResult: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

vi.mock('@/lib/crypto/encryption', () => ({
  decrypt: vi.fn((value: string) => `decrypted-${value}`),
}));

const mockUpdateDocument = vi.fn();
const mockCreateTag = vi.fn();
const mockCreateCorrespondent = vi.fn();
const mockCreateDocumentType = vi.fn();

vi.mock('@repo/paperless-client', () => ({
  PaperlessClient: vi.fn().mockImplementation(function () {
    return {
      updateDocument: mockUpdateDocument,
      createTag: mockCreateTag,
      createCorrespondent: mockCreateCorrespondent,
      createDocumentType: mockCreateDocumentType,
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
import { mockPrisma } from '@/test-utils/prisma-mock';
import { PaperlessApiError } from '@repo/paperless-client';

const mockedPrisma = mockPrisma<{
  paperlessInstance: {
    findFirst: typeof prisma.paperlessInstance.findFirst;
  };
  paperlessDocument: {
    findFirst: typeof prisma.paperlessDocument.findFirst;
    update: typeof prisma.paperlessDocument.update;
  };
  documentProcessingResult: {
    findFirst: typeof prisma.documentProcessingResult.findFirst;
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

const mockInstance = {
  id: 'instance-1',
  name: 'Test Instance',
  apiUrl: 'https://paperless.example.com',
  apiToken: 'encrypted-token',
  ownerId: 'admin-1',
};

const mockDocument = {
  id: 'doc-1',
  paperlessId: 100,
  title: 'Invoice 001',
  paperlessInstanceId: 'instance-1',
};

const mockProcessingResult = {
  id: 'result-1',
  documentId: 'doc-1',
  processedAt: new Date(),
  changes: {
    suggestedTitle: 'Invoice from ACME',
    suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
    suggestedDocumentType: { name: 'Invoice' },
    suggestedTags: [{ id: 10, name: 'Finance' }, { name: 'New Tag' }],
    suggestedDate: '2024-01-15',
    confidence: 0.92,
    reasoning: 'Document shows invoice details.',
  },
};

describe('POST /api/paperless-instances/[id]/documents/[documentId]/apply', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateDocument.mockResolvedValue({ id: 100 });
    mockCreateTag.mockResolvedValue({ id: 99, name: 'New Tag' });
    mockCreateCorrespondent.mockResolvedValue({ id: 88, name: 'New Correspondent' });
    mockCreateDocumentType.mockResolvedValue({ id: 77, name: 'New Type' });
    mockedPrisma.paperlessDocument.update.mockResolvedValue(mockDocument);
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
      {
        method: 'POST',
        body: JSON.stringify({ field: 'title', value: 'New Title' }),
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
      'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
      {
        method: 'POST',
        body: JSON.stringify({ field: 'title', value: 'New Title' }),
      }
    );
    const response = await POST(request, mockContext('instance-1', 'doc-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('documentNotFound');
  });

  describe('apply title', () => {
    it('applies title to document', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({ field: 'title', value: 'New Title' }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.field).toBe('title');
      expect(mockUpdateDocument).toHaveBeenCalledWith(100, { title: 'New Title' });
      expect(mockedPrisma.paperlessDocument.update).toHaveBeenCalledWith({
        where: { id: 'doc-1' },
        data: { title: 'New Title' },
      });
    });
  });

  describe('apply correspondent', () => {
    it('applies existing correspondent', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({
            field: 'correspondent',
            value: { id: 5, name: 'Existing Corp' },
          }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));

      expect(response.status).toBe(200);
      expect(mockCreateCorrespondent).not.toHaveBeenCalled();
      expect(mockUpdateDocument).toHaveBeenCalledWith(100, { correspondent: 5 });
    });

    it('creates new correspondent if no id', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({
            field: 'correspondent',
            value: { name: 'New Corp' },
          }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));

      expect(response.status).toBe(200);
      expect(mockCreateCorrespondent).toHaveBeenCalledWith('New Corp');
      expect(mockUpdateDocument).toHaveBeenCalledWith(100, { correspondent: 88 });
    });
  });

  describe('apply documentType', () => {
    it('applies existing document type', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({
            field: 'documentType',
            value: { id: 3, name: 'Invoice' },
          }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));

      expect(response.status).toBe(200);
      expect(mockCreateDocumentType).not.toHaveBeenCalled();
      expect(mockUpdateDocument).toHaveBeenCalledWith(100, { document_type: 3 });
    });

    it('creates new document type if no id', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({
            field: 'documentType',
            value: { name: 'Contract' },
          }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));

      expect(response.status).toBe(200);
      expect(mockCreateDocumentType).toHaveBeenCalledWith('Contract');
      expect(mockUpdateDocument).toHaveBeenCalledWith(100, { document_type: 77 });
    });
  });

  describe('apply tags', () => {
    it('applies existing tags', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({
            field: 'tags',
            value: [
              { id: 1, name: 'Tag1' },
              { id: 2, name: 'Tag2' },
            ],
          }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));

      expect(response.status).toBe(200);
      expect(mockCreateTag).not.toHaveBeenCalled();
      expect(mockUpdateDocument).toHaveBeenCalledWith(100, { tags: [1, 2] });
    });

    it('creates new tags if no id', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);
      mockCreateTag.mockResolvedValueOnce({ id: 99, name: 'NewTag' });

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({
            field: 'tags',
            value: [{ id: 1, name: 'Existing' }, { name: 'NewTag' }],
          }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));

      expect(response.status).toBe(200);
      expect(mockCreateTag).toHaveBeenCalledWith('NewTag');
      expect(mockUpdateDocument).toHaveBeenCalledWith(100, { tags: [1, 99] });
    });
  });

  describe('apply date', () => {
    it('applies date to document', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({ field: 'date', value: '2024-01-15' }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));

      expect(response.status).toBe(200);
      expect(mockUpdateDocument).toHaveBeenCalledWith(100, {
        created: '2024-01-15',
      });
    });
  });

  describe('apply all', () => {
    it('returns 404 if no processing result exists', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);
      mockedPrisma.documentProcessingResult.findFirst.mockResolvedValueOnce(null);

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({ field: 'all' }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('noProcessingResult');
    });

    it('applies all fields from processing result', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);
      mockedPrisma.documentProcessingResult.findFirst.mockResolvedValueOnce(mockProcessingResult);
      mockCreateTag.mockResolvedValueOnce({ id: 99, name: 'New Tag' });
      mockCreateDocumentType.mockResolvedValueOnce({ id: 77, name: 'Invoice' });

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({ field: 'all' }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));

      expect(response.status).toBe(200);
      expect(mockUpdateDocument).toHaveBeenCalledWith(100, {
        title: 'Invoice from ACME',
        correspondent: 1,
        document_type: 77,
        tags: [10, 99],
        created: '2024-01-15',
      });
    });

    it('applies only available fields when some are missing', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);
      // Processing result with only title - all other fields missing
      mockedPrisma.documentProcessingResult.findFirst.mockResolvedValueOnce({
        id: 'result-1',
        documentId: 'doc-1',
        processedAt: new Date(),
        changes: {
          suggestedTitle: 'Just a Title',
          suggestedCorrespondent: null,
          suggestedDocumentType: null,
          suggestedTags: [],
          suggestedDate: null,
          confidence: 0.85,
          reasoning: 'Only title found.',
        },
      });

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({ field: 'all' }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));

      expect(response.status).toBe(200);
      expect(mockUpdateDocument).toHaveBeenCalledWith(100, {
        title: 'Just a Title',
      });
      expect(mockCreateCorrespondent).not.toHaveBeenCalled();
      expect(mockCreateDocumentType).not.toHaveBeenCalled();
      expect(mockCreateTag).not.toHaveBeenCalled();
    });

    it('handles processing result with no usable fields', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);
      // Processing result with all fields missing/empty
      mockedPrisma.documentProcessingResult.findFirst.mockResolvedValueOnce({
        id: 'result-1',
        documentId: 'doc-1',
        processedAt: new Date(),
        changes: {
          suggestedTitle: '',
          suggestedCorrespondent: null,
          suggestedDocumentType: null,
          suggestedTags: null,
          suggestedDate: null,
          confidence: 0.5,
          reasoning: 'Could not determine metadata.',
        },
      });

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({ field: 'all' }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));

      expect(response.status).toBe(200);
      // Empty update data since no fields have usable values
      expect(mockUpdateDocument).toHaveBeenCalledWith(100, {});
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('returns 502 on Paperless API error', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);
      mockUpdateDocument.mockRejectedValueOnce(new PaperlessApiError('API Error', 500));

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({ field: 'title', value: 'New Title' }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.message).toBe('paperlessUpdateFailed');
    });

    it('validates request body', async () => {
      mockAdmin();

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({ field: 'invalid' }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));

      expect(response.status).toBe(400);
    });

    it('passes through client-side Paperless API error status codes', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);
      mockUpdateDocument.mockRejectedValueOnce(new PaperlessApiError('Not Found', 404));

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({ field: 'title', value: 'New Title' }),
        }
      );
      const response = await POST(request, mockContext('instance-1', 'doc-1'));
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('paperlessUpdateFailed');
    });

    it('returns 500 on non-PaperlessApiError errors', async () => {
      mockAdmin();
      mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(mockInstance);
      mockedPrisma.paperlessDocument.findFirst.mockResolvedValueOnce(mockDocument);
      mockUpdateDocument.mockRejectedValueOnce(new Error('Generic database error'));

      const request = new NextRequest(
        'http://localhost/api/paperless-instances/instance-1/documents/doc-1/apply',
        {
          method: 'POST',
          body: JSON.stringify({ field: 'title', value: 'New Title' }),
        }
      );

      const response = await POST(request, mockContext('instance-1', 'doc-1'));
      expect(response.status).toBe(500);
    });
  });
});
