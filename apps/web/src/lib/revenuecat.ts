/**
 * RevenueCat helper for Google Play Billing via Capacitor.
 * Only used when running inside the Capacitor Android WebView.
 * Browser users continue using Razorpay.
 *
 * Trial flow:
 * - New user: ₹2 for 2 days (intro offer) → auto-renews ₹199/month
 * - Returning/cancelled user: ₹199/month (no trial)
 * Google Play handles intro offer eligibility automatically.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CapacitorWindow = Window & { Capacitor?: any };

export function isCapacitorApp(): boolean {
  return (
    typeof window !== "undefined" &&
    !!(window as CapacitorWindow).Capacitor?.isNativePlatform?.()
  );
}

let rcInitialized = false;

async function getRC() {
  const { Purchases } = await import("@revenuecat/purchases-capacitor");
  return Purchases;
}

export async function initRevenueCat(userId?: string) {
  if (!isCapacitorApp() || rcInitialized) return;

  try {
    const Purchases = await getRC();
    await Purchases.configure({
      apiKey: "test_IEClPGMteffJiuurQBBVQPQHIzg",
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
    const Purchases = await getRC();
    await Purchases.logIn({ appUserID: userId });
    console.log("[RevenueCat] Logged in:", userId);
  } catch (err) {
    console.error("[RevenueCat] Login error:", err);
  }
}

export async function logoutRevenueCat() {
  if (!isCapacitorApp()) return;

  try {
    const Purchases = await getRC();
    await Purchases.logOut();
    console.log("[RevenueCat] Logged out");
  } catch (err) {
    console.error("[RevenueCat] Logout error:", err);
  }
}

export type TrialInfo = {
  eligible: boolean;
  introPrice?: string; // e.g. "₹2"
  introDays?: number;  // e.g. 2
  monthlyPrice?: string; // e.g. "₹199"
};

/**
 * Check if user is eligible for the intro trial offer.
 * Google Play tracks this automatically — if they already used it, not eligible.
 */
export async function getTrialInfo(): Promise<TrialInfo> {
  if (!isCapacitorApp()) return { eligible: false };

  try {
    const Purchases = await getRC();
    const offerings = await Purchases.getOfferings();
    const monthly =
      offerings?.current?.monthly ||
      offerings?.current?.availablePackages?.[0];

    if (!monthly) return { eligible: false };

    const product = monthly.product;
    const introOffer = product?.introductoryPrice;
    const monthlyPrice = product?.priceString || "₹199";

    if (introOffer && introOffer.price > 0) {
      return {
        eligible: true,
        introPrice: introOffer.priceString || "₹2",
        introDays: introOffer.periodNumberOfUnits || 2,
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
 * Google Play will automatically apply the intro offer (₹2 trial) if eligible.
 * If not eligible (cancelled before), it charges ₹199 directly.
 */
export async function purchaseMonthly(): Promise<{ success: boolean; error?: string }> {
  if (!isCapacitorApp()) return { success: false, error: "Not in Capacitor" };

  try {
    const Purchases = await getRC();
    const offerings = await Purchases.getOfferings();

    const monthly =
      offerings?.current?.monthly ||
      offerings?.current?.availablePackages?.[0];

    if (!monthly) {
      return { success: false, error: "No subscription package found" };
    }

    // Google Play handles trial eligibility automatically —
    // if the user is eligible for the intro offer, they see ₹2 for 2 days
    // if not (already used trial / cancelled), they see ₹199/month
    const result = await Purchases.purchasePackage({ aPackage: monthly });
    console.log("[RevenueCat] Purchase result:", JSON.stringify(result));

    const entitlement = result?.customerInfo?.entitlements?.active?.["Natak TV Pro"];
    if (entitlement) {
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

export async function checkEntitlement(): Promise<boolean> {
  if (!isCapacitorApp()) return false;

  try {
    const Purchases = await getRC();
    const info = await Purchases.getCustomerInfo();
    const isActive = !!info?.customerInfo?.entitlements?.active?.["Natak TV Pro"];
    console.log("[RevenueCat] Entitlement active:", isActive);
    return isActive;
  } catch (err) {
    console.error("[RevenueCat] Check entitlement error:", err);
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!isCapacitorApp()) return false;

  try {
    const Purchases = await getRC();
    const info = await Purchases.restorePurchases();
    return !!info?.customerInfo?.entitlements?.active?.["Natak TV Pro"];
  } catch (err) {
    console.error("[RevenueCat] Restore error:", err);
    return false;
  }
}
