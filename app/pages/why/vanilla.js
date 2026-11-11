import docsStyles from "../docs.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "NMUI vs Hand-rolled vanilla";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    <header class="docs-header">
      <h1>NMUI vs Hand-rolled vanilla</h1>
      <p>Hand-rolled vanilla is the honest baseline — plain HTML, CSS, and JS, nothing you didn't write. NMUI is what you build when you get tired of rewriting it.</p>
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
            <tr><td>Hand-rolled vanilla</td><td>None</td><td>None</td><td>You build it</td></tr>
          </tbody>
        </table>
        </div>
      </section>

      <section class="docs-section">
        <h2>Where vanilla wins</h2>
        <p><strong>Total control.</strong> Exactly what you need, nothing you don't. No API to fight, no opinions to work around.</p>
        <p><strong>Zero dependencies.</strong> Nothing to update, nothing to audit, nothing that breaks on someone else's major version.</p>
        <p><strong>No abstraction.</strong> What you see is what the browser runs — debugging is reading your own code.</p>
      </section>

      <section class="docs-section">
        <h2>Where NMUI wins</h2>
        <p><strong>Total control, answered.</strong> NMUI keeps the control: themes are variables, components take attributes, and every component is plain HTML, CSS, and JS you can read. What you give up is writing the same dialog for the fifth time.</p>
        <p><strong>Zero dependencies, answered.</strong> Same premise — zero is the shared starting point. NMUI is what you get when you spend that zero-dependency budget once, on a library, instead of once per component.</p>
        <p><strong>No abstraction, answered.</strong> NMUI's abstraction is one element per component — the thinnest layer that still saves you the work. The browser still does the rendering; the library just stops you rewriting it. Dialogs, menus, date pickers, and nav rails are weeks of work with accessibility done right — and every one of them needs hover, focus, pressed, disabled, and error states.</p>
      </section>

      <section class="docs-section">
        <h2>When to pick which</h2>
        <p>Pick hand-rolled when you have very few components and the design is fully custom — a landing page with three buttons does not need a library. Pick NMUI when you'd be rebuilding a component library anyway, and you'd rather start from one that already exists.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p><a data-link href="/why-nmui">← Why NMUI</a></p>
    </footer>
  </div>`;
}
