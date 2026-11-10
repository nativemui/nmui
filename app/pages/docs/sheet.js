import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Sheet — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/sheet")}
    <header class="docs-header">
      <h1>Sheet</h1>
      <p>Bottom sheet by default, <code>side</code> docks to the edge. <code>modal</code> adds a scrim.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Modal bottom sheet</h2>
        ${demo(`<nmui-button tonal id="demo-sheet-open">Open sheet</nmui-button>
<nmui-sheet modal id="demo-sheet">
  <headline small>Share</headline>
  <nmui-list>
    <nmui-list item><icon>link</icon>Copy link</nmui-list>
    <nmui-list item><icon>mail</icon>Email</nmui-list>
  </nmui-list>
</nmui-sheet>`)}
      </section>

      <section class="docs-section">
        <h2>Side sheet</h2>
        ${demo(`<nmui-button tonal id="demo-side-open">Open side sheet</nmui-button>
<nmui-sheet side id="demo-side">
  <headline small>Details</headline>
  <p>Side sheets hold supplementary content.</p>
</nmui-sheet>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  const wire = (btnId, sheetId) => {
    const sheet = mount.querySelector("#" + sheetId);
    mount.querySelector("#" + btnId)?.addEventListener("click", () => sheet.show());
  };
  wire("demo-sheet-open", "demo-sheet");
  wire("demo-side-open", "demo-side");
}
