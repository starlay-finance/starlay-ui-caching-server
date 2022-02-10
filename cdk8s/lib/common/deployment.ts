import {
  IntOrString,
  KubeDeployment,
  Probe,
} from 'cdk8s-plus-17/lib/imports/k8s';
import { Construct } from 'constructs';
import { Environments, envVars } from './env';
import { meta } from './metadata';
export interface DeploymentProps {
  name: string;
  replicas?: number;
  command: string[];
  readinessProbe?: Probe;
  target: Environments;
}

export const nodeCommands = (job: string) => {
  return ['npm', 'run', job];
};
export const newDeployment = (scope: Construct, props: DeploymentProps) => {
  const { name, replicas, command, readinessProbe, target } = props;
  return new KubeDeployment(scope, `${name}-deployment`, {
    metadata: meta(name),
    spec: {
      progressDeadlineSeconds: 180,
      replicas: replicas ? replicas : 1,
      selector: {
        matchLabels: {
          component: name,
        },
      },
      strategy: {
        rollingUpdate: {
          maxSurge: IntOrString.fromNumber(1),
          maxUnavailable: IntOrString.fromNumber(0),
        },
        type: 'RollingUpdate',
      },
      template: {
        metadata: {
          labels: {
            component: name,
          },
        },
        spec: {
          containers: [
            {
              command: command,
              env: envVars(target),
              image: imageName(),
              imagePullPolicy: 'Always',
              name: 'main',
              ports: [
                {
                  containerPort: 3000,
                  name: 'http',
                  protocol: 'TCP',
                },
              ],
              readinessProbe: readinessProbe,
            },
          ],
        },
      },
    },
  });
};

const imageName = () => {
  const imageName = process.env.IMAGE;
  if (imageName) {
    console.log('imageName:', imageName);
    return imageName;
  }
  return 'gcr.io/vein-dev-339807/vein-dev:latest';
};
