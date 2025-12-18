import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { registerCrudPaths, createNameSchema, createOptionalNameSchema } from './crud-helpers';

extendZodWithOpenApi(z);

// Response language options for AI bots
export const ResponseLanguageSchema = z
  .enum(['DOCUMENT', 'GERMAN', 'ENGLISH'])
  .openapi('ResponseLanguage');

// Document mode for analysis (text only or full PDF)
export const DocumentModeSchema = z.enum(['text', 'pdf']).openapi('DocumentMode');

// AiBot in list (with model relation)
export const AiBotListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    systemPrompt: z.string(),
    responseLanguage: ResponseLanguageSchema,
    documentMode: DocumentModeSchema,
    pdfMaxSizeMb: z.number().nullable(),
    aiModelId: z.string(),
    aiModel: z.object({
      id: z.string(),
      name: z.string(),
      modelIdentifier: z.string(),
      aiAccount: z.object({
        id: z.string(),
        name: z.string(),
        provider: z.string(),
      }),
    }),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi('AiBotListItem');

// Create AiBot request
export const CreateAiBotRequestSchema = z
  .object({
    name: createNameSchema(),
    aiModelId: z.string().min(1, 'AI Model is required'),
    systemPrompt: z.string().min(1, 'System prompt is required'),
    responseLanguage: ResponseLanguageSchema.optional().default('DOCUMENT'),
    documentMode: DocumentModeSchema.optional().default('text'),
    pdfMaxSizeMb: z.number().min(1).max(100).nullable().optional(),
  })
  .openapi('CreateAiBotRequest');

// Update AiBot request (partial)
export const UpdateAiBotRequestSchema = z
  .object({
    name: createOptionalNameSchema(),
    aiModelId: z.string().min(1).optional(),
    systemPrompt: z.string().min(1).optional(),
    responseLanguage: ResponseLanguageSchema.optional(),
    documentMode: DocumentModeSchema.optional(),
    pdfMaxSizeMb: z.number().min(1).max(100).nullable().optional(),
  })
  .openapi('UpdateAiBotRequest');

// Register schemas
registry.register('ResponseLanguage', ResponseLanguageSchema);
registry.register('DocumentMode', DocumentModeSchema);
registry.register('AiBotListItem', AiBotListItemSchema);
registry.register('CreateAiBotRequest', CreateAiBotRequestSchema);
registry.register('UpdateAiBotRequest', UpdateAiBotRequestSchema);

// Register all CRUD paths using helper
registerCrudPaths({
  resourceName: 'AiBot',
  resourcePath: '/ai-bots',
  tag: 'AiBots',
  listItemSchema: AiBotListItemSchema,
  createRequestSchema: CreateAiBotRequestSchema,
  updateRequestSchema: UpdateAiBotRequestSchema,
  deleteReturnsSuccess: true, // AiBots DELETE returns 200 with success object
});
