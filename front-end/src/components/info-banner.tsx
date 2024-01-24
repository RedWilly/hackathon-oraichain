import React from 'react';

import type { HTMLAttributes, PropsWithChildren } from 'react';

import { InfoIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface IInfoBanner extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {}

export default function InfoBanner({ className, children, ...properties }: IInfoBanner) {
  return (
    <div
      className={cn('flex items-center gap-x-2.5 rounded-md bg-secondary px-2.5 py-1', className)}
      {...properties}
    >
      <InfoIcon className='h-5 w-5 shrink-0 text-secondary-foreground' />
      <p className='text-sm text-secondary-foreground'>{children}</p>
    </div>
  );
}
