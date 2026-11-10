import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Navigation drawer — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/nav-drawer")}
    <header class="docs-header">
      <h1>Navigation drawer</h1>
      <p>In-flow by default; <code>modal</code> slides over content with a scrim.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Standard</h2>
        ${demo(`<nmui-nav-drawer>
  <headline small>Mail</headline>
  <a selected><icon>inbox</icon>Inbox</a>
  <a><icon>send</icon>Sent</a>
  <a><icon>draft</icon>Drafts</a>
</nmui-nav-drawer>`)}
      </section>

      <section class="docs-section">
        <h2>Modal</h2>
        ${demo(`<nmui-button tonal id="demo-drawer-open">Open drawer</nmui-button>
<nmui-nav-drawer modal id="demo-drawer">
  <headline small>Mail</headline>
  <a selected><icon>inbox</icon>Inbox</a>
  <a><icon>send</icon>Sent</a>
</nmui-nav-drawer>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  const drawer = mount.querySelector("#demo-drawer");
  mount.querySelector("#demo-drawer-open")?.addEventListener("click", () => drawer.show());
}
