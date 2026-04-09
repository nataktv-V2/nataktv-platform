/**
 * RevenueCat helper for Google Play Billing via Capacitor.
 * Only used when running inside the Capacitor Android WebView.
 * Browser users continue using Razorpay.
 *
 * Trial flow:
 * - New user: 4 day free trial → auto-renews ₹199/month
 * - Returning/cancelled user: ₹199/month (no trial)
 * Google Play handles trial eligibility automatically.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CapacitorWindow = Window & { Capacitor?: any };

export function isCapacitorApp(): boolean {
  if (typeof window === "undefined") return false;
  const cap = (window as CapacitorWindow).Capacitor;
  if (!cap) return false;
  // Try isNativePlatform() first, fall back to checking isPluginAvailable or platform
  if (typeof cap.isNativePlatform === "function") return cap.isNativePlatform();
  // Fallback: if Capacitor object exists with native platform info
  return cap.getPlatform?.() === "android" || cap.getPlatform?.() === "ios" || !!cap.Plugins;
}

let rcInitialized = false;

function getRC() {
  // Access via Capacitor bridge — no npm import needed in web app
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as CapacitorWindow).Capacitor?.Plugins?.Purchases;
}

export async function initRevenueCat(userId?: string) {
  if (!isCapacitorApp() || rcInitialized) return;

  try {
    const Purchases = getRC();
    await Purchases.configure({
      apiKey: "goog_fKAiDErpdjMrzaZpxvRPucXqBfX",
      appUserID: userId || undefined,
    });
    rcInitialized = true;
    console.log("[RevenueCat] Initialized", userId ? `for ${userId}` : "anonymous");
  } catch (err) {
    console.error("[RevenueCat] Init error:", err);
  }
}

export async function loginRevenueCat(userId: string) {
  if (!isCapacitorApp()) return;

  try {
    const Purchases = getRC();
    await Purchases.logIn({ appUserID: userId });
    console.log("[RevenueCat] Logged in:", userId);
  } catch (err) {
    console.error("[RevenueCat] Login error:", err);
  }
}

export async function logoutRevenueCat() {
  if (!isCapacitorApp()) return;

  try {
    const Purchases = getRC();
    await Purchases.logOut();
    console.log("[RevenueCat] Logged out");
  } catch (err) {
    console.error("[RevenueCat] Logout error:", err);
  }
}

export type TrialInfo = {
  eligible: boolean;
  introPrice?: string; // e.g. "Free" or "₹2"
  introDays?: number;  // e.g. 7 (1 week)
  monthlyPrice?: string; // e.g. "₹199"
};

/**
 * Check if user is eligible for the intro trial offer.
 * Google Play tracks this automatically — if they already used it, not eligible.
 */
export async function getTrialInfo(): Promise<TrialInfo> {
  if (!isCapacitorApp()) return { eligible: false };

  try {
    const Purchases = getRC();
    const offerings = await Purchases.getOfferings();
    const monthly =
      offerings?.current?.monthly ||
      offerings?.current?.availablePackages?.[0];

    if (!monthly) return { eligible: false };

    const product = monthly.product;
    const introOffer = product?.introductoryPrice;
    const monthlyPrice = product?.priceString || "₹199";

    if (introOffer && introOffer.price >= 0) {
      return {
        eligible: true,
        introPrice: introOffer.price === 0 ? "Free" : (introOffer.priceString || "₹2"),
        introDays: introOffer.periodNumberOfUnits || 4,
        monthlyPrice,
      };
    }

    return { eligible: false, monthlyPrice };
  } catch (err) {
    console.error("[RevenueCat] Trial info error:", err);
    return { eligible: false };
  }
}

/**
 * Purchase the monthly subscription.
 * Google Play will automatically apply the 1-week free trial if eligible.
 * If not eligible (cancelled before), it charges ₹199/month directly.
 */
export async function purchaseMonthly(): Promise<{ success: boolean; error?: string }> {
  if (!isCapacitorApp()) return { success: false, error: "Not in Capacitor" };

  try {
    const Purchases = getRC();
    const offerings = await Purchases.getOfferings();

    const monthly =
      offerings?.current?.monthly ||
      offerings?.current?.availablePackages?.[0];

    if (!monthly) {
      return { success: false, error: "No subscription package found" };
    }

    const result = await Purchases.purchasePackage({ aPackage: monthly });
    console.log("[RevenueCat] Purchase result:", JSON.stringify(result));

    const entitlement = result?.customerInfo?.entitlements?.active?.["Natak TV Pro"];
    if (entitlement) {
      syncGooglePlayToServer(
        result?.customerInfo?.originalAppUserId || "",
        {
          active: true,
          willRenew: true,
          expirationDate: entitlement.expirationDate || undefined,
          productId: entitlement.productIdentifier || "nataktv_monthly",
        }
      );
      return { success: true };
    }

    return { success: false, error: "Purchase completed but entitlement not active" };
  } catch (err: unknown) {
    const msg = String((err as { message?: string })?.message || err);
    if (msg.includes("userCancelled") || msg.includes("1")) {
      return { success: false, error: "cancelled" };
    }
    console.error("[RevenueCat] Purchase error:", msg);
    return { success: false, error: msg };
  }
}

export type EntitlementInfo = {
  active: boolean;
  willRenew: boolean;
  expirationDate?: string;
  productId?: string;
};

export async function checkEntitlement(): Promise<boolean> {
  if (!isCapacitorApp()) return false;

  try {
    const Purchases = getRC();
    const info = await Purchases.getCustomerInfo();
    const isActive = !!info?.customerInfo?.entitlements?.active?.["Natak TV Pro"];
    console.log("[RevenueCat] Entitlement active:", isActive);
    return isActive;
  } catch (err) {
    console.error("[RevenueCat] Check entitlement error:", err);
    return false;
  }
}

export async function getEntitlementInfo(): Promise<EntitlementInfo> {
  if (!isCapacitorApp()) return { active: false, willRenew: false };

  try {
    const Purchases = getRC();

    // Invalidate cache to get fresh data from RevenueCat servers
    if (typeof Purchases.invalidateCustomerInfoCache === "function") {
      await Purchases.invalidateCustomerInfoCache();
    }

    const info = await Purchases.getCustomerInfo();
    const ent = info?.customerInfo?.entitlements?.active?.["Natak TV Pro"];

    console.log("[RevenueCat] Full entitlement:", JSON.stringify(ent));

    if (ent) {
      // Detect cancellation: check willRenew, unsubscribeDetectedAt, or billingIssueDetectedAt
      const isCancelled = ent.willRenew === false
        || ent.willRenew === "false"
        || !!ent.unsubscribeDetectedAt;

      return {
        active: true,
        willRenew: !isCancelled,
        expirationDate: ent.expirationDate || undefined,
        productId: ent.productIdentifier || "nataktv_monthly",
      };
    }
    return { active: false, willRenew: false };
  } catch (err) {
    console.error("[RevenueCat] Entitlement info error:", err);
    return { active: false, willRenew: false };
  }
}

/**
 * Sync Google Play subscription state to our server DB.
 * Fire-and-forget — doesn't block the UI.
 */
export function syncGooglePlayToServer(uid: string, entitlement: EntitlementInfo) {
  fetch("/api/subscription/google-play-sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid,
      active: entitlement.active,
      productId: entitlement.productId,
      expirationDate: entitlement.expirationDate,
    }),
  }).catch((err) => console.error("[RevenueCat] Sync error:", err));
}

export async function restorePurchases(): Promise<boolean> {
  if (!isCapacitorApp()) return false;

  try {
    const Purchases = getRC();
    const info = await Purchases.restorePurchases();
    return !!info?.customerInfo?.entitlements?.active?.["Natak TV Pro"];
  } catch (err) {
    console.error("[RevenueCat] Restore error:", err);
    return false;
  }
}
