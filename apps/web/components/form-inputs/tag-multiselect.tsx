'use client';

import { useState, useMemo, useId } from 'react';
import { X, ChevronsUpDown, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type TagOption = {
  id: number;
  name: string;
  documentCount?: number;
};

type TagMultiselectProps = {
  options: TagOption[];
  selected: number[];
  onChange: (selected: number[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  isLoading?: boolean;
  testId?: string;
};

export function TagMultiselect({
  options,
  selected,
  onChange,
  placeholder = 'Select tags...',
  emptyMessage = 'No tags found.',
  disabled = false,
  isLoading = false,
  testId = 'tag-multiselect',
}: Readonly<TagMultiselectProps>) {
  const [open, setOpen] = useState(false);
  const listboxId = useId();

  const selectedTags = useMemo(() => {
    return selected
      .map((id) => options.find((opt) => opt.id === id))
      .filter((tag): tag is TagOption => tag !== undefined);
  }, [selected, options]);

  const handleSelect = (tagId: number) => {
    if (selected.includes(tagId)) {
      onChange(selected.filter((id) => id !== tagId));
    } else {
      onChange([...selected, tagId]);
    }
  };

  const handleRemove = (tagId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((id) => id !== tagId));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          tabIndex={disabled || isLoading ? -1 : 0}
          className={cn(
            'flex h-auto min-h-9 w-full cursor-pointer items-center justify-between rounded-none border-0 bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
            (disabled || isLoading) && 'pointer-events-none opacity-50'
          )}
          data-testid={testId}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(!open);
            }
          }}
        >
          <div className="flex flex-1 flex-wrap gap-2">
            {selectedTags.length > 0 ? (
              selectedTags.map((tag) => (
                <Badge key={tag.id} variant="default" className="gap-0 pr-1 text-xs shadow-sm">
                  {tag.name}
                  {tag.documentCount !== undefined && (
                    <span className="opacity-70">({tag.documentCount})</span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(tag.id, e)}
                    className="inline-flex h-4 cursor-pointer items-center justify-center rounded-full p-0.5 opacity-70 transition-opacity hover:bg-white/20 hover:opacity-100"
                    data-testid={`${testId}-remove-${tag.id}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            )}
          </div>
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} data-testid={`${testId}-search`} />
          <CommandList id={listboxId} role="listbox">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => handleSelect(tag.id)}
                  data-testid={`${testId}-option-${tag.id}`}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.includes(tag.id) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {tag.name}
                  {tag.documentCount !== undefined && (
                    <span className="text-muted-foreground ml-1">({tag.documentCount})</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
