import docsStyles from "../docs.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "NMUI vs Bootstrap";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    <header class="docs-header">
      <h1>NMUI vs Bootstrap</h1>
      <p>Bootstrap is the classic kit — grid, components, and a decade of familiarity, working straight from a CDN. NMUI is the same idea, rebuilt for Material 3.</p>
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
            <tr><td>Bootstrap</td><td>No (CDN works)</td><td>Small JS for some components</td><td>No — its own look</td></tr>
          </tbody>
        </table>
        </div>
      </section>

      <section class="docs-section">
        <h2>Where Bootstrap wins</h2>
        <p><strong>Familiar.</strong> Everyone has used it. The docs, the answers, and the muscle memory are all already there.</p>
        <p><strong>Zero build.</strong> A CDN link and you are going — the same no-toolchain story NMUI tells.</p>
        <p><strong>Battle-tested.</strong> A decade of production use on millions of sites. The rough edges are long gone.</p>
      </section>

      <section class="docs-section">
        <h2>Where NMUI wins</h2>
        <p><strong>M3 Expressive.</strong> Bootstrap has its own look, and it is not Material. If the design should be Material 3, Bootstrap is the wrong shape.</p>
        <p><strong>Components as elements.</strong> Bootstrap is classes plus data attributes; NMUI is custom elements with bare attributes — <code>&lt;nmui-button tonal&gt;</code> instead of a class list.</p>
        <p><strong>Modern.</strong> No jQuery-era patterns, no global CSS that fights your own. Theming is CSS variables, not a Sass build.</p>
      </section>

      <section class="docs-section">
        <h2>When to pick which</h2>
        <p>Pick Bootstrap when you want the familiar kit and don't care about Material 3. Pick NMUI when the design should be Material 3 — and when you'd rather write an element than a class list.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p><a data-link href="/why-nmui">← Why NMUI</a></p>
    </footer>
  </div>`;
}
