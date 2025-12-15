import { prisma } from '@repo/database';
import { scanInstance, calculateNextScanTime } from './document-scanner';
import { processAllPending, resetStuckItems } from './queue-processor';

/**
 * Scheduler that manages background jobs using setTimeout:
 * - Scanning Paperless instances for new documents (timer-based per instance)
 * - Processing queued documents with AI analysis (event-based, triggered by scanner)
 */
class Scheduler {
  private readonly instanceTimers: Map<string, NodeJS.Timeout> = new Map();
  private readonly scanningInstances: Set<string> = new Set(); // Track instances currently being scanned
  private isRunning = false;
  private isProcessorRunning = false;

  /**
   * Starts the scheduler by scheduling timers for all auto-process enabled instances.
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('[Scheduler] Already running');
      return;
    }

    // Reset any items stuck in "processing" state from previous runs
    const resetCount = await resetStuckItems();
    if (resetCount > 0) {
      console.log(`[Scheduler] Reset ${resetCount} stuck processing items`);
    }

    this.isRunning = true;
    console.log('[Scheduler] Started');

    // Schedule all instances
    await this.scheduleAllInstances();
  }

  /**
   * Stops the scheduler and clears all timers.
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    // Clear all instance timers
    for (const [instanceId, timer] of this.instanceTimers) {
      clearTimeout(timer);
      console.log(`[Scheduler] Cleared timer for instance ${instanceId}`);
    }
    this.instanceTimers.clear();

    this.isRunning = false;
    console.log('[Scheduler] Stopped');
  }

  /**
   * Schedules timers for all auto-process enabled instances.
   */
  private async scheduleAllInstances(): Promise<void> {
    const instances = await prisma.paperlessInstance.findMany({
      where: { autoProcessEnabled: true },
      select: {
        id: true,
        name: true,
        scanCronExpression: true,
        nextScanAt: true,
      },
    });

    for (const instance of instances) {
      this.scheduleInstance(
        instance.id,
        instance.name,
        instance.scanCronExpression,
        instance.nextScanAt
      );
    }

    console.log(`[Scheduler] Scheduled ${instances.length} instances`);
  }

  /**
   * Schedules a single instance for scanning.
   */
  scheduleInstance(
    instanceId: string,
    instanceName: string,
    cronExpression: string,
    nextScanAt: Date | null
  ): void {
    // Skip if instance is currently being scanned - the scan will reschedule when done
    if (this.scanningInstances.has(instanceId)) {
      console.log(
        `[Scheduler] Instance "${instanceName}" is currently scanning, will reschedule after`
      );
      return;
    }

    // Clear existing timer if any
    const existingTimer = this.instanceTimers.get(instanceId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Calculate delay until next scan
    const now = new Date();
    let targetTime: Date;

    if (nextScanAt && nextScanAt > now) {
      targetTime = nextScanAt;
    } else {
      targetTime = calculateNextScanTime(cronExpression);
    }

    const delay = Math.max(0, targetTime.getTime() - now.getTime());

    console.log(
      `[Scheduler] Instance "${instanceName}" scheduled in ${Math.round(delay / 1000)}s (at ${targetTime.toISOString()})`
    );

    // Schedule the scan
    const timer = setTimeout(() => {
      this.runInstanceScan(instanceId);
    }, delay);

    this.instanceTimers.set(instanceId, timer);
  }

  /**
   * Removes the timer for an instance (e.g., when disabled or deleted).
   */
  unscheduleInstance(instanceId: string): void {
    const timer = this.instanceTimers.get(instanceId);
    if (timer) {
      clearTimeout(timer);
      this.instanceTimers.delete(instanceId);
      console.log(`[Scheduler] Unscheduled instance ${instanceId}`);
    }
  }

  /**
   * Runs a scan for a specific instance and schedules the next scan.
   * Uses try-catch-finally to ensure next iteration is always scheduled.
   */
  private async runInstanceScan(instanceId: string): Promise<void> {
    // Check if already scanning (another timer might have fired first)
    if (this.scanningInstances.has(instanceId)) {
      console.log(`[Scheduler] Skipping duplicate scan for instance ${instanceId}`);
      return;
    }

    // Mark instance as scanning to prevent duplicate schedules
    this.scanningInstances.add(instanceId);
    // Remove timer from map since it has already fired
    this.instanceTimers.delete(instanceId);

    try {
      const result = await scanInstance(instanceId);

      if (result.error) {
        console.log(`[Scanner] ${result.instanceName}: Error - ${result.error}`);
      } else if (result.documentsQueued > 0) {
        console.log(
          `[Scanner] ${result.instanceName}: Queued ${result.documentsQueued} new, ${result.documentsAlreadyProcessed} processed, ${result.documentsAlreadyQueued} in queue`
        );
        // Trigger processor if new documents were queued
        this.triggerProcessor();
      } else {
        console.log(
          `[Scanner] ${result.instanceName}: No new documents (${result.documentsAlreadyProcessed} processed, ${result.documentsAlreadyQueued} in queue)`
        );
      }
    } catch (error) {
      console.error(`[Scanner] Error scanning instance ${instanceId}:`, error);
    } finally {
      // Remove scanning lock and schedule next scan
      this.scanningInstances.delete(instanceId);
      await this.scheduleNextScan(instanceId);
    }
  }

  /**
   * Schedules the next scan for an instance.
   * Fetches current instance config and schedules if still enabled.
   */
  private async scheduleNextScan(instanceId: string): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      const instance = await prisma.paperlessInstance.findUnique({
        where: { id: instanceId },
        select: {
          id: true,
          name: true,
          scanCronExpression: true,
          nextScanAt: true,
          autoProcessEnabled: true,
        },
      });

      if (instance?.autoProcessEnabled) {
        this.scheduleInstance(
          instance.id,
          instance.name,
          instance.scanCronExpression,
          instance.nextScanAt
        );
      }
    } catch (error) {
      console.error(`[Scheduler] Error scheduling next scan for ${instanceId}:`, error);
    }
  }

  /**
   * Triggers the processor to process all pending queue items.
   * If processor is already running, it will process all items including newly added ones.
   */
  triggerProcessor(): void {
    if (this.isProcessorRunning) {
      // Processor already running - it will pick up new items in its loop
      console.log('[Processor] Already running, will process new items');
      return;
    }

    // Start processor asynchronously (don't await to avoid blocking)
    this.runProcessor();
  }

  /**
   * Runs the processor to analyze all pending queued documents.
   * Loops until no more pending items are available.
   */
  private async runProcessor(): Promise<void> {
    // v8 ignore next 3 -- @preserve Defensive guard: unreachable in normal execution
    // because triggerProcessor() already checks isProcessorRunning before calling this
    if (this.isProcessorRunning) {
      return;
    }

    this.isProcessorRunning = true;
    console.log('[Processor] Starting to process pending items');

    try {
      const results = await processAllPending();

      let successCount = 0;
      let failCount = 0;

      for (const result of results) {
        if (result.success) {
          successCount++;
        } else {
          failCount++;
          console.log(`[Processor] Failed: ${result.documentId} - ${result.error}`);
        }
      }

      if (results.length > 0) {
        console.log(`[Processor] Finished: ${successCount} successful, ${failCount} failed`);
      }
    } catch (error) {
      console.error('[Processor] Error:', error);
    } finally {
      this.isProcessorRunning = false;
    }
  }

  /**
   * Manually triggers a scan for a specific instance.
   */
  async triggerScan(instanceId: string): Promise<void> {
    await this.runInstanceScan(instanceId);
  }

  /**
   * Returns whether the scheduler is running.
   */
  getStatus(): {
    running: boolean;
    scheduledInstances: number;
    processorActive: boolean;
  } {
    return {
      running: this.isRunning,
      scheduledInstances: this.instanceTimers.size,
      processorActive: this.isProcessorRunning,
    };
  }
}

// Singleton instance using globalThis to survive HMR and module re-evaluation
const globalForScheduler = globalThis as unknown as { scheduler: Scheduler | undefined };

globalForScheduler.scheduler ??= new Scheduler();

export const scheduler = globalForScheduler.scheduler;
