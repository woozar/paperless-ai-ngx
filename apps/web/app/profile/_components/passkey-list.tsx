'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Key, Trash2, Pencil, Laptop, Smartphone, Clock, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { useApi } from '@/lib/use-api';
import {
  getAuthWebauthnCredentials,
  patchAuthWebauthnCredentialsById,
  deleteAuthWebauthnCredentialsById,
  type WebAuthnCredential,
} from '@repo/api-client';
import { RegisterPasskeyButton } from './register-passkey-button';
import { RenamePasskeyDialog } from './rename-passkey-dialog';
import { DeletePasskeyDialog } from './delete-passkey-dialog';

export function PasskeyList() {
  const t = useTranslations('profile.passkeys');
  const { showError } = useErrorDisplay('profile.passkeys');
  const client = useApi();
  const [credentials, setCredentials] = useState<WebAuthnCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<WebAuthnCredential | null>(null);

  const loadCredentials = useCallback(async () => {
    const { data, error } = await getAuthWebauthnCredentials({ client });
    if (error) {
      showError('loadFailed');
    } else if (data) {
      setCredentials(data.credentials);
    }
    setIsLoading(false);
  }, [client, showError]);

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  const handleRename = (credential: WebAuthnCredential) => {
    setSelectedCredential(credential);
    setRenameDialogOpen(true);
  };

  const handleDelete = (credential: WebAuthnCredential) => {
    setSelectedCredential(credential);
    setDeleteDialogOpen(true);
  };

  const handleRenameSuccess = async (id: string, name: string) => {
    const { error } = await patchAuthWebauthnCredentialsById({
      client,
      path: { id },
      body: { name },
    });

    if (error) {
      showError('renameFailed');
    } else {
      toast.success(t('renamed'));
      setRenameDialogOpen(false);
      loadCredentials();
    }
  };

  const handleDeleteSuccess = async (id: string) => {
    const { error } = await deleteAuthWebauthnCredentialsById({
      client,
      path: { id },
    });

    if (error) {
      showError('deleteFailed');
    } else {
      toast.success(t('deleted'));
      setDeleteDialogOpen(false);
      loadCredentials();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType === 'multiDevice') {
      return <Smartphone className="h-5 w-5" />;
    }
    return <Laptop className="h-5 w-5" />;
  };

  const getCredentialName = (credential: WebAuthnCredential, index: number) => {
    if (credential.name) return credential.name;
    return `${t('defaultName')} ${index + 1}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {credentials.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Key className="text-muted-foreground mb-3 h-12 w-12" />
            <p className="text-muted-foreground mb-4">{t('noPasskeys')}</p>
            <RegisterPasskeyButton onSuccess={loadCredentials} />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {credentials.map((credential, index) => (
              <Card key={credential.id} className="bg-muted/30">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                      {getDeviceIcon(credential.deviceType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{getCredentialName(credential, index)}</span>
                        {credential.backedUp && (
                          <span title={t('backedUp')}>
                            <ShieldCheck className="text-success h-4 w-4" />
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t('createdAt', { date: formatDate(credential.createdAt) })}
                        </span>
                        {credential.lastUsedAt && (
                          <span>{t('lastUsed', { date: formatDate(credential.lastUsedAt) })}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRename(credential)}
                      title={t('rename')}
                      data-testid={`rename-passkey-${credential.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(credential)}
                      title={t('delete')}
                      className="hover:text-destructive"
                      data-testid={`delete-passkey-${credential.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <RegisterPasskeyButton onSuccess={loadCredentials} />
        </>
      )}

      {selectedCredential && (
        <>
          <RenamePasskeyDialog
            open={renameDialogOpen}
            onOpenChange={setRenameDialogOpen}
            credential={selectedCredential}
            onRename={handleRenameSuccess}
          />
          <DeletePasskeyDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            credential={selectedCredential}
            onDelete={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  );
}
