import crypto from "crypto";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

const BASE_URL = "https://api.razorpay.com/v1";

function getAuthHeader() {
  const encoded = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  return `Basic ${encoded}`;
}

async function razorpayFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.description || `Razorpay API error: ${res.status}`);
  }
  return data;
}

export async function createSubscription(planId: string, customerEmail: string, customerName: string) {
  // 2-day trial: delay subscription start by 2 days
  // Razorpay charges a token auth amount during signup (refunded automatically)
  // We add a ₹2 addon as upfront charge for the trial period
  const trialEndTimestamp = Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60;

  return razorpayFetch("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      plan_id: planId,
      total_count: 120, // max cycles (10 years monthly)
      quantity: 1,
      customer_notify: 0, // we handle notifications
      start_at: trialEndTimestamp, // subscription billing starts after 2 days
      addons: [
        {
          item: {
            name: "Trial Access - 2 Days",
            amount: 200, // ₹2 in paise
            currency: "INR",
          },
        },
      ],
      notes: {
        email: customerEmail,
        name: customerName,
      },
    }),
  });
}

export async function createSubscriptionNoTrial(planId: string, customerEmail: string, customerName: string) {
  // Direct ₹199/month — no trial, starts immediately
  return razorpayFetch("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      plan_id: planId,
      total_count: 120,
      quantity: 1,
      customer_notify: 0,
      notes: {
        email: customerEmail,
        name: customerName,
      },
    }),
  });
}

export async function fetchSubscription(subscriptionId: string) {
  return razorpayFetch(`/subscriptions/${subscriptionId}`);
}

/**
 * Cancel a Razorpay subscription.
 *
 * IMPORTANT: default is `cancelAtEnd: false` (immediate cancel).
 *
 * We tested `cancel_at_cycle_end: 1` on a live subscription (paid_count=1,
 * status=active) and Razorpay returned success but didn't actually schedule
 * the cancel (has_scheduled_changes stayed false, next charge still pending).
 * That silently-failing cancel would have caused ghost charges after the
 * user clicked Cancel → chargebacks → real ban risk.
 *
 * `cancel_at_cycle_end: 0` (immediate) works reliably: status becomes
 * "cancelled" right away, charge_at is cleared, no future charges possible.
 */
export async function cancelSubscription(subscriptionId: string, cancelAtEnd: boolean = false) {
  return razorpayFetch(`/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    body: JSON.stringify({
      cancel_at_cycle_end: cancelAtEnd ? 1 : 0,
    }),
  });
}

export function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function verifyPaymentSignature(
  razorpayPaymentId: string,
  razorpaySubscriptionId: string,
  razorpaySignature: string
): boolean {
  const body = `${razorpayPaymentId}|${razorpaySubscriptionId}`;
  const expected = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpaySignature));
}
