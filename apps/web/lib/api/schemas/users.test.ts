import { describe, it, expect } from 'vitest';
import {
  UserRoleSchema,
  UserListItemSchema,
  UserListResponseSchema,
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
} from './users';

describe('UserRoleSchema', () => {
  it('validates DEFAULT role', () => {
    const result = UserRoleSchema.safeParse('DEFAULT');
    expect(result.success).toBe(true);
  });

  it('validates ADMIN role', () => {
    const result = UserRoleSchema.safeParse('ADMIN');
    expect(result.success).toBe(true);
  });

  it('rejects invalid role', () => {
    const result = UserRoleSchema.safeParse('SUPERADMIN');
    expect(result.success).toBe(false);
  });
});

describe('UserListItemSchema', () => {
  it('validates correct user list item', () => {
    const result = UserListItemSchema.safeParse({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
      isActive: true,
      mustChangePassword: false,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = UserListItemSchema.safeParse({
      id: 'user-1',
      username: 'testuser',
    });
    expect(result.success).toBe(false);
  });
});

describe('UserListResponseSchema', () => {
  it('validates correct user list response', () => {
    const result = UserListResponseSchema.safeParse({
      users: [
        {
          id: 'user-1',
          username: 'testuser',
          role: 'DEFAULT',
          isActive: true,
          mustChangePassword: false,
          createdAt: '2024-01-15T10:00:00.000Z',
          updatedAt: '2024-01-15T10:00:00.000Z',
        },
      ],
      total: 1,
    });
    expect(result.success).toBe(true);
  });

  it('validates empty user list', () => {
    const result = UserListResponseSchema.safeParse({
      users: [],
      total: 0,
    });
    expect(result.success).toBe(true);
  });
});

describe('CreateUserRequestSchema', () => {
  it('validates correct create user request', () => {
    const result = CreateUserRequestSchema.safeParse({
      username: 'newuser',
      password: 'password123',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe('DEFAULT');
    }
  });

  it('validates create user with role', () => {
    const result = CreateUserRequestSchema.safeParse({
      username: 'newadmin',
      password: 'password123',
      role: 'ADMIN',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe('ADMIN');
    }
  });

  it('rejects username shorter than 3 characters', () => {
    const result = CreateUserRequestSchema.safeParse({
      username: 'ab',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects username longer than 50 characters', () => {
    const result = CreateUserRequestSchema.safeParse({
      username: 'a'.repeat(51),
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects username with special characters', () => {
    const result = CreateUserRequestSchema.safeParse({
      username: 'user@name',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('accepts username with allowed characters', () => {
    const result = CreateUserRequestSchema.safeParse({
      username: 'user_name-123',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = CreateUserRequestSchema.safeParse({
      username: 'newuser',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects username with only whitespace', () => {
    const result = CreateUserRequestSchema.safeParse({
      username: '        ',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });
});

describe('UpdateUserRequestSchema', () => {
  it('validates update with username only', () => {
    const result = UpdateUserRequestSchema.safeParse({
      username: 'newname',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with role only', () => {
    const result = UpdateUserRequestSchema.safeParse({
      role: 'ADMIN',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with isActive only', () => {
    const result = UpdateUserRequestSchema.safeParse({
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('validates update with resetPassword', () => {
    const result = UpdateUserRequestSchema.safeParse({
      resetPassword: 'newpassword123',
    });
    expect(result.success).toBe(true);
  });

  it('validates empty update request', () => {
    const result = UpdateUserRequestSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('rejects invalid username in update', () => {
    const result = UpdateUserRequestSchema.safeParse({
      username: 'a',
    });
    expect(result.success).toBe(false);
  });

  it('rejects resetPassword shorter than 8 characters', () => {
    const result = UpdateUserRequestSchema.safeParse({
      resetPassword: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('validates update with multiple fields', () => {
    const result = UpdateUserRequestSchema.safeParse({
      username: 'newname',
      role: 'ADMIN',
      isActive: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects username with only whitespace in update', () => {
    const result = UpdateUserRequestSchema.safeParse({
      username: '        ',
    });
    expect(result.success).toBe(false);
  });
});
