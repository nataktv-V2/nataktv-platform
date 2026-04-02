/**
 * Push notification registration for Capacitor Android app.
 * Requests permission, gets FCM token, and registers it with our server.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CapacitorWindow = Window & { Capacitor?: any };

function isCapacitor(): boolean {
  return (
    typeof window !== "undefined" &&
    !!(window as CapacitorWindow).Capacitor?.isNativePlatform?.()
  );
}

export async function registerPushNotifications(uid: string) {
  if (!isCapacitor()) return;

  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");

    // Request permission
    const permResult = await PushNotifications.requestPermissions();
    if (permResult.receive !== "granted") {
      console.log("[Push] Permission denied");
      return;
    }

    // Register with FCM
    await PushNotifications.register();

    // Listen for token
    PushNotifications.addListener("registration", async (token) => {
      console.log("[Push] FCM token:", token.value);
      // Send token to our server
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
    PushNotifications.addListener("registrationError", (error) => {
      console.error("[Push] Registration error:", error);
    });

    // Listen for incoming notifications (foreground)
    PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.log("[Push] Received in foreground:", notification);
      // Could show an in-app toast/banner here
    });

    // Listen for notification taps (user clicked notification)
    PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
      const url = action.notification?.data?.url;
      if (url && typeof window !== "undefined") {
        window.location.href = url;
      }
    });
  } catch (err) {
    console.error("[Push] Setup error:", err);
  }
}
