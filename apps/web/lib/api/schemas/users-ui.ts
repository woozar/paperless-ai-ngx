import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { selectOptions } from './form-field-meta';

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
    .meta({ inputType: 'text', labelKey: 'username' }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .meta({ inputType: 'password', labelKey: 'password', validate: true }),
  role: UserRoleSchema.default('DEFAULT').meta({
    inputType: 'select',
    labelKey: 'role',
    options: selectOptions({ DEFAULT: 'default', ADMIN: 'admin' }),
  }),
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
    .meta({ inputType: 'text', labelKey: 'username' }),
  role: UserRoleSchema.meta({
    inputType: 'select',
    labelKey: 'role',
    options: selectOptions({ DEFAULT: 'default', ADMIN: 'admin' }),
  }),
  resetPassword: z
    .union([z.string().min(8, 'Password must be at least 8 characters'), z.literal('')])
    .optional()
    .meta({ inputType: 'password', labelKey: 'resetPassword', validate: true }),
});

export type CreateUserFormData = z.infer<typeof CreateUserFormSchema>;
export type EditUserFormData = z.infer<typeof EditUserFormSchema>;
