import { describe, it, expect } from 'vitest';
import {
  DocumentAnalysisResultSchema,
  AnalyzeDocumentRequestSchema,
  type DocumentAnalysisResult,
} from './document-analysis';

describe('DocumentAnalysisResultSchema', () => {
  const validResult: DocumentAnalysisResult = {
    suggestedTitle: 'Invoice from ACME',
    suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
    suggestedDocumentType: { id: 2, name: 'Invoice' },
    suggestedTags: [{ id: 10, name: 'Finance' }],
    confidence: 0.85,
    reasoning: 'Document contains invoice details',
  };

  it('validates a complete valid result', () => {
    const result = DocumentAnalysisResultSchema.safeParse(validResult);
    expect(result.success).toBe(true);
  });

  it('accepts correspondent without id (new item)', () => {
    const result = DocumentAnalysisResultSchema.safeParse({
      ...validResult,
      suggestedCorrespondent: { name: 'New Company' },
    });
    expect(result.success).toBe(true);
  });

  it('accepts document type without id (new item)', () => {
    const result = DocumentAnalysisResultSchema.safeParse({
      ...validResult,
      suggestedDocumentType: { name: 'New Type' },
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty tags array', () => {
    const result = DocumentAnalysisResultSchema.safeParse({
      ...validResult,
      suggestedTags: [],
    });
    expect(result.success).toBe(true);
  });

  it('rejects confidence below 0', () => {
    const result = DocumentAnalysisResultSchema.safeParse({
      ...validResult,
      confidence: -0.1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects confidence above 1', () => {
    const result = DocumentAnalysisResultSchema.safeParse({
      ...validResult,
      confidence: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing suggestedTitle', () => {
    const { suggestedTitle: _, ...incomplete } = validResult;
    const result = DocumentAnalysisResultSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });

  it('rejects missing suggestedCorrespondent', () => {
    const { suggestedCorrespondent: _, ...incomplete } = validResult;
    const result = DocumentAnalysisResultSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });

  it('rejects missing suggestedDocumentType', () => {
    const { suggestedDocumentType: _, ...incomplete } = validResult;
    const result = DocumentAnalysisResultSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });

  it('accepts existing tags with id', () => {
    const result = DocumentAnalysisResultSchema.safeParse({
      ...validResult,
      suggestedTags: [{ id: 10, name: 'Existing Tag' }],
    });
    expect(result.success).toBe(true);
  });

  it('accepts new tags with name only', () => {
    const result = DocumentAnalysisResultSchema.safeParse({
      ...validResult,
      suggestedTags: [{ name: 'New Tag' }],
    });
    expect(result.success).toBe(true);
  });

  it('accepts mix of existing and new tags', () => {
    const result = DocumentAnalysisResultSchema.safeParse({
      ...validResult,
      suggestedTags: [{ id: 10, name: 'Existing Tag' }, { name: 'New Tag' }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects tags without id or name', () => {
    const result = DocumentAnalysisResultSchema.safeParse({
      ...validResult,
      suggestedTags: [{}],
    });
    expect(result.success).toBe(false);
  });

  it('accepts confidence at boundary values', () => {
    expect(DocumentAnalysisResultSchema.safeParse({ ...validResult, confidence: 0 }).success).toBe(
      true
    );
    expect(DocumentAnalysisResultSchema.safeParse({ ...validResult, confidence: 1 }).success).toBe(
      true
    );
  });
});

describe('AnalyzeDocumentRequestSchema', () => {
  it('validates a valid request', () => {
    const result = AnalyzeDocumentRequestSchema.safeParse({
      aiBotId: 'bot-123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing aiBotId', () => {
    const result = AnalyzeDocumentRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('accepts any string as aiBotId', () => {
    const result = AnalyzeDocumentRequestSchema.safeParse({
      aiBotId: 'any-string',
    });
    expect(result.success).toBe(true);
  });
});
