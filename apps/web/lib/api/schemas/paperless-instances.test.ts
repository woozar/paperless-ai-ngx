import { describe, it, expect } from 'vitest';
import {
  PaperlessInstanceListItemSchema,
  CreatePaperlessInstanceRequestSchema,
  UpdatePaperlessInstanceRequestSchema,
} from './paperless-instances';

describe('PaperlessInstanceListItemSchema', () => {
  it('validates correct instance item', () => {
    const result = PaperlessInstanceListItemSchema.safeParse({
      id: 'instance-1',
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: '***',
      isActive: true,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = PaperlessInstanceListItemSchema.safeParse({
      id: 'instance-1',
      name: 'My Paperless',
    });
    expect(result.success).toBe(false);
  });
});

describe('CreatePaperlessInstanceRequestSchema', () => {
  it('validates correct create request', () => {
    const result = CreatePaperlessInstanceRequestSchema.safeParse({
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'my-secret-token',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = CreatePaperlessInstanceRequestSchema.safeParse({
      name: '',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'my-secret-token',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only name', () => {
    const result = CreatePaperlessInstanceRequestSchema.safeParse({
      name: '   ',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'my-secret-token',
    });
    expect(result.success).toBe(false);
  });

  it('rejects name longer than 100 characters', () => {
    const result = CreatePaperlessInstanceRequestSchema.safeParse({
      name: 'a'.repeat(101),
      apiUrl: 'https://paperless.example.com',
      apiToken: 'my-secret-token',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid URL format', () => {
    const result = CreatePaperlessInstanceRequestSchema.safeParse({
      name: 'My Paperless',
      apiUrl: 'not-a-url',
      apiToken: 'my-secret-token',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty apiToken', () => {
    const result = CreatePaperlessInstanceRequestSchema.safeParse({
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: '',
    });
    expect(result.success).toBe(false);
  });

  it('trims name before validation', () => {
    const result = CreatePaperlessInstanceRequestSchema.safeParse({
      name: '  My Paperless  ',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'my-secret-token',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('My Paperless');
    }
  });
});

describe('UpdatePaperlessInstanceRequestSchema', () => {
  it('validates update with name only', () => {
    const result = UpdatePaperlessInstanceRequestSchema.safeParse({
      name: 'New Name',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with apiUrl only', () => {
    const result = UpdatePaperlessInstanceRequestSchema.safeParse({
      apiUrl: 'https://new.paperless.com',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with apiToken only', () => {
    const result = UpdatePaperlessInstanceRequestSchema.safeParse({
      apiToken: 'new-token',
    });
    expect(result.success).toBe(true);
  });

  it('validates update with isActive only', () => {
    const result = UpdatePaperlessInstanceRequestSchema.safeParse({
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('validates empty update request', () => {
    const result = UpdatePaperlessInstanceRequestSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('validates update with multiple fields', () => {
    const result = UpdatePaperlessInstanceRequestSchema.safeParse({
      name: 'New Name',
      apiUrl: 'https://new.paperless.com',
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid URL in update', () => {
    const result = UpdatePaperlessInstanceRequestSchema.safeParse({
      apiUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty name in update', () => {
    const result = UpdatePaperlessInstanceRequestSchema.safeParse({
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only name in update', () => {
    const result = UpdatePaperlessInstanceRequestSchema.safeParse({
      name: '   ',
    });
    expect(result.success).toBe(false);
  });

  it('trims name in update', () => {
    const result = UpdatePaperlessInstanceRequestSchema.safeParse({
      name: '  Updated Name  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Updated Name');
    }
  });
});
