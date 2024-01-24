/* eslint-disable semi */

import type { Abi, Hex } from 'viem';

export default interface IArtifact {
  abi: Abi;
  bytecode: Hex;
}
