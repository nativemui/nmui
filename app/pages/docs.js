import docsStyles from "./docs.css" with { type: "css" };
import { nav } from "./nav.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Docs — nmui";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs")}
    <header class="docs-header">
      <h1>Docs</h1>
      <p>Everything below is built with the library itself. If the docs look right, the library works.</p>
    </header>

    <main>
      <section class="docs-section" id="use">
        <h2>Use it</h2>
        <p>One component, on any page. Import the module — the tag registers itself:</p>
        <pre><code>&lt;script type="module"&gt;
  import "./components/button/button.js";
&lt;/script&gt;

&lt;nmui-button tonal large&gt;Push me&lt;/nmui-button&gt;</code></pre>
        <p>Or go full app. <code>index.html</code> stays almost empty — the module
        finds the <code>&lt;App&gt;</code> mount and renders into it:</p>
        <pre><code>&lt;!DOCTYPE html&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;script type="module" src="./app.js"&gt;&lt;/script&gt;
&lt;App&gt;&lt;/App&gt;</code></pre>
      </section>

      <section class="docs-section" id="theme">
        <h2>Theme</h2>
        <p>
          The theme is <strong>one attribute</strong>:
          <code>&lt;html theme="dark"&gt;</code>. Every component reads
          <code>--md-sys-*</code> variables, so recoloring the library is
          recoloring CSS. Try it — this toggle flips the attribute live:
        </p>
        <div class="docs-row">
          <nmui-button tonal id="theme-light">Light</nmui-button>
          <nmui-button tonal id="theme-dark">Dark</nmui-button>
        </div>
        <p>Adding a theme is a CSS block. No JS theming layer exists:</p>
        <pre><code>:root[theme="midnight"] {
  --md-sys-color-primary: #8ab4ff;
  --md-sys-color-on-primary: #001844;
  /* …only override what you want… */
}</code></pre>
        <p class="docs-note">
          The theme is set on <code>&lt;html&gt;</code> by a tiny synchronous
          script in <code>&lt;head&gt;</code>, before first paint — dark mode
          never flashes white. The choice persists in
          <code>localStorage</code>, or call <code>nmui.theme("dark")</code>.
        </p>
      </section>

      <section class="docs-section" id="guides">
        <h2>Guides</h2>
        <div class="docs-row">
          <a data-link href="/docs/getting-started" class="docs-card">
            <strong>Getting started</strong>
            <span>Use the library without this site: get the files, import a component, theme it</span>
          </a>
          <a data-link href="/docs/router" class="docs-card">
            <strong>Router</strong>
            <span>Not M3 — this site's router, plus SPA server fallback for every stack</span>
          </a>
          <a data-link href="/docs/layout" class="docs-card">
            <strong>Layout</strong>
            <span>Panes, breakpoints, canonical layouts</span>
          </a>
          <a data-link href="/docs/theming" class="docs-card">
            <strong>Theming tool</strong>
            <span>Build a theme, check its contrast and alarm colors, export the CSS file</span>
          </a>
        </div>
      </section>

      <section class="docs-section" id="components">
        <h2>Components</h2>
        <div class="docs-row">
          <a data-link href="/docs/button" class="docs-card">
            <strong>Button</strong>
            <span>Variants, sizes, shapes</span>
          </a>
          <a data-link href="/docs/toggle-button" class="docs-card">
            <strong>Toggle button</strong>
            <span>Per-variant selection colors</span>
          </a>
          <a data-link href="/docs/icon-button" class="docs-card">
            <strong>Icon button</strong>
            <span>Filled, tonal, outlined, standard</span>
          </a>
          <a data-link href="/docs/toggle-icon-button" class="docs-card">
            <strong>Toggle icon button</strong>
            <span>Glyph fills when selected</span>
          </a>
          <a data-link href="/docs/split-button" class="docs-card">
            <strong>Split button</strong>
            <span>Action + menu arrow</span>
          </a>
          <a data-link href="/docs/button-group" class="docs-card">
            <strong>Button group</strong>
            <span>Shared width, selection play</span>
          </a>
          <a data-link href="/docs/connected-button-group" class="docs-card">
            <strong>Connected group</strong>
            <span>Joined buttons, sized corners</span>
          </a>
          <a data-link href="/docs/fab" class="docs-card">
            <strong>FAB</strong>
            <span>Four sizes, container colors</span>
          </a>
          <a data-link href="/docs/extended-fab" class="docs-card">
            <strong>Extended FAB</strong>
            <span>Icon + label</span>
          </a>
          <a data-link href="/docs/fab-menu" class="docs-card">
            <strong>FAB menu</strong>
            <span>FAB that opens actions</span>
          </a>
          <a data-link href="/docs/layout" class="docs-card">
            <strong>Layout</strong>
            <span>Panes, breakpoints, canonical layouts</span>
          </a>
          <a data-link href="/docs/app-bar" class="docs-card">
            <strong>App bar</strong>
            <span>Top app bar, small / medium / large</span>
          </a>
          <a data-link href="/docs/badge" class="docs-card">
            <strong>Badge</strong>
            <span>Counts and status dots</span>
          </a>
          <a data-link href="/docs/card" class="docs-card">
            <strong>Card</strong>
            <span>Elevated, filled, outlined</span>
          </a>
          <a data-link href="/docs/carousel" class="docs-card">
            <strong>Carousel</strong>
            <span>Six layouts, dynamic item sizes, parallax</span>
          </a>
          <a data-link href="/docs/checkbox" class="docs-card">
            <strong>Checkbox</strong>
            <span>Native input, three states</span>
          </a>
          <a data-link href="/docs/chip" class="docs-card">
            <strong>Chip</strong>
            <span>Assist, filter, input, suggestion</span>
          </a>
          <a data-link href="/docs/date-picker" class="docs-card">
            <strong>Date picker</strong>
            <span>Docked, modal, and range</span>
          </a>
          <a data-link href="/docs/dialog" class="docs-card">
            <strong>Dialog</strong>
            <span>Modal surface with scrim</span>
          </a>
          <a data-link href="/docs/divider" class="docs-card">
            <strong>Divider</strong>
            <span>Full-width, inset, middle inset, vertical</span>
          </a>
          <a data-link href="/docs/list" class="docs-card">
            <strong>List</strong>
            <span>Standard & segmented rows: leading, text, trailing</span>
          </a>
          <a data-link href="/docs/loading" class="docs-card">
            <strong>Loading indicator</strong>
            <span>Expressive morphing indicator, default & contained</span>
          </a>
          <a data-link href="/docs/menu" class="docs-card">
            <strong>Menu</strong>
            <span>Baseline, vertical & vibrant — submenus, single & multi-select</span>
          </a>
          <a data-link href="/docs/navigation-bar" class="docs-card">
            <strong>Navigation bar</strong>
            <span>Bottom destinations with pill</span>
          </a>
          <a data-link href="/docs/nav-drawer" class="docs-card">
            <strong>Navigation drawer</strong>
            <span>Standard and modal</span>
          </a>
          <a data-link href="/docs/navigation-rail" class="docs-card">
            <strong>Navigation rail</strong>
            <span>Collapsed + expanded, standard + modal</span>
          </a>
          <a data-link href="/docs/progress" class="docs-card">
            <strong>Progress indicators</strong>
            <span>Linear & circular — flat, wavy, configurable thickness</span>
          </a>
          <a data-link href="/docs/radio" class="docs-card">
            <strong>Radio</strong>
            <span>Native grouping, styled</span>
          </a>
          <a data-link href="/docs/search" class="docs-card">
            <strong>Search</strong>
            <span>Bar + docked/full-screen view</span>
          </a>
          <a data-link href="/docs/bottom-sheet" class="docs-card">
            <strong>Bottom sheets</strong>
            <span>Standard + modal, with detents</span>
          </a>
          <a data-link href="/docs/side-sheet" class="docs-card">
            <strong>Side sheets</strong>
            <span>Standard + modal, edge-anchored</span>
          </a>
          <a data-link href="/docs/slider" class="docs-card">
            <strong>Slider</strong>
            <span>Standard, centered, and range — five sizes</span>
          </a>
          <a data-link href="/docs/snackbar" class="docs-card">
            <strong>Snackbar</strong>
            <span>Brief message, optional action — one at a time</span>
          </a>
          <a data-link href="/docs/switch" class="docs-card">
            <strong>Switch</strong>
            <span>Immediate settings, optional handle icons</span>
          </a>
          <a data-link href="/docs/tabs" class="docs-card">
            <strong>Tabs</strong>
            <span>Animated indicator</span>
          </a>
          <a data-link href="/docs/text-field" class="docs-card">
            <strong>Text field</strong>
            <span>Filled, outlined, error</span>
          </a>
          <a data-link href="/docs/time-picker" class="docs-card">
            <strong>Time picker</strong>
            <span>Styled native time input</span>
          </a>
          <a data-link href="/docs/tooltip" class="docs-card">
            <strong>Tooltip</strong>
            <span>Plain and rich</span>
          </a>
        </div>
      </section>

      <section class="docs-section" id="pattern">
        <h2>The pattern</h2>
        <p>Every component follows the same module contract:</p>
        <pre><code>import buttonStyles from "./button.css" with { type: "css" };

document.adoptedStyleSheets.push(buttonStyles);

class NMUIButton extends HTMLElement { /* … */ }

if (!customElements.get("nmui-button")) {
  customElements.define("nmui-button", NMUIButton);
}

export { NMUIButton };</code></pre>
        <ul class="docs-list">
          <li>Co-located <code>.js</code> + <code>.css</code> — styles load as a real stylesheet, no build step.</li>
          <li>Self-registering with a <code>customElements.get</code> guard — importing twice is safe.</li>
          <li>Light DOM, no shadow root — page CSS and themes cascade straight in.</li>
          <li>Bare attributes are the entire config API.</li>
          <li>No guard rails for bad markup — the browser is the debugger.</li>
        </ul>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  const on = (id, fn) => mount.querySelector(id)?.addEventListener("click", fn);
  on("#theme-light", () => nmui.theme("light"));
  on("#theme-dark", () => nmui.theme("dark"));
}
