'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Check, Minus } from 'lucide-react';
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
        const isAssigned = 'isAssigned' in tag && tag.isAssigned === true;
        const isRemoved = 'isRemoved' in tag && tag.isRemoved === true;
        // v8 ignore next -- @preserve - defensive fallback for tags without name
        const displayName = tag.name ?? (isExisting ? `#${tag.id}` : '');

        // Four states:
        // 1. Removed (red) - tag is on document but AI doesn't suggest it, will be removed
        // 2. Already assigned (gray) - no action needed
        // 3. Existing but not assigned (blue) - will be added
        // 4. New tag (green) - will be created and added
        let className: string;
        let title: string;
        let prefix: React.ReactNode = null;

        if (isRemoved) {
          className = 'border-red-500 text-red-700 dark:text-red-400';
          title = t('analyze.removedTag');
          prefix = <Minus className="mr-1 h-3 w-3" />;
        } else if (isAssigned) {
          className = 'border-gray-400 text-gray-500 dark:text-gray-400';
          title = t('analyze.alreadyAssignedTag');
          prefix = <Check className="mr-1 h-3 w-3" />;
        } else if (isExisting) {
          className = 'border-blue-500 text-blue-700 dark:text-blue-400';
          title = t('analyze.existingTag');
        } else {
          className = 'border-green-500 text-green-700 dark:text-green-400';
          title = t('analyze.newTag');
          prefix = <span className="mr-1 text-xs opacity-70">+</span>;
        }

        return (
          <Badge
            key={isExisting ? tag.id : `new-${index}`}
            variant="outline"
            className={className}
            title={title}
          >
            {prefix}
            {displayName}
          </Badge>
        );
      })}
    </div>
  );
}
