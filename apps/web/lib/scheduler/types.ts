/**
 * Processing queue status values
 */
export const QueueStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type QueueStatusType = (typeof QueueStatus)[keyof typeof QueueStatus];

/**
 * Result of scanning an instance for new documents
 */
export interface ScanResult {
  instanceId: string;
  instanceName: string;
  documentsQueued: number;
  documentsAlreadyProcessed: number;
  documentsAlreadyQueued: number;
  error?: string;
}

/**
 * Result of processing a queue item
 */
export interface ProcessResult {
  queueItemId: string;
  documentId: string;
  success: boolean;
  error?: string;
}

/**
 * Scheduler configuration
 */
export interface SchedulerConfig {
  /** Default retry delay in minutes for failed queue items */
  retryDelayMinutes: number;
}

export const DEFAULT_SCHEDULER_CONFIG: SchedulerConfig = {
  retryDelayMinutes: 5,
};
