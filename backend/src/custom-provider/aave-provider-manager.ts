import { AaveCustomProvider } from './aave-custom-provider';
import { InternalAaveProviderContext } from './models/internal-aave-provider-context';
import { StarlayProviderContext } from './models/starlay-provider-context';

export const generate: (context: StarlayProviderContext) => AaveCustomProvider = (
  context: StarlayProviderContext
) => {
  return new AaveCustomProvider(context, internalGenerate);
};

const internalGenerate: (context: InternalAaveProviderContext) => AaveCustomProvider = (
  context: StarlayProviderContext
) => {
  return new AaveCustomProvider(context, internalGenerate);
};
