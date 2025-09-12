import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agrovison.care',
  appName: 'agro-vision-care',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://54e97d4f-6b20-4741-89a0-d4f3777d7108.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#10b981',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;