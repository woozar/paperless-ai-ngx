import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { CommonErrorResponses } from './common';

extendZodWithOpenApi(z);

// AiProvider enum
export const AiProviderTypeSchema = z
  .enum(['openai', 'anthropic', 'ollama', 'google', 'custom'])
  .openapi('AiProviderType');

// AiProvider in list (apiKey always masked)
export const AiProviderListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    provider: AiProviderTypeSchema,
    model: z.string(),
    apiKey: z.string(), // Always "***" in responses
    baseUrl: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi('AiProviderListItem');

// AiProvider list response
export const AiProviderListResponseSchema = z
  .object({
    providers: z.array(AiProviderListItemSchema),
    total: z.number(),
  })
  .openapi('AiProviderListResponse');

// Create AiProvider request
export const CreateAiProviderRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters'),
    provider: AiProviderTypeSchema,
    model: z.string().min(1, 'Model is required'),
    apiKey: z.string().min(1, 'API key is required'),
    baseUrl: z.string().url('Invalid URL format').optional(),
  })
  .refine(
    (data) => {
      // baseUrl is required for ollama and custom providers
      if (data.provider === 'ollama' || data.provider === 'custom') {
        return !!data.baseUrl;
      }
      return true;
    },
    {
      message: 'Base URL is required for ollama and custom providers',
      path: ['baseUrl'],
    }
  )
  .openapi('CreateAiProviderRequest');

// Update AiProvider request (partial)
export const UpdateAiProviderRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters')
      .optional(),
    provider: AiProviderTypeSchema.optional(),
    model: z.string().min(1).optional(),
    apiKey: z.string().min(1).optional(), // If empty, keep existing
    baseUrl: z.string().url('Invalid URL format').nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .openapi('UpdateAiProviderRequest');

// Register schemas
registry.register('AiProviderType', AiProviderTypeSchema);
registry.register('AiProviderListItem', AiProviderListItemSchema);
registry.register('AiProviderListResponse', AiProviderListResponseSchema);
registry.register('CreateAiProviderRequest', CreateAiProviderRequestSchema);
registry.register('UpdateAiProviderRequest', UpdateAiProviderRequestSchema);

// Register paths
registry.registerPath({
  method: 'get',
  path: '/ai-providers',
  summary: 'List all AiProviders (Admin only)',
  tags: ['AiProviders'],
  responses: {
    200: {
      description: 'List of AiProviders',
      content: {
        'application/json': {
          schema: AiProviderListResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
  },
});

registry.registerPath({
  method: 'post',
  path: '/ai-providers',
  summary: 'Create a new AiProvider (Admin only)',
  tags: ['AiProviders'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateAiProviderRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'AiProvider created',
      content: {
        'application/json': {
          schema: AiProviderListItemSchema,
        },
      },
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    409: CommonErrorResponses[409],
  },
});

registry.registerPath({
  method: 'get',
  path: '/ai-providers/{id}',
  summary: 'Get AiProvider by ID (Admin only)',
  tags: ['AiProviders'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'AiProvider details',
      content: {
        'application/json': {
          schema: AiProviderListItemSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
  },
});

registry.registerPath({
  method: 'patch',
  path: '/ai-providers/{id}',
  summary: 'Update AiProvider (Admin only)',
  tags: ['AiProviders'],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateAiProviderRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'AiProvider updated',
      content: {
        'application/json': {
          schema: AiProviderListItemSchema,
        },
      },
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
    409: CommonErrorResponses[409],
  },
});

registry.registerPath({
  method: 'delete',
  path: '/ai-providers/{id}',
  summary: 'Delete AiProvider (Admin only)',
  tags: ['AiProviders'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    204: {
      description: 'AiProvider deleted',
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
  },
});
