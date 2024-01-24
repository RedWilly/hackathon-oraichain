import React, { useEffect, useState } from 'react';

import { DialogDescription } from '@radix-ui/react-dialog';
import { sepolia } from 'viem/chains';
import { useAccount, useSwitchChain } from 'wagmi';

import { mapViemErrorToMessage } from '@/lib/errors-mapper';

import ErrorBanner from './error-banner';
import LoadingButton from './loading-button';
import SuccessfulTransaction from './successful-transaction';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const requiredChain = 'Sepolia';

export default function IncompatibleChainDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { isConnected, chainId } = useAccount();
  const {
    isPending: isSwitching,
    isSuccess: isSwitchSuccess,
    reset,
    switchChainAsync
  } = useSwitchChain();

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isConnected && chainId !== sepolia.id) {
      reset();
      setIsDialogOpen(true);
    }
  }, [isConnected, chainId, reset]);

  async function onSwitchChainClick() {
    try {
      setErrorMessage(undefined);

      await switchChainAsync({ chainId: sepolia.id });
    } catch (error: unknown) {
      const errorMessage = mapViemErrorToMessage(error);
      setErrorMessage(errorMessage);

      console.error('Error switching chain', error);
    }
  }

  function onDialogOpenChange(isOpen: boolean) {
    if (chainId !== sepolia.id) {
      return;
    }

    setIsDialogOpen(isOpen);
    setErrorMessage(undefined);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogContent>
        {isSwitchSuccess ? (
          <SuccessfulTransaction
            content={`Switched to ${requiredChain} successfully`}
            onCloseClick={() => setIsDialogOpen(false)}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Ooops, incompatible chain</DialogTitle>

              <DialogDescription className='text-sm'>
                For the time being, our application is compatible only with the {requiredChain}{' '}
                chain. In order to continue using our application, please switch your chain to{' '}
                {requiredChain} by using the button below.
              </DialogDescription>
            </DialogHeader>

            {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

            <LoadingButton
              isLoading={isSwitching}
              loadingContent={`Switching to ${requiredChain}`}
              defaultContent={`Switch to ${requiredChain}`}
              disabled={isSwitching}
              onClick={onSwitchChainClick}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
