/**
 * Push notification registration for Capacitor Android app.
 * Registers FCM token on app launch (even before login).
 * When user logs in, updates the token with their uid.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWindow = Window & { Capacitor?: any };

function isCapacitor(): boolean {
  return (
    typeof window !== "undefined" &&
    !!(window as AnyWindow).Capacitor?.isNativePlatform?.()
  );
}

function getPushPlugin() {
  return (window as AnyWindow).Capacitor?.Plugins?.PushNotifications;
}

let _registeredToken: string | null = null;
let _initialized = false;

/**
 * Call on app load — registers FCM token even without a user.
 * Anonymous tokens allow sending notifications to non-logged-in users.
 */
export async function initPushNotifications() {
  if (!isCapacitor() || _initialized) return;
  _initialized = true;

  const PushNotifications = getPushPlugin();
  if (!PushNotifications) {
    console.log("[Push] PushNotifications plugin not available");
    return;
  }

  try {
    const permResult = await PushNotifications.requestPermissions();
    if (permResult.receive !== "granted") {
      console.log("[Push] Permission denied");
      return;
    }

    await PushNotifications.register();

    PushNotifications.addListener("registration", async (token: { value: string }) => {
      console.log("[Push] FCM token:", token.value);
      _registeredToken = token.value;
      // Register anonymous token (no uid yet)
      try {
        await fetch("/api/notifications/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token.value }),
        });
        console.log("[Push] Anonymous token registered");
      } catch (err) {
        console.error("[Push] Failed to register token:", err);
      }
    });

    PushNotifications.addListener("registrationError", (error: unknown) => {
      console.error("[Push] Registration error:", error);
    });

    PushNotifications.addListener("pushNotificationReceived", (notification: unknown) => {
      console.log("[Push] Received in foreground:", notification);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PushNotifications.addListener("pushNotificationActionPerformed", (action: any) => {
      const url = action?.notification?.data?.url;
      if (url && typeof window !== "undefined") {
        window.location.href = url;
      }
    });
  } catch (err) {
    console.error("[Push] Setup error:", err);
  }
}

/**
 * Call when user logs in — associates the FCM token with their uid.
 */
export async function linkPushTokenToUser(uid: string) {
  if (!_registeredToken) return;

  try {
    await fetch("/api/notifications/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: _registeredToken, uid }),
    });
    console.log("[Push] Token linked to user:", uid);
  } catch (err) {
    console.error("[Push] Failed to link token:", err);
  }
}
