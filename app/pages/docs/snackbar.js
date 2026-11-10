import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Snackbar — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/snackbar")}
    <header class="docs-header">
      <h1>Snackbar</h1>
      <p>A brief message with an optional action. Auto-hides after 4s unless <code>persistent</code>.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>With action</h2>
        ${demo(`<nmui-button tonal id="demo-snack-open">Save draft</nmui-button>
<nmui-snackbar id="demo-snack">
  <span>Draft saved</span>
  <nmui-button text>Undo</nmui-button>
</nmui-snackbar>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  const snack = mount.querySelector("#demo-snack");
  mount.querySelector("#demo-snack-open")?.addEventListener("click", () => snack.show());
  snack?.addEventListener("action", () => {
    snack.show("Undone");
  });
}
