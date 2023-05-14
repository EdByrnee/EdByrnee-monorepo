import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'market.localshelf',
  appName: 'appacut-app',
  webDir: '../../dist/apps/appacut-app',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 20000,
      showSpinner: true,
      iosSpinnerStyle: 'large',
      androidSpinnerStyle: 'large',
    },
    PushNotifications: {
      presentationOptions: ['alert', 'badge', 'sound'],
    },
  },
};

export default config;
