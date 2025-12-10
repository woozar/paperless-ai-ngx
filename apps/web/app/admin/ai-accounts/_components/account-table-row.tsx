import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, UserPlus, Trash2 } from 'lucide-react';
import type { AiAccountListItem } from '@repo/api-client';
import { useSettings } from '@/components/settings-provider';
import { ProviderLogo } from '@/components/provider-logo';

type AccountWithPermissions = Omit<AiAccountListItem, 'apiKey'> & {
  canEdit?: boolean;
  canShare?: boolean;
  isOwner?: boolean;
};

type AccountTableRowProps = Readonly<{
  account: AccountWithPermissions;
  onEdit: (account: AccountWithPermissions) => void;
  onDelete: (account: AccountWithPermissions) => void;
  onShare?: (account: AccountWithPermissions) => void;
  formatDate: (dateString: string) => string;
}>;

export const AccountTableRow = memo(function AccountTableRow({
  account,
  onEdit,
  onDelete,
  onShare,
  formatDate,
}: AccountTableRowProps) {
  const t = useTranslations('admin.aiAccounts');
  const tCommon = useTranslations('common');
  const { settings } = useSettings();
  const showShareButton = settings['security.sharing.mode'] === 'ADVANCED';

  // Default to true for backwards compatibility (owner can always edit/share)
  const canEdit = account.canEdit ?? true;
  const canShare = account.canShare ?? account.isOwner ?? true;
  const isOwner = account.isOwner ?? true;

  return (
    <TableRow>
      <TableCell className="font-medium">{account.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ProviderLogo provider={account.provider} size={20} />
          <span>{t(`providerTypes.${account.provider}`)}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(account.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {showShareButton && onShare && canShare && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onShare(account)}
                  data-testid={`share-account-${account.id}`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="sr-only">{tCommon('share')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tCommon('shareTooltip')}</TooltipContent>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(account)}
                  data-testid={`edit-account-${account.id}`}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">{t('editAccount')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('editAccount')}</TooltipContent>
            </Tooltip>
          )}
          {isOwner && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(account)}
                  data-testid={`delete-account-${account.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t('deleteAccount')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('deleteAccount')}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
});
