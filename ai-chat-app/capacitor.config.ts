import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mallard.cc',
  appName: 'App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
