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
    // Spoof User-Agent to look like standard Chrome Mobile (not WebView).
    // Razorpay detects "wv" / "; wv)" in the UA and disables UPI Intent flow
    // (falls back to UPI Collect "enter your UPI ID"). By presenting a
    // normal Chrome UA, Razorpay keeps UPI Intent enabled and emits
    // phonepe://, intent:// URLs which MainActivity's interceptor launches.
    overrideUserAgent:
      "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
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
