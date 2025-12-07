'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Trash2, Users, User, Loader2, Plus, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Permission, ShareAccessItem } from '@/lib/api/schemas/sharing';
import { useApi } from '@/lib/use-api';
import {
  getAiProvidersByIdSharing,
  postAiProvidersByIdSharing,
  deleteAiProvidersByIdSharingByAccessId,
  getAiBotsByIdSharing,
  postAiBotsByIdSharing,
  deleteAiBotsByIdSharingByAccessId,
  getPaperlessInstancesByIdSharing,
  postPaperlessInstancesByIdSharing,
  deletePaperlessInstancesByIdSharingByAccessId,
  getUsers,
} from '@repo/api-client';

export type ResourceType = 'ai-providers' | 'ai-bots' | 'paperless-instances';

type ShareDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceType: ResourceType;
  resourceId: string;
  resourceName: string;
}>;

type UserOption = {
  id: string;
  username: string;
};

const PERMISSIONS: Permission[] = ['READ', 'WRITE', 'FULL'];
const ALL_USERS_VALUE = '__all_users__';

// API function mappings per resource type
const apiMappings = {
  'ai-providers': {
    getSharing: getAiProvidersByIdSharing,
    postSharing: postAiProvidersByIdSharing,
    deleteSharing: deleteAiProvidersByIdSharingByAccessId,
  },
  'ai-bots': {
    getSharing: getAiBotsByIdSharing,
    postSharing: postAiBotsByIdSharing,
    deleteSharing: deleteAiBotsByIdSharingByAccessId,
  },
  'paperless-instances': {
    getSharing: getPaperlessInstancesByIdSharing,
    postSharing: postPaperlessInstancesByIdSharing,
    deleteSharing: deletePaperlessInstancesByIdSharingByAccessId,
  },
} as const;

export function ShareDialog({
  open,
  onOpenChange,
  resourceType,
  resourceId,
  resourceName,
}: ShareDialogProps) {
  const t = useTranslations('sharing');
  const tErrors = useTranslations('errors');
  const client = useApi();

  const [shares, setShares] = useState<ShareAccessItem[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  // New share row state
  const [newUserValue, setNewUserValue] = useState<string>('');
  const [newPermission, setNewPermission] = useState<Permission>('READ');
  const [isAdding, setIsAdding] = useState(false);

  const api = apiMappings[resourceType];

  // Load shares when dialog opens
  useEffect(() => {
    if (open) {
      loadShares();
      loadUsers();
    } else {
      // Reset form when dialog closes
      setNewUserValue('');
      setNewPermission('READ');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, resourceType, resourceId]);

  const loadShares = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await api.getSharing({
        client,
        path: { id: resourceId },
      });
      if (data) {
        setShares(data.items);
      }
      // v8 ignore next -- @preserve: API returns either data or error, never both undefined
      if (!data && error) toast.error(t('error.loadFailed'));
    } catch {
      toast.error(t('error.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [api, client, resourceId, t]);

  const loadUsers = useCallback(async () => {
    try {
      const { data } = await getUsers({
        client,
        query: { limit: 100 },
      });
      if (data) {
        setUsers(
          data.items.map((u) => ({
            id: u.id,
            username: u.username,
          }))
        );
      }
    } catch {
      // Silent fail - users dropdown will be empty
    }
  }, [client]);

  // Filter out users that already have shares
  const availableUsers = users.filter((user) => !shares.some((share) => share.userId === user.id));

  // Check if "all users" share already exists
  const allUsersShareExists = shares.some((share) => share.userId === null);

  const handlePermissionChange = async (shareId: string, newPermission: Permission) => {
    const share = shares.find((s) => s.id === shareId);
    /* v8 ignore next -- @preserve Defensive guard: share always exists when called from UI, permission never same due to Select behavior */
    if (!share || share.permission === newPermission) return;

    setSavingId(shareId);
    try {
      const { data, error } = await api.postSharing({
        client,
        path: { id: resourceId },
        body: {
          userId: share.userId,
          permission: newPermission,
        },
      });

      if (data) {
        setShares((prev) => prev.map((s) => (s.id === data.id ? data : s)));
        toast.success(t('shareUpdated'));
      }
      // v8 ignore next -- @preserve: API returns either data or error, never both undefined
      if (!data && error) toast.error(tErrors(error.message));
    } catch {
      toast.error(t('error.updateFailed'));
    } finally {
      setSavingId(null);
    }
  };

  const handleAddShare = async () => {
    /* v8 ignore next -- @preserve Defensive guard: button is disabled when newUserValue is empty */
    if (!newUserValue) return;

    const userId = newUserValue === ALL_USERS_VALUE ? null : newUserValue;

    setIsAdding(true);
    try {
      const { data, error } = await api.postSharing({
        client,
        path: { id: resourceId },
        body: {
          userId,
          permission: newPermission,
        },
      });

      if (data) {
        setShares((prev) => [...prev, data]);
        toast.success(t('shareAdded'));
        // Reset new row
        setNewUserValue('');
        setNewPermission('READ');
      }
      // v8 ignore next -- @preserve: API returns either data or error, never both undefined
      if (!data && error) toast.error(tErrors(error.message));
    } catch {
      toast.error(t('error.addFailed'));
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveShare = async (accessId: string) => {
    setSavingId(accessId);
    try {
      const { error } = await api.deleteSharing({
        client,
        path: { id: resourceId, accessId },
      });

      if (error) {
        toast.error(t('error.removeFailed'));
      } else {
        setShares((prev) => prev.filter((s) => s.id !== accessId));
        toast.success(t('shareRemoved'));
      }
    } catch {
      toast.error(t('error.removeFailed'));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{resourceName}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('user')}</TableHead>
                <TableHead>{t('permission')}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Existing shares */}
              {shares.map((share) => (
                <TableRow key={share.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {share.userId === null ? (
                        <Users className="text-muted-foreground h-4 w-4" />
                      ) : (
                        <User className="text-muted-foreground h-4 w-4" />
                      )}
                      <span className="text-sm">
                        {share.userId === null ? t('allUsers') : share.username}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={share.permission}
                      onValueChange={(value) =>
                        handlePermissionChange(share.id, value as Permission)
                      }
                      disabled={savingId === share.id}
                    >
                      <SelectTrigger
                        className="h-8 w-[120px]"
                        data-testid={`permission-select-${share.id}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PERMISSIONS.map((perm) => (
                          <SelectItem key={perm} value={perm}>
                            {t(`permissions.${perm}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveShare(share.id)}
                      disabled={savingId === share.id}
                      data-testid={`remove-share-${share.id}`}
                    >
                      {savingId === share.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {/* Add new share row */}
              <TableRow>
                <TableCell>
                  <Select value={newUserValue} onValueChange={setNewUserValue} disabled={isAdding}>
                    <SelectTrigger className="h-8 w-full" data-testid="new-share-user-select">
                      <SelectValue
                        placeholder={
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            {t('addShare')}
                          </span>
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {!allUsersShareExists && (
                        <SelectItem value={ALL_USERS_VALUE}>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {t('allUsers')}
                          </div>
                        </SelectItem>
                      )}
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {user.username}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={newPermission}
                    onValueChange={(value) => setNewPermission(value as Permission)}
                    disabled={isAdding}
                  >
                    <SelectTrigger
                      className="h-8 w-[120px]"
                      data-testid="new-share-permission-select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PERMISSIONS.map((perm) => (
                        <SelectItem key={perm} value={perm}>
                          {t(`permissions.${perm}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleAddShare}
                    disabled={!newUserValue || isAdding}
                    data-testid="add-share-button"
                  >
                    {isAdding ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>

              {/* Empty state message */}
              {shares.length === 0 && !isAdding && (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground py-4 text-center">
                    {t('noShares')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
