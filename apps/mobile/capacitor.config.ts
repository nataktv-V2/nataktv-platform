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
    GoogleAuth: {
      scopes: ["profile", "email"],
      clientId: "342635565192-46l6ple0vs3p6mc6l5e0kkf4jvj4v53f.apps.googleusercontent.com",
      androidClientId: "342635565192-46l6ple0vs3p6mc6l5e0kkf4jvj4v53f.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
