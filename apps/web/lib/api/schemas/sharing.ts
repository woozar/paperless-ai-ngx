import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { CommonErrorResponses } from './common';

extendZodWithOpenApi(z);

// Permission levels for shared resources
export const PermissionSchema = z.enum(['READ', 'WRITE', 'ADMIN']).openapi('Permission');

export type Permission = z.infer<typeof PermissionSchema>;

// A single share access entry
export const ShareAccessItemSchema = z
  .object({
    id: z.string(),
    userId: z.string().nullable(), // null = shared with all users
    username: z.string().nullable(), // null = "All Users"
    permission: PermissionSchema,
    createdAt: z.iso.datetime(),
  })
  .openapi('ShareAccessItem');

export type ShareAccessItem = z.infer<typeof ShareAccessItemSchema>;

// List of share access entries
export const ShareAccessListSchema = z
  .object({
    items: z.array(ShareAccessItemSchema),
  })
  .openapi('ShareAccessList');

// Create share request
export const CreateShareRequestSchema = z
  .object({
    userId: z.string().nullable(), // null = share with all users
    permission: PermissionSchema,
  })
  .openapi('CreateShareRequest');

export type CreateShareRequest = z.infer<typeof CreateShareRequestSchema>;

// Register schemas
registry.register('Permission', PermissionSchema);
registry.register('ShareAccessItem', ShareAccessItemSchema);
registry.register('ShareAccessList', ShareAccessListSchema);
registry.register('CreateShareRequest', CreateShareRequestSchema);

// Helper to register sharing paths for a resource
function registerSharingPaths(resourcePath: string, tag: string) {
  // GET /{resource}/{id}/sharing - List shares
  registry.registerPath({
    method: 'get',
    path: `${resourcePath}/{id}/sharing`,
    summary: `List shares for ${tag}`,
    tags: [tag],
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'List of shares',
        content: {
          'application/json': {
            schema: ShareAccessListSchema,
          },
        },
      },
      401: CommonErrorResponses[401],
      404: CommonErrorResponses[404],
    },
  });

  // POST /{resource}/{id}/sharing - Create share
  registry.registerPath({
    method: 'post',
    path: `${resourcePath}/{id}/sharing`,
    summary: `Share ${tag} with user or all users`,
    tags: [tag],
    request: {
      params: z.object({
        id: z.string(),
      }),
      body: {
        content: {
          'application/json': {
            schema: CreateShareRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Share updated (already existed)',
        content: {
          'application/json': {
            schema: ShareAccessItemSchema,
          },
        },
      },
      201: {
        description: 'Share created',
        content: {
          'application/json': {
            schema: ShareAccessItemSchema,
          },
        },
      },
      400: CommonErrorResponses[400],
      401: CommonErrorResponses[401],
      404: CommonErrorResponses[404],
    },
  });

  // DELETE /{resource}/{id}/sharing/{accessId} - Remove share
  registry.registerPath({
    method: 'delete',
    path: `${resourcePath}/{id}/sharing/{accessId}`,
    summary: `Remove share from ${tag}`,
    tags: [tag],
    request: {
      params: z.object({
        id: z.string(),
        accessId: z.string(),
      }),
    },
    responses: {
      204: {
        description: 'Share removed',
      },
      401: CommonErrorResponses[401],
      404: CommonErrorResponses[404],
    },
  });
}

// Register sharing paths for all resources
registerSharingPaths('/ai-providers', 'AiProviders');
registerSharingPaths('/ai-bots', 'AiBots');
registerSharingPaths('/paperless-instances', 'PaperlessInstances');
