// router.js — the standalone client-side router from the nmui demo app.
// No dependencies, no build step. Edit routes.js (see routes.example.js),
// give it a <main> element to render into, done.
//
// How it works:
//   - the route table maps paths to dynamic import()s (lazy pages),
//   - <a data-link> clicks are intercepted into history.pushState,
//   - popstate handles back/forward,
//   - the URL is the source of truth on boot/refresh.
// Your server must fall back to index.html for unknown paths —
// see the per-stack folders next to this file.
import { routes } from "./routes.js";

const mount = document.querySelector("main");

async function render(path) {
  const page = await routes[path](); // lazy-loads the page module
  mount.innerHTML = "";
  await page.render(mount);
  document.title = page.title || "My site";
  mount.scrollTo(0, 0);
}

function go(path, push) {
  const target = routes[path] ? path : "/"; // unknown path -> home
  if (push) history.pushState({ path: target }, "", target);
  return render(target);
}

// In-app links: <a data-link href="/docs">. Everything else —
// external URLs, downloads, anchors — is left for the browser.
document.addEventListener("click", function (e) {
  const a = e.target.closest ? e.target.closest("a[data-link]") : null;
  if (!a) return;
  e.preventDefault();
  go(a.getAttribute("href"), true);
});

// Back / forward buttons.
window.addEventListener("popstate", function (e) {
  go((e.state && e.state.path) || location.pathname, false);
});

// Boot from the URL, so refresh and deep links land on the right page.
(function boot() {
  let path = location.pathname;
  if (path.endsWith("/index.html")) {
    path = path.slice(0, -"/index.html".length) || "/";
  }
  if (!routes[path]) path = "/";
  history.replaceState({ path }, "", path);
  render(path);
})();

export { go as navigate };
