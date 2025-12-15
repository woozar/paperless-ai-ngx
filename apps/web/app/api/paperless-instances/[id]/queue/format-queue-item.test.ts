import { describe, it, expect } from 'vitest';
import { formatQueueItem, type QueueItemInput } from './format-queue-item';

function createQueueItem(overrides: Partial<QueueItemInput> = {}): QueueItemInput {
  return {
    id: 'queue-1',
    paperlessDocumentId: 123,
    status: 'pending',
    priority: 0,
    attempts: 0,
    maxAttempts: 3,
    lastError: null,
    scheduledFor: new Date('2024-01-15T10:00:00Z'),
    startedAt: null,
    completedAt: null,
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-15T09:00:00Z'),
    documentId: null,
    document: null,
    aiBotId: null,
    aiBot: null,
    ...overrides,
  };
}

describe('formatQueueItem', () => {
  it('formats basic queue item with null relations', () => {
    const result = formatQueueItem(createQueueItem());

    expect(result).toEqual({
      id: 'queue-1',
      paperlessDocumentId: 123,
      status: 'pending',
      priority: 0,
      attempts: 0,
      maxAttempts: 3,
      lastError: null,
      scheduledFor: '2024-01-15T10:00:00.000Z',
      startedAt: null,
      completedAt: null,
      createdAt: '2024-01-15T09:00:00.000Z',
      updatedAt: '2024-01-15T09:00:00.000Z',
      documentId: null,
      documentTitle: null,
      aiBotId: null,
      aiBotName: null,
    });
  });

  it('formats queue item with document title', () => {
    const result = formatQueueItem(
      createQueueItem({
        documentId: 'doc-1',
        document: { title: 'Test Document' },
      })
    );

    expect(result.documentId).toBe('doc-1');
    expect(result.documentTitle).toBe('Test Document');
  });

  it('formats queue item with AI bot name', () => {
    const result = formatQueueItem(
      createQueueItem({
        aiBotId: 'bot-1',
        aiBot: { name: 'Test Bot' },
      })
    );

    expect(result.aiBotId).toBe('bot-1');
    expect(result.aiBotName).toBe('Test Bot');
  });

  it('formats queue item with all date fields populated', () => {
    const result = formatQueueItem(
      createQueueItem({
        startedAt: new Date('2024-01-15T10:05:00Z'),
        completedAt: new Date('2024-01-15T10:10:00Z'),
      })
    );

    expect(result.startedAt).toBe('2024-01-15T10:05:00.000Z');
    expect(result.completedAt).toBe('2024-01-15T10:10:00.000Z');
  });

  it('formats queue item with error', () => {
    const result = formatQueueItem(
      createQueueItem({
        status: 'failed',
        lastError: 'Connection timeout',
        attempts: 3,
      })
    );

    expect(result.status).toBe('failed');
    expect(result.lastError).toBe('Connection timeout');
    expect(result.attempts).toBe(3);
  });
});
