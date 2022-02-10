import { Construct } from 'constructs';
import { newDeployment, nodeCommands } from './common/deployment';
import { Environments } from './common/env';

export const newBackends = (scope: Construct, target: Environments) => {
  const backends = [
    {
      name: 'protocol-data-loader',
      command: 'job:update-general-reserves-data',
    },
    {
      name: 'reserve-incentives',
      command: 'job:update-reserve-incentives-data',
    },
    {
      name: 'user-incentives',
      command: 'job:update-users-incentives-data',
    },
    {
      name: 'user-data-loader',
      command: 'job:update-users-data',
    },
    {
      name: 'update-block-number-loader',
      command: 'job:update-block-number',
    },
  ];

  backends.forEach((b) => {
    nodeDeployment(scope, b.name, b.command, target);
  });
};

const nodeDeployment = (
  scope: Construct,
  name: string,
  command: string,
  target: Environments
) => {
  return newDeployment(scope, {
    name: name,
    command: nodeCommands(command),
    target,
  });
};
