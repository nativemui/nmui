import docsStyles from "../docs.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "NMUI vs Vue";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    <header class="docs-header">
      <h1>NMUI vs Vue</h1>
      <p>Vue is the progressive framework — use a little or a lot, with the gentlest learning curve of the big frameworks. NMUI is what you get when you use none of it.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>At a glance</h2>
        <div class="docs-table-wrap">
        <table class="docs-compare">
          <thead>
            <tr><th></th><th>Build step</th><th>Runtime shipped</th><th>M3 Expressive</th></tr>
          </thead>
          <tbody>
            <tr><td>NMUI</td><td>None — import a file</td><td>None (native custom elements)</td><td>Built in</td></tr>
            <tr><td>Vue</td><td>Yes, for single-file components</td><td>Vue</td><td>Bring your own</td></tr>
          </tbody>
        </table>
        </div>
      </section>

      <section class="docs-section">
        <h2>Where Vue wins</h2>
        <p><strong>Approachable.</strong> Templates read like HTML, and the documentation is famously good — the easiest on-ramp of the big frameworks.</p>
        <p><strong>Flexible.</strong> Drop it on a page via CDN for a widget, or build a full single-page app. It scales down as well as up.</p>
        <p><strong>Ecosystem.</strong> Router, state, and a huge community — especially strong outside the US.</p>
        <p><strong>Nuxt.</strong> Server rendering and static generation with the same gentle model.</p>
      </section>

      <section class="docs-section">
        <h2>Where NMUI wins</h2>
        <p><strong>No build step.</strong> Single-file components need a compiler. NMUI is an import statement.</p>
        <p><strong>No runtime.</strong> Vue ships to every visitor. NMUI ships nothing.</p>
        <p><strong>M3 built in.</strong> With Vue you add a component library for Material — another dependency, another API. NMUI is the component library.</p>
        <p><strong>Nothing to learn on top.</strong> Vue's reactivity model is pleasant, but it is still a model. NMUI has no model — it is the platform, with attributes.</p>
      </section>

      <section class="docs-section">
        <h2>When to pick which</h2>
        <p>Pick Vue when you want a framework with a gentle ramp, its ecosystem, and the option to grow into a full app. Pick NMUI when you want Material 3 with zero toolchain and the page is the product.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p><a data-link href="/why-nmui">← Why NMUI</a></p>
    </footer>
  </div>`;
}
