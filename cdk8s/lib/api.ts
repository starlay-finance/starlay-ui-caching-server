import { IntOrString, KubeService, Probe } from 'cdk8s-plus-17/lib/imports/k8s';
import { Construct } from 'constructs';
import { newDeployment, nodeCommands } from './common/deployment';
import { Environments } from './common/env';
import { meta } from './common/metadata';

export const newApiService = (scope: Construct) => {
  return new KubeService(scope, 'api-service', {
    metadata: meta('api'),
    spec: {
      type: 'NodePort',
      ports: [
        {
          name: 'http',
          port: 80,
          protocol: 'TCP',
          targetPort: IntOrString.fromNumber(3000),
        },
      ],
      selector: {
        component: 'api',
      },
    },
  });
};

export const newApiDeployment = (scope: Construct, target: Environments) => {
  return newDeployment(scope, {
    command: nodeCommands('prod'),
    name: 'api',
    readinessProbe: probe(),
    replicas: 2,
    target,
  });
};

const probe = (): Probe => {
  return {
    httpGet: {
      path: '/.well-known/apollo/server-health',
      port: IntOrString.fromNumber(3000),
    },
    initialDelaySeconds: 10,
    periodSeconds: 10,
  };
};
