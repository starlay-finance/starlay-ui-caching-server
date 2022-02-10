import { EnvVar } from 'cdk8s-plus-17/lib/imports/k8s';

export const envVars = (target: Environments): EnvVar[] => {
  const { rpcUrl, chain } = valueOf(target);
  return [
    {
      name: 'REDIS_HOST',
      value: 'redis',
    },
    {
      name: 'RPC_URL',
      value: rpcUrl,
    },
    {
      name: 'CHAIN_ID',
      value: `${chain.chainId}`,
    },
  ];
};

export enum Environments {
  PROD = 'prod',
  DEV = 'dev',
  TEST = 'test',
}

export interface EnvironmentVariables {
  rootDomain: string;
  projectId: string;
  chain: {
    chainId: number;
    name: string;
  };
  rpcUrl: string;
}

const EnvironmentVariablesSetting: {
  [key in Environments]: EnvironmentVariables;
} = {
  [Environments.PROD]: {
    rootDomain: 'vein.finance',
    projectId: '',
    chain: {
      chainId: 137,
      name: 'polygon',
    },
    rpcUrl: 'https://polygon-rpc.com',
  },
  [Environments.DEV]: {
    rootDomain: 'vein-dev.tk',
    projectId: 'vein-dev-339807',
    chain: {
      chainId: 81,
      name: 'shibuya',
    },
    rpcUrl: 'https://rpc.shibuya.astar.network:8545',
  },
  [Environments.TEST]: {
    rootDomain: 'test.example.com',
    projectId: '',
    chain: {
      chainId: 137,
      name: 'polygon',
    },
    rpcUrl: 'https://polygon-rpc.com',
  },
};

export function valueOf(env: Environments): EnvironmentVariables {
  return EnvironmentVariablesSetting[env];
}
