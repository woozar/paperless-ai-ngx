import { describe, it, expect } from 'vitest';
import {
  DocumentStatusSchema,
  DocumentListItemSchema,
  DocumentFilterQuerySchema,
  AnalyzeDocumentRequestSchema,
  SuggestedItemSchema,
  SuggestedTagSchema,
  DocumentAnalysisResultSchema,
  AnalyzeDocumentResponseSchema,
  DocumentProcessingResultSchema,
} from './documents';

describe('DocumentStatusSchema', () => {
  it('accepts valid status values', () => {
    expect(DocumentStatusSchema.safeParse('processed').success).toBe(true);
    expect(DocumentStatusSchema.safeParse('unprocessed').success).toBe(true);
  });

  it('rejects invalid status values', () => {
    expect(DocumentStatusSchema.safeParse('invalid').success).toBe(false);
    expect(DocumentStatusSchema.safeParse('').success).toBe(false);
  });
});

describe('DocumentListItemSchema', () => {
  const validItem = {
    id: 'doc-123',
    paperlessId: 456,
    title: 'Test Document',
    status: 'processed',
    documentDate: '2024-01-10T00:00:00Z',
    importedAt: '2024-01-15T10:00:00Z',
    lastProcessedAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
  };

  it('validates a complete document list item', () => {
    expect(DocumentListItemSchema.safeParse(validItem).success).toBe(true);
  });

  it('accepts null lastProcessedAt', () => {
    expect(DocumentListItemSchema.safeParse({ ...validItem, lastProcessedAt: null }).success).toBe(
      true
    );
  });

  it('requires all mandatory fields', () => {
    expect(DocumentListItemSchema.safeParse({}).success).toBe(false);
    expect(DocumentListItemSchema.safeParse({ id: 'doc-123' }).success).toBe(false);
  });
});

describe('DocumentFilterQuerySchema', () => {
  it('accepts valid filter values', () => {
    expect(DocumentFilterQuerySchema.safeParse({ status: 'all' }).success).toBe(true);
    expect(DocumentFilterQuerySchema.safeParse({ status: 'processed' }).success).toBe(true);
    expect(DocumentFilterQuerySchema.safeParse({ status: 'unprocessed' }).success).toBe(true);
  });

  it('uses default value when status not provided', () => {
    const result = DocumentFilterQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts pagination parameters', () => {
    const result = DocumentFilterQuerySchema.safeParse({ page: 2, limit: 20 });
    expect(result.success).toBe(true);
  });
});

describe('AnalyzeDocumentRequestSchema', () => {
  it('validates valid CUID', () => {
    const result = AnalyzeDocumentRequestSchema.safeParse({
      aiBotId: 'cjld2cjxh0000qzrmn831i7rn',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid CUID', () => {
    const result = AnalyzeDocumentRequestSchema.safeParse({
      aiBotId: 'invalid-id',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing aiBotId', () => {
    const result = AnalyzeDocumentRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('SuggestedItemSchema', () => {
  it('accepts item with id and name', () => {
    expect(SuggestedItemSchema.safeParse({ id: 1, name: 'Test' }).success).toBe(true);
  });

  it('accepts item with only name (new item)', () => {
    expect(SuggestedItemSchema.safeParse({ name: 'New Item' }).success).toBe(true);
  });

  it('accepts null value', () => {
    expect(SuggestedItemSchema.safeParse(null).success).toBe(true);
  });

  it('rejects item without name', () => {
    expect(SuggestedItemSchema.safeParse({ id: 1 }).success).toBe(false);
  });
});

describe('SuggestedTagSchema', () => {
  it('accepts existing tag with id and name', () => {
    expect(SuggestedTagSchema.safeParse({ id: 1, name: 'Test' }).success).toBe(true);
  });

  it('accepts existing tag with id only', () => {
    expect(SuggestedTagSchema.safeParse({ id: 1 }).success).toBe(true);
  });

  it('accepts new tag with name only', () => {
    expect(SuggestedTagSchema.safeParse({ name: 'New Tag' }).success).toBe(true);
  });

  it('rejects tag without id or name', () => {
    expect(SuggestedTagSchema.safeParse({}).success).toBe(false);
  });
});

describe('DocumentAnalysisResultSchema', () => {
  const validResult = {
    suggestedTitle: 'Invoice from ACME',
    suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
    suggestedDocumentType: { id: 2, name: 'Invoice' },
    suggestedTags: [{ id: 10, name: 'Finance' }],
    confidence: 0.85,
    reasoning: 'Document shows invoice details',
  };

  it('validates complete result', () => {
    expect(DocumentAnalysisResultSchema.safeParse(validResult).success).toBe(true);
  });

  it('accepts null correspondent', () => {
    expect(
      DocumentAnalysisResultSchema.safeParse({
        ...validResult,
        suggestedCorrespondent: null,
      }).success
    ).toBe(true);
  });

  it('accepts null document type', () => {
    expect(
      DocumentAnalysisResultSchema.safeParse({
        ...validResult,
        suggestedDocumentType: null,
      }).success
    ).toBe(true);
  });

  it('rejects confidence outside 0-1 range', () => {
    expect(
      DocumentAnalysisResultSchema.safeParse({ ...validResult, confidence: -0.1 }).success
    ).toBe(false);
    expect(
      DocumentAnalysisResultSchema.safeParse({ ...validResult, confidence: 1.1 }).success
    ).toBe(false);
  });
});

describe('AnalyzeDocumentResponseSchema', () => {
  const validResponse = {
    success: true,
    result: {
      suggestedTitle: 'Invoice',
      suggestedCorrespondent: { name: 'Company' },
      suggestedDocumentType: { name: 'Invoice' },
      suggestedTags: [],
      confidence: 0.9,
      reasoning: 'Test',
    },
    inputTokens: 1000,
    outputTokens: 500,
    estimatedCost: 0.0025,
  };

  it('validates complete response', () => {
    expect(AnalyzeDocumentResponseSchema.safeParse(validResponse).success).toBe(true);
  });

  it('requires success to be true', () => {
    expect(
      AnalyzeDocumentResponseSchema.safeParse({
        ...validResponse,
        success: false,
      }).success
    ).toBe(false);
  });
});

describe('DocumentProcessingResultSchema', () => {
  const validProcessingResult = {
    id: 'result-123',
    processedAt: '2024-01-15T12:00:00Z',
    aiProvider: 'OpenAI GPT-4',
    inputTokens: 1000,
    outputTokens: 500,
    estimatedCost: 0.0025,
    changes: {
      suggestedTitle: 'Invoice',
      suggestedCorrespondent: { name: 'Company' },
      suggestedDocumentType: { name: 'Invoice' },
      suggestedTags: [],
      confidence: 0.9,
      reasoning: 'Test',
    },
    toolCalls: [{ toolName: 'searchTags', input: { query: 'finance' } }],
    originalTitle: 'original.pdf',
  };

  it('validates complete processing result', () => {
    expect(DocumentProcessingResultSchema.safeParse(validProcessingResult).success).toBe(true);
  });

  it('accepts null changes', () => {
    expect(
      DocumentProcessingResultSchema.safeParse({
        ...validProcessingResult,
        changes: null,
      }).success
    ).toBe(true);
  });

  it('accepts null toolCalls', () => {
    expect(
      DocumentProcessingResultSchema.safeParse({
        ...validProcessingResult,
        toolCalls: null,
      }).success
    ).toBe(true);
  });

  it('accepts null originalTitle', () => {
    expect(
      DocumentProcessingResultSchema.safeParse({
        ...validProcessingResult,
        originalTitle: null,
      }).success
    ).toBe(true);
  });
});
