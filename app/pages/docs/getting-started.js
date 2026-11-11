import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Getting started — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/getting-started")}
    <header class="docs-header">
      <h1>Getting started</h1>
      <p>nmui is a library, not a framework: copy the component folders into your project, import the ones you use, and write the tags. There is nothing to install, nothing to compile, and no runtime to keep happy — every component is a self-registering custom element in plain JS with its CSS riding along.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>1. Get the files</h2>
        <p>Clone the repo or download it, and take the two folders that are the library — <code>components/</code> and <code>css/</code> (<code>layout/</code> too, if you want the Panes layout system). The rest of the repo is this documentation site, which is built with the library but isn't part of it.</p>
        <pre class="docs-code">git clone https://github.com/nativemui/nmui.git</pre>
      </section>

      <section class="docs-section">
        <h2>2. Import a component and use it</h2>
        <p>Importing a component registers it — that's the whole setup. Then the tag just works, in any HTML page, with or without the rest of nmui:</p>
        ${demo(`<nmui-button tonal>Save draft</nmui-button>
<nmui-button>Publish</nmui-button>`)}
        <pre class="docs-code">&lt;script type="module"&gt;
  import "./components/button/button.js";
&lt;/script&gt;

&lt;nmui-button tonal&gt;Save draft&lt;/nmui-button&gt;</pre>
        <p class="demo-hint">Variants are bare attributes — <code>tonal</code>, <code>outlined</code>, <code>xxlarge</code>, <code>rounded</code> — never classes or config objects. Settings live on the tag.</p>
      </section>

      <section class="docs-section">
        <h2>3. Or import everything</h2>
        <p>The barrel file registers every component at once. Fine for an app built entirely on nmui; import individually when you only need a few.</p>
        <pre class="docs-code">&lt;script type="module"&gt;
  import "./components/index.js";
&lt;/script&gt;</pre>
      </section>

      <section class="docs-section">
        <h2>4. Theme it</h2>
        <p>Components read the standard M3 color roles (<code>--md-sys-color-*</code>), so they pick up any theme that defines them — and they ship with baseline fallbacks, so they look right with no theme at all. For the full light/dark themes, include the theme CSS and flip one attribute:</p>
        <pre class="docs-code">&lt;link rel="stylesheet" href="./css/themes.css"&gt;
&lt;html theme="dark"&gt;   &lt;!-- or "light" --&gt;</pre>
        <p>Writing your own theme is one CSS file of color roles — the <a data-link href="/docs/theming">theming tool</a> edits them against a live preview and exports exactly that file.</p>
      </section>

      <section class="docs-section">
        <h2>5. Working with components in code</h2>
        <p>Components behave like the native elements they decorate. State is attributes and properties — <code>btn.selected = true</code> updates silently, <code>btn.click()</code> performs the full press, events included — and interactions report through a custom <code>change</code> event whose <code>event.detail</code> carries the value. Every component's docs page has an Events section with its exact payload. No framework bindings, no wrappers: if you can use a <code>&lt;button&gt;</code>, you can use these.</p>
      </section>

      <section class="docs-section">
        <h2>Browser support</h2>
        <p>Chrome/Edge 93+ and Firefox 147+. nmui imports each component's CSS as a native CSS module (<code>with { type: "css" }</code>), which Safari doesn't support (<a href="https://bugs.webkit.org/show_bug.cgi?id=227967">WebKit bug 227967</a>) — Safari is intentionally left behind. Everything else is standard web platform: custom elements, constructable stylesheets, <code>color-mix</code>.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — <a href="https://github.com/nativemui/nmui">github.com/nativemui/nmui</a></p>
    </footer>
  </div>`;
}
