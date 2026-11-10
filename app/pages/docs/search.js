import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Search — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/search")}
    <header class="docs-header">
      <h1>Search</h1>
      <p>The M3 search bar over a native input. Clear button appears when there's text; Escape clears too.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Search bar</h2>
        ${demo(`<nmui-search><input type="search" placeholder="Search"></nmui-search>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;
}
