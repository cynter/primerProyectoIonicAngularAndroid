import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'PruebaAppp',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: true,          // oculta solo cuando Ionic bootstrap esté listo (o usa método hide)
      showSpinner: false,
      backgroundColor: '#3E178A',    // combínalo con tu splash
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
