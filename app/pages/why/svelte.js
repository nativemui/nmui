import docsStyles from "../docs.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "NMUI vs Svelte";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    <header class="docs-header">
      <h1>NMUI vs Svelte</h1>
      <p>Svelte is a compiler — you write components, it compiles them to vanilla JS with almost no runtime. NMUI skips the compiler too.</p>
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
            <tr><td>Svelte</td><td>Yes (compiler)</td><td>Almost none — compiled away</td><td>Bring your own</td></tr>
          </tbody>
        </table>
        </div>
      </section>

      <section class="docs-section">
        <h2>Where Svelte wins</h2>
        <p><strong>Tiny runtime.</strong> The compiler does the work up front and mostly disappears — what ships is small and fast.</p>
        <p><strong>Less boilerplate.</strong> Reactive assignments read like plain JavaScript, not framework calls.</p>
        <p><strong>Fast.</strong> Compiled output, no virtual DOM diffing — updates touch exactly what changed.</p>
        <p><strong>SvelteKit.</strong> Routing, SSR, and adapters in one coherent package when the app grows.</p>
      </section>

      <section class="docs-section">
        <h2>Where NMUI wins</h2>
        <p><strong>Tiny runtime, answered.</strong> NMUI's runtime is zero — not tiny, zero. There is nothing to compile away, because there is nothing to compile.</p>
        <p><strong>Less boilerplate, answered.</strong> NMUI has less still: an element and its attributes. No component script block, no reactive declarations, no framework syntax of any kind.</p>
        <p><strong>Fast, answered.</strong> Compiled output is fast; no output is faster. No hydration, no runtime diffing — the browser renders the markup directly.</p>
        <p><strong>SvelteKit, answered.</strong> Routing, SSR, and adapters are a framework around the compiler. NMUI's answer is <a data-link href="/docs/router">the Router guide</a>: a tiny router and static hosting.</p>
      </section>

      <section class="docs-section">
        <h2>When to pick which</h2>
        <p>Pick Svelte when you want a framework's ergonomics with minimal runtime cost. Pick NMUI when you want zero toolchain, period — no compiler, no config, no dev server.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p><a data-link href="/why-nmui">← Why NMUI</a></p>
    </footer>
  </div>`;
}
