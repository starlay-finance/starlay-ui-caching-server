import { Certificate } from './../imports/cert-manager.io';
import { Construct } from 'constructs';
import { ClusterIssuer } from '../imports/cert-manager.io';
import { Environments, valueOf } from './common/env';
import { CERT_SECRET_NAME, NAMESPACE } from './common/const';

export const newCertIssuer = (scope: Construct, target: Environments) => {
  new ClusterIssuer(scope, 'cluster-issuer', {
    metadata: {
      name: 'letsencrypt-prod',
      namespace: NAMESPACE,
    },
    spec: {
      acme: {
        server: 'https://acme-v02.api.letsencrypt.org/directory',
        privateKeySecretRef: {
          name: 'letsencrypt-prod-account-key',
        },
        solvers: [
          {
            dns01: {
              clouddns: {
                project: valueOf(target).projectId,
                serviceAccountSecretRef: {
                  name: 'clouddns-dns01-solver-svc-acct',
                  key: 'service-account.json',
                },
              },
            },
          },
        ],
      },
    },
  });
};

export const newCert = (scope: Construct, target: Environments) => {
  new Certificate(scope, 'certificate', {
    metadata: {
      name: 'vein',
      namespace: NAMESPACE,
    },
    spec: {
      secretName: CERT_SECRET_NAME,
      issuerRef: {
        name: 'letsencrypt-prod',
        kind: 'ClusterIssuer',
      },
      dnsNames: [`*.${valueOf(target).rootDomain}`],
    },
  });
};
