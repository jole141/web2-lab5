"use strict";

self.addEventListener("push", function (event) {
  var data = { title: "title", body: "body", redirectUrl: "/" };
  if (event.data) {
    data = JSON.parse(event.data.text());
  }
  let options = {
    body: data.body,
    icon: "assets/img/android/androidlaunchericon-96-96.png",
    badge: "assets/img/android/androidlaunchericon-96-96.png",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    data: {
      redirectUrl: data.redirectUrl,
    },
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  let notification = event.notification;
  event.waitUntil(
    clients.matchAll().then(function (clis) {
      clis.forEach((client) => {
        client.navigate(notification.data.redirectUrl);
        client.focus();
      });
      notification.close();
    })
  );
});
self.addEventListener("notificationclose", function (event) {
  console.log("notificationclose", event);
});
