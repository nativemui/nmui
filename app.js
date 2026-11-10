import "./components/index.js";
import { routes } from "./app/pages/index.js";

// The <App> tag is the mount point. (The HTML parser lowercases tag names,
// so <App> arrives in the DOM as <app> — query it lowercase.)
const mount = document.querySelector("app");

if (!mount) {
  throw new Error("nmui: no <App> mount tag found.");
}

const nmui = {
  version: "0.32.0",

  // Dead-simple theming: the theme is one attribute on <html>, so it
  // cascades into every component through CSS variables. Persisted.
  theme(name) {
    document.documentElement.setAttribute("theme", name);
    try {
      localStorage.setItem("nmui-theme", name);
    } catch (e) {
      /* private mode — theme still applies for the session */
    }
    return name;
  },
  get themeName() {
    return document.documentElement.getAttribute("theme") || "light";
  },

  // Client-side navigation. Updates the URL, the page, and the title.
  navigate(path) {
    return go(path, true);
  },
};

window.nmui = nmui;

// -- app shell ---------------------------------------------------------------
// The demo app's chrome is our own expanded navigation rail. Pages
// render into <main>; the rail owns Home / Docs / component links, the
// collapse toggle, and the theme toggle.

mount.innerHTML = `
  <nmui-navigation rail expanded id="app-rail">
    <header>
      <div class="rail-brand-row">
        <img class="rail-brand" src="/assets/mark.svg" alt="">
        <headline small class="rail-title brand-word">NATIVE <span>MUI</span></headline>
      </div>
      <div class="rail-tools">
        <nmui-button icon standard id="rail-collapse" aria-label="Collapse rail">menu_open</nmui-button>
        <nmui-button icon standard id="rail-theme" aria-label="Toggle theme">dark_mode</nmui-button>
      </div>
    </header>
    <a data-link href="/"><icon>home</icon>Home</a>
    <a data-link href="/docs"><icon>library_books</icon>Docs</a>
    <a data-link href="/docs/button"><icon>widgets</icon>Components</a>
    <section>
      <a data-link href="/docs/button"><icon>smart_button</icon>Button</a>
      <a data-link href="/docs/app-bar"><icon>web_asset</icon>App bar</a>
      <a data-link href="/docs/badge"><icon>badge</icon>Badge</a>
      <a data-link href="/docs/card"><icon>style</icon>Cards</a>
      <a data-link href="/docs/checkbox"><icon>check_box</icon>Checkbox</a>
      <a data-link href="/docs/chip"><icon>sell</icon>Chip</a>
      <a data-link href="/docs/date-picker"><icon>calendar_month</icon>Date picker</a>
      <a data-link href="/docs/divider"><icon>horizontal_rule</icon>Divider</a>
      <a data-link href="/docs/list"><icon>list</icon>List</a>
      <a data-link href="/docs/loading"><icon>progress_activity</icon>Loading & progress</a>
      <section>
        <a data-link href="/docs/loading"><icon>hourglass_top</icon>Loading indicator</a>
        <a data-link href="/docs/progress"><icon>donut_large</icon>Progress indicators</a>
      </section>
      <a data-link href="/docs/menu"><icon>menu</icon>Menu</a>
      <a data-link href="/docs/navigation-bar"><icon>navigation</icon>Navigation</a>
      <section>
        <a data-link href="/docs/navigation-bar"><icon>bottom_navigation</icon>Bar</a>
        <a data-link href="/docs/navigation-rail"><icon>dock_to_left</icon>Rail</a>
      </section>
    </section>
    <a data-link href="/docs/layout"><icon>menu_book</icon>Guides</a>
    <section>
      <a data-link href="/docs/getting-started"><icon>rocket_launch</icon>Getting started</a>
      <a data-link href="/docs/layout"><icon>dashboard</icon>Layout</a>
      <a data-link href="/docs/router"><icon>alt_route</icon>Router</a>
      <a data-link href="/docs/theming"><icon>palette</icon>Theming</a>
    </section>
  </nmui-navigation>
  <main id="app-main"></main>`;

const main = mount.querySelector("#app-main");
const rail = mount.querySelector("#app-rail");
const collapseBtn = rail.querySelector("#rail-collapse");
const themeBtn = rail.querySelector("#rail-theme");

function setRailIcon(btn, name) {
  const icon = btn.querySelector("icon");
  if (icon) icon.textContent = name;
}

// Swap a header icon by rotating it out, changing the glyph at the
// midpoint, and rotating the new glyph in.
function spinRailIcon(btn, name) {
  const icon = btn.querySelector("icon");
  if (!icon) return;
  const out = icon.animate(
    [
      { transform: "rotate(0deg)", opacity: 1 },
      { transform: "rotate(90deg)", opacity: 0 },
    ],
    { duration: 130, easing: "ease-in", fill: "forwards" }
  );
  out.onfinish = () => {
    icon.textContent = name;
    icon.animate(
      [
        { transform: "rotate(-90deg)", opacity: 0 },
        { transform: "rotate(0deg)", opacity: 1 },
      ],
      { duration: 190, easing: "ease-out", fill: "forwards" }
    );
  };
}

// Restore the rail's shape and the theme icon from the last session.
try {
  if (localStorage.getItem("nmui-rail") === "collapsed") {
    rail.removeAttribute("expanded");
    rail.setAttribute("collapsed", "");
    setRailIcon(collapseBtn, "menu");
  }
} catch (e) { /* private mode */ }
setRailIcon(themeBtn, nmui.themeName === "dark" ? "light_mode" : "dark_mode");

function setRailExpanded(expanded) {
  rail.toggleAttribute("expanded", expanded);
  rail.toggleAttribute("collapsed", !expanded);
  spinRailIcon(collapseBtn, expanded ? "menu_open" : "menu");
  collapseBtn.setAttribute("aria-label", expanded ? "Collapse rail" : "Expand rail");
  try {
    localStorage.setItem("nmui-rail", expanded ? "expanded" : "collapsed");
  } catch (e) { /* private mode */ }
  // Selection is mode-specific (parents carry the pill only when
  // collapsed), so re-sync against the current route.
  syncRail(location.pathname);
}

collapseBtn.addEventListener("click", () => {
  setRailExpanded(!rail.hasAttribute("expanded"));
});

themeBtn.addEventListener("click", () => {
  const next = nmui.themeName === "dark" ? "light" : "dark";
  nmui.theme(next);
  setRailIcon(themeBtn, next === "dark" ? "light_mode" : "dark_mode");
});

// The rail's [selected] follows the route: exact matches win,
// otherwise the longest matching prefix. Group parents (a
// destination with a <section> after it) are toggles, not pages,
// so they never match a route themselves; the current page's
// destination carries the pill and its groups open around it.
// Only in the collapsed rail — where groups are hidden — do the
// parents also take the pill, so the top level still shows where
// you are. Pages with no rail destination of their own (the
// button family's sub-pages, the unlisted component drafts) fall
// back to their family instead of the Docs hub: "/docs" itself is
// exact-match only, never a prefix, or it would swallow every
// docs page.
const BUTTON_FAMILY = [
  "/docs/toggle-button",
  "/docs/icon-button",
  "/docs/toggle-icon-button",
  "/docs/split-button",
  "/docs/button-group",
  "/docs/connected-button-group",
  "/docs/fab",
  "/docs/extended-fab",
  "/docs/fab-menu",
];

function syncRail(path) {
  const anchors = [...rail.querySelectorAll("a[data-link]")];
  anchors.forEach((a) => a.removeAttribute("selected"));
  const isParent = (a) => a.nextElementSibling?.tagName === "SECTION";
  let best = null;
  const exact = [];
  anchors.forEach((a) => {
    if (isParent(a)) return;
    const href = a.getAttribute("href");
    if (href === path) exact.push(a);
    else if (
      href !== "/" &&
      href !== "/docs" &&
      path.startsWith(href + "/") &&
      (!best || href.length > best.getAttribute("href").length)
    ) {
      best = a;
    }
  });
  let selected = exact.length ? exact : best ? [best] : [];
  if (!selected.length && path.startsWith("/docs/")) {
    const byHref = (href) => anchors.filter((a) => a.getAttribute("href") === href);
    if (BUTTON_FAMILY.includes(path)) {
      // Button itself: the /docs/button anchor inside the group
      // (the other one is the Components toggle parent).
      selected = byHref("/docs/button").filter((a) => !isParent(a));
    } else if (path === "/docs/nav-drawer") {
      // The Navigation parent stands for its unlisted sibling page.
      selected = byHref("/docs/navigation-bar").filter((a) => isParent(a));
    } else {
      // Any other docs page is a component page: the Components
      // parent stands for it.
      selected = byHref("/docs/button").filter((a) => isParent(a));
    }
  }
  const collapsed = rail.hasAttribute("collapsed");
  selected.forEach((a) => {
    a.setAttribute("selected", "");
    // Open the group this destination heads, and every group it
    // sits inside, so the current page is visible in the rail.
    if (isParent(a)) {
      a.nextElementSibling.setAttribute("open", "");
      a.setAttribute("aria-expanded", "true");
    }
    let el = a;
    while (el) {
      const section = el.closest("section");
      const parent = section?.previousElementSibling;
      if (!parent?.matches("a, button")) break;
      section.setAttribute("open", "");
      parent.setAttribute("aria-expanded", "true");
      if (collapsed) parent.setAttribute("selected", "");
      el = parent;
    }
  });
}

// -- tiny router ------------------------------------------------------------
// history.pushState for in-app links, popstate for back/forward, and the
// URL is the source of truth on load/refresh. Pages are lazy-loaded.

async function render(path) {
  const page = await routes[path]();
  main.innerHTML = "";
  await page.render(main, nmui);
  document.title = page.title || "nmui";
  main.scrollTo(0, 0);
  syncRail(path);
}

function go(path, push) {
  const target = routes[path] ? path : "/";
  if (push) history.pushState({ path: target }, "", target);
  return render(target);
}

// In-app links: <a data-link href="/docs">. Everything else is left alone.
document.addEventListener("click", (e) => {
  const t = e.target instanceof Element ? e.target : null;
  const a = t?.closest("a[data-link]");
  if (!a) return;
  e.preventDefault();
  // A rail destination with a section under it is a group parent:
  // it never navigates. The component has already toggled its
  // section by the time this bubbles up; here we only handle the
  // collapsed rail, whose groups are hidden whole — force this one
  // open (the component's toggle may have just closed it) and
  // expand the rail so the group is actually visible.
  if (rail.contains(a) && a.nextElementSibling?.tagName === "SECTION") {
    if (rail.hasAttribute("collapsed")) {
      a.nextElementSibling.setAttribute("open", "");
      a.setAttribute("aria-expanded", "true");
      setRailExpanded(true);
    }
    return;
  }
  go(a.getAttribute("href"), true);
});

window.addEventListener("popstate", (e) => {
  go(e.state?.path || location.pathname, false);
});

// Boot from the URL.
{
  let path = location.pathname;
  if (path.endsWith("/index.html")) path = path.slice(0, -"/index.html".length) || "/";
  if (!routes[path]) path = "/";
  history.replaceState({ path }, "", path);
  render(path);
}
