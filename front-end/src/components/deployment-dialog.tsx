import React, { useState } from 'react';

import { type TConstructorArgument, type TConstructorArgumentValue } from './sections/code-viewer';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

type TDeploymentDialog = {
  constructorArguments: TConstructorArgument[];
  constructorArgumentsValue: TConstructorArgumentValue;
  setConstructorArgumentsValue: React.Dispatch<React.SetStateAction<TConstructorArgumentValue>>;
  onDeployClick: () => void;
};

export default function DeploymentDialog({
  constructorArguments,
  constructorArgumentsValue,
  setConstructorArgumentsValue,
  onDeployClick
}: TDeploymentDialog) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function onConstructorArgumentValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setConstructorArgumentsValue({ ...constructorArgumentsValue, [name]: value });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Deploy Smart Contract</Button>
      </DialogTrigger>

      <DialogContent className='max-h-[calc(100%-5rem)] overflow-y-auto '>
        <DialogHeader>
          <DialogTitle>Deploy Smart Contract</DialogTitle>
          <DialogDescription>Provide the arguments for the constractor.</DialogDescription>
        </DialogHeader>

        <form className='flex flex-col gap-y-5'>
          {constructorArguments.map((argument, index) => (
            <div key={`${argument.name}-${index}`} className='flex flex-col gap-y-2.5'>
              <Label htmlFor={argument.name}>
                <span>{argument.name}</span>
              </Label>

              <div className='relative'>
                <Input
                  id={argument.name}
                  name={argument.name}
                  value={constructorArgumentsValue[argument.name]}
                  placeholder={`Fill in ${argument.name} argument`}
                  onChange={onConstructorArgumentValueChange}
                />

                <span className='absolute right-0 top-0 flex h-full items-center justify-center rounded-r-md border-y border-r bg-background px-1.5 pr-3 text-xs text-muted-foreground'>
                  {argument.type}
                </span>
              </div>
            </div>
          ))}
        </form>

        <DialogFooter className='mt-5'>
          <Button className='w-full' onClick={onDeployClick}>
            Deploy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
