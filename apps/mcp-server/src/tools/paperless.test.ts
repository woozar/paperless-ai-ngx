import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaperlessTools } from './paperless.js';
import type {
  PaperlessClient,
  PaperlessCorrespondent,
  PaperlessDocument,
  PaperlessDocumentType,
  PaperlessPaginatedResponse,
  PaperlessTag,
} from '@repo/paperless-client';

describe('PaperlessTools', () => {
  let mockClient: PaperlessClient;
  let tools: PaperlessTools;

  beforeEach(() => {
    mockClient = {
      getDocuments: vi.fn(),
      getDocument: vi.fn(),
      getDocumentContent: vi.fn(),
      searchTags: vi.fn(),
      searchCorrespondents: vi.fn(),
      searchDocumentTypes: vi.fn(),
      checkConnection: vi.fn(),
    } as Partial<PaperlessClient> as PaperlessClient;

    tools = new PaperlessTools(mockClient);
  });

  describe('listDocuments', () => {
    it('should list documents without filters', async () => {
      const mockResponse: PaperlessPaginatedResponse<PaperlessDocument> = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: 'Document 1',
            created: '2024-01-01',
            modified: '2024-01-02',
            added: '2024-01-01',
            correspondent: 1,
            document_type: 1,
            tags: [1, 2],
            archive_serial_number: 'ASN-001',
            content: 'Content 1',
            archived_file_name: 'Archived File Name 1',
            original_file_name: 'Original File Name 1',
          },
          {
            id: 2,
            title: 'Document 2',
            created: '2024-01-03',
            modified: '2024-01-04',
            added: '2024-01-03',
            correspondent: 2,
            document_type: 2,
            tags: [3],
            archive_serial_number: 'ASN-002',
            content: 'Content 2',
            archived_file_name: 'Archived File Name 2',
            original_file_name: 'Original File Name 2',
          },
        ],
      };

      vi.mocked(mockClient.getDocuments).mockResolvedValue(mockResponse);

      const result = await tools.listDocuments({});

      expect(result.count).toBe(2);
      expect(result.documents).toHaveLength(2);
      expect(result.documents[0]?.title).toBe('Document 1');
      expect(result.documents[1]?.title).toBe('Document 2');
      expect(mockClient.getDocuments).toHaveBeenCalledWith({
        page: undefined,
        page_size: undefined,
        search: undefined,
        tags__id__in: undefined,
        correspondent__id: undefined,
        document_type__id: undefined,
      });
    });

    it('should list documents with pagination', async () => {
      const mockResponse: PaperlessPaginatedResponse<PaperlessDocument> = {
        count: 100,
        next: 'http://example.com/api/documents/?page=2',
        previous: null,
        results: [],
      };

      vi.mocked(mockClient.getDocuments).mockResolvedValue(mockResponse);

      await tools.listDocuments({ page: 1, page_size: 25 });

      expect(mockClient.getDocuments).toHaveBeenCalledWith({
        page: 1,
        page_size: 25,
        search: undefined,
        tags__id__in: undefined,
        correspondent__id: undefined,
        document_type__id: undefined,
      });
    });

    it('should list documents with search query', async () => {
      const mockResponse: PaperlessPaginatedResponse<PaperlessDocument> = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: 'Invoice 2024',
            created: '2024-01-01',
            modified: '2024-01-02',
            added: '2024-01-01',
            correspondent: 1,
            document_type: 1,
            tags: [],
            archive_serial_number: null,
            content: 'Invoice content',
            archived_file_name: 'Archived File Name 1',
            original_file_name: 'Original File Name 1',
          },
        ],
      };

      vi.mocked(mockClient.getDocuments).mockResolvedValue(mockResponse);

      await tools.listDocuments({ search: 'invoice' });

      expect(mockClient.getDocuments).toHaveBeenCalledWith({
        page: undefined,
        page_size: undefined,
        search: 'invoice',
        tags__id__in: undefined,
        correspondent__id: undefined,
        document_type__id: undefined,
      });
    });

    it('should list documents filtered by tags', async () => {
      const mockResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [],
      };

      vi.mocked(mockClient.getDocuments).mockResolvedValue(mockResponse);

      await tools.listDocuments({ tags: [1, 2, 3] });

      expect(mockClient.getDocuments).toHaveBeenCalledWith({
        page: undefined,
        page_size: undefined,
        search: undefined,
        tags__id__in: [1, 2, 3],
        correspondent__id: undefined,
        document_type__id: undefined,
      });
    });

    it('should list documents filtered by correspondent', async () => {
      const mockResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [],
      };

      vi.mocked(mockClient.getDocuments).mockResolvedValue(mockResponse);

      await tools.listDocuments({ correspondent_id: 5 });

      expect(mockClient.getDocuments).toHaveBeenCalledWith({
        page: undefined,
        page_size: undefined,
        search: undefined,
        tags__id__in: undefined,
        correspondent__id: 5,
        document_type__id: undefined,
      });
    });

    it('should list documents filtered by document type', async () => {
      const mockResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [],
      };

      vi.mocked(mockClient.getDocuments).mockResolvedValue(mockResponse);

      await tools.listDocuments({ document_type_id: 3 });

      expect(mockClient.getDocuments).toHaveBeenCalledWith({
        page: undefined,
        page_size: undefined,
        search: undefined,
        tags__id__in: undefined,
        correspondent__id: undefined,
        document_type__id: 3,
      });
    });

    it('should list documents with multiple filters', async () => {
      const mockResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [],
      };

      vi.mocked(mockClient.getDocuments).mockResolvedValue(mockResponse);

      await tools.listDocuments({
        page: 2,
        page_size: 50,
        search: 'invoice',
        tags: [1, 2],
        correspondent_id: 3,
        document_type_id: 4,
      });

      expect(mockClient.getDocuments).toHaveBeenCalledWith({
        page: 2,
        page_size: 50,
        search: 'invoice',
        tags__id__in: [1, 2],
        correspondent__id: 3,
        document_type__id: 4,
      });
    });

    it('should map document fields correctly', async () => {
      const mockResponse: PaperlessPaginatedResponse<PaperlessDocument> = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 123,
            title: 'Test Document',
            created: '2024-01-01T10:00:00Z',
            modified: '2024-01-02T11:00:00Z',
            added: '2024-01-01T09:00:00Z',
            correspondent: 5,
            document_type: 3,
            tags: [1, 2, 3],
            archive_serial_number: 'ASN-123',
            content: 'Full content',
            archived_file_name: 'Archived File Name 1',
            original_file_name: 'Original File Name 1',
          },
        ],
      };

      vi.mocked(mockClient.getDocuments).mockResolvedValue(mockResponse);

      const result = await tools.listDocuments({});

      expect(result.documents[0]).toEqual({
        id: 123,
        title: 'Test Document',
        created: '2024-01-01T10:00:00Z',
        modified: '2024-01-02T11:00:00Z',
        added: '2024-01-01T09:00:00Z',
        correspondent: 5,
        document_type: 3,
        tags: [1, 2, 3],
        archive_serial_number: 'ASN-123',
      });
      expect(result.documents[0]).not.toHaveProperty('content');
      expect(result.documents[0]).not.toHaveProperty('extra_field');
    });
  });

  describe('getDocument', () => {
    it('should get document by ID', async () => {
      const mockDocument: Awaited<ReturnType<typeof mockClient.getDocument>> = {
        id: 1,
        title: 'Test Document',
        content: 'Document content',
        created: '2024-01-01',
        modified: '2024-01-02',
        added: '2024-01-01',
        correspondent: 1,
        document_type: 2,
        tags: [1, 2],
        archive_serial_number: 'ASN-001',
        original_file_name: 'test.pdf',
        archived_file_name: 'Archived File Name 1',
      };

      vi.mocked(mockClient.getDocument).mockResolvedValue(mockDocument);

      const result = await tools.getDocument({ id: 1 });

      expect(result).toEqual({
        id: 1,
        title: 'Test Document',
        content: 'Document content',
        created: '2024-01-01',
        modified: '2024-01-02',
        added: '2024-01-01',
        correspondent: 1,
        document_type: 2,
        tags: [1, 2],
        archive_serial_number: 'ASN-001',
        original_file_name: 'test.pdf',
      });
      expect(mockClient.getDocument).toHaveBeenCalledWith(1);
    });

    it('should include all document fields', async () => {
      const mockDocument: PaperlessDocument = {
        id: 42,
        title: 'Full Document',
        content: 'Complete content',
        created: '2024-01-01T10:00:00Z',
        modified: '2024-01-02T11:00:00Z',
        added: '2024-01-01T09:00:00Z',
        correspondent: 5,
        document_type: 3,
        tags: [1, 2, 3, 4],
        archive_serial_number: 'ASN-042',
        original_file_name: 'document.pdf',
        archived_file_name: 'document.pdf',
      };

      vi.mocked(mockClient.getDocument).mockResolvedValue(mockDocument);

      const result = await tools.getDocument({ id: 42 });

      expect(result).not.toHaveProperty('extra_field');
    });
  });

  describe('getDocumentContent', () => {
    it('should get document content by ID', async () => {
      const mockDocument: PaperlessDocument = {
        id: 1,
        title: 'Test Document',
        content: 'This should not be used',
        correspondent: 1,
        document_type: 1,
        tags: [1, 2, 3],
        created: '2024-01-01',
        modified: '2024-01-02',
        added: '2024-01-01',
        archive_serial_number: 'ASN-001',
        original_file_name: 'Document.pdf',
        archived_file_name: 'Document.pdf',
      };
      const mockContent = 'This is the actual content from getDocumentContent';

      vi.mocked(mockClient.getDocument).mockResolvedValue(mockDocument);
      vi.mocked(mockClient.getDocumentContent).mockResolvedValue(mockContent);

      const result = await tools.getDocumentContent({ id: 1 });

      expect(result).toEqual({
        id: 1,
        title: 'Test Document',
        content: 'This is the actual content from getDocumentContent',
      });
      expect(mockClient.getDocumentContent).toHaveBeenCalledWith(1);
      expect(mockClient.getDocument).toHaveBeenCalledWith(1);
    });

    it('should call both getDocumentContent and getDocument', async () => {
      const mockDocument: PaperlessDocument = {
        id: 5,
        title: 'Document Title',
        content: 'Document Content',
        correspondent: 1,
        document_type: 1,
        tags: [1, 2, 3],
        created: '2024-01-01',
        modified: '2024-01-02',
        added: '2024-01-01',
        archive_serial_number: 'ASN-001',
        original_file_name: 'Document.pdf',
        archived_file_name: 'Document.pdf',
      };

      vi.mocked(mockClient.getDocument).mockResolvedValue(mockDocument);
      vi.mocked(mockClient.getDocumentContent).mockResolvedValue('Content');

      await tools.getDocumentContent({ id: 5 });

      expect(mockClient.getDocumentContent).toHaveBeenCalledTimes(1);
      expect(mockClient.getDocument).toHaveBeenCalledTimes(1);
    });
  });

  describe('searchTags', () => {
    it('should search tags by query', async () => {
      const mockTags: PaperlessTag[] = [
        {
          id: 1,
          name: 'Important',
          slug: 'important',
          color: '#ff0000',
          document_count: 10,
          is_inbox_tag: false,
          matching_algorithm: 0,
          is_insensitive: false,
          match: 'important',
        },
        {
          id: 2,
          name: 'Urgent',
          slug: 'urgent',
          color: '#ff6600',
          document_count: 5,
          is_inbox_tag: false,
          matching_algorithm: 0,
          is_insensitive: false,
          match: 'urgent',
        },
      ];

      vi.mocked(mockClient.searchTags).mockResolvedValue(mockTags);

      const result = await tools.searchTags({ query: 'imp' });

      expect(result.tags).toHaveLength(2);
      expect(result.tags[0]).toEqual({
        id: 1,
        name: 'Important',
        slug: 'important',
        color: '#ff0000',
        document_count: 10,
      });
      expect(mockClient.searchTags).toHaveBeenCalledWith('imp');
    });

    it('should return empty array when no tags found', async () => {
      vi.mocked(mockClient.searchTags).mockResolvedValue([]);

      const result = await tools.searchTags({ query: 'nonexistent' });

      expect(result.tags).toHaveLength(0);
    });

    it('should map tag fields correctly', async () => {
      const mockTags: PaperlessTag[] = [
        {
          id: 1,
          name: 'Tag',
          slug: 'tag',
          color: '#000000',
          document_count: 3,
          is_inbox_tag: false,
          matching_algorithm: 0,
          is_insensitive: false,
          match: 'tag',
        },
      ];

      vi.mocked(mockClient.searchTags).mockResolvedValue(mockTags);

      const result = await tools.searchTags({ query: 'tag' });

      expect(result.tags[0]).not.toHaveProperty('extra_field');
    });
  });

  describe('searchCorrespondents', () => {
    it('should search correspondents by query', async () => {
      const mockCorrespondents: PaperlessCorrespondent[] = [
        {
          id: 1,
          name: 'Company A',
          slug: 'company-a',
          document_count: 20,
          is_insensitive: false,
          matching_algorithm: 0,
          match: 'company-a',
          last_correspondence: null,
        },
        {
          id: 2,
          name: 'Company B',
          slug: 'company-b',
          document_count: 15,
          is_insensitive: false,
          matching_algorithm: 0,
          match: 'company-b',
          last_correspondence: null,
        },
      ];

      vi.mocked(mockClient.searchCorrespondents).mockResolvedValue(mockCorrespondents);

      const result = await tools.searchCorrespondents({ query: 'company' });

      expect(result.correspondents).toHaveLength(2);
      expect(result.correspondents[0]).toEqual({
        id: 1,
        name: 'Company A',
        slug: 'company-a',
        document_count: 20,
      });
      expect(mockClient.searchCorrespondents).toHaveBeenCalledWith('company');
    });

    it('should return empty array when no correspondents found', async () => {
      vi.mocked(mockClient.searchCorrespondents).mockResolvedValue([]);

      const result = await tools.searchCorrespondents({ query: 'nonexistent' });

      expect(result.correspondents).toHaveLength(0);
    });

    it('should map correspondent fields correctly', async () => {
      const mockCorrespondents: PaperlessCorrespondent[] = [
        {
          id: 1,
          name: 'Test',
          slug: 'test',
          document_count: 5,
          is_insensitive: false,
          matching_algorithm: 0,
          match: 'test',
          last_correspondence: null,
        },
      ];

      vi.mocked(mockClient.searchCorrespondents).mockResolvedValue(mockCorrespondents);

      const result = await tools.searchCorrespondents({ query: 'test' });

      expect(result.correspondents[0]).not.toHaveProperty('extra_field');
    });
  });

  describe('searchDocumentTypes', () => {
    it('should search document types by query', async () => {
      const mockTypes: PaperlessDocumentType[] = [
        {
          id: 1,
          name: 'Invoice',
          slug: 'invoice',
          document_count: 50,
          match: 'invoice',
          matching_algorithm: 0,
          is_insensitive: false,
        },
        {
          id: 2,
          name: 'Receipt',
          slug: 'receipt',
          document_count: 30,
          match: 'receipt',
          matching_algorithm: 0,
          is_insensitive: false,
        },
      ];

      vi.mocked(mockClient.searchDocumentTypes).mockResolvedValue(mockTypes);

      const result = await tools.searchDocumentTypes({ query: 'inv' });

      expect(result.document_types).toHaveLength(2);
      expect(result.document_types[0]).toEqual({
        id: 1,
        name: 'Invoice',
        slug: 'invoice',
        document_count: 50,
      });
      expect(mockClient.searchDocumentTypes).toHaveBeenCalledWith('inv');
    });

    it('should return empty array when no document types found', async () => {
      vi.mocked(mockClient.searchDocumentTypes).mockResolvedValue([]);

      const result = await tools.searchDocumentTypes({ query: 'nonexistent' });

      expect(result.document_types).toHaveLength(0);
    });

    it('should map document type fields correctly', async () => {
      const mockTypes: PaperlessDocumentType[] = [
        {
          id: 1,
          name: 'Type',
          slug: 'type',
          document_count: 10,
          is_insensitive: false,
          matching_algorithm: 0,
          match: 'type',
        },
      ];

      vi.mocked(mockClient.searchDocumentTypes).mockResolvedValue(mockTypes);

      const result = await tools.searchDocumentTypes({ query: 'type' });

      expect(result.document_types[0]).not.toHaveProperty('extra_field');
    });
  });

  describe('checkConnection', () => {
    it('should check connection successfully', async () => {
      vi.mocked(mockClient.checkConnection).mockResolvedValue(true);

      const result = await tools.checkConnection();

      expect(result).toEqual({ connected: true });
      expect(mockClient.checkConnection).toHaveBeenCalled();
    });

    it('should return false when connection fails', async () => {
      vi.mocked(mockClient.checkConnection).mockResolvedValue(false);

      const result = await tools.checkConnection();

      expect(result).toEqual({ connected: false });
    });
  });
});
