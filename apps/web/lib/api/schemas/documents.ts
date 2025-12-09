import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { CommonErrorResponses, PaginationQuerySchema, PaginatedResponseSchema } from './common';

extendZodWithOpenApi(z);

// Document status enum
export const DocumentStatusSchema = z.enum(['processed', 'unprocessed']).openapi('DocumentStatus');

// Document list item (for table display)
export const DocumentListItemSchema = z
  .object({
    id: z.string(),
    paperlessId: z.number(),
    title: z.string(),
    status: DocumentStatusSchema,
    importedAt: z.iso.datetime(),
    lastProcessedAt: z.iso.datetime().nullable(),
  })
  .openapi('DocumentListItem');

// Document list filter query params
export const DocumentFilterQuerySchema = PaginationQuerySchema.extend({
  status: z.enum(['all', 'processed', 'unprocessed']).default('all').optional(),
}).openapi('DocumentFilterQuery');

// Document list response
export const DocumentListResponseSchema =
  PaginatedResponseSchema(DocumentListItemSchema).openapi('DocumentListResponse');

// Analyze document request
export const AnalyzeDocumentRequestSchema = z
  .object({
    aiBotId: z.cuid(),
  })
  .openapi('AnalyzeDocumentRequest');

// AI suggestion for correspondent/document type (id optional - if missing, it's a new item)
export const SuggestedItemSchema = z
  .object({
    id: z.number().optional(),
    name: z.string(),
  })
  .nullable()
  .openapi('SuggestedItem');

// AI suggestion for tag (existing only)
export const SuggestedTagSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .openapi('SuggestedTag');

// Document analysis result
export const DocumentAnalysisResultSchema = z
  .object({
    suggestedTitle: z.string(),
    suggestedCorrespondent: SuggestedItemSchema,
    suggestedDocumentType: SuggestedItemSchema,
    suggestedTags: z.array(SuggestedTagSchema),
    confidence: z.number().min(0).max(1),
    reasoning: z.string(),
  })
  .openapi('DocumentAnalysisResult');

// Analyze document response
export const AnalyzeDocumentResponseSchema = z
  .object({
    success: z.literal(true),
    result: DocumentAnalysisResultSchema,
    tokensUsed: z.number(),
  })
  .openapi('AnalyzeDocumentResponse');

// Tool call schema for processing result
const ToolCallSchema = z.object({
  toolName: z.string(),
  input: z.record(z.string(), z.any()),
});

// Document processing result (stored result from AI analysis)
export const DocumentProcessingResultSchema = z
  .object({
    id: z.string(),
    processedAt: z.iso.datetime(),
    aiProvider: z.string(),
    tokensUsed: z.number(),
    changes: DocumentAnalysisResultSchema.nullable(),
    toolCalls: z.array(ToolCallSchema).nullable(),
    originalTitle: z.string().nullable(),
  })
  .openapi('DocumentProcessingResult');

// Register schemas
registry.register('DocumentStatus', DocumentStatusSchema);
registry.register('DocumentListItem', DocumentListItemSchema);
registry.register('DocumentProcessingResult', DocumentProcessingResultSchema);
registry.register('DocumentFilterQuery', DocumentFilterQuerySchema);
registry.register('DocumentListResponse', DocumentListResponseSchema);
registry.register('AnalyzeDocumentRequest', AnalyzeDocumentRequestSchema);
registry.register('SuggestedItem', SuggestedItemSchema);
registry.register('SuggestedTag', SuggestedTagSchema);
registry.register('DocumentAnalysisResult', DocumentAnalysisResultSchema);
registry.register('AnalyzeDocumentResponse', AnalyzeDocumentResponseSchema);

// Register documents list path
registry.registerPath({
  method: 'get',
  path: '/paperless-instances/{id}/documents',
  tags: ['Documents'],
  summary: 'List documents for a Paperless instance',
  description: 'Returns a paginated list of documents imported from the Paperless instance',
  request: {
    params: z.object({
      id: z.string(),
    }),
    query: DocumentFilterQuerySchema,
  },
  responses: {
    200: {
      description: 'List of documents',
      content: {
        'application/json': {
          schema: DocumentListResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
  },
});

// Register analyze document path
registry.registerPath({
  method: 'post',
  path: '/paperless-instances/{id}/documents/{documentId}/analyze',
  tags: ['Documents'],
  summary: 'Analyze a document with AI',
  description:
    'Uses the specified AI bot to analyze the document and suggest metadata (title, tags, correspondent, document type)',
  request: {
    params: z.object({
      id: z.string(),
      documentId: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: AnalyzeDocumentRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Document analysis result',
      content: {
        'application/json': {
          schema: AnalyzeDocumentResponseSchema,
        },
      },
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
    500: CommonErrorResponses[500],
  },
});

// Register get document result path
registry.registerPath({
  method: 'get',
  path: '/paperless-instances/{id}/documents/{documentId}/result',
  tags: ['Documents'],
  summary: 'Get latest processing result for a document',
  description: 'Returns the most recent AI analysis result for the specified document',
  request: {
    params: z.object({
      id: z.string(),
      documentId: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Document processing result',
      content: {
        'application/json': {
          schema: DocumentProcessingResultSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
  },
});
