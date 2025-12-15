// Helper to format queue item for response
export type QueueItemInput = {
  id: string;
  paperlessDocumentId: number;
  status: string;
  priority: number;
  attempts: number;
  maxAttempts: number;
  lastError: string | null;
  scheduledFor: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  documentId: string | null;
  document?: { title: string } | null;
  aiBotId: string | null;
  aiBot?: { name: string } | null;
};

export function formatQueueItem(item: QueueItemInput) {
  return {
    id: item.id,
    paperlessDocumentId: item.paperlessDocumentId,
    status: item.status,
    priority: item.priority,
    attempts: item.attempts,
    maxAttempts: item.maxAttempts,
    lastError: item.lastError,
    scheduledFor: item.scheduledFor.toISOString(),
    startedAt: item.startedAt?.toISOString() ?? null,
    completedAt: item.completedAt?.toISOString() ?? null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    documentId: item.documentId,
    documentTitle: item.document?.title ?? null,
    aiBotId: item.aiBotId,
    aiBotName: item.aiBot?.name ?? null,
  };
}
