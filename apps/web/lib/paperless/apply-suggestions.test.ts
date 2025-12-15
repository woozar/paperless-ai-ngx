import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { DocumentAnalysisResult } from '@repo/api-client';
import {
  applySuggestions,
  hasAutoApplyEnabled,
  type AutoApplySettings,
  type ApplySuggestionsParams,
} from './apply-suggestions';

// Helper to create a valid analysis result with minimal defaults
function createAnalysisResult(
  overrides: Partial<NonNullable<DocumentAnalysisResult>>
): NonNullable<DocumentAnalysisResult> {
  return {
    suggestedTitle: '',
    suggestedCorrespondent: { name: '' },
    suggestedDocumentType: { name: '' },
    suggestedTags: [],
    confidence: 0.9,
    reasoning: 'Test reasoning',
    ...overrides,
  } as NonNullable<DocumentAnalysisResult>;
}

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessDocument: {
      update: vi.fn(),
    },
  },
}));

import { prisma } from '@repo/database';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  paperlessDocument: {
    update: typeof prisma.paperlessDocument.update;
  };
}>(prisma);

describe('hasAutoApplyEnabled', () => {
  it('returns false when all settings are disabled', () => {
    const settings: AutoApplySettings = {
      autoApplyTitle: false,
      autoApplyCorrespondent: false,
      autoApplyDocumentType: false,
      autoApplyTags: false,
      autoApplyDate: false,
    };
    expect(hasAutoApplyEnabled(settings)).toBe(false);
  });

  it('returns true when title is enabled', () => {
    const settings: AutoApplySettings = {
      autoApplyTitle: true,
      autoApplyCorrespondent: false,
      autoApplyDocumentType: false,
      autoApplyTags: false,
      autoApplyDate: false,
    };
    expect(hasAutoApplyEnabled(settings)).toBe(true);
  });

  it('returns true when correspondent is enabled', () => {
    const settings: AutoApplySettings = {
      autoApplyTitle: false,
      autoApplyCorrespondent: true,
      autoApplyDocumentType: false,
      autoApplyTags: false,
      autoApplyDate: false,
    };
    expect(hasAutoApplyEnabled(settings)).toBe(true);
  });

  it('returns true when document type is enabled', () => {
    const settings: AutoApplySettings = {
      autoApplyTitle: false,
      autoApplyCorrespondent: false,
      autoApplyDocumentType: true,
      autoApplyTags: false,
      autoApplyDate: false,
    };
    expect(hasAutoApplyEnabled(settings)).toBe(true);
  });

  it('returns true when tags is enabled', () => {
    const settings: AutoApplySettings = {
      autoApplyTitle: false,
      autoApplyCorrespondent: false,
      autoApplyDocumentType: false,
      autoApplyTags: true,
      autoApplyDate: false,
    };
    expect(hasAutoApplyEnabled(settings)).toBe(true);
  });

  it('returns true when date is enabled', () => {
    const settings: AutoApplySettings = {
      autoApplyTitle: false,
      autoApplyCorrespondent: false,
      autoApplyDocumentType: false,
      autoApplyTags: false,
      autoApplyDate: true,
    };
    expect(hasAutoApplyEnabled(settings)).toBe(true);
  });

  it('returns true when all settings are enabled', () => {
    const settings: AutoApplySettings = {
      autoApplyTitle: true,
      autoApplyCorrespondent: true,
      autoApplyDocumentType: true,
      autoApplyTags: true,
      autoApplyDate: true,
    };
    expect(hasAutoApplyEnabled(settings)).toBe(true);
  });
});

describe('applySuggestions', () => {
  const mockClient = {
    updateDocument: vi.fn(),
    createCorrespondent: vi.fn(),
    createDocumentType: vi.fn(),
    createTag: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedPrisma.paperlessDocument.update.mockResolvedValue({} as never);
  });

  it('returns empty appliedFields when all settings are disabled', async () => {
    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedTitle: 'New Title',
        suggestedCorrespondent: { name: 'Correspondent' },
        suggestedDocumentType: { name: 'Invoice' },
        suggestedTags: [{ name: 'Tag1' }],
        suggestedDate: '2024-01-15',
      }),
      settings: {
        autoApplyTitle: false,
        autoApplyCorrespondent: false,
        autoApplyDocumentType: false,
        autoApplyTags: false,
        autoApplyDate: false,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(true);
    expect(result.appliedFields).toHaveLength(0);
    expect(mockClient.updateDocument).not.toHaveBeenCalled();
    expect(mockedPrisma.paperlessDocument.update).not.toHaveBeenCalled();
  });

  it('applies title when enabled and suggested', async () => {
    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedTitle: 'New Title',
      }),
      settings: {
        autoApplyTitle: true,
        autoApplyCorrespondent: false,
        autoApplyDocumentType: false,
        autoApplyTags: false,
        autoApplyDate: false,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(true);
    expect(result.appliedFields).toEqual(['title']);
    expect(mockClient.updateDocument).toHaveBeenCalledWith(123, { title: 'New Title' });
    expect(mockedPrisma.paperlessDocument.update).toHaveBeenCalledWith({
      where: { id: 'doc-1' },
      data: { title: 'New Title' },
    });
  });

  it('applies correspondent with existing ID', async () => {
    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedCorrespondent: { id: 5, name: 'Existing Corp' },
      }),
      settings: {
        autoApplyTitle: false,
        autoApplyCorrespondent: true,
        autoApplyDocumentType: false,
        autoApplyTags: false,
        autoApplyDate: false,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(true);
    expect(result.appliedFields).toEqual(['correspondent']);
    expect(mockClient.createCorrespondent).not.toHaveBeenCalled();
    expect(mockClient.updateDocument).toHaveBeenCalledWith(123, { correspondent: 5 });
  });

  it('creates new correspondent when no ID', async () => {
    mockClient.createCorrespondent.mockResolvedValueOnce({ id: 10 });

    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedCorrespondent: { name: 'New Corp' },
      }),
      settings: {
        autoApplyTitle: false,
        autoApplyCorrespondent: true,
        autoApplyDocumentType: false,
        autoApplyTags: false,
        autoApplyDate: false,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(true);
    expect(result.appliedFields).toEqual(['correspondent']);
    expect(mockClient.createCorrespondent).toHaveBeenCalledWith('New Corp');
    expect(mockClient.updateDocument).toHaveBeenCalledWith(123, { correspondent: 10 });
  });

  it('applies document type with existing ID', async () => {
    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedDocumentType: { id: 3, name: 'Invoice' },
      }),
      settings: {
        autoApplyTitle: false,
        autoApplyCorrespondent: false,
        autoApplyDocumentType: true,
        autoApplyTags: false,
        autoApplyDate: false,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(true);
    expect(result.appliedFields).toEqual(['documentType']);
    expect(mockClient.createDocumentType).not.toHaveBeenCalled();
    expect(mockClient.updateDocument).toHaveBeenCalledWith(123, { document_type: 3 });
  });

  it('creates new document type when no ID', async () => {
    mockClient.createDocumentType.mockResolvedValueOnce({ id: 7 });

    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedDocumentType: { name: 'Receipt' },
      }),
      settings: {
        autoApplyTitle: false,
        autoApplyCorrespondent: false,
        autoApplyDocumentType: true,
        autoApplyTags: false,
        autoApplyDate: false,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(true);
    expect(result.appliedFields).toEqual(['documentType']);
    expect(mockClient.createDocumentType).toHaveBeenCalledWith('Receipt');
    expect(mockClient.updateDocument).toHaveBeenCalledWith(123, { document_type: 7 });
  });

  it('applies tags with mixed existing and new', async () => {
    mockClient.createTag.mockResolvedValueOnce({ id: 15 });

    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedTags: [{ id: 1, name: 'Existing' }, { name: 'NewTag' }],
      }),
      settings: {
        autoApplyTitle: false,
        autoApplyCorrespondent: false,
        autoApplyDocumentType: false,
        autoApplyTags: true,
        autoApplyDate: false,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(true);
    expect(result.appliedFields).toEqual(['tags']);
    expect(mockClient.createTag).toHaveBeenCalledWith('NewTag');
    expect(mockClient.updateDocument).toHaveBeenCalledWith(123, { tags: [1, 15] });
  });

  it('applies date when enabled and suggested', async () => {
    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedDate: '2024-03-15',
      }),
      settings: {
        autoApplyTitle: false,
        autoApplyCorrespondent: false,
        autoApplyDocumentType: false,
        autoApplyTags: false,
        autoApplyDate: true,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(true);
    expect(result.appliedFields).toEqual(['date']);
    expect(mockClient.updateDocument).toHaveBeenCalledWith(123, { created: '2024-03-15' });
    expect(mockedPrisma.paperlessDocument.update).toHaveBeenCalledWith({
      where: { id: 'doc-1' },
      data: { documentDate: expect.any(Date) },
    });
  });

  it('applies multiple fields when enabled', async () => {
    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedTitle: 'New Title',
        suggestedDate: '2024-03-15',
      }),
      settings: {
        autoApplyTitle: true,
        autoApplyCorrespondent: false,
        autoApplyDocumentType: false,
        autoApplyTags: false,
        autoApplyDate: true,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(true);
    expect(result.appliedFields).toEqual(['title', 'date']);
    expect(mockClient.updateDocument).toHaveBeenCalledWith(123, {
      title: 'New Title',
      created: '2024-03-15',
    });
  });

  it('skips fields not in analysis result', async () => {
    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      // Only suggestedTitle is set, others are undefined
      analysisResult: {
        suggestedTitle: 'New Title',
        confidence: 0.9,
        reasoning: 'Test',
      } as NonNullable<DocumentAnalysisResult>,
      settings: {
        autoApplyTitle: true,
        autoApplyCorrespondent: true,
        autoApplyDocumentType: true,
        autoApplyTags: true,
        autoApplyDate: true,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(true);
    expect(result.appliedFields).toEqual(['title']);
  });

  it('does not apply title when enabled but suggestedTitle is empty', async () => {
    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedTitle: '', // Empty string
      }),
      settings: {
        autoApplyTitle: true,
        autoApplyCorrespondent: false,
        autoApplyDocumentType: false,
        autoApplyTags: false,
        autoApplyDate: false,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(true);
    expect(result.appliedFields).toHaveLength(0);
    expect(mockClient.updateDocument).not.toHaveBeenCalled();
  });

  it('returns error on client update failure', async () => {
    mockClient.updateDocument.mockRejectedValueOnce(new Error('API Error'));

    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedTitle: 'New Title',
      }),
      settings: {
        autoApplyTitle: true,
        autoApplyCorrespondent: false,
        autoApplyDocumentType: false,
        autoApplyTags: false,
        autoApplyDate: false,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(false);
    expect(result.error).toBe('API Error');
  });

  it('returns error on database update failure', async () => {
    mockedPrisma.paperlessDocument.update.mockRejectedValueOnce(new Error('Database Error'));

    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedTitle: 'New Title',
      }),
      settings: {
        autoApplyTitle: true,
        autoApplyCorrespondent: false,
        autoApplyDocumentType: false,
        autoApplyTags: false,
        autoApplyDate: false,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Database Error');
  });

  it('returns unknown error for non-Error exceptions', async () => {
    mockClient.updateDocument.mockRejectedValueOnce('String error');

    const params: ApplySuggestionsParams = {
      client: mockClient as never,
      paperlessDocumentId: 123,
      localDocumentId: 'doc-1',
      analysisResult: createAnalysisResult({
        suggestedTitle: 'New Title',
      }),
      settings: {
        autoApplyTitle: true,
        autoApplyCorrespondent: false,
        autoApplyDocumentType: false,
        autoApplyTags: false,
        autoApplyDate: false,
      },
    };

    const result = await applySuggestions(params);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unknown error applying suggestions');
  });
});
