import { BACKUP_RPC_URLS, RPC_MAX_TIMEOUT, RPC_URL } from '../../src/config';
import { StarlayCustomProvider } from '../../src/custom-provider/starlay-custom-provider';
import { generate } from '../../src/custom-provider/starlay-provider-manager';

describe('StarlayProviderManager', () => {
  describe('generate', () => {
    it('should generate a new `StarlayCustomProvider`', () => {
      const provider = generate({
        selectedNode: RPC_URL,
        backupNodes: BACKUP_RPC_URLS,
        maxTimout: RPC_MAX_TIMEOUT,
      });

      expect(provider).toBeInstanceOf(StarlayCustomProvider);
    });
  });
});
