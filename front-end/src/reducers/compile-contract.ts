import type IArtifact from '@/interfaces/artifact';

import EReducerState from '@/constants/reducer-state';

const compileContractInitialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  artifact: null as IArtifact | null,
  errorMessage: null as string | null
};

type TCompileContractState = typeof compileContractInitialState;

interface ICompileContractAction {
  state: EReducerState;
  payload: IArtifact | string | null;
}

function compileContractReducer(state: TCompileContractState, action: ICompileContractAction) {
  switch (action.state) {
    case EReducerState.start: {
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        artifact: null,
        errorMessage: null
      };
    }
    case EReducerState.success: {
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        artifact: action.payload as IArtifact,
        errorMessage: null
      };
    }
    case EReducerState.error: {
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        artifact: null,
        errorMessage: action.payload as string
      };
    }
    case EReducerState.reset: {
      return {
        isLoading: false,
        isError: false,
        isSuccess: false,
        artifact: null,
        errorMessage: null
      };
    }
    default: {
      return state;
    }
  }
}

export type { TCompileContractState, ICompileContractAction };
export { compileContractInitialState, compileContractReducer };
