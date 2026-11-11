import docsStyles from "../docs.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "NMUI vs Angular";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    <header class="docs-header">
      <h1>NMUI vs Angular</h1>
      <p>Angular is the full platform — TypeScript-first, batteries included, built for enterprise teams. NMUI is the opposite bet: the page, not the platform.</p>
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
            <tr><td>Angular</td><td>Yes</td><td>Angular</td><td>Bring your own (Angular Material)</td></tr>
          </tbody>
        </table>
        </div>
      </section>

      <section class="docs-section">
        <h2>Where Angular wins</h2>
        <p><strong>Everything included.</strong> Router, forms, HTTP, dependency injection, testing — all in the box, all documented together.</p>
        <p><strong>Enterprise scale.</strong> Strong opinions and long-term support for huge teams and codebases that live for a decade.</p>
        <p><strong>TypeScript throughout.</strong> Types are not bolted on; the whole platform is written in them.</p>
      </section>

      <section class="docs-section">
        <h2>Where NMUI wins</h2>
        <p><strong>No build step.</strong> Angular is a toolchain — CLI, compiler, config. NMUI is an import statement.</p>
        <p><strong>No TypeScript requirement.</strong> You can write TypeScript with NMUI if you want it, but nothing in the library demands it.</p>
        <p><strong>No framework to learn.</strong> Angular is a large body of knowledge — modules, decorators, RxJS, change detection. NMUI is the platform with attributes.</p>
        <p><strong>M3 built in.</strong> Angular Material is a separate library with its own API; NMUI is the component library.</p>
      </section>

      <section class="docs-section">
        <h2>When to pick which</h2>
        <p>Pick Angular when you're building enterprise software with a large team and want the whole platform under one roof. Pick NMUI when the page is small and the platform is overhead.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p><a data-link href="/why-nmui">← Why NMUI</a></p>
    </footer>
  </div>`;
}
