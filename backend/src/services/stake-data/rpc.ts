import { StakeGeneralUIData } from '../../graphql/object-types/stake-general-data';
import { StakeUserUIData } from '../../graphql/object-types/stake-user-data';
import StakeUiHelperI from './contract';

/**
 * Get the stake user data using rpc
 * @param userAddress The user address
 */
export const getUserStakeUIDataRPC = async (userAddress: string): Promise<StakeUserUIData> => {
  const { 0: starlay, 1: bpt, 2: usdPriceEth } = await StakeUiHelperI!.getUserStakeUIData(userAddress);

  return {
    starlay: {
      stakeTokenUserBalance: starlay.stakeTokenUserBalance.toHexString(),
      underlyingTokenUserBalance: starlay.underlyingTokenUserBalance.toHexString(),
      userCooldown: starlay.userCooldown.toNumber(),
      userIncentivesToClaim: starlay.userIncentivesToClaim.toHexString(),
      userPermitNonce: starlay.userPermitNonce.toHexString(),
    },
    bpt: {
      stakeTokenUserBalance: bpt.stakeTokenUserBalance.toHexString(),
      underlyingTokenUserBalance: bpt.underlyingTokenUserBalance.toHexString(),
      userCooldown: bpt.userCooldown.toNumber(),
      userIncentivesToClaim: bpt.userIncentivesToClaim.toHexString(),
      userPermitNonce: bpt.userPermitNonce.toHexString(),
    },
    usdPriceEth: usdPriceEth.toHexString(),
  };
};

/**
 * Get the stake general data using rpc
 */
export const getGeneralStakeUIDataRPC = async (): Promise<StakeGeneralUIData> => {
  const { 0: starlay, 1: bpt, 2: usdPriceEth } = await StakeUiHelperI!.getGeneralStakeUIData();

  return {
    starlay: {
      stakeTokenTotalSupply: starlay.stakeTokenTotalSupply.toHexString(),
      stakeCooldownSeconds: starlay.stakeCooldownSeconds.toNumber(),
      stakeUnstakeWindow: starlay.stakeUnstakeWindow.toNumber(),
      stakeTokenPriceEth: starlay.stakeTokenPriceEth.toHexString(),
      rewardTokenPriceEth: starlay.rewardTokenPriceEth.toHexString(),
      stakeApy: starlay.stakeApy.toHexString(),
      distributionPerSecond: starlay.distributionPerSecond.toHexString(),
      distributionEnd: starlay.distributionEnd.toHexString(),
    },
    bpt: {
      stakeTokenTotalSupply: bpt.stakeTokenTotalSupply.toHexString(),
      stakeCooldownSeconds: bpt.stakeCooldownSeconds.toNumber(),
      stakeUnstakeWindow: bpt.stakeUnstakeWindow.toNumber(),
      stakeTokenPriceEth: bpt.stakeTokenPriceEth.toHexString(),
      rewardTokenPriceEth: bpt.rewardTokenPriceEth.toHexString(),
      stakeApy: bpt.stakeApy.toHexString(),
      distributionPerSecond: bpt.distributionPerSecond.toHexString(),
      distributionEnd: bpt.distributionEnd.toHexString(),
    },
    usdPriceEth: usdPriceEth.toHexString(),
  };
};
