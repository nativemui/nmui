// routes.js — copy this to routes.js next to router.js and edit.
// One line per page: path -> lazy page module. Each page module
// exports { title, render(mount) }.
export const routes = {
  "/": () => import("./pages/home.js"),
  "/about": () => import("./pages/about.js"),
  "/docs": () => import("./pages/docs.js"),
  "/docs/button": () => import("./pages/docs/button.js"),
};

// A page module looks like:
//
//   // pages/about.js
//   export const title = "About — My site";
//   export function render(mount) {
//     mount.innerHTML = "<h1>About</h1><p>…</p>";
//   }
