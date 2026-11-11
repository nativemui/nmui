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
        <p><strong>Approachable, answered.</strong> NMUI is more approachable still: there is nothing to learn beyond the platform. No reactivity model, no single-file-component syntax, no framework concepts at all.</p>
        <p><strong>Flexible, answered.</strong> NMUI flexes the same way — import one component or the whole set — except the floor is lower: a single HTML file with an import, no CDN-versus-build decision to make.</p>
        <p><strong>The ecosystem, answered.</strong> Most of it fills gaps the platform has since closed — routing, state, and theming are guides on this site, not packages to install. What's left is your app, in plain JavaScript.</p>
        <p><strong>Nuxt, answered.</strong> Nuxt solves server rendering — a problem most pages don't have. Static hosting, the router, and the page you're on: that's the stack.</p>
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
