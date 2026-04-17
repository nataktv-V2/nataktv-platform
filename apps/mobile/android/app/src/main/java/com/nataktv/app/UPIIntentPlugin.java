package com.nataktv.app;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Intercepts UPI payment scheme URLs (phonepe://, gpay://, upi://, etc.) from
 * the WebView and launches the corresponding Android app via Intent.
 *
 * This is purely local URL handling — does NOT talk to Razorpay or any server.
 * When a user taps a UPI app button in the Razorpay web checkout, Razorpay
 * tries to open a URL like "phonepe://upi/pay?pa=merchant&am=2". Capacitor's
 * WebView doesn't handle these custom schemes by default, so nothing happens
 * and Razorpay falls back to asking for a UPI ID. This plugin fixes that.
 */
@CapacitorPlugin(name = "UPIIntent")
public class UPIIntentPlugin extends Plugin {

    private static final String TAG = "UPIIntent";

    private static final String[] UPI_SCHEMES = {
        "upi://",
        "phonepe://",
        "gpay://",
        "tez://",
        "paytmmp://",
        "paytm://",
        "credpay://",
        "bhim://",
        "intent://"
    };

    @Override
    public Boolean shouldOverrideLoad(Uri url) {
        if (url == null) return null;

        String urlString = url.toString();

        for (String scheme : UPI_SCHEMES) {
            if (urlString.toLowerCase().startsWith(scheme)) {
                try {
                    Intent intent;
                    if (urlString.startsWith("intent://")) {
                        // Parse Android Intent URI (e.g. intent://#Intent;scheme=upi;...)
                        intent = Intent.parseUri(urlString, Intent.URI_INTENT_SCHEME);
                    } else {
                        intent = new Intent(Intent.ACTION_VIEW, url);
                    }
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    getContext().startActivity(intent);
                    Log.d(TAG, "Launched UPI app for: " + scheme);
                    return true; // abort WebView loading — app is handling it
                } catch (android.content.ActivityNotFoundException e) {
                    Log.w(TAG, "UPI app not installed for: " + scheme);
                    return false;
                } catch (Exception e) {
                    Log.e(TAG, "Failed to launch UPI app: " + urlString, e);
                    return false;
                }
            }
        }

        return null; // not a UPI URL — default WebView behavior
    }
}
