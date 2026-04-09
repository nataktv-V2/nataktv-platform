import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.nataktv.app",
  appName: "Natak TV",
  webDir: "out",
  server: {
    // In production, load the live website instead of local files
    url: "https://app.nataktv.com",
    cleartext: false,
    // Allow WebView to navigate to beatai payment proxy without opening Chrome
    allowNavigation: ["beatai.indidino.com"],
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
      // No clientId/serverClientId — our custom token flow only needs
      // basic profile info (name, email, id), not an ID token.
      // Setting these causes "must be in same project" error with Play signing.
      grantOfflineAccess: false,
      forceCodeForRefreshToken: false,
    },
  },
};

export default config;
