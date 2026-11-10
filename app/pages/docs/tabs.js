import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Tabs — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/tabs")}
    <header class="docs-header">
      <h1>Tabs</h1>
      <p>An animated indicator tracks the selected tab. Arrow keys move between tabs.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Primary</h2>
        ${demo(`<nmui-tabs>
  <a selected><icon>home</icon>Home</a>
  <a><icon>search</icon>Search</a>
  <a><icon>settings</icon>Settings</a>
</nmui-tabs>`)}
      </section>

      <section class="docs-section">
        <h2>Secondary</h2>
        ${demo(`<nmui-tabs secondary>
  <a selected>All</a>
  <a>Unread</a>
  <a>Starred</a>
</nmui-tabs>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;
}
