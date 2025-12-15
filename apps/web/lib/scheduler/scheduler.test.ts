import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock prisma before importing scheduler
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

// Mock document-scanner
vi.mock('./document-scanner', () => ({
  scanInstance: vi.fn(),
  calculateNextScanTime: vi.fn(),
}));

// Mock queue-processor
vi.mock('./queue-processor', () => ({
  processAllPending: vi.fn(),
  resetStuckItems: vi.fn(),
}));

import { prisma } from '@repo/database';
import { scanInstance, calculateNextScanTime } from './document-scanner';
import { processAllPending, resetStuckItems } from './queue-processor';

// Import Scheduler class for testing (need to create new instances)
// We'll test through the module by creating a fresh scheduler each time
const createScheduler = async () => {
  // Clear module cache to get fresh instance
  vi.resetModules();
  const { scheduler } = await import('./scheduler');
  return scheduler;
};

describe('Scheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.mocked(resetStuckItems).mockResolvedValue(0);
    // Suppress console output during tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('start', () => {
    it('resets stuck items on start', async () => {
      vi.mocked(resetStuckItems).mockResolvedValue(3);
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([]);

      const scheduler = await createScheduler();
      await scheduler.start();

      expect(resetStuckItems).toHaveBeenCalled();
      scheduler.stop();
    });

    it('schedules all auto-process enabled instances', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      const nextScanTime = new Date('2024-01-15T10:30:00Z');
      vi.mocked(calculateNextScanTime).mockReturnValue(nextScanTime);

      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '*/30 * * * *',
          nextScanAt: null,
        },
      ] as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      expect(scheduler.getStatus().scheduledInstances).toBe(1);
      scheduler.stop();
    });

    it('does not start if already running', async () => {
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([]);

      const scheduler = await createScheduler();
      await scheduler.start();
      await scheduler.start(); // Second call should be ignored

      expect(prisma.paperlessInstance.findMany).toHaveBeenCalledTimes(1);
      scheduler.stop();
    });
  });

  describe('stop', () => {
    it('clears all timers on stop', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:30:00Z'));
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '*/30 * * * *',
          nextScanAt: null,
        },
      ] as never);

      const scheduler = await createScheduler();
      await scheduler.start();
      expect(scheduler.getStatus().scheduledInstances).toBe(1);

      scheduler.stop();
      expect(scheduler.getStatus().scheduledInstances).toBe(0);
      expect(scheduler.getStatus().running).toBe(false);
    });
  });

  describe('timer execution', () => {
    it('executes scan when timer fires', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      const nextScanTime = new Date('2024-01-15T10:30:00Z'); // 30 minutes from now
      vi.mocked(calculateNextScanTime).mockReturnValue(nextScanTime);

      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '*/30 * * * *',
          nextScanAt: null,
        },
      ] as never);

      vi.mocked(scanInstance).mockResolvedValue({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });

      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '*/30 * * * *',
        nextScanAt: new Date('2024-01-15T11:00:00Z'),
        autoProcessEnabled: true,
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      expect(scanInstance).not.toHaveBeenCalled();

      // Advance time by 30 minutes
      await vi.advanceTimersByTimeAsync(30 * 60 * 1000);

      expect(scanInstance).toHaveBeenCalledWith('instance-1');
      scheduler.stop();
    });

    it('uses nextScanAt if available and in future', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      const nextScanAt = new Date('2024-01-15T10:15:00Z'); // 15 minutes from now (stored in DB)
      const cronNextScan = new Date('2024-01-15T10:30:00Z'); // 30 minutes (from cron)

      vi.mocked(calculateNextScanTime).mockReturnValue(cronNextScan);

      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '*/30 * * * *',
          nextScanAt: nextScanAt, // Use stored nextScanAt
        },
      ] as never);

      vi.mocked(scanInstance).mockResolvedValue({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });

      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '*/30 * * * *',
        nextScanAt: cronNextScan,
        autoProcessEnabled: true,
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      // Should not fire at 14 minutes
      await vi.advanceTimersByTimeAsync(14 * 60 * 1000);
      expect(scanInstance).not.toHaveBeenCalled();

      // Should fire at 15 minutes (using nextScanAt, not cron's 30 min)
      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);
      expect(scanInstance).toHaveBeenCalledWith('instance-1');

      scheduler.stop();
    });

    it('triggers processor when documents are queued', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:01:00Z'));

      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      vi.mocked(scanInstance).mockResolvedValue({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 5, // Documents were queued
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });

      vi.mocked(processAllPending).mockResolvedValue([]);

      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '* * * * *',
        nextScanAt: new Date('2024-01-15T10:02:00Z'),
        autoProcessEnabled: true,
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      // Advance to trigger scan
      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);

      expect(processAllPending).toHaveBeenCalled();
      scheduler.stop();
    });

    it('schedules next scan even after error', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      const firstScan = new Date('2024-01-15T10:01:00Z');
      const secondScan = new Date('2024-01-15T10:02:00Z');

      vi.mocked(calculateNextScanTime)
        .mockReturnValueOnce(firstScan)
        .mockReturnValueOnce(secondScan);

      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      // First scan throws error
      vi.mocked(scanInstance).mockRejectedValueOnce(new Error('Network error'));

      // Second scan succeeds
      vi.mocked(scanInstance).mockResolvedValueOnce({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });

      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '* * * * *',
        nextScanAt: secondScan,
        autoProcessEnabled: true,
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      // First scan at 1 minute - throws error but should still schedule next
      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);
      expect(scanInstance).toHaveBeenCalledTimes(1);

      // Second scan should still fire at 2 minutes
      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);
      expect(scanInstance).toHaveBeenCalledTimes(2);

      scheduler.stop();
    });

    it('schedules next scan after completion', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      const firstScan = new Date('2024-01-15T10:01:00Z');
      const secondScan = new Date('2024-01-15T10:02:00Z');

      vi.mocked(calculateNextScanTime)
        .mockReturnValueOnce(firstScan)
        .mockReturnValueOnce(secondScan);

      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      vi.mocked(scanInstance).mockResolvedValue({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });

      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '* * * * *',
        nextScanAt: secondScan,
        autoProcessEnabled: true,
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      // First scan at 1 minute
      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);
      expect(scanInstance).toHaveBeenCalledTimes(1);

      // Second scan at 2 minutes
      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);
      expect(scanInstance).toHaveBeenCalledTimes(2);

      scheduler.stop();
    });
  });

  describe('scheduleInstance', () => {
    it('can manually schedule an instance', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([]);
      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:05:00Z'));

      const scheduler = await createScheduler();
      await scheduler.start();

      scheduler.scheduleInstance('new-instance', 'New Instance', '*/5 * * * *', null);

      expect(scheduler.getStatus().scheduledInstances).toBe(1);
      scheduler.stop();
    });

    it('clears existing timer when rescheduling same instance', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([]);
      vi.mocked(calculateNextScanTime)
        .mockReturnValueOnce(new Date('2024-01-15T10:05:00Z'))
        .mockReturnValueOnce(new Date('2024-01-15T10:10:00Z'));

      const scheduler = await createScheduler();
      await scheduler.start();

      // Schedule instance first time
      scheduler.scheduleInstance('instance-1', 'Test Instance', '*/5 * * * *', null);
      expect(scheduler.getStatus().scheduledInstances).toBe(1);

      // Reschedule same instance - should clear existing timer
      scheduler.scheduleInstance('instance-1', 'Test Instance', '*/10 * * * *', null);
      expect(scheduler.getStatus().scheduledInstances).toBe(1);

      scheduler.stop();
    });
  });

  describe('unscheduleInstance', () => {
    it('removes timer for an instance', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:30:00Z'));
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '*/30 * * * *',
          nextScanAt: null,
        },
      ] as never);

      const scheduler = await createScheduler();
      await scheduler.start();
      expect(scheduler.getStatus().scheduledInstances).toBe(1);

      scheduler.unscheduleInstance('instance-1');
      expect(scheduler.getStatus().scheduledInstances).toBe(0);

      scheduler.stop();
    });

    it('does nothing when unscheduling non-existent instance', async () => {
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([]);

      const scheduler = await createScheduler();
      await scheduler.start();

      // Try to unschedule an instance that was never scheduled
      scheduler.unscheduleInstance('non-existent-instance');

      // Should not throw, status unchanged
      expect(scheduler.getStatus().scheduledInstances).toBe(0);

      scheduler.stop();
    });
  });

  describe('getStatus', () => {
    it('returns correct status', async () => {
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([]);

      const scheduler = await createScheduler();

      expect(scheduler.getStatus()).toEqual({
        running: false,
        scheduledInstances: 0,
        processorActive: false,
      });

      await scheduler.start();

      expect(scheduler.getStatus()).toEqual({
        running: true,
        scheduledInstances: 0,
        processorActive: false,
      });

      scheduler.stop();
    });
  });

  describe('triggerScan', () => {
    it('manually triggers a scan for a specific instance', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([]);
      vi.mocked(scanInstance).mockResolvedValue({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });
      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:30:00Z'));
      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '*/30 * * * *',
        nextScanAt: new Date('2024-01-15T10:30:00Z'),
        autoProcessEnabled: true,
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      await scheduler.triggerScan('instance-1');

      expect(scanInstance).toHaveBeenCalledWith('instance-1');
      scheduler.stop();
    });
  });

  describe('stop', () => {
    it('does nothing when not running', async () => {
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([]);

      const scheduler = await createScheduler();
      // Don't start, just stop
      scheduler.stop();

      expect(scheduler.getStatus().running).toBe(false);
    });
  });

  describe('processor', () => {
    it('logs success and failure counts from processor results', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:01:00Z'));
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      vi.mocked(scanInstance).mockResolvedValue({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 3,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });

      vi.mocked(processAllPending).mockResolvedValue([
        { queueItemId: 'q1', documentId: 'doc-1', success: true },
        { queueItemId: 'q2', documentId: 'doc-2', success: true },
        { queueItemId: 'q3', documentId: 'doc-3', success: false, error: 'AI error' },
      ]);

      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '* * * * *',
        nextScanAt: new Date('2024-01-15T10:02:00Z'),
        autoProcessEnabled: true,
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('2 successful, 1 failed'));
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[Processor] Failed: doc-3 - AI error')
      );

      scheduler.stop();
    });

    it('skips processing when processor already running', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:01:00Z'));
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      vi.mocked(scanInstance).mockResolvedValue({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 5,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });

      // Make processor take a long time
      let resolveProcessor: () => void;
      vi.mocked(processAllPending).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveProcessor = () => resolve([]);
          })
      );

      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '* * * * *',
        nextScanAt: new Date('2024-01-15T10:02:00Z'),
        autoProcessEnabled: true,
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      // Trigger first scan
      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);

      // Manually trigger processor while still running
      scheduler.triggerProcessor();

      expect(console.log).toHaveBeenCalledWith(
        '[Processor] Already running, will process new items'
      );

      // Resolve the processor
      resolveProcessor!();
      await vi.advanceTimersByTimeAsync(0);

      scheduler.stop();
    });

    it('handles race condition when triggerProcessor is called multiple times synchronously', async () => {
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([]);

      // Make processor take a long time so we can observe the race
      let resolveProcessor: () => void;
      vi.mocked(processAllPending).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveProcessor = () => resolve([]);
          })
      );

      const scheduler = await createScheduler();
      await scheduler.start();

      // Clear mock to track only the calls from triggerProcessor
      vi.mocked(processAllPending).mockClear();

      // Call triggerProcessor twice synchronously (without awaiting)
      // This should trigger line 232's guard in the second runProcessor call
      scheduler.triggerProcessor();
      scheduler.triggerProcessor();

      // Advance microtasks to let both runProcessor calls start
      await vi.advanceTimersByTimeAsync(0);

      // processAllPending should only be called once because the second
      // runProcessor() call should hit the guard at line 232
      expect(processAllPending).toHaveBeenCalledTimes(1);

      // Cleanup
      resolveProcessor!();
      await vi.advanceTimersByTimeAsync(0);
      scheduler.stop();
    });
  });

  describe('scan result handling', () => {
    it('logs error message when scan returns error', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:01:00Z'));
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      vi.mocked(scanInstance).mockResolvedValue({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
        error: 'Connection refused',
      });

      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '* * * * *',
        nextScanAt: new Date('2024-01-15T10:02:00Z'),
        autoProcessEnabled: true,
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);

      expect(console.log).toHaveBeenCalledWith(
        '[Scanner] Test Instance: Error - Connection refused'
      );

      scheduler.stop();
    });
  });

  describe('scheduleNextScan', () => {
    it('does not schedule when instance is disabled', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:01:00Z'));
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      vi.mocked(scanInstance).mockResolvedValue({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });

      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '* * * * *',
        nextScanAt: new Date('2024-01-15T10:02:00Z'),
        autoProcessEnabled: false, // Disabled
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();
      expect(scheduler.getStatus().scheduledInstances).toBe(1);

      // Trigger scan
      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);

      // After scan completes, instance should not be rescheduled
      expect(scheduler.getStatus().scheduledInstances).toBe(0);
      scheduler.stop();
    });

    it('handles error when fetching instance for next scan', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:01:00Z'));
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      vi.mocked(scanInstance).mockResolvedValue({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });

      vi.mocked(prisma.paperlessInstance.findUnique).mockRejectedValue(new Error('Database error'));

      const scheduler = await createScheduler();
      await scheduler.start();

      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error scheduling next scan for instance-1'),
        expect.any(Error)
      );

      scheduler.stop();
    });
  });

  describe('processor error handling', () => {
    it('handles processor errors gracefully', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:01:00Z'));
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      vi.mocked(scanInstance).mockResolvedValue({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 5,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });

      vi.mocked(processAllPending).mockRejectedValue(new Error('Processor error'));

      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '* * * * *',
        nextScanAt: new Date('2024-01-15T10:02:00Z'),
        autoProcessEnabled: true,
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);

      expect(console.error).toHaveBeenCalledWith('[Processor] Error:', expect.any(Error));

      scheduler.stop();
    });
  });

  describe('duplicate scan handling', () => {
    it('skips scan when instance is already being scanned', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:01:00Z'));
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      // Make scan take a long time
      let resolveScan: (
        value: ReturnType<typeof scanInstance> extends Promise<infer T> ? T : never
      ) => void;
      vi.mocked(scanInstance).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveScan = resolve;
          })
      );

      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '* * * * *',
        nextScanAt: new Date('2024-01-15T10:02:00Z'),
        autoProcessEnabled: true,
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      // First scan starts
      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);
      expect(scanInstance).toHaveBeenCalledTimes(1);

      // Manually trigger another scan while first is still running
      await scheduler.triggerScan('instance-1');

      expect(console.log).toHaveBeenCalledWith(
        '[Scheduler] Skipping duplicate scan for instance instance-1'
      );
      expect(scanInstance).toHaveBeenCalledTimes(1);

      // Resolve the first scan
      resolveScan!({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });
      await vi.advanceTimersByTimeAsync(0);

      scheduler.stop();
    });

    it('skips scheduling when instance is already scanning', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:01:00Z'));
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      // Make scan take a long time
      let resolveScan: (
        value: ReturnType<typeof scanInstance> extends Promise<infer T> ? T : never
      ) => void;
      vi.mocked(scanInstance).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveScan = resolve;
          })
      );

      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        id: 'instance-1',
        name: 'Test Instance',
        scanCronExpression: '* * * * *',
        nextScanAt: new Date('2024-01-15T10:02:00Z'),
        autoProcessEnabled: true,
      } as never);

      const scheduler = await createScheduler();
      await scheduler.start();

      // First scan starts
      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);

      // Try to schedule while scan is running
      scheduler.scheduleInstance('instance-1', 'Test Instance', '* * * * *', null);

      expect(console.log).toHaveBeenCalledWith(
        '[Scheduler] Instance "Test Instance" is currently scanning, will reschedule after'
      );

      // Resolve the scan
      resolveScan!({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });
      await vi.advanceTimersByTimeAsync(0);

      scheduler.stop();
    });
  });

  describe('scheduleNextScan edge cases', () => {
    it('does not schedule when scheduler is stopped', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:01:00Z'));
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      // Make scan return immediately
      vi.mocked(scanInstance).mockResolvedValue({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });

      const scheduler = await createScheduler();
      await scheduler.start();

      // Stop scheduler immediately after starting the scan timer
      scheduler.stop();

      // Reset findUnique mock to track if it's called during scheduleNextScan
      vi.mocked(prisma.paperlessInstance.findUnique).mockClear();

      // Advance time to trigger the scan
      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);

      // findUnique should not be called because scheduler is stopped
      expect(prisma.paperlessInstance.findUnique).not.toHaveBeenCalled();
    });

    it('returns early in scheduleNextScan when scheduler stops during scan', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);

      vi.mocked(calculateNextScanTime).mockReturnValue(new Date('2024-01-15T10:01:00Z'));
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        {
          id: 'instance-1',
          name: 'Test Instance',
          scanCronExpression: '* * * * *',
          nextScanAt: null,
        },
      ] as never);

      // Make scan take time and stop scheduler during the scan
      let resolveScan: (
        value: ReturnType<typeof scanInstance> extends Promise<infer T> ? T : never
      ) => void;
      vi.mocked(scanInstance).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveScan = resolve;
          })
      );

      const scheduler = await createScheduler();
      await scheduler.start();

      // Trigger the scan
      await vi.advanceTimersByTimeAsync(1 * 60 * 1000);

      // Stop scheduler WHILE scan is running
      scheduler.stop();

      // Clear the mock to track subsequent calls
      vi.mocked(prisma.paperlessInstance.findUnique).mockClear();

      // Now resolve the scan - scheduleNextScan should return early
      resolveScan!({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });
      await vi.advanceTimersByTimeAsync(0);

      // findUnique should NOT be called because scheduler was stopped
      expect(prisma.paperlessInstance.findUnique).not.toHaveBeenCalled();
    });
  });
});
