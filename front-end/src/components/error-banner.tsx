import React from 'react';

import type { HTMLAttributes, PropsWithChildren } from 'react';

import { XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface IErrorBanner extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {}

export default function ErrorBanner({ className, children, ...properties }: IErrorBanner) {
  return (
    <div
      className={cn(
        'flex items-center gap-x-2.5 rounded-md bg-destructive px-2.5 py-1.5',
        className
      )}
      {...properties}
    >
      <XCircle className='h-5 w-5 shrink-0 text-destructive-foreground' />
      <p className='text-sm text-destructive-foreground'>{children}</p>
    </div>
  );
}
