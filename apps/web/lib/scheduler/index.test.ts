import { describe, it, expect, vi } from 'vitest';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    processingQueue: {
      updateMany: vi.fn(),
    },
  },
}));

vi.mock('./document-scanner', () => ({
  scanInstance: vi.fn(),
  scanDueInstances: vi.fn(),
  calculateNextScanTime: vi.fn(),
}));

vi.mock('./queue-processor', () => ({
  processQueueItem: vi.fn(),
  processAllPending: vi.fn(),
  resetStuckItems: vi.fn(),
  getQueueStats: vi.fn(),
}));

import {
  scheduler,
  scanInstance,
  scanDueInstances,
  calculateNextScanTime,
  processQueueItem,
  processAllPending,
  resetStuckItems,
  getQueueStats,
  QueueStatus,
  DEFAULT_SCHEDULER_CONFIG,
} from './index';

describe('scheduler/index exports', () => {
  it('exports scheduler singleton', () => {
    expect(scheduler).toBeDefined();
    expect(typeof scheduler.start).toBe('function');
    expect(typeof scheduler.stop).toBe('function');
    expect(typeof scheduler.getStatus).toBe('function');
  });

  it('exports document scanner functions', () => {
    expect(scanInstance).toBeDefined();
    expect(scanDueInstances).toBeDefined();
    expect(calculateNextScanTime).toBeDefined();
  });

  it('exports queue processor functions', () => {
    expect(processQueueItem).toBeDefined();
    expect(processAllPending).toBeDefined();
    expect(resetStuckItems).toBeDefined();
    expect(getQueueStats).toBeDefined();
  });

  it('exports QueueStatus enum', () => {
    expect(QueueStatus).toBeDefined();
    expect(QueueStatus.PENDING).toBe('pending');
    expect(QueueStatus.PROCESSING).toBe('processing');
    expect(QueueStatus.COMPLETED).toBe('completed');
    expect(QueueStatus.FAILED).toBe('failed');
  });

  it('exports DEFAULT_SCHEDULER_CONFIG', () => {
    expect(DEFAULT_SCHEDULER_CONFIG).toBeDefined();
    expect(typeof DEFAULT_SCHEDULER_CONFIG.retryDelayMinutes).toBe('number');
  });
});
