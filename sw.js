importScripts("https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js");
importScripts("/assets/js/utils/db-utils.js");


const STATIC = "static-v1";
const DYNAMIC = "dynamic-v1";
const INMUTABLE = "inmutable-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/assets/css/style.css",
  "/assets/img/img-404.png",
  "/assets/img/report.ico",
  "/assets/img/reports.png",
  "/assets/img/not-found.svg",
  "/assets/js/auth/signin.js",
  "/assets/js/admin/admin.home.controller.js",
  "/assets/js/admin/admin.users.controller.js",
  "/assets/js/axios/axios-intance.js",
  "/assets/js/toast/toasts.js",
  "/assets/js/main.js",
];

const APP_SHELL_INMUTABLE = [
  "/assets/js/jquery-3.7.1.min.js",
  "/assets/vendor/bootstrap/css/bootstrap.css",
  "/assets/vendor/bootstrap/js/bootstrap.js",
  "/assets/vendor/bootstrap-icons/bootstrap-icons.css",
  "/assets/vendor/boxicons/css/boxicons.css",
  "/assets/vendor/boxicons/fonts/boxicons.eot",
  "/assets/vendor/simple-datatables/simple-datatables.js",
  "/assets/vendor/simple-datatables/style.css",
];

const clear = (cacheName, items = 50) => {
  caches.open(cacheName).then((cache) => {
    return cache.keys().then((keys) => {
      if (keys.length > items) {
        cache.delete(keys[0]).then(clear(cacheName, items));
      }
    });
  });
};

self.addEventListener("install", (e) => {
  const static = caches.open(STATIC).then((cache) => cache.addAll(APP_SHELL));
  const inmutable = caches
    .open(INMUTABLE)
    .then((cache) => cache.addAll(APP_SHELL_INMUTABLE));
  e.waitUntil(Promise.all([static, inmutable]));
});

self.addEventListener("activate", (e) => {
  const response = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC && key.includes("static")) return caches.delete(key);
      if (key !== DYNAMIC && key.includes("dynamic")) return caches.delete(key);
    });
  });
  e.waitUntil(response);
});

self.addEventListener("fetch", (e) => {});
