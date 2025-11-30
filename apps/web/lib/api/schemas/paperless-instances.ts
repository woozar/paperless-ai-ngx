import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { CommonErrorResponses } from './common';

extendZodWithOpenApi(z);

// PaperlessInstance in list (apiToken always masked)
export const PaperlessInstanceListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    apiUrl: z.string(),
    apiToken: z.string(), // Always "***" in responses
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi('PaperlessInstanceListItem');

// PaperlessInstance list response
export const PaperlessInstanceListResponseSchema = z
  .object({
    instances: z.array(PaperlessInstanceListItemSchema),
    total: z.number(),
  })
  .openapi('PaperlessInstanceListResponse');

// Create PaperlessInstance request
export const CreatePaperlessInstanceRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters'),
    apiUrl: z.string().url('Invalid URL format'),
    apiToken: z.string().min(1, 'API token is required'),
  })
  .openapi('CreatePaperlessInstanceRequest');

// Update PaperlessInstance request (partial)
export const UpdatePaperlessInstanceRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters')
      .optional(),
    apiUrl: z.string().url('Invalid URL format').optional(),
    apiToken: z.string().min(1).optional(), // If empty, keep existing
    isActive: z.boolean().optional(),
  })
  .openapi('UpdatePaperlessInstanceRequest');

// Register schemas
registry.register('PaperlessInstanceListItem', PaperlessInstanceListItemSchema);
registry.register('PaperlessInstanceListResponse', PaperlessInstanceListResponseSchema);
registry.register('CreatePaperlessInstanceRequest', CreatePaperlessInstanceRequestSchema);
registry.register('UpdatePaperlessInstanceRequest', UpdatePaperlessInstanceRequestSchema);

// Register paths
registry.registerPath({
  method: 'get',
  path: '/paperless-instances',
  summary: 'List all PaperlessInstances (Admin only)',
  tags: ['PaperlessInstances'],
  responses: {
    200: {
      description: 'List of PaperlessInstances',
      content: {
        'application/json': {
          schema: PaperlessInstanceListResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
  },
});

registry.registerPath({
  method: 'post',
  path: '/paperless-instances',
  summary: 'Create a new PaperlessInstance (Admin only)',
  tags: ['PaperlessInstances'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreatePaperlessInstanceRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'PaperlessInstance created',
      content: {
        'application/json': {
          schema: PaperlessInstanceListItemSchema,
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
  path: '/paperless-instances/{id}',
  summary: 'Get PaperlessInstance by ID (Admin only)',
  tags: ['PaperlessInstances'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'PaperlessInstance details',
      content: {
        'application/json': {
          schema: PaperlessInstanceListItemSchema,
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
  path: '/paperless-instances/{id}',
  summary: 'Update PaperlessInstance (Admin only)',
  tags: ['PaperlessInstances'],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdatePaperlessInstanceRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'PaperlessInstance updated',
      content: {
        'application/json': {
          schema: PaperlessInstanceListItemSchema,
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
  path: '/paperless-instances/{id}',
  summary: 'Delete PaperlessInstance (Admin only)',
  tags: ['PaperlessInstances'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    204: {
      description: 'PaperlessInstance deleted',
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
  },
});
