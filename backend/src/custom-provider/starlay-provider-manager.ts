import { InternalStarlayProviderContext } from './models/internal-starlay-provider-context';
import { StarlayProviderContext } from './models/starlay-provider-context';
import { StarlayCustomProvider } from './starlay-custom-provider';

export const generate: (context: StarlayProviderContext) => StarlayCustomProvider = (
  context: StarlayProviderContext
) => {
  return new StarlayCustomProvider(context, internalGenerate);
};

const internalGenerate: (context: InternalStarlayProviderContext) => StarlayCustomProvider = (
  context: StarlayProviderContext
) => {
  return new StarlayCustomProvider(context, internalGenerate);
};
