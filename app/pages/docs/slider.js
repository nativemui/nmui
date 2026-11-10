import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Slider — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/slider")}
    <header class="docs-header">
      <h1>Slider</h1>
      <p>Decorates a native range input. <code>discrete</code> renders tick marks from min / max / step.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Continuous</h2>
        ${demo(`<nmui-slider><input type="range" value="40"></nmui-slider>`)}
      </section>

      <section class="docs-section">
        <h2>Discrete</h2>
        ${demo(`<nmui-slider discrete><input type="range" min="0" max="5" step="1" value="3"></nmui-slider>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;
}
