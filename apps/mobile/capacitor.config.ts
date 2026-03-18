import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.nataktv.app",
  appName: "Natak TV",
  webDir: "out",
  server: {
    // In production, load the live website instead of local files
    url: "https://app.nataktv.com",
    cleartext: false,
  },
  android: {
    backgroundColor: "#0a0a0c",
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: "#0a0a0c",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0a0a0c",
    },
  },
};

export default config;
