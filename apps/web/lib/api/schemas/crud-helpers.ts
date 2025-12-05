import { z } from 'zod';
import { registry } from '../openapi';
import { CommonErrorResponses, PaginationQuerySchema, PaginationMetaSchema } from './common';

type CrudResourceConfig = {
  /** Resource name in singular form (e.g., "AiProvider") */
  resourceName: string;
  /** Resource path (e.g., "/ai-providers") */
  resourcePath: string;
  /** Tag for OpenAPI grouping (e.g., "AiProviders") */
  tag: string;
  /** Schema for list item response */
  listItemSchema: z.ZodType;
  /** Schema for create request body */
  createRequestSchema: z.ZodType;
  /** Schema for update request body */
  updateRequestSchema: z.ZodType;
  /** Whether DELETE returns 200 with success object instead of 204 */
  deleteReturnsSuccess?: boolean;
};

/**
 * Registers standard CRUD paths for a resource in the OpenAPI registry.
 * This reduces duplication across different resource schemas.
 */
export function registerCrudPaths(config: CrudResourceConfig) {
  const {
    resourceName,
    resourcePath,
    tag,
    listItemSchema,
    createRequestSchema,
    updateRequestSchema,
    deleteReturnsSuccess = false,
  } = config;

  // Create paginated response schema for this resource
  const paginatedResponseSchema = z
    .object({
      items: z.array(listItemSchema),
    })
    .extend(PaginationMetaSchema.shape);

  // GET /resources - List all (paginated)
  registry.registerPath({
    method: 'get',
    path: resourcePath,
    summary: `List all ${tag} (Admin only)`,
    tags: [tag],
    request: {
      query: PaginationQuerySchema,
    },
    responses: {
      200: {
        description: `Paginated list of ${tag}`,
        content: {
          'application/json': {
            schema: paginatedResponseSchema,
          },
        },
      },
      401: CommonErrorResponses[401],
      403: CommonErrorResponses[403],
    },
  });

  // POST /resources - Create new
  registry.registerPath({
    method: 'post',
    path: resourcePath,
    summary: `Create a new ${resourceName} (Admin only)`,
    tags: [tag],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: `${resourceName} created`,
        content: {
          'application/json': {
            schema: listItemSchema,
          },
        },
      },
      400: CommonErrorResponses[400],
      401: CommonErrorResponses[401],
      403: CommonErrorResponses[403],
      409: CommonErrorResponses[409],
    },
  });

  // GET /resources/{id} - Get by ID
  registry.registerPath({
    method: 'get',
    path: `${resourcePath}/{id}`,
    summary: `Get ${resourceName} by ID (Admin only)`,
    tags: [tag],
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: `${resourceName} details`,
        content: {
          'application/json': {
            schema: listItemSchema,
          },
        },
      },
      401: CommonErrorResponses[401],
      403: CommonErrorResponses[403],
      404: CommonErrorResponses[404],
    },
  });

  // PATCH /resources/{id} - Update
  registry.registerPath({
    method: 'patch',
    path: `${resourcePath}/{id}`,
    summary: `Update ${resourceName} (Admin only)`,
    tags: [tag],
    request: {
      params: z.object({
        id: z.string(),
      }),
      body: {
        content: {
          'application/json': {
            schema: updateRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: `${resourceName} updated`,
        content: {
          'application/json': {
            schema: listItemSchema,
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

  // DELETE /resources/{id} - Delete
  registry.registerPath({
    method: 'delete',
    path: `${resourcePath}/{id}`,
    summary: `Delete ${resourceName} (Admin only)`,
    tags: [tag],
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: deleteReturnsSuccess
      ? {
          200: {
            description: `${resourceName} deleted`,
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                }),
              },
            },
          },
          401: CommonErrorResponses[401],
          403: CommonErrorResponses[403],
          404: CommonErrorResponses[404],
        }
      : {
          204: {
            description: `${resourceName} deleted`,
          },
          400: CommonErrorResponses[400],
          401: CommonErrorResponses[401],
          403: CommonErrorResponses[403],
          404: CommonErrorResponses[404],
        },
  });
}

/**
 * Creates a standard name validation schema used across resources.
 * All resources have similar name requirements.
 */
export const createNameSchema = (fieldName = 'Name') =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`)
    .max(100, `${fieldName} must be at most 100 characters`);

/**
 * Creates an optional name validation schema for update operations.
 */
export const createOptionalNameSchema = (fieldName = 'Name') =>
  createNameSchema(fieldName).optional();
