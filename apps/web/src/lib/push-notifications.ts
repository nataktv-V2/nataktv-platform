/**
 * Push notification registration for Capacitor Android app.
 * Uses window.Capacitor.Plugins directly — no npm import needed.
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as AnyWindow).Capacitor?.Plugins?.PushNotifications;
}

export async function registerPushNotifications(uid: string) {
  if (!isCapacitor()) return;

  const PushNotifications = getPushPlugin();
  if (!PushNotifications) {
    console.log("[Push] PushNotifications plugin not available");
    return;
  }

  try {
    // Request permission
    const permResult = await PushNotifications.requestPermissions();
    if (permResult.receive !== "granted") {
      console.log("[Push] Permission denied");
      return;
    }

    // Register with FCM
    await PushNotifications.register();

    // Listen for token
    PushNotifications.addListener("registration", async (token: { value: string }) => {
      console.log("[Push] FCM token:", token.value);
      try {
        await fetch("/api/notifications/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token.value, uid }),
        });
        console.log("[Push] Token registered with server");
      } catch (err) {
        console.error("[Push] Failed to register token:", err);
      }
    });

    // Listen for registration errors
    PushNotifications.addListener("registrationError", (error: unknown) => {
      console.error("[Push] Registration error:", error);
    });

    // Listen for incoming notifications (foreground)
    PushNotifications.addListener("pushNotificationReceived", (notification: unknown) => {
      console.log("[Push] Received in foreground:", notification);
    });

    // Listen for notification taps
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
