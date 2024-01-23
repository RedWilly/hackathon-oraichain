import React from 'react';

import type { HTMLAttributes, PropsWithChildren } from 'react';

import { AlertTriangle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface IErrorBanner extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {}

export default function ErrorBanner({ className, children, ...properties }: IErrorBanner) {
  return (
    <div
      className={cn(
        'flex items-center gap-x-2.5 rounded-md bg-destructive px-2.5 py-1.5 text-sm text-destructive-foreground',
        className
      )}
      {...properties}
    >
      <AlertTriangle className='h-5 w-5 shrink-0' />
      <p>{children}</p>
    </div>
  );
}
