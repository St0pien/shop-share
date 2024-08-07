import * as React from 'react';

import { cn } from '@/lib/utils';

interface CustomProps {
  icon?: React.ReactNode;
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  CustomProps;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className='relative w-full'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2'>{icon}</div>
        <input
          type={type}
          className={cn(
            'focus-visible: flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            'peer border-2 bg-neutral-dark focus-visible:border-primary',
            icon && 'pl-10',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
