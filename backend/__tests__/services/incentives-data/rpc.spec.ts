import { ReserveIncentivesData } from '../../../src/graphql/object-types/incentives';
import { UserIncentivesData } from '../../../src/graphql/object-types/user-incentives';
import {
  getPoolIncentivesRPC,
  getUserPoolIncentivesRPC,
} from '../../../src/services/incentives-data/rpc';
import { poolAddress, userAddress } from '../../mocks';

describe('rpc', () => {
  describe('getPoolIncentivesRPC', () => {
    it('should return `Incentives Data`', async () => {
      const result: ReserveIncentivesData[] = await getPoolIncentivesRPC({
        lendingPoolAddressProvider: poolAddress,
      });
      expect(result).toBeInstanceOf(Array);
      const response = result[0];
      expect(response).toBeInstanceOf(Object);
      expect(response.lIncentiveData).toBeInstanceOf(Object);
      expect(response.vdIncentiveData).toBeInstanceOf(Object);
      expect(response.sdIncentiveData).toBeInstanceOf(Object);
      expect(typeof response.lIncentiveData.emissionPerSecond).toEqual('string');
      expect(typeof response.lIncentiveData.emissionEndTimestamp).toEqual('number');
    });
  });

  describe('getUserPoolIncentivesRPC', () => {
    jest.setTimeout(20000);
    it('should return `User Incentives Data`', async () => {
      const result: UserIncentivesData[] = await getUserPoolIncentivesRPC(poolAddress, userAddress);
      expect(result).toBeInstanceOf(Array);
      const response = result[0];
      expect(response).toBeInstanceOf(Object);
      expect(response.lTokenIncentivesUserData).toBeInstanceOf(Object);
      expect(response.vdTokenIncentivesUserData).toBeInstanceOf(Object);
      expect(response.sdTokenIncentivesUserData).toBeInstanceOf(Object);
      expect(typeof response.lTokenIncentivesUserData.incentiveControllerAddress).toEqual('string');
    });
  });
});
