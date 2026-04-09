# Natak TV - Known Issues & Fixes

> CRITICAL: Read this BEFORE every update/release to avoid repeating mistakes.

---

## 1. Google Sign-In "Something went wrong" (MOST COMMON)

**Root Cause**: Play Store re-signs the app with Google's Play App Signing key (SHA-1: `F6:FF:31:AB:40:48:32:9A:E9:A8:E7:CE:FF:B4:78:61:B4:B8:FA:28`). This creates an OAuth client in Google's INTERNAL GCP project, NOT our Firebase project (`natak-tv-71b7a`). If `server_client_id` or `clientId` is set in the config, the GoogleAuth plugin tries to get an ID token — which fails with "Android clients and Web clients must be in the same project."

**Why debug APK works but Play Store doesn't**: Debug APK uses local debug key (SHA-1: `95ea05...`) which has an OAuth client in OUR Firebase project → same project → works. Play Store uses Google's key → different project → fails.

**Fix (plugin patch approach)**: 
- `capacitor.config.ts` — GoogleAuth plugin must NOT have `clientId`, `androidClientId`, or `serverClientId`
- `android/app/src/main/res/values/strings.xml` — `server_client_id` = `"SKIP"` (NOT empty — empty crashes the plugin)
- Patched `GoogleAuth.java` via `pnpm patch` — skips `requestIdToken()` when clientId is "SKIP", empty, "Your Web Client Key", or doesn't contain `.apps.googleusercontent.com`
- Patch file: `patches/@codetrix-studio__capacitor-google-auth@3.4.0-rc.4.patch`
- Our custom token flow only needs basic profile info (name, email, Google ID) — no ID token needed

**IMPORTANT — what does NOT work**:
- Empty `server_client_id` (`""`) → crashes with "Given String is empty or null"
- Removing `server_client_id` entirely → plugin default "Your Web Client Key" takes over → invalid audience
- Any real web client ID → "must be in same project" error on Play Store

**Files to check before every release**:
```
apps/mobile/capacitor.config.ts → GoogleAuth section (no clientId)
apps/mobile/android/app/src/main/res/values/strings.xml → server_client_id = "SKIP"
apps/mobile/android/app/src/main/assets/capacitor.config.json → after cap sync
patches/@codetrix-studio__capacitor-google-auth@3.4.0-rc.4.patch → must exist
```

**Verification command after build**:
```bash
# Check AAB has no clientId in GoogleAuth config
cd apps/mobile/android
unzip -p app/build/outputs/bundle/release/app-release.aab "base/assets/capacitor.config.json" | grep -A10 "GoogleAuth"
# Should NOT contain clientId or androidClientId

# Check server_client_id = SKIP in merged resources
grep "server_client_id" app/build/intermediates/incremental/release/mergeReleaseResources/merged.dir/values/values.xml
# Should show: SKIP
```

---

## 2. Firebase Admin "Could not load the default credentials"

**Root Cause**: Server env var is `FIREBASE_SERVICE_ACCOUNT_KEY_B64` (base64 encoded), but code was only reading `FIREBASE_SERVICE_ACCOUNT_KEY`.

**Fix**: `apps/web/src/lib/firebase-admin.ts` reads BOTH env vars:
```ts
const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64;
const serviceAccount = serviceAccountRaw
  ? serviceAccountRaw
  : serviceAccountB64
    ? Buffer.from(serviceAccountB64, "base64").toString("utf-8")
    : null;
```

**Verification**: 
```bash
ssh root@64.227.168.208 "curl -s -X POST https://app.nataktv.com/api/auth/google-native -H 'Content-Type: application/json' -d '{\"googleId\":\"test\",\"email\":\"test@test.com\",\"displayName\":\"Test\"}'"
# Should return {"token":"eyJ..."} — NOT a credentials error
```

---

## 3. "Email address is already in use by another account"

**Root Cause**: Custom token flow creates user with UID `google_<id>`, but the email is already taken by an existing Firebase user who signed in via web (different UID).

**Fix**: `apps/web/src/app/api/auth/google-native/route.ts` — Look up existing user by email FIRST with `getUserByEmail()`, reuse their UID. Only create new user if email doesn't exist.

---

## 4. GoogleAuth.signOut() Crashes WebView / Closes App

**Root Cause**: Calling `GoogleAuth.signOut()` without first calling `GoogleAuth.initialize()` crashes the native plugin.

**Fix**: `apps/web/src/components/auth/AuthProvider.tsx` — Always call `initialize()` before `signOut()`:
```ts
await GoogleAuth.initialize({ scopes: "profile,email", grantOfflineAccess: false });
await GoogleAuth.signOut();
```

---

## 5. Razorpay Opens Instead of Google Play Billing on Android App

**Root Cause**: Profile page always used RazorpayCheckout. `isCapacitorApp()` returned false due to missing fallback checks.

**Fix**: 
- Profile page checks `isCapacitorApp()` and uses `purchaseMonthly()` from RevenueCat for Capacitor
- `isCapacitorApp()` in `lib/revenuecat.ts` has proper fallbacks:
```ts
if (typeof cap.isNativePlatform === "function") return cap.isNativePlatform();
return cap.getPlatform?.() === "android" || cap.getPlatform?.() === "ios" || !!cap.Plugins;
```

---

## 6. "Not configured for billing through Google Play"

**Root Cause**: Sideloaded debug APKs CANNOT use Google Play Billing. The app must be installed from Play Store.

**Fix**: Can only test Play Billing on Play Store version (production or internal testing track).

---

## 7. INSTALL_FAILED_UPDATE_INCOMPATIBLE

**Root Cause**: Debug APK signed with debug key, Play Store version signed with upload/Play key. Android won't allow update across different signatures.

**Fix**: Uninstall existing app first, then install:
```bash
adb uninstall com.nataktv.app
adb install app-debug.apk
```

---

## 8. Debug APK Testing is MISLEADING for Google Sign-In

**CRITICAL LESSON**: Never trust Google Sign-In working on a debug APK as proof it will work on Play Store. The signing keys are different, which means:
- Debug: OAuth client in YOUR Firebase project → works
- Play Store: OAuth client in Google's project → may fail

**Rule**: For Google Sign-In, only trust testing on the actual Play Store build (internal testing track or production).

---

## Release Checklist (FOLLOW BEFORE EVERY RELEASE)

### Pre-build checks:
- [ ] `capacitor.config.ts` → GoogleAuth has NO `clientId`, `androidClientId`, or `serverClientId`
- [ ] `strings.xml` → `server_client_id` = "SKIP" (NOT empty, NOT removed)
- [ ] `patches/@codetrix-studio__capacitor-google-auth@3.4.0-rc.4.patch` exists
- [ ] `build.gradle` → `versionCode` incremented (must be higher than previous upload)
- [ ] `build.gradle` → `versionName` updated

### Build steps:
```bash
cd apps/mobile
npx cap sync android
cd android
./gradlew bundleRelease
```

### Post-build verification:
```bash
# Verify no clientId leaked into AAB
unzip -p app/build/outputs/bundle/release/app-release.aab "base/assets/capacitor.config.json" | grep -A10 "GoogleAuth"
```

### Server deploy (if JS changes):
```bash
ssh root@64.227.168.208 "cd /opt/nataktv && git pull && pnpm build && pm2 restart nataktv"
```

### After Play Console upload:
- [ ] Send for review from Publishing Overview
- [ ] After approval: manually publish (managed publishing is ON)

---

## Key Architecture Notes

- **Capacitor WebView + server.url**: App loads JS from `app.nataktv.com`. JS code changes deploy to server, NOT through AAB update. Native config (capacitor.config, strings.xml, plugins) requires new AAB.
- **Custom Token Flow**: Native picker → user info (name/email/id) → POST `/api/auth/google-native` → backend creates Firebase custom token → `signInWithCustomToken()`
- **Firebase Project**: `natak-tv-71b7a` (project number `342635565192`)
- **Play Console**: officialnataktv@gmail.com / Bharat Entertainment
- **Server**: root@64.227.168.208, PM2 process `nataktv`, app at /opt/nataktv
- **RevenueCat**: API key `goog_fKAiDErpdjMrzaZpxvRPucXqBfX`, product `nataktv_monthly`

---

*Last updated: 2026-04-09*
