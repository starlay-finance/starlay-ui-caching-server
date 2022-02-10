import { newIngress } from './lib/ingress';
import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { KubeNamespace } from 'cdk8s-plus-17/lib/imports/k8s';
import { newApiDeployment, newApiService } from './lib/api';
import { newBackends } from './lib/backend';
import { newRedisDeployment, newRedisService } from './lib/redis';
import { newCert, newCertIssuer } from './lib/cert';
import { Environments, valueOf } from './lib/common/env';
import { NAMESPACE } from './lib/common/const';

export class CacheBackendChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);
    new KubeNamespace(this, 'namespace', {
      metadata: { name: NAMESPACE },
    });
    newApiService(this);
    newApiDeployment(this, target);
    newBackends(this, target);
    newRedisService(this);
    newRedisDeployment(this);
  }
}

export class CertChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);
    newCertIssuer(this, target);
    newCert(this, target);
  }
}
export class IngressChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);
    newIngress(this, target);
  }
}

const app = new App();
const target: Environments = process.env.TARGET as Environments;
if (!target || !valueOf(target)) throw new Error('Invalid target environment');

new CacheBackendChart(app, `backend`);
new CertChart(app, 'cert');
new IngressChart(app, 'ingress');
app.synth();
