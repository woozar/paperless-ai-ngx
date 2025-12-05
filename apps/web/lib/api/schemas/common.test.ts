import { describe, it, expect } from 'vitest';
import {
  ErrorResponseSchema,
  PaginationQuerySchema,
  PaginatedResponseSchema,
  IdParamSchema,
  SuccessResponseSchema,
} from './common';
import { z } from 'zod';

describe('ErrorResponseSchema', () => {
  it('validates correct error response', () => {
    const result = ErrorResponseSchema.safeParse({
      error: 'Not found',
      message: 'User not found',
    });
    expect(result.success).toBe(true);
  });

  it('validates error response with details', () => {
    const result = ErrorResponseSchema.safeParse({
      error: 'Validation error',
      message: 'Invalid input',
      details: { field: 'username', issue: 'too short' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = ErrorResponseSchema.safeParse({
      error: 'Not found',
    });
    expect(result.success).toBe(false);
  });
});

describe('PaginationQuerySchema', () => {
  it('validates correct pagination query', () => {
    const result = PaginationQuerySchema.safeParse({
      page: 1,
      limit: 20,
    });
    expect(result.success).toBe(true);
  });

  it('coerces string to number', () => {
    const result = PaginationQuerySchema.safeParse({
      page: '2',
      limit: '10',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(10);
    }
  });

  it('uses default values when not provided', () => {
    const result = PaginationQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    }
  });

  it('rejects page less than 1', () => {
    const result = PaginationQuerySchema.safeParse({
      page: 0,
      limit: 20,
    });
    expect(result.success).toBe(false);
  });

  it('rejects limit less than 1', () => {
    const result = PaginationQuerySchema.safeParse({
      page: 1,
      limit: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects limit greater than 100', () => {
    const result = PaginationQuerySchema.safeParse({
      page: 1,
      limit: 101,
    });
    expect(result.success).toBe(false);
  });
});

describe('PaginatedResponseSchema', () => {
  it('creates paginated schema with item type', () => {
    const itemSchema = z.object({
      id: z.string(),
      name: z.string(),
    });
    const paginatedSchema = PaginatedResponseSchema(itemSchema);

    const result = paginatedSchema.safeParse({
      items: [{ id: '1', name: 'Test' }],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    expect(result.success).toBe(true);
  });

  it('validates empty items array', () => {
    const itemSchema = z.object({
      id: z.string(),
    });
    const paginatedSchema = PaginatedResponseSchema(itemSchema);

    const result = paginatedSchema.safeParse({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    });
    expect(result.success).toBe(true);
  });
});

describe('IdParamSchema', () => {
  it('validates correct cuid', () => {
    const result = IdParamSchema.safeParse({
      id: 'clg1234567890abcdef',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid id format', () => {
    const result = IdParamSchema.safeParse({
      id: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing id', () => {
    const result = IdParamSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('SuccessResponseSchema', () => {
  it('validates correct success response', () => {
    const result = SuccessResponseSchema.safeParse({
      success: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects success: false', () => {
    const result = SuccessResponseSchema.safeParse({
      success: false,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing success field', () => {
    const result = SuccessResponseSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
