import { ImagePullPolicy } from 'cdk8s-plus-17';
import { KubeDeployment, KubeService } from 'cdk8s-plus-17/lib/imports/k8s';
import { Construct } from 'constructs';
import { meta } from './common/metadata';

const props = {
  component: 'redis',
  dockerImage: 'redis:6-alpine',
  port: 6379,
};

export const newRedisService = (scope: Construct) => {
  const { component, port } = props;
  return new KubeService(scope, 'redis-service', {
    metadata: meta(component),
    spec: {
      ports: [
        {
          name: component,
          port: port,
        },
      ],
      selector: {
        component: component,
      },
    },
  });
};

export const newRedisDeployment = (scope: Construct) => {
  const { component, dockerImage, port } = props;
  return new KubeDeployment(scope, 'redis-deployment', {
    metadata: meta(component),
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          component: component,
        },
      },
      template: {
        metadata: {
          labels: {
            component: component,
          },
        },
        spec: {
          containers: [
            {
              image: dockerImage,
              imagePullPolicy: ImagePullPolicy.ALWAYS,
              name: 'main',
              ports: [
                {
                  containerPort: port,
                  name: component,
                  protocol: 'TCP',
                },
              ],
            },
          ],
        },
      },
    },
  });
};
