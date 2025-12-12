import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PaperlessClient, PaperlessApiError } from './index';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('PaperlessClient', () => {
  const baseUrl = 'https://paperless.example.com';
  const token = 'test-token';
  let client: PaperlessClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new PaperlessClient({ baseUrl, token });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('constructor', () => {
    it('removes trailing slash from baseUrl', () => {
      const clientWithSlash = new PaperlessClient({ baseUrl: 'https://example.com/', token });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [], count: 0 }),
      });
      clientWithSlash.getTags();
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api/tags/?page_size=9999',
        expect.any(Object)
      );
    });
  });

  describe('getDocuments', () => {
    it('fetches documents without params', async () => {
      const mockResponse = { results: [], count: 0, next: null, previous: null };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getDocuments();

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/documents/`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('fetches documents with all params', async () => {
      const mockResponse = { results: [], count: 0, next: null, previous: null };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await client.getDocuments({
        page: 2,
        page_size: 25,
        search: 'invoice',
        tags__id__in: [1, 2, 3],
        correspondent__id: 5,
        document_type__id: 10,
      });

      const calledUrl = mockFetch.mock.calls[0]![0] as string;
      expect(calledUrl).toContain('page=2');
      expect(calledUrl).toContain('page_size=25');
      expect(calledUrl).toContain('search=invoice');
      expect(calledUrl).toContain('tags__id__in=1%2C2%2C3');
      expect(calledUrl).toContain('correspondent__id=5');
      expect(calledUrl).toContain('document_type__id=10');
    });

    it('throws PaperlessApiError on failed request', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: () => Promise.resolve(''),
      });

      await expect(client.getDocuments()).rejects.toThrow(PaperlessApiError);
      await expect(client.getDocuments()).rejects.toThrow('API request failed: 401 Unauthorized');
    });

    it('includes error body in error message when available', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () => Promise.resolve('Invalid parameters'),
      });

      await expect(client.getDocuments()).rejects.toThrow(
        'API request failed: 400 Bad Request - Invalid parameters'
      );
    });

    it('handles error when response.text() throws', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.reject(new Error('Cannot read body')),
      });

      await expect(client.getDocuments()).rejects.toThrow(
        'API request failed: 500 Internal Server Error'
      );
    });
  });

  describe('getDocument', () => {
    it('fetches a single document by id', async () => {
      const mockDocument = { id: 123, title: 'Test Document' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDocument),
      });

      const result = await client.getDocument(123);

      expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/api/documents/123/`, expect.any(Object));
      expect(result).toEqual(mockDocument);
    });
  });

  describe('getDocumentContent', () => {
    it('fetches document content as text', async () => {
      const mockContent = 'Document text content';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent),
      });

      const result = await client.getDocumentContent(123);

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/documents/123/preview/`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Token ${token}`,
          }),
        })
      );
      expect(result).toBe(mockContent);
    });

    it('throws PaperlessApiError on failed request', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(client.getDocumentContent(123)).rejects.toThrow(PaperlessApiError);
      await expect(client.getDocumentContent(123)).rejects.toThrow(
        'Failed to get document content: 404'
      );
    });
  });

  describe('getDocumentPreview', () => {
    it('fetches document preview and returns raw response', async () => {
      const mockResponse = {
        ok: true,
        headers: new Headers({ 'content-type': 'application/pdf' }),
        body: 'mock-body',
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await client.getDocumentPreview(456);

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/documents/456/preview/`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Token ${token}`,
          }),
        })
      );
      expect(result).toBe(mockResponse);
    });

    it('throws PaperlessApiError on failed request', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(client.getDocumentPreview(456)).rejects.toThrow(PaperlessApiError);
      await expect(client.getDocumentPreview(456)).rejects.toThrow(
        'Failed to get document preview: 500'
      );
    });
  });

  describe('updateDocument', () => {
    it('updates document with PATCH request', async () => {
      const mockDocument = { id: 123, title: 'Updated Title' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDocument),
      });

      const result = await client.updateDocument(123, {
        title: 'Updated Title',
        correspondent: 5,
        document_type: 10,
        tags: [1, 2],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/documents/123/`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({
            title: 'Updated Title',
            correspondent: 5,
            document_type: 10,
            tags: [1, 2],
          }),
        })
      );
      expect(result).toEqual(mockDocument);
    });
  });

  describe('getTags', () => {
    it('fetches all tags with large page size', async () => {
      const mockResponse = { results: [{ id: 1, name: 'Tag1', slug: 'tag1' }], count: 1 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getTags();

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/tags/?page_size=9999`,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('searchTags', () => {
    it('filters tags by name (case-insensitive)', async () => {
      const mockResponse = {
        results: [
          { id: 1, name: 'Invoice', slug: 'invoice' },
          { id: 2, name: 'Receipt', slug: 'receipt' },
          { id: 3, name: 'Tax Invoice', slug: 'tax-invoice' },
        ],
        count: 3,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.searchTags('invoice');

      expect(result).toHaveLength(2);
      expect(result[0]!.name).toBe('Invoice');
      expect(result[1]!.name).toBe('Tax Invoice');
    });

    it('filters tags by slug', async () => {
      const mockResponse = {
        results: [
          { id: 1, name: 'Special Tag', slug: 'special-tag' },
          { id: 2, name: 'Normal', slug: 'normal' },
        ],
        count: 2,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.searchTags('special');

      expect(result).toHaveLength(1);
      expect(result[0]!.slug).toBe('special-tag');
    });
  });

  describe('createTag', () => {
    it('creates a new tag with POST request', async () => {
      const mockTag = { id: 5, name: 'New Tag', slug: 'new-tag' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTag),
      });

      const result = await client.createTag('New Tag');

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/tags/`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'New Tag' }),
        })
      );
      expect(result).toEqual(mockTag);
    });
  });

  describe('getCorrespondents', () => {
    it('fetches all correspondents with large page size', async () => {
      const mockResponse = { results: [{ id: 1, name: 'Company', slug: 'company' }], count: 1 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getCorrespondents();

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/correspondents/?page_size=9999`,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('searchCorrespondents', () => {
    it('filters correspondents by name (case-insensitive)', async () => {
      const mockResponse = {
        results: [
          { id: 1, name: 'Acme Corp', slug: 'acme-corp' },
          { id: 2, name: 'Beta Inc', slug: 'beta-inc' },
          { id: 3, name: 'Acme Services', slug: 'acme-services' },
        ],
        count: 3,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.searchCorrespondents('acme');

      expect(result).toHaveLength(2);
      expect(result[0]!.name).toBe('Acme Corp');
      expect(result[1]!.name).toBe('Acme Services');
    });

    it('filters correspondents by slug', async () => {
      const mockResponse = {
        results: [
          { id: 1, name: 'Company A', slug: 'company-a' },
          { id: 2, name: 'Firm B', slug: 'firm-b' },
        ],
        count: 2,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.searchCorrespondents('firm');

      expect(result).toHaveLength(1);
      expect(result[0]!.slug).toBe('firm-b');
    });
  });

  describe('createCorrespondent', () => {
    it('creates a new correspondent with POST request', async () => {
      const mockCorrespondent = { id: 5, name: 'New Company', slug: 'new-company' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCorrespondent),
      });

      const result = await client.createCorrespondent('New Company');

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/correspondents/`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'New Company' }),
        })
      );
      expect(result).toEqual(mockCorrespondent);
    });
  });

  describe('getDocumentTypes', () => {
    it('fetches all document types with large page size', async () => {
      const mockResponse = { results: [{ id: 1, name: 'Invoice', slug: 'invoice' }], count: 1 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getDocumentTypes();

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/document_types/?page_size=9999`,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('searchDocumentTypes', () => {
    it('filters document types by name (case-insensitive)', async () => {
      const mockResponse = {
        results: [
          { id: 1, name: 'Invoice', slug: 'invoice' },
          { id: 2, name: 'Contract', slug: 'contract' },
          { id: 3, name: 'Tax Invoice', slug: 'tax-invoice' },
        ],
        count: 3,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.searchDocumentTypes('invoice');

      expect(result).toHaveLength(2);
      expect(result[0]!.name).toBe('Invoice');
      expect(result[1]!.name).toBe('Tax Invoice');
    });

    it('filters document types by slug', async () => {
      const mockResponse = {
        results: [
          { id: 1, name: 'Some Type', slug: 'some-type' },
          { id: 2, name: 'Other', slug: 'other' },
        ],
        count: 2,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.searchDocumentTypes('some');

      expect(result).toHaveLength(1);
      expect(result[0]!.slug).toBe('some-type');
    });
  });

  describe('createDocumentType', () => {
    it('creates a new document type with POST request', async () => {
      const mockDocumentType = { id: 5, name: 'New Type', slug: 'new-type' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDocumentType),
      });

      const result = await client.createDocumentType('New Type');

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/document_types/`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'New Type' }),
        })
      );
      expect(result).toEqual(mockDocumentType);
    });
  });

  describe('checkConnection', () => {
    it('returns true when connection succeeds', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [], count: 0 }),
      });

      const result = await client.checkConnection();

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/tags/?page_size=1`,
        expect.any(Object)
      );
      expect(result).toBe(true);
    });

    it('returns false when connection fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      const result = await client.checkConnection();

      expect(result).toBe(false);
    });
  });
});

describe('PaperlessApiError', () => {
  it('creates error with message and status code', () => {
    const error = new PaperlessApiError('Test error', 404);

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe('PaperlessApiError');
  });

  it('is instance of Error', () => {
    const error = new PaperlessApiError('Test error', 500);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(PaperlessApiError);
  });
});
