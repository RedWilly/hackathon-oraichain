import React, { useState } from 'react';

import type IArtifact from '@/interfaces/artifact';

import { Loader2 } from 'lucide-react';

import DownloadButton from './download-button';

export default function DownloadArtifactsButton(_artifact: IArtifact) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DownloadButton
      className='w-40'
      onButtonClick={async () => {
        setIsLoading(true);

        // TODO: Make Deploymnet

        setIsLoading(false);
      }}
    >
      {isLoading ? (
        <div className='flex items-center gap-x-2.5'>
          <Loader2 className='animate-spin' />
          <span>Downloading Artifacts</span>
        </div>
      ) : (
        <span>Download Artifacts</span>
      )}
    </DownloadButton>
  );
}
