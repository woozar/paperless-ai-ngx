'use client';

import * as React from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { PASSWORD_REQUIREMENTS, checkRequirement } from '@/lib/utilities/password-validation';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showRules?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showRules = false, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState('');
    const t = useTranslations('passwordRequirements');

    const currentValue = value?.toString() ?? internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            className={cn('pr-10', className)}
            ref={ref}
            value={value}
            onChange={handleChange}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {showRules && (
          <div className="text-muted-foreground space-y-1 text-sm">
            {PASSWORD_REQUIREMENTS.map((requirement) => {
              const isMet = checkRequirement(currentValue, requirement.key);
              return (
                <div key={requirement.key} className="flex items-center gap-2">
                  {isMet ? (
                    <Check className="h-4 w-4 shrink-0 text-green-600" />
                  ) : (
                    <X className="text-muted-foreground h-4 w-4 shrink-0" />
                  )}
                  <span className={cn(isMet && 'text-green-600')}>{t(requirement.key)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
