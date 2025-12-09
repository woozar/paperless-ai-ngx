import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkInstanceAccess,
  checkDocumentAccess,
  instanceNotFoundResponse,
  documentNotFoundResponse,
} from './document-access';

const mockFindFirst = vi.fn();

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: (args: unknown) => mockFindFirst('paperlessInstance', args),
    },
    paperlessDocument: {
      findFirst: (args: unknown) => mockFindFirst('paperlessDocument', args),
    },
  },
}));

describe('document-access', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkInstanceAccess', () => {
    it('returns instance when user is owner', async () => {
      const mockInstance = { id: 'instance-1', ownerId: 'user-1' };
      mockFindFirst.mockResolvedValue(mockInstance);

      const result = await checkInstanceAccess('instance-1', 'user-1');

      expect(result).toEqual(mockInstance);
      expect(mockFindFirst).toHaveBeenCalledWith('paperlessInstance', {
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

    it('returns null when instance not found', async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await checkInstanceAccess('instance-1', 'user-1');

      expect(result).toBeNull();
    });
  });

  describe('checkDocumentAccess', () => {
    it('returns document when it exists and belongs to instance', async () => {
      const mockDocument = { id: 'doc-1', paperlessInstanceId: 'instance-1' };
      mockFindFirst.mockResolvedValue(mockDocument);

      const result = await checkDocumentAccess('doc-1', 'instance-1');

      expect(result).toEqual(mockDocument);
      expect(mockFindFirst).toHaveBeenCalledWith('paperlessDocument', {
        where: {
          id: 'doc-1',
          paperlessInstanceId: 'instance-1',
        },
      });
    });

    it('returns null when document not found', async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await checkDocumentAccess('doc-1', 'instance-1');

      expect(result).toBeNull();
    });
  });

  describe('instanceNotFoundResponse', () => {
    it('returns 404 response with correct error message', async () => {
      const response = instanceNotFoundResponse();

      expect(response.status).toBe(404);

      const body = await response.json();
      expect(body).toEqual({
        error: 'paperlessInstanceNotFound',
        message: 'paperlessInstanceNotFound',
      });
    });
  });

  describe('documentNotFoundResponse', () => {
    it('returns 404 response with correct error message', async () => {
      const response = documentNotFoundResponse();

      expect(response.status).toBe(404);

      const body = await response.json();
      expect(body).toEqual({
        error: 'documentNotFound',
        message: 'documentNotFound',
      });
    });
  });
});
