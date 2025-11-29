import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { CommonErrorResponses } from './common';

extendZodWithOpenApi(z);

// User role enum
export const UserRoleSchema = z.enum(['DEFAULT', 'ADMIN']).openapi('UserRole');

// User in list (without sensitive data)
export const UserListItemSchema = z
  .object({
    id: z.string(),
    username: z.string(),
    role: UserRoleSchema,
    isActive: z.boolean(),
    mustChangePassword: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi('UserListItem');

// User list response
export const UserListResponseSchema = z
  .object({
    users: z.array(UserListItemSchema),
    total: z.number(),
  })
  .openapi('UserListResponse');

// Create user request
export const CreateUserRequestSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be at most 50 characters')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores, and hyphens'
      ),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: UserRoleSchema.default('DEFAULT'),
  })
  .openapi('CreateUserRequest');

// Update user request (partial)
export const UpdateUserRequestSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be at most 50 characters')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores, and hyphens'
      )
      .optional(),
    role: UserRoleSchema.optional(),
    isActive: z.boolean().optional(),
    resetPassword: z.string().min(8).optional(), // Admin can reset user's password
  })
  .openapi('UpdateUserRequest');

// Register schemas
registry.register('UserRole', UserRoleSchema);
registry.register('UserListItem', UserListItemSchema);
registry.register('UserListResponse', UserListResponseSchema);
registry.register('CreateUserRequest', CreateUserRequestSchema);
registry.register('UpdateUserRequest', UpdateUserRequestSchema);

// Register user paths
registry.registerPath({
  method: 'get',
  path: '/users',
  summary: 'List all users (Admin only)',
  tags: ['Users'],
  responses: {
    200: {
      description: 'List of users',
      content: {
        'application/json': {
          schema: UserListResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
  },
});

registry.registerPath({
  method: 'post',
  path: '/users',
  summary: 'Create a new user (Admin only)',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created',
      content: {
        'application/json': {
          schema: UserListItemSchema,
        },
      },
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/{id}',
  summary: 'Get user by ID (Admin only)',
  tags: ['Users'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'User details',
      content: {
        'application/json': {
          schema: UserListItemSchema,
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
  path: '/users/{id}',
  summary: 'Update user (Admin only)',
  tags: ['Users'],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateUserRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User updated',
      content: {
        'application/json': {
          schema: UserListItemSchema,
        },
      },
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
  },
});

registry.registerPath({
  method: 'delete',
  path: '/users/{id}',
  summary: 'Delete user (Admin only)',
  tags: ['Users'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    204: {
      description: 'User deleted',
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
  },
});
