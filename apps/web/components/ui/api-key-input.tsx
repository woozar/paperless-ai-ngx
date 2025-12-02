import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';

export type ApiKeyInputProps = React.ComponentProps<'input'>;

const ApiKeyInput = React.forwardRef<HTMLInputElement, ApiKeyInputProps>(
  ({ className, ...props }, ref) => {
    const [showKey, setShowKey] = React.useState(false);

    return (
      <div className="relative">
        <Input
          type={showKey ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          autoComplete="off"
          data-1p-ignore="true"
          data-lpignore="true"
          data-form-type="other"
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowKey((prev) => !prev)}
          tabIndex={-1}
        >
          {showKey ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">{showKey ? 'Hide API key' : 'Show API key'}</span>
        </Button>
      </div>
    );
  }
);

ApiKeyInput.displayName = 'ApiKeyInput';

export { ApiKeyInput };
