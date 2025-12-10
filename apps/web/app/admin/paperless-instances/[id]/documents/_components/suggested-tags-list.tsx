'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import type { SuggestedTag } from '@repo/api-client';

type SuggestedTagsListProps = Readonly<{
  tags: SuggestedTag[];
}>;

export function SuggestedTagsList({ tags }: SuggestedTagsListProps) {
  const t = useTranslations('admin.documents');

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {tags.map((tag, index) => {
        const isExisting = 'id' in tag;
        // v8 ignore next -- @preserve - defensive fallback for tags without name
        const displayName = tag.name ?? (isExisting ? `#${tag.id}` : '');
        return (
          <Badge
            key={isExisting ? tag.id : `new-${index}`}
            variant="outline"
            className={
              isExisting
                ? 'border-blue-500 text-blue-700 dark:text-blue-400'
                : 'border-green-500 text-green-700 dark:text-green-400'
            }
            title={isExisting ? t('analyze.existingTag') : t('analyze.newTag')}
          >
            {!isExisting && <span className="mr-1 text-xs opacity-70">+</span>}
            {displayName}
          </Badge>
        );
      })}
    </div>
  );
}
