"use strict";

self.addEventListener("push", function (event) {
  const data = JSON.parse(event.data.text());
  event.waitUntil(
    registration.showNotification(data.title, {
      body: data.message,
      icon: "/icons/android-chrome-192x192.png",
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return clients.openWindow("/");
      })
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "my-sync-event") {
    event.waitUntil(doSync());
  }
});

async function doSync() {
  try {
    // Perform sync tasks here, such as making API calls or storing data in IndexedDB
  } catch (error) {
    console.error("Error during sync: ", error);
  }
}
