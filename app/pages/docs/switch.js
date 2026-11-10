import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Switch — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/switch")}
    <header class="docs-header">
      <h1>Switch</h1>
      <p>Decorates a native checkbox. <code>icons</code> shows check / x glyphs in the thumb.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>States</h2>
        ${demo(`<nmui-switch><input type="checkbox">Off</nmui-switch>
<nmui-switch><input type="checkbox" checked>On</nmui-switch>
<nmui-switch><input type="checkbox" disabled>Disabled</nmui-switch>`)}
      </section>

      <section class="docs-section">
        <h2>Thumb icons</h2>
        ${demo(`<nmui-switch icons><input type="checkbox">Wi-Fi</nmui-switch>
<nmui-switch icons><input type="checkbox" checked>Bluetooth</nmui-switch>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;
}
