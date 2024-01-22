import React, { useEffect, useState } from 'react';

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

const mockedABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'maxSupply_',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'buyFee_',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'sellFee_',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'liquidityFee_',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'antiWhaleLimit_',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'antiWhaleLimit',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'buyFeePercentage',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'liquidityFeePercentage',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'liquidityWallet',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'sellFeePercentage',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

interface IContructorArgument {
  name: string;
  type: string;
}

type TContructorArgumentValue = Record<string, string>;

export default function DeploymentDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [constructorArguments, setConstructorArguments] = useState<IContructorArgument[]>([]);
  const [constructorArgumentsValue, setConstructorArgumentsValue] =
    useState<TContructorArgumentValue>({});

  useEffect(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    () => {
      for (const element of mockedABI) {
        if (
          element !== null &&
          element !== undefined &&
          'type' in element &&
          typeof element.type === 'string' &&
          element.type === 'constructor'
        ) {
          const constructor = element;

          if (
            constructor !== null &&
            constructor !== undefined &&
            'inputs' in constructor &&
            Array.isArray(constructor.inputs)
          ) {
            const _constructorArguments: IContructorArgument[] = [];
            const _constructorArgumentsValue: TContructorArgumentValue = {};

            const constructorArguments = constructor.inputs;

            for (const argument of constructorArguments) {
              if (
                argument !== null &&
                argument !== undefined &&
                typeof argument === 'object' &&
                'name' in argument &&
                typeof argument.name === 'string' &&
                'type' in argument &&
                typeof argument.type === 'string'
              ) {
                _constructorArguments.push({
                  name: argument.name,
                  type: argument.type
                });
                _constructorArgumentsValue[argument.name] = '';
              }
            }

            setConstructorArguments(_constructorArguments);
            setConstructorArgumentsValue(_constructorArgumentsValue);
          }

          break;
        }
      }
    },
    [
      /* ABI */
    ]
  );

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
                  type={argument.type}
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
          <Button className='w-full'>Deploy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
