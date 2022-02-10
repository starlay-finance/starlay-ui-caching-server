import { Construct } from 'constructs';
import { KubeIngress } from '../imports/k8s';
import { CERT_SECRET_NAME, NAMESPACE } from './common/const';
import { Environments, valueOf } from './common/env';

export const newIngress = (scope: Construct, target: Environments) => {
  new KubeIngress(scope, 'ingress', {
    metadata: {
      name: 'ingress-dev',
      namespace: NAMESPACE,
      annotations: {
        'kubernetes.io/ingress.global-static-ip-name': 'api-static-ip',
        'cert-manager.io/cluster-issuer': 'letsencrypt-prod',
        'ingress.kubernetes.io/rewrite-target': '/',
      },
    },
    spec: {
      tls: [
        {
          hosts: [host(target)],
          secretName: CERT_SECRET_NAME,
        },
      ],
      rules: [
        {
          host: host(target),
          http: {
            paths: [
              {
                path: '/',
                pathType: 'Prefix',
                backend: {
                  service: {
                    name: 'api',
                    port: {
                      number: 80,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  });
};

const host = (target: Environments) => {
  return `api-${valueOf(target).chain.name}.${valueOf(target).rootDomain}`;
};
