import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Radio — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/radio")}
    <header class="docs-header">
      <h1>Radio</h1>
      <p>Decorates native radio inputs. The <code>name</code> attribute groups them natively — the visuals follow.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Group</h2>
        ${demo(`<nmui-radio><input type="radio" name="demo-size" checked>Small</nmui-radio>
<nmui-radio><input type="radio" name="demo-size">Medium</nmui-radio>
<nmui-radio><input type="radio" name="demo-size">Large</nmui-radio>
<nmui-radio><input type="radio" name="demo-size" disabled>Disabled</nmui-radio>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;
}
