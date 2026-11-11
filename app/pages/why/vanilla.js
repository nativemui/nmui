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
        <p><strong>You don't write 30+ components yourself.</strong> Dialogs, menus, date pickers, and nav rails are weeks of work with accessibility done right — and every one of them needs hover, focus, pressed, disabled, and error states.</p>
        <p><strong>M3 already applied.</strong> The spec, the tokens, the motion, the elevation — done, consistent, and tested against real browsers.</p>
        <p><strong>Consistent.</strong> One library, one set of patterns, instead of thirty one-off implementations that drift apart over a year.</p>
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
