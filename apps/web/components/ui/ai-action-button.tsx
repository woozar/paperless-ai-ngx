import * as React from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

const AiActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled}
        className={cn(
          'relative overflow-hidden border-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0',
          'group',
          className
        )}
        {...props}
      >
        {/* Animated Rainbow Gradient Background */}
        <span
          className={cn(
            'absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FF0000_0%,#FF7F00_14%,#FFFF00_28%,#00FF00_42%,#0000FF_57%,#4B0082_71%,#9400D3_85%,#FF0000_100%)]',
            disabled && 'grayscale'
          )}
        />

        {/* Inner Content Mask - matches button background */}
        <span className="bg-background/90 group-hover:bg-background/95 absolute inset-[2px] rounded-md transition-colors" />

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </Button>
    );
  }
);
AiActionButton.displayName = 'AiActionButton';

export { AiActionButton };
