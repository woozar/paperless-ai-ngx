'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, FileText } from 'lucide-react';
import type { DocumentListItem } from '@repo/api-client';

type PreviewDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentListItem | null;
  instanceId: string;
}>;

export function PreviewDialog({ open, onOpenChange, document, instanceId }: PreviewDialogProps) {
  const t = useTranslations('admin.documents');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open || !document) {
      // Reset state when dialog closes (cleanup is handled by the return function)
      setBlobUrl(null);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const fetchPdf = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(
          `/api/paperless-instances/${instanceId}/documents/${document.id}/preview`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setBlobUrl(url);
        setIsLoading(false);
      } catch {
        setHasError(true);
        setIsLoading(false);
      }
    };

    fetchPdf();

    // Cleanup on unmount or when document changes
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [open, document?.id, instanceId, document]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-5xl flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('preview.title')}
          </DialogTitle>
          <DialogDescription>
            {document?.title ? t('preview.description', { title: document.title }) : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="relative min-h-0 flex-1">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
          )}
          {hasError && (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              {t('preview.loadError')}
            </div>
          )}
          {blobUrl && !hasError && (
            <iframe
              src={blobUrl}
              className="h-full w-full rounded border"
              title={document?.title || 'Document Preview'}
              data-testid="preview-iframe"
            />
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('preview.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
