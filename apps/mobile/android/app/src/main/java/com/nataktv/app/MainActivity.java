package com.nataktv.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {

    private static final String UPI_TAG = "NatakTVUPIIntent";

    // Custom URL schemes that should launch a native app via Intent
    private static final String[] UPI_SCHEMES = {
        "upi", "phonepe", "gpay", "tez", "paytmmp", "paytm", "credpay", "bhim"
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FacebookSdk.sdkInitialize(getApplicationContext());
        AppEventsLogger.activateApp(getApplication());
        createNotificationChannel();
        installUpiIntentInterceptor();
    }

    /**
     * Intercept UPI scheme URLs (phonepe://, upi://, etc.) loaded inside the
     * Capacitor WebView and launch the corresponding installed app via Intent.
     * Without this, the WebView silently ignores custom schemes and Razorpay
     * falls back to asking the user for a UPI ID.
     *
     * This is pure Android-side URL handling — no Razorpay API calls, no
     * Razorpay SDK. Razorpay has no way to detect it.
     */
    private void installUpiIntentInterceptor() {
        if (bridge == null || bridge.getWebView() == null) {
            Log.w(UPI_TAG, "Bridge or WebView is null — cannot install interceptor");
            return;
        }

        bridge.getWebView().setWebViewClient(new BridgeWebViewClient(bridge) {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (handleUpiScheme(request.getUrl())) return true;
                return super.shouldOverrideUrlLoading(view, request);
            }

            @SuppressWarnings("deprecation")
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url != null && handleUpiScheme(Uri.parse(url))) return true;
                return super.shouldOverrideUrlLoading(view, url);
            }
        });
    }

    private boolean handleUpiScheme(Uri uri) {
        if (uri == null) return false;
        String scheme = uri.getScheme();
        if (scheme == null) return false;
        String lower = scheme.toLowerCase();

        // Handle Android Intent URIs (intent://...)
        String full = uri.toString();
        if (lower.equals("intent")) {
            try {
                Intent intent = Intent.parseUri(full, Intent.URI_INTENT_SCHEME);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                Log.d(UPI_TAG, "Launched intent:// URL");
                return true;
            } catch (ActivityNotFoundException e) {
                // Try fallback URL if provided
                String fallback = uri.getQueryParameter("browser_fallback_url");
                if (fallback != null) {
                    bridge.getWebView().loadUrl(fallback);
                    return true;
                }
                return false;
            } catch (Exception e) {
                Log.e(UPI_TAG, "Failed to parse intent URI: " + full, e);
                return false;
            }
        }

        // Handle UPI scheme URLs directly
        for (String s : UPI_SCHEMES) {
            if (lower.equals(s)) {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                    Log.d(UPI_TAG, "Launched " + scheme + "://");
                    return true;
                } catch (ActivityNotFoundException e) {
                    Log.w(UPI_TAG, "No app installed for " + scheme + "://");
                    return false;
                } catch (Exception e) {
                    Log.e(UPI_TAG, "Failed to launch " + scheme + "://", e);
                    return false;
                }
            }
        }
        return false;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                "nataktv_default",
                "Natak TV",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("New shows, updates, and exclusive content from Natak TV");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
}
