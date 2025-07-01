import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.aicompanion',
  appName: 'AI Companion',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
