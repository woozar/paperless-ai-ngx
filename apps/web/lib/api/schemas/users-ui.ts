import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// User role enum
export const UserRoleSchema = z.enum(['DEFAULT', 'ADMIN']).openapi('UserRole');

// UI-enhanced schema for creating users
export const CreateUserFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    )
    .describe('text|username'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .describe('password|password|validate'),
  role: UserRoleSchema.default('DEFAULT').describe('select|role|DEFAULT:default|ADMIN:admin'),
});

// UI-enhanced schema for editing users
export const EditUserFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    )
    .describe('text|username'),
  role: UserRoleSchema.describe('select|role|DEFAULT:default|ADMIN:admin'),
  resetPassword: z
    .union([z.string().min(8, 'Password must be at least 8 characters'), z.literal('')])
    .optional()
    .describe('password|resetPassword|validate'),
});

export type CreateUserFormData = z.infer<typeof CreateUserFormSchema>;
export type EditUserFormData = z.infer<typeof EditUserFormSchema>;
