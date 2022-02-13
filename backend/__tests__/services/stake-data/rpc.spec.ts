import {
  getGeneralStakeUIDataRPC,
  getUserStakeUIDataRPC,
} from '../../../src/services/stake-data/rpc';
import { poolAddress } from '../../mocks';

describe('rpc', () => {
  describe('getUserStakeUIDataRPC', () => {
    it('should return `StakeUserUIData`', async () => {
      const result = await getUserStakeUIDataRPC(poolAddress);
      expect(result).toBeInstanceOf(Object);
      expect(result.starlay).toBeInstanceOf(Object);
      expect(result.starlay.stakeTokenUserBalance).not.toBeUndefined();
      // @ts-ignore
      expect(result.starlay.stakeTokenTotalSupply).toBeUndefined();
      expect(result.bpt).toBeInstanceOf(Object);
      expect(result.bpt.stakeTokenUserBalance).not.toBeUndefined();
      // @ts-ignore
      expect(result.bpt.stakeTokenTotalSupply).toBeUndefined();
      expect(typeof result.usdPriceEth).toEqual('string');
    });
  });

  describe('getGeneralStakeUIDataRPC', () => {
    it('should return `StakeGeneralUIData`', async () => {
      const result = await getGeneralStakeUIDataRPC();
      expect(result).toBeInstanceOf(Object);
      expect(result.starlay).toBeInstanceOf(Object);
      expect(result.starlay.stakeTokenTotalSupply).not.toBeUndefined();
      // @ts-ignore
      expect(result.starlay.stakeTokenUserBalance).toBeUndefined();
      expect(result.bpt).toBeInstanceOf(Object);
      expect(result.bpt.stakeTokenTotalSupply).not.toBeUndefined();
      // @ts-ignore
      expect(result.bpt.stakeTokenUserBalance).toBeUndefined();
      expect(typeof result.usdPriceEth).toEqual('string');
    });
  });
});
