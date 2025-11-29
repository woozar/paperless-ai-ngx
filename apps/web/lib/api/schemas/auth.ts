import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { CommonErrorResponses, SuccessResponseSchema } from './common';

extendZodWithOpenApi(z);

// Login
export const LoginRequestSchema = z
  .object({
    username: z.string().min(1),
    password: z.string().min(1),
  })
  .openapi('LoginRequest');

export const LoginResponseSchema = z
  .object({
    token: z.string(),
    user: z.object({
      id: z.string(),
      username: z.string(),
      role: z.enum(['DEFAULT', 'ADMIN']),
      mustChangePassword: z.boolean(),
    }),
  })
  .openapi('LoginResponse');

// Change Password
export const ChangePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
  })
  .openapi('ChangePasswordRequest');

// Current User
export const CurrentUserSchema = z
  .object({
    id: z.string(),
    username: z.string(),
    role: z.enum(['DEFAULT', 'ADMIN']),
    mustChangePassword: z.boolean(),
    createdAt: z.iso.datetime(),
  })
  .openapi('CurrentUser');

// Register schemas with OpenAPI
registry.register('LoginRequest', LoginRequestSchema);
registry.register('LoginResponse', LoginResponseSchema);
registry.register('ChangePasswordRequest', ChangePasswordRequestSchema);
registry.register('CurrentUser', CurrentUserSchema);

// Register auth paths
registry.registerPath({
  method: 'post',
  path: '/auth/login',
  summary: 'Login with username and password',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: LoginResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  summary: 'Logout and invalidate session',
  tags: ['Auth'],
  responses: {
    200: {
      description: 'Logout successful',
      content: {
        'application/json': {
          schema: SuccessResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/change-password',
  summary: 'Change current user password',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ChangePasswordRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password changed successfully',
      content: {
        'application/json': {
          schema: SuccessResponseSchema,
        },
      },
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/me',
  summary: 'Get current authenticated user',
  tags: ['Auth'],
  responses: {
    200: {
      description: 'Current user info',
      content: {
        'application/json': {
          schema: CurrentUserSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
  },
});
