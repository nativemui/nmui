import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Dialog — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/dialog")}
    <header class="docs-header">
      <h1>Dialog</h1>
      <p>A modal surface with scrim. <code>headline</code> for the title, free content, <code>actions</code> for the buttons. Escape and scrim clicks close it.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Basic dialog</h2>
        ${demo(`<nmui-button tonal id="demo-dialog-open">Open dialog</nmui-button>
<nmui-dialog id="demo-dialog">
  <headline>Delete item?</headline>
  <p>This can't be undone.</p>
  <actions>
    <nmui-button text data-close>Cancel</nmui-button>
    <nmui-button text>Delete</nmui-button>
  </actions>
</nmui-dialog>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  const dialog = mount.querySelector("#demo-dialog");
  mount.querySelector("#demo-dialog-open")?.addEventListener("click", () => dialog.show());
}
