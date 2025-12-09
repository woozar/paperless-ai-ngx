import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPaperlessTools } from './paperless-tools';
import type { PaperlessClient } from '@repo/paperless-client';

function createMockClient(overrides: Partial<PaperlessClient> = {}): PaperlessClient {
  return {
    getTags: vi.fn().mockResolvedValue({
      results: [
        { id: 1, name: 'Finance' },
        { id: 2, name: 'Important' },
        { id: 3, name: 'Archive' },
      ],
    }),
    getCorrespondents: vi.fn().mockResolvedValue({
      results: [
        { id: 10, name: 'ACME Corp' },
        { id: 11, name: 'Bank of Test' },
      ],
    }),
    getDocumentTypes: vi.fn().mockResolvedValue({
      results: [
        { id: 100, name: 'Invoice' },
        { id: 101, name: 'Contract' },
      ],
    }),
    ...overrides,
  } as unknown as PaperlessClient;
}

describe('createPaperlessTools', () => {
  let mockClient: PaperlessClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('searchTags', () => {
    it('returns all tags when no query is provided', async () => {
      const tools = createPaperlessTools(mockClient);

      const result = await tools.searchTags.execute?.(
        { query: undefined },
        { abortSignal: new AbortController().signal, toolCallId: '1', messages: [] }
      );

      expect(result).toEqual([
        { id: 1, name: 'Finance' },
        { id: 2, name: 'Important' },
        { id: 3, name: 'Archive' },
      ]);
    });

    it('filters tags by query (case insensitive)', async () => {
      const tools = createPaperlessTools(mockClient);

      const result = await tools.searchTags.execute?.(
        { query: 'fin' },
        { abortSignal: new AbortController().signal, toolCallId: '2', messages: [] }
      );

      expect(result).toEqual([{ id: 1, name: 'Finance' }]);
    });

    it('returns empty array when no tags match query', async () => {
      const tools = createPaperlessTools(mockClient);

      const result = await tools.searchTags.execute?.(
        { query: 'nonexistent' },
        { abortSignal: new AbortController().signal, toolCallId: '3', messages: [] }
      );

      expect(result).toEqual([]);
    });
  });

  describe('searchCorrespondents', () => {
    it('returns all correspondents when no query is provided', async () => {
      const tools = createPaperlessTools(mockClient);

      const result = await tools.searchCorrespondents.execute?.(
        { query: undefined },
        { abortSignal: new AbortController().signal, toolCallId: '4', messages: [] }
      );

      expect(result).toEqual([
        { id: 10, name: 'ACME Corp' },
        { id: 11, name: 'Bank of Test' },
      ]);
    });

    it('filters correspondents by query (case insensitive)', async () => {
      const tools = createPaperlessTools(mockClient);

      const result = await tools.searchCorrespondents.execute?.(
        { query: 'BANK' },
        { abortSignal: new AbortController().signal, toolCallId: '5', messages: [] }
      );

      expect(result).toEqual([{ id: 11, name: 'Bank of Test' }]);
    });

    it('returns empty array when no correspondents match query', async () => {
      const tools = createPaperlessTools(mockClient);

      const result = await tools.searchCorrespondents.execute?.(
        { query: 'xyz' },
        { abortSignal: new AbortController().signal, toolCallId: '6', messages: [] }
      );

      expect(result).toEqual([]);
    });
  });

  describe('searchDocumentTypes', () => {
    it('returns all document types when no query is provided', async () => {
      const tools = createPaperlessTools(mockClient);

      const result = await tools.searchDocumentTypes.execute?.(
        { query: undefined },
        { abortSignal: new AbortController().signal, toolCallId: '7', messages: [] }
      );

      expect(result).toEqual([
        { id: 100, name: 'Invoice' },
        { id: 101, name: 'Contract' },
      ]);
    });

    it('filters document types by query (case insensitive)', async () => {
      const tools = createPaperlessTools(mockClient);

      const result = await tools.searchDocumentTypes.execute?.(
        { query: 'inv' },
        { abortSignal: new AbortController().signal, toolCallId: '8', messages: [] }
      );

      expect(result).toEqual([{ id: 100, name: 'Invoice' }]);
    });

    it('returns empty array when no document types match query', async () => {
      const tools = createPaperlessTools(mockClient);

      const result = await tools.searchDocumentTypes.execute?.(
        { query: 'nonexistent' },
        { abortSignal: new AbortController().signal, toolCallId: '9', messages: [] }
      );

      expect(result).toEqual([]);
    });
  });

  describe('tool metadata', () => {
    it('has description for searchTags', () => {
      const tools = createPaperlessTools(mockClient);
      expect(tools.searchTags.description).toContain('Search for tags');
    });

    it('has description for searchCorrespondents', () => {
      const tools = createPaperlessTools(mockClient);
      expect(tools.searchCorrespondents.description).toContain('Search for correspondents');
    });

    it('has description for searchDocumentTypes', () => {
      const tools = createPaperlessTools(mockClient);
      expect(tools.searchDocumentTypes.description).toContain('Search for document types');
    });
  });
});
