"use client";

import { useEffect } from "react";
import { register } from "@/lib/mixpanel";

/**
 * Loads Mixpanel via their official bootloader snippet. The snippet sets up
 * window.mixpanel as a queue stub, dynamically injects the CDN script, and
 * when the real SDK loads it replays queued calls.
 *
 * We use Mixpanel's own CDN (not npm) for Vercel-breach supply chain safety.
 *
 * Also registers global properties sent with every event:
 *   - platform: "capacitor-android" | "browser"
 *   - app_version / app_build (on Capacitor)
 */

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CapacitorWindow = Window & { Capacitor?: any; mixpanel?: any };

/** Mixpanel's official bootloader — sets up stub, async-loads CDN, replays queue. */
function bootloaderSnippet(token: string): string {
  // This is Mixpanel's documented JS loader. Keep it verbatim as one statement.
  return `
(function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");a.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);
mixpanel.init(${JSON.stringify(token)}, {
  debug: false,
  ip: false,
  track_pageview: false,
  persistence: "localStorage",
  property_blacklist: ["$current_url", "$initial_referrer"]
});
`;
}

export function MixpanelLoader() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!TOKEN) return;

    const w = window as CapacitorWindow;

    // Wait up to 10s for the real SDK to replace the stub, then register
    // global props. (Stub also accepts register() calls — they just queue.)
    const tryRegister = () => {
      const cap = w.Capacitor;
      const isCapacitor = !!cap?.isNativePlatform?.();
      const platform = isCapacitor ? "capacitor-android" : "browser";
      const baseProps: Record<string, unknown> = { platform };

      if (isCapacitor && cap.Plugins?.App?.getInfo) {
        cap.Plugins.App.getInfo()
          .then((info: { version?: string; build?: string }) => {
            register({
              ...baseProps,
              app_version: info?.version,
              app_build: info?.build,
            });
          })
          .catch(() => register(baseProps));
      } else {
        register(baseProps);
      }
    };

    // Register works even on the stub (queued), but delay slightly so init runs first
    const t = window.setTimeout(tryRegister, 50);
    return () => window.clearTimeout(t);
  }, []);

  if (!TOKEN) return null;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: bootloaderSnippet(TOKEN) }}
    />
  );
}
