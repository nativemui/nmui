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
        <p><strong>No compiler at all.</strong> Svelte still needs a build step — a compiler, a config, a dev server. NMUI is an import statement.</p>
        <p><strong>M3 built in.</strong> Svelte gives you the framework; a Material component library is still something you add on top.</p>
        <p><strong>No framework concepts.</strong> No stores, no runes, no Svelte-specific API to keep up with. The platform is the API.</p>
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
