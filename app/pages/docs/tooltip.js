import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Tooltip — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/tooltip")}
    <header class="docs-header">
      <h1>Tooltip</h1>
      <p>Lives inside its anchor; shows on hover or focus. <code>rich</code> adds a title and actions.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Plain</h2>
        <p>Hover or focus the buttons:</p>
        ${demo(`<nmui-button icon aria-label="Delete">delete<nmui-tooltip>Delete</nmui-tooltip></nmui-button>
<nmui-button icon aria-label="Share">share<nmui-tooltip>Share</nmui-tooltip></nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Rich</h2>
        ${demo(`<nmui-button icon aria-label="Sync status">sync<nmui-tooltip rich>
  <strong>Sync status</strong>
  <span>Last synced 2 minutes ago.</span>
  <actions><nmui-button text>Retry</nmui-button></actions>
</nmui-tooltip></nmui-button>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;
}
