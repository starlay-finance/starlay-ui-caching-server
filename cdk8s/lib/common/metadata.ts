import { NAMESPACE } from './const';

export const meta = (name: string) => {
  return {
    labels: {
      component: name,
    },
    name: name,
    namespace: NAMESPACE,
  };
};
