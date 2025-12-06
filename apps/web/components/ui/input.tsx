import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/50 flex h-9 w-full rounded-none border-0 bg-gray-200 px-3 py-1.5 text-sm text-gray-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
