/* eslint-disable no-undef */
// Firebase Cloud Messaging Service Worker
// This runs in the background and handles push notifications

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDJyq9e-5bogw8ABnrvO597fng3IxF-qJQ",
  authDomain: "natak-tv-71b7a.firebaseapp.com",
  projectId: "natak-tv-71b7a",
  storageBucket: "natak-tv-71b7a.firebasestorage.app",
  messagingSenderId: "342635565192",
  appId: "1:342635565192:web:9cd8940d9985e8052b0f3d",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const { title, body, image } = payload.notification || {};
  const notificationTitle = title || "Natak TV";
  const notificationOptions = {
    body: body || "New content available!",
    icon: "/logo.png",
    badge: "/logo.png",
    image: image || undefined,
    data: payload.data,
    actions: [{ action: "open", title: "Watch Now" }],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/home";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/home") && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
