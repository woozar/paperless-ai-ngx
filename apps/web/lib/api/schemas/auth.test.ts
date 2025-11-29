import { describe, it, expect } from 'vitest';
import {
  LoginRequestSchema,
  LoginResponseSchema,
  ChangePasswordRequestSchema,
  CurrentUserSchema,
} from './auth';

describe('LoginRequestSchema', () => {
  it('validates correct login request', () => {
    const result = LoginRequestSchema.safeParse({
      username: 'testuser',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty username', () => {
    const result = LoginRequestSchema.safeParse({
      username: '',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = LoginRequestSchema.safeParse({
      username: 'testuser',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const result = LoginRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('LoginResponseSchema', () => {
  it('validates correct login response', () => {
    const result = LoginResponseSchema.safeParse({
      token: 'jwt-token',
      user: {
        id: 'user-1',
        username: 'testuser',
        role: 'DEFAULT',
        mustChangePassword: false,
      },
    });
    expect(result.success).toBe(true);
  });

  it('validates admin role', () => {
    const result = LoginResponseSchema.safeParse({
      token: 'jwt-token',
      user: {
        id: 'admin-1',
        username: 'admin',
        role: 'ADMIN',
        mustChangePassword: false,
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid role', () => {
    const result = LoginResponseSchema.safeParse({
      token: 'jwt-token',
      user: {
        id: 'user-1',
        username: 'testuser',
        role: 'INVALID',
        mustChangePassword: false,
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing token', () => {
    const result = LoginResponseSchema.safeParse({
      user: {
        id: 'user-1',
        username: 'testuser',
        role: 'DEFAULT',
        mustChangePassword: false,
      },
    });
    expect(result.success).toBe(false);
  });
});

describe('ChangePasswordRequestSchema', () => {
  it('validates correct change password request', () => {
    const result = ChangePasswordRequestSchema.safeParse({
      currentPassword: 'oldpassword',
      newPassword: 'newpassword123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty current password', () => {
    const result = ChangePasswordRequestSchema.safeParse({
      currentPassword: '',
      newPassword: 'newpassword123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects new password shorter than 8 characters', () => {
    const result = ChangePasswordRequestSchema.safeParse({
      currentPassword: 'oldpassword',
      newPassword: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('accepts new password with exactly 8 characters', () => {
    const result = ChangePasswordRequestSchema.safeParse({
      currentPassword: 'oldpassword',
      newPassword: '12345678',
    });
    expect(result.success).toBe(true);
  });
});

describe('CurrentUserSchema', () => {
  it('validates correct current user', () => {
    const result = CurrentUserSchema.safeParse({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
      mustChangePassword: false,
      createdAt: '2024-01-15T10:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('validates admin user', () => {
    const result = CurrentUserSchema.safeParse({
      id: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
      mustChangePassword: true,
      createdAt: '2024-01-15T10:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid datetime format', () => {
    const result = CurrentUserSchema.safeParse({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
      mustChangePassword: false,
      createdAt: 'invalid-date',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const result = CurrentUserSchema.safeParse({
      id: 'user-1',
      username: 'testuser',
    });
    expect(result.success).toBe(false);
  });
});
