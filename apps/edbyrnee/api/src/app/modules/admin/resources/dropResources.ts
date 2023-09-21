import { ResourceOptions } from 'adminjs';
import { Drop } from '../../drops/entities/drop.entity';
export const dropSection = {
  name: 'Drop',
  icon: 'Check',
};

export interface ResourceListing {
  resource: any;
  options: ResourceOptions;
}

export const dropResources: ResourceListing[] = [
  {
    resource: Drop,
    options: {
      parent: dropSection,
    },
  },
];
