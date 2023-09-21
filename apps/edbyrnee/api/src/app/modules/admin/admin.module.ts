import { Database, Resource } from '@adminjs/sequelize';
import AdminJS from 'adminjs';

import { AdminModule } from '@adminjs/nestjs';
import { brandingConfig } from './branding-config';
import { userResources } from './resources/userResources';
import { dropResources } from './resources/dropResources';
AdminJS.registerAdapter({ Database, Resource });

export function createAdminModule(): any {
  return AdminModule.createAdmin({
    adminJsOptions: {
      branding: brandingConfig,
      rootPath: '/admin',
      resources: [...userResources, ...dropResources],
    },
    auth: {
      authenticate: async (email, password) =>
        Promise.resolve({ email: 'ed_b@hotmail.co.uk' }),
      cookieName: 'test',
      cookiePassword: 'Sh0ppr1234!',
    },
  });
}
