import { Resource } from '@adminjs/sequelize';
import { ResourceOptions } from 'adminjs';
import { UserProfile } from '../../auth/entities/user-profile.entity';
import { UserRole } from '../../auth/entities/user-role.entity';
export const userSection = {
  name: 'Users',
  icon: 'Check',
};

export interface ResourceListing {
  resource: any;
  options: ResourceOptions;
}

export const userResources: ResourceListing[] = [
  {
    resource: UserProfile,
    options: {
      parent: userSection,
    },
  },
  // {
  //   resource: UserRole,
  //   options: {
  //     parent: userSection,
  //   },
  // },
];
