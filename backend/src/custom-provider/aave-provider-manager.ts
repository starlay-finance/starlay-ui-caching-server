import { AaveCustomProvider } from './aave-custom-provider';
import { InternalStarlayProviderContext } from './models/internal-starlay-provider-context';
import { StarlayProviderContext } from './models/starlay-provider-context';

export const generate: (context: StarlayProviderContext) => AaveCustomProvider = (
  context: StarlayProviderContext
) => {
  return new AaveCustomProvider(context, internalGenerate);
};

const internalGenerate: (context: InternalStarlayProviderContext) => AaveCustomProvider = (
  context: StarlayProviderContext
) => {
  return new AaveCustomProvider(context, internalGenerate);
};
