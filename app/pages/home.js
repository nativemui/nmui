import homeStyles from "./home.css" with { type: "css" };
import { nav } from "./nav.js";

if (!document.adoptedStyleSheets.includes(homeStyles)) {
  document.adoptedStyleSheets.push(homeStyles);
}

export const title = "Native MUI";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="home">
    ${nav("/")}
    <header class="home-hero">
      <img class="home-mark" src="/assets/mark.svg" alt="">
      <display large class="brand-word">NATIVE <span>MUI</span></display>
      <nmui-chip class="home-version">v${nmui.version}</nmui-chip>
      <headline small class="home-tagline">
        Material&nbsp;3 Expressive, in vanilla JS/HTML/CSS.
        No framework. No build step. No dependencies.
      </headline>
      <nmui-button tonal large id="home-docs">Read the docs</nmui-button>
      <nmui-button outlined large id="home-theme">Toggle theme</nmui-button>
      <nmui-button outlined large href="https://github.com/nativemui/nmui" target="_blank">GitHub</nmui-button>
    </header>
    <section class="home-points">
      <nmui-card outlined>
        <headline small>One tag</headline>
        <p>Bare attributes declare role and variants. <code>&lt;nmui-button tonal large&gt;</code> is the whole API.</p>
      </nmui-card>
      <nmui-card outlined>
        <headline small>One attribute theme</headline>
        <p><code>&lt;html theme="dark"&gt;</code> recolors the library. Try the toggle — this page is the demo.</p>
      </nmui-card>
      <nmui-card outlined>
        <headline small>Zero baggage</headline>
        <p>Import one component, use one component. No runtime, no bundle, no build.</p>
      </nmui-card>
    </section>
    <section class="home-showcase">
      <headline medium>The library, live</headline>
      <p>Every component below is the real thing — this page is built with nmui. Click them; they work.</p>
      <div class="home-showcase-row">
        <nmui-button tonal>Save draft</nmui-button>
        <nmui-button>Publish</nmui-button>
        <nmui-button outlined>Share</nmui-button>
        <nmui-chip assist><icon>calendar_month</icon>Add to calendar</nmui-chip>
        <nmui-badge>3<nmui-button icon standard>notifications</nmui-button></nmui-badge>
        <nmui-switch><input type="checkbox" checked>Airplane mode</nmui-switch>
      </div>
      <nmui-button outlined id="home-components">Browse all components</nmui-button>
    </section>
    <section class="home-get">
      <headline medium>Get it</headline>
      <p>Clone the repo, copy <code>components/</code> and <code>css/</code> into your project, import a component. That's the whole install.</p>
      <pre class="home-code">git clone https://github.com/nativemui/nmui.git</pre>
      <pre class="home-code">&lt;script type="module"&gt;
  import "./components/index.js";
&lt;/script&gt;</pre>
      <p>Full setup, theming, and the browser note — <a data-link href="/docs/getting-started">Getting started</a>.</p>
    </section>
    <section class="home-why">
      <headline medium>Why native?</headline>
      <p>Frontend tooling got heavy. The browser didn't. If the browser can do it, NMUI lets the browser do it.</p>
      <nmui-button outlined id="home-why">Why NMUI?</nmui-button>
    </section>
    <footer class="home-footer">
      <p><span class="brand-word">NATIVE MUI</span> — Material 3 Expressive, in vanilla JS/HTML/CSS.</p>
      <p><a href="https://github.com/nativemui/nmui">GitHub</a> · <a data-link href="/docs">Docs</a> · <a data-link href="/about">About</a></p>
    </footer>
  </div>`;

  mount.querySelector("#home-docs")?.addEventListener("click", () => nmui.navigate("/docs"));
  mount
    .querySelector("#home-theme")
    ?.addEventListener("click", () => {
      nmui.cycleTheme();
      nmui.syncThemeIcons?.();
    });
  mount.querySelector("#home-components")?.addEventListener("click", () => nmui.navigate("/docs"));
  mount.querySelector("#home-why")?.addEventListener("click", () => nmui.navigate("/why-nmui"));
}
