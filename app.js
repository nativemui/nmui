import "./components/index.js";
import { routes } from "./app/pages/index.js";

// The <App> tag is the mount point. (The HTML parser lowercases tag names,
// so <App> arrives in the DOM as <app> — query it lowercase.)
const mount = document.querySelector("app");

if (!mount) {
  throw new Error("nmui: no <App> mount tag found.");
}

// The OS color-scheme query: "system" theme resolves through this,
// and follows it live when it changes.
const systemQuery = window.matchMedia("(prefers-color-scheme: dark)");

const nmui = {
  version: "0.43.28",

  // Dead-simple theming: the theme is one attribute on <html>, so it
  // cascades into every component through CSS variables. The attribute
  // always holds the resolved theme ("light" / "dark"); the preference
  // is "light", "dark", or "system" (follow the OS, live), persisted.
  theme(name) {
    const pref = ["light", "dark", "system"].includes(name) ? name : "system";
    const resolved =
      pref === "system"
        ? systemQuery.matches
          ? "dark"
          : "light"
        : pref;
    document.documentElement.setAttribute("theme", resolved);
    try {
      localStorage.setItem("nmui-theme", pref);
    } catch (e) {
      /* private mode — theme still applies for the session */
    }
    return pref;
  },
  get themeName() {
    let pref = "system";
    try {
      pref = localStorage.getItem("nmui-theme") || "system";
    } catch (e) {
      /* private mode */
    }
    return ["light", "dark", "system"].includes(pref) ? pref : "system";
  },
  get themeResolved() {
    return document.documentElement.getAttribute("theme") || "light";
  },
  // Light -> dark -> system -> light. The shell toggles and the home
  // page button all cycle through this one method.
  cycleTheme() {
    const order = ["light", "dark", "system"];
    return this.theme(order[(order.indexOf(this.themeName) + 1) % order.length]);
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
//
// Compact windows (<600px) get the M3 phone pattern instead: a top bar
// (menu, brand, theme) and the rail as a MODAL overlay — a 96dp rail
// eating a phone's width helps nobody. The mode is chosen before the
// markup lands so the rail connects already knowing it's modal, and
// re-applied if the window crosses the breakpoint while open.

const compactQuery = window.matchMedia("(max-width: 599px)");
let railPref = "expanded";
try {
  if (localStorage.getItem("nmui-rail") === "collapsed") railPref = "collapsed";
} catch (e) { /* private mode */ }
const bootRailAttrs = compactQuery.matches
  ? "rail expanded modal"
  : railPref === "collapsed"
    ? "rail collapsed"
    : "rail expanded";

mount.innerHTML = `
  <div class="app-topbar">
    <nmui-button icon standard id="topbar-menu" aria-label="Open navigation">menu</nmui-button>
    <img class="rail-brand" src="/assets/mark.svg" alt="">
    <headline small class="topbar-title brand-word">NATIVE <span>MUI</span></headline>
    <nmui-button icon standard id="topbar-theme" aria-label="Toggle theme">dark_mode</nmui-button>
  </div>
  <nmui-navigation ${bootRailAttrs} id="app-rail">
    <header>
      <div class="rail-brand-row">
        <img class="rail-brand" src="/assets/mark.svg" alt="">
        <headline small class="rail-title brand-word">NATIVE <span>MUI</span></headline>
      </div>
      <div class="rail-tools">
        <nmui-button icon standard id="rail-collapse" aria-label="Collapse rail">menu</nmui-button>
        <nmui-button icon standard id="rail-theme" aria-label="Toggle theme">dark_mode</nmui-button>
      </div>
    </header>
    <a data-link href="/"><icon>home</icon>Home</a>
    <a data-link href="/docs/getting-started"><icon>rocket_launch</icon>Getting started</a>
    <a data-link href="/docs/button"><icon>widgets</icon>Components</a>
    <section>
      <a data-link href="/docs/button"><icon>smart_button</icon>Button</a>
      <section>
        <a data-link href="/docs/button"><icon>smart_button</icon>Button</a>
        <a data-link href="/docs/toggle-button"><icon>toggle_on</icon>Toggle</a>
        <a data-link href="/docs/icon-button"><icon>star</icon>Icon</a>
        <a data-link href="/docs/toggle-icon-button"><icon>favorite</icon>Toggle icon</a>
        <a data-link href="/docs/split-button"><icon>arrow_drop_down</icon>Split</a>
        <a data-link href="/docs/button-group"><icon>view_column</icon>Group</a>
        <a data-link href="/docs/connected-button-group"><icon>link</icon>Connected group</a>
        <a data-link href="/docs/fab"><icon>add</icon>FAB</a>
        <a data-link href="/docs/extended-fab"><icon>edit</icon>Extended FAB</a>
        <a data-link href="/docs/fab-menu"><icon>menu</icon>FAB menu</a>
      </section>
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
      <a data-link href="/docs/radio"><icon>radio_button_checked</icon>Radio</a>
      <a data-link href="/docs/search"><icon>search</icon>Search</a>
      <a data-link href="/docs/bottom-sheet"><icon>dock_to_bottom</icon>Sheets</a>
      <section>
        <a data-link href="/docs/bottom-sheet"><icon>dock_to_bottom</icon>Bottom sheets</a>
        <a data-link href="/docs/side-sheet"><icon>dock_to_right</icon>Side sheets</a>
      </section>
      <a data-link href="/docs/slider"><icon>tune</icon>Slider</a>
      <a data-link href="/docs/snackbar"><icon>feedback</icon>Snackbar</a>
      <a data-link href="/docs/switch"><icon>toggle_on</icon>Switch</a>
      <a data-link href="/docs/tabs"><icon>tab</icon>Tabs</a>
      <a data-link href="/docs/text-field"><icon>text_fields</icon>Text field</a>
      <a data-link href="/docs/toolbar"><icon>bottom_app_bar</icon>Toolbars</a>
      <a data-link href="/docs/tooltip"><icon>tooltip</icon>Tooltip</a>
    </section>
    <a data-link href="/docs/layout"><icon>menu_book</icon>Guides</a>
    <section>
      <a data-link href="/docs/layout"><icon>dashboard</icon>Layout</a>
      <a data-link href="/docs/router"><icon>alt_route</icon>Router</a>
      <a data-link href="/docs/state"><icon>storage</icon>State</a>
      <a data-link href="/docs/theming"><icon>palette</icon>Theming</a>
      <a data-link href="/docs/typography"><icon>format_size</icon>Typography</a>
      <a data-link href="/docs/motion"><icon>animation</icon>Motion</a>
    </section>
    <a data-link href="/about"><icon>info</icon>About Native MUI</a>
    <a data-link href="/why-nmui"><icon>lightbulb</icon>Why NMUI</a>
    <section>
      <a data-link href="/why-nmui"><icon>lightbulb</icon>Overview</a>
      <a data-link href="/why-nmui/react"><icon>code</icon>React</a>
      <a data-link href="/why-nmui/vue"><icon>code</icon>Vue</a>
      <a data-link href="/why-nmui/svelte"><icon>code</icon>Svelte</a>
      <a data-link href="/why-nmui/angular"><icon>code</icon>Angular</a>
      <a data-link href="/why-nmui/tailwind"><icon>palette</icon>Tailwind</a>
      <a data-link href="/why-nmui/bootstrap"><icon>grid_view</icon>Bootstrap</a>
      <a data-link href="/why-nmui/material-web"><icon>widgets</icon>Material Web</a>
      <a data-link href="/why-nmui/vanilla"><icon>eco</icon>Vanilla</a>
    </section>
    <footer>
      <nmui-button icon standard href="https://github.com/nativemui" target="_blank" aria-label="GitHub"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></nmui-button>
      <nmui-button icon standard href="https://www.linkedin.com/company/nativemui/" target="_blank" aria-label="LinkedIn"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></nmui-button>
      <nmui-button icon standard href="https://x.com/nativemui_hq" target="_blank" aria-label="X"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24"><path fill="currentColor" d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/></svg></nmui-button>
    </footer>
  </nmui-navigation>
  <main id="app-main"></main>`;

const main = mount.querySelector("#app-main");
const rail = mount.querySelector("#app-rail");
const collapseBtn = rail.querySelector("#rail-collapse");
const themeBtn = rail.querySelector("#rail-theme");
const topbarMenuBtn = mount.querySelector("#topbar-menu");
const topbarThemeBtn = mount.querySelector("#topbar-theme");

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

// The toggle icons show the CURRENT mode (with three states there is
// no single "other" mode to point at): sun for light, moon for dark,
// auto-brightness for system.
const THEME_ICONS = { light: "light_mode", dark: "dark_mode", system: "brightness_auto" };

function syncThemeIcons() {
  const pref = nmui.themeName;
  setRailIcon(themeBtn, THEME_ICONS[pref]);
  setRailIcon(topbarThemeBtn, THEME_ICONS[pref]);
  const label = `Toggle theme (currently ${pref})`;
  themeBtn.setAttribute("aria-label", label);
  topbarThemeBtn.setAttribute("aria-label", label);
}
// Pages cycle the theme too (home page button, docs hub); let them keep
// the shell icons in sync after they do.
nmui.syncThemeIcons = syncThemeIcons;

// In system mode, follow the OS live: an OS change re-resolves the
// theme without a reload. Light/dark preferences ignore the OS.
systemQuery.addEventListener("change", () => {
  if (nmui.themeName === "system") {
    nmui.theme("system");
    syncThemeIcons();
  }
});

// Apply the shell mode for the current window size. Compact: the
// rail is a modal overlay (expanded width, opened from the top
// bar) and its header button closes it. Wider: the rail docks at
// the user's saved preference and its header button collapses it.
function applyShellMode() {
  if (compactQuery.matches) {
    rail.setAttribute("modal", "");
    rail.setAttribute("expanded", "");
    rail.removeAttribute("collapsed");
    setRailIcon(collapseBtn, "close");
    collapseBtn.setAttribute("aria-label", "Close navigation");
  } else {
    rail.close();
    rail.removeAttribute("modal");
    rail.toggleAttribute("expanded", railPref === "expanded");
    rail.toggleAttribute("collapsed", railPref !== "expanded");
    setRailIcon(collapseBtn, railPref === "expanded" ? "menu_open" : "menu");
    collapseBtn.setAttribute(
      "aria-label",
      railPref === "expanded" ? "Collapse rail" : "Expand rail"
    );
  }
  syncThemeIcons();
  // Selection is mode-specific (parents carry the pill only when
  // collapsed), so re-sync against the current route.
  syncRail(location.pathname);
}
compactQuery.addEventListener("change", applyShellMode);

function setRailExpanded(expanded) {
  railPref = expanded ? "expanded" : "collapsed";
  rail.toggleAttribute("expanded", expanded);
  rail.toggleAttribute("collapsed", !expanded);
  spinRailIcon(collapseBtn, expanded ? "menu_open" : "menu");
  collapseBtn.setAttribute("aria-label", expanded ? "Collapse rail" : "Expand rail");
  try {
    localStorage.setItem("nmui-rail", railPref);
  } catch (e) { /* private mode */ }
  syncRail(location.pathname);
}

collapseBtn.addEventListener("click", () => {
  if (compactQuery.matches) {
    rail.close();
    return;
  }
  setRailExpanded(!rail.hasAttribute("expanded"));
});

function toggleTheme() {
  nmui.cycleTheme();
  syncThemeIcons();
}
themeBtn.addEventListener("click", toggleTheme);
topbarThemeBtn.addEventListener("click", toggleTheme);
topbarMenuBtn.addEventListener("click", () => rail.show());

// The rail's [selected] follows the route: exact matches win,
// otherwise the longest matching prefix. Group parents (a
// destination with a <section> after it) are toggles, not pages,
// so they never match a route themselves; the current page's
// destination carries the pill and its groups open around it.
// Only in the collapsed rail — where groups are hidden — do the
// parents also take the pill, so the top level still shows where
// you are. Pages with no rail destination of their own (the
// unlisted component drafts) fall back to the Components parent
// instead of the Docs hub: "/docs" itself is exact-match only,
// never a prefix, or it would swallow every docs page.

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
  if (!selected.length && (path === "/docs" || path.startsWith("/docs/"))) {
    const byHref = (href) => anchors.filter((a) => a.getAttribute("href") === href);
    if (path === "/docs") {
      // The docs hub has no rail entry of its own now — Getting
      // started is the rail's docs entry, so it stands for the hub.
      selected = byHref("/docs/getting-started");
    } else if (path === "/docs/nav-drawer") {
      // The Navigation parent stands for its unlisted sibling page.
      selected = byHref("/docs/navigation-bar").filter((a) => isParent(a));
    } else {
      // Any other docs page is a component page: the Components
      // parent stands for it — the top-level /docs/button parent,
      // not the Button parent nested inside the group (same href).
      selected = byHref("/docs/button").filter(
        (a) => isParent(a) && a.parentElement.tagName === "DESTINATIONS"
      );
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

// Boot: the markup already carries the right attributes for the
// current size; this sets the header icons to match the mode.
applyShellMode();

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
