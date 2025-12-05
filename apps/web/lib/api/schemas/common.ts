import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const ErrorResponseSchema = z
  .object({
    error: z.string(),
    message: z.string(),
    params: z.record(z.string(), z.union([z.string(), z.number(), z.date()])).optional(),
  })
  .openapi('ErrorResponse');

export const PaginationQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
    limit: z.coerce.number().int().min(1).max(100).default(10).openapi({ example: 10 }),
  })
  .openapi('PaginationQuery');

export const PaginationMetaSchema = z
  .object({
    total: z.number().int().openapi({ example: 100 }),
    page: z.number().int().openapi({ example: 1 }),
    limit: z.number().int().openapi({ example: 10 }),
    totalPages: z.number().int().openapi({ example: 10 }),
  })
  .openapi('PaginationMeta');

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
  });

/**
 * Helper to parse pagination query params from request
 */
export function getPaginationParams(request: Request): { page: number; limit: number } {
  const url = new URL(request.url);
  const page = Number.parseInt(url.searchParams.get('page') ?? '1', 10);
  const limit = Number.parseInt(url.searchParams.get('limit') ?? '10', 10);
  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
  };
}

/**
 * Helper to calculate pagination metadata
 */
export function getPaginationMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export const IdParamSchema = z.object({
  id: z.cuid(),
});

export const SuccessResponseSchema = z
  .object({
    success: z.literal(true),
  })
  .openapi('SuccessResponse');

// Common error responses
export const CommonErrorResponses = {
  400: {
    description: 'Bad request',
    content: {
      'application/json': {
        schema: ErrorResponseSchema,
      },
    },
  },
  401: {
    description: 'Not authenticated',
    content: {
      'application/json': {
        schema: ErrorResponseSchema,
      },
    },
  },
  403: {
    description: 'Not authorized',
    content: {
      'application/json': {
        schema: ErrorResponseSchema,
      },
    },
  },
  404: {
    description: 'Not found',
    content: {
      'application/json': {
        schema: ErrorResponseSchema,
      },
    },
  },
  409: {
    description: 'Conflict',
    content: {
      'application/json': {
        schema: ErrorResponseSchema,
      },
    },
  },
  500: {
    description: 'Internal server error',
    content: {
      'application/json': {
        schema: ErrorResponseSchema,
      },
    },
  },
} as const;
