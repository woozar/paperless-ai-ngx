import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { CommonErrorResponses } from './common';

extendZodWithOpenApi(z);

// AiBot in list (with provider relation)
export const AiBotListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    systemPrompt: z.string(),
    aiProviderId: z.string(),
    aiProvider: z.object({
      id: z.string(),
      name: z.string(),
    }),
    isActive: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi('AiBotListItem');

// AiBot list response
export const AiBotListResponseSchema = z
  .object({
    bots: z.array(AiBotListItemSchema),
    total: z.number(),
  })
  .openapi('AiBotListResponse');

// Create AiBot request
export const CreateAiBotRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters'),
    aiProviderId: z.string().min(1, 'AI Provider is required'),
    systemPrompt: z.string().min(1, 'System prompt is required'),
  })
  .openapi('CreateAiBotRequest');

// Update AiBot request (partial)
export const UpdateAiBotRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters')
      .optional(),
    aiProviderId: z.string().min(1).optional(),
    systemPrompt: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
  })
  .openapi('UpdateAiBotRequest');

// Register schemas
registry.register('AiBotListItem', AiBotListItemSchema);
registry.register('AiBotListResponse', AiBotListResponseSchema);
registry.register('CreateAiBotRequest', CreateAiBotRequestSchema);
registry.register('UpdateAiBotRequest', UpdateAiBotRequestSchema);

// Register paths
registry.registerPath({
  method: 'get',
  path: '/ai-bots',
  summary: 'List all AiBots (Admin only)',
  tags: ['AiBots'],
  responses: {
    200: {
      description: 'List of AiBots',
      content: {
        'application/json': {
          schema: AiBotListResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
  },
});

registry.registerPath({
  method: 'post',
  path: '/ai-bots',
  summary: 'Create a new AiBot (Admin only)',
  tags: ['AiBots'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateAiBotRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'AiBot created',
      content: {
        'application/json': {
          schema: AiBotListItemSchema,
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
  path: '/ai-bots/{id}',
  summary: 'Get AiBot by ID (Admin only)',
  tags: ['AiBots'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'AiBot details',
      content: {
        'application/json': {
          schema: AiBotListItemSchema,
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
  path: '/ai-bots/{id}',
  summary: 'Update AiBot (Admin only)',
  tags: ['AiBots'],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateAiBotRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'AiBot updated',
      content: {
        'application/json': {
          schema: AiBotListItemSchema,
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
  path: '/ai-bots/{id}',
  summary: 'Delete AiBot (Admin only)',
  tags: ['AiBots'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    204: {
      description: 'AiBot deleted',
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
  },
});
