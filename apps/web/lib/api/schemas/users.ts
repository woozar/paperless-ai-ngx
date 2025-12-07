import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { CommonErrorResponses, PaginationQuerySchema, PaginationMetaSchema } from './common';

extendZodWithOpenApi(z);

// User role enum
export const UserRoleSchema = z.enum(['DEFAULT', 'ADMIN']).openapi('UserRole');

// Username validation schema (reused in create and update)
const UsernameSchema = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username must be at most 50 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens'
  );

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

// User list response (paginated)
export const UserListResponseSchema = z
  .object({
    items: z.array(UserListItemSchema),
  })
  .extend(PaginationMetaSchema.shape)
  .openapi('UserListResponse');

// Create user request
export const CreateUserRequestSchema = z
  .object({
    username: UsernameSchema,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: UserRoleSchema.default('DEFAULT'),
  })
  .openapi('CreateUserRequest');

// Update user request (partial)
export const UpdateUserRequestSchema = z
  .object({
    username: UsernameSchema.optional(),
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

// Common response builders to reduce duplication
const idParamSchema = z.object({ id: z.string() });

const paginatedListResponse = (description: string) => ({
  200: {
    description,
    content: { 'application/json': { schema: UserListResponseSchema } },
  },
  401: CommonErrorResponses[401],
  403: CommonErrorResponses[403],
});

const userItemResponse = (description: string, includeNotFound = false) => ({
  200: {
    description,
    content: { 'application/json': { schema: UserListItemSchema } },
  },
  401: CommonErrorResponses[401],
  403: CommonErrorResponses[403],
  ...(includeNotFound && { 404: CommonErrorResponses[404] }),
});

// Register user paths
registry.registerPath({
  method: 'get',
  path: '/users',
  summary: 'List all users (Admin only)',
  tags: ['Users'],
  request: { query: PaginationQuerySchema },
  responses: paginatedListResponse('Paginated list of users'),
});

registry.registerPath({
  method: 'post',
  path: '/users',
  summary: 'Create a new user (Admin only)',
  tags: ['Users'],
  request: {
    body: { content: { 'application/json': { schema: CreateUserRequestSchema } } },
  },
  responses: {
    201: {
      description: 'User created',
      content: { 'application/json': { schema: UserListItemSchema } },
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
  request: { params: idParamSchema },
  responses: userItemResponse('User details', true),
});

registry.registerPath({
  method: 'patch',
  path: '/users/{id}',
  summary: 'Update user (Admin only)',
  tags: ['Users'],
  request: {
    params: idParamSchema,
    body: { content: { 'application/json': { schema: UpdateUserRequestSchema } } },
  },
  responses: {
    ...userItemResponse('User updated', true),
    400: CommonErrorResponses[400],
  },
});

registry.registerPath({
  method: 'delete',
  path: '/users/{id}',
  summary: 'Soft delete user (Admin only)',
  tags: ['Users'],
  request: { params: idParamSchema },
  responses: {
    ...userItemResponse('User soft deleted', true),
    400: CommonErrorResponses[400],
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/inactive',
  summary: 'List all inactive (soft-deleted) users (Admin only)',
  tags: ['Users'],
  request: { query: PaginationQuerySchema },
  responses: paginatedListResponse('Paginated list of inactive users'),
});

registry.registerPath({
  method: 'post',
  path: '/users/{id}/restore',
  summary: 'Restore a soft-deleted user (Admin only)',
  tags: ['Users'],
  request: { params: idParamSchema },
  responses: userItemResponse('User restored', true),
});
