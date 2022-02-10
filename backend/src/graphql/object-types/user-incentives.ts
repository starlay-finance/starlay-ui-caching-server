import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class TokenIncentivesUserData {
  @Field()
  tokenIncentivesUserIndex: string;

  @Field()
  userUnclaimedRewards: string;

  @Field()
  tokenAddress: string;

  @Field()
  rewardTokenAddress: string;

  @Field()
  rewardTokenDecimals: number;

  @Field()
  incentiveControllerAddress: string;
}

@ObjectType()
export class UserIncentivesData {
  @Field()
  underlyingAsset: string;

  @Field(() => TokenIncentivesUserData)
  lTokenIncentivesUserData: TokenIncentivesUserData;

  @Field(() => TokenIncentivesUserData)
  vdTokenIncentivesUserData: TokenIncentivesUserData;

  @Field(() => TokenIncentivesUserData)
  sdTokenIncentivesUserData: TokenIncentivesUserData;
}
