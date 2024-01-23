import React, { useEffect, useState } from 'react';

import type IArtifact from '@/interfaces/artifact';

import { encodeDeployData } from 'viem';

import { account, publicClient, walletClient } from '@/providers/wagmi';

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

const mockedBytecode =
  '0x608060405234801561000f575f80fd5b5060405161030338038061030383398181016040528101906100319190610094565b845f8190555083600181905550826002819055508160038190555080600481905550505050505061010b565b5f80fd5b5f819050919050565b61007381610061565b811461007d575f80fd5b50565b5f8151905061008e8161006a565b92915050565b5f805f805f60a086880312156100ad576100ac61005d565b5b5f6100ba88828901610080565b95505060206100cb88828901610080565b94505060406100dc88828901610080565b93505060606100ed88828901610080565b92505060806100fe88828901610080565b9150509295509295909350565b6101eb806101185f395ff3fe608060405234801561000f575f80fd5b5060043610610055575f3560e01c80631234f86814610059578063601d495814610077578063d44545e714610095578063d4698016146100b3578063e208a939146100d1575b5f80fd5b6100616100ef565b60405161006e9190610144565b60405180910390f35b61007f6100f5565b60405161008c9190610144565b60405180910390f35b61009d6100fb565b6040516100aa9190610144565b60405180910390f35b6100bb610101565b6040516100c8919061019c565b60405180910390f35b6100d9610126565b6040516100e69190610144565b60405180910390f35b60045481565b60035481565b60015481565b60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60025481565b5f819050919050565b61013e8161012c565b82525050565b5f6020820190506101575f830184610135565b92915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6101868261015d565b9050919050565b6101968161017c565b82525050565b5f6020820190506101af5f83018461018d565b9291505056fea2646970667358221220018b4e4ac269db3d55b5c938e0db0610704e1723c3b43ad1aaa413ad4992eff164736f6c63430008140033';

type TConstructorArgument = {
  name: string;
  type: string;
};

type TConstructorArgumentValue = Record<string, string>;

type TDeploymentDialog = {
  contractArtifacts: IArtifact;
};

export default function DeploymentDialog({ contractArtifacts }: TDeploymentDialog) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [constructorArguments, setConstructorArguments] = useState<TConstructorArgument[]>([]);
  const [constructorArgumentsValue, setConstructorArgumentsValue] =
    useState<TConstructorArgumentValue>({});

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
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
          const _constructorArguments: TConstructorArgument[] = [];
          const _constructorArgumentsValue: TConstructorArgumentValue = {};

          for (const input of constructor.inputs) {
            if (
              input !== null &&
              input !== undefined &&
              typeof input === 'object' &&
              'name' in input &&
              typeof input.name === 'string' &&
              'type' in input &&
              typeof input.type === 'string'
            ) {
              _constructorArguments.push({
                name: input.name,
                type: input.type
              });
              _constructorArgumentsValue[input.name] = '';
            }
          }

          setConstructorArguments(_constructorArguments);
          setConstructorArgumentsValue(_constructorArgumentsValue);
        }

        break;
      }
    }
  }, [contractArtifacts]);

  function onConstructorArgumentValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setConstructorArgumentsValue({ ...constructorArgumentsValue, [name]: value });
  }

  async function deployContract() {
    try {
      const data = encodeDeployData({
        abi: mockedABI,
        bytecode: mockedBytecode,
        args: Object.values(constructorArgumentsValue)
      });

      const estimateGas = await publicClient.estimateGas({
        to: null,
        account,
        data
      });

      const hash = await walletClient.deployContract({
        abi: mockedABI,
        account,
        bytecode: mockedBytecode,
        args: Object.values(constructorArgumentsValue),
        gas: estimateGas
      });

      const transactionReceipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('transactionReceipt', transactionReceipt);
    } catch (error: unknown) {
      console.error('Error deploying smart contract', error);
    }
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
          <Button className='w-full' onClick={deployContract}>
            Deploy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
