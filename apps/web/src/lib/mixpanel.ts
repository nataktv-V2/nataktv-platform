/**
 * Mixpanel wrapper — loaded via CDN (not npm) for Vercel-breach safety.
 *
 * Reads token from NEXT_PUBLIC_MIXPANEL_TOKEN at build time.
 * If token is not set, all functions are no-ops (never breaks the app).
 *
 * The CDN script is injected in app/layout.tsx <Script> element.
 * Access pattern: window.mixpanel (populated by the CDN script after load).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MixpanelWindow = Window & { mixpanel?: any };

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

function getMP() {
  if (typeof window === "undefined") return null;
  if (!TOKEN) return null;
  const mp = (window as MixpanelWindow).mixpanel;
  return mp ?? null;
}

/**
 * Track an event. Use past-tense names: `subscribe_tapped`, `video_played`.
 * Extra properties go in the second arg.
 */
export function track(event: string, props?: Record<string, unknown>) {
  const mp = getMP();
  if (!mp) return;
  try {
    mp.track(event, props ?? {});
  } catch {
    // never break the app because of analytics
  }
}

/**
 * Identify the current user (call on sign-in). Links future events
 * to this user. Pass Firebase UID as the ID.
 */
export function identify(
  firebaseUid: string,
  traits?: {
    email?: string;
    name?: string;
    createdAt?: string;
    [k: string]: unknown;
  }
) {
  const mp = getMP();
  if (!mp) return;
  try {
    mp.identify(firebaseUid);
    if (traits) {
      mp.people.set({
        $email: traits.email,
        $name: traits.name,
        $created: traits.createdAt,
        ...traits,
      });
    }
  } catch {
    // ignore
  }
}

/**
 * Clear identity (call on sign-out).
 */
export function reset() {
  const mp = getMP();
  if (!mp) return;
  try {
    mp.reset();
  } catch {
    // ignore
  }
}

/**
 * Register persistent properties sent with every event (e.g. app version,
 * platform). Call once on app load.
 */
export function register(props: Record<string, unknown>) {
  const mp = getMP();
  if (!mp) return;
  try {
    mp.register(props);
  } catch {
    // ignore
  }
}

/**
 * Register properties ONE TIME only — won't overwrite if already set.
 * Use for user-acquisition properties like first_referrer.
 */
export function registerOnce(props: Record<string, unknown>) {
  const mp = getMP();
  if (!mp) return;
  try {
    mp.register_once(props);
  } catch {
    // ignore
  }
}
