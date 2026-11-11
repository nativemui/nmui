import docsStyles from "../docs.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "NMUI vs React";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    <header class="docs-header">
      <h1>NMUI vs React</h1>
      <p>React is the component library the whole industry standardized on — a JavaScript UI library with a virtual DOM and the biggest ecosystem in frontend. NMUI is the same idea with the framework removed.</p>
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
            <tr><td>React</td><td>Yes (JSX + bundler)</td><td>React + ReactDOM</td><td>Bring your own (MUI, etc.)</td></tr>
          </tbody>
        </table>
        </div>
      </section>

      <section class="docs-section">
        <h2>Where React wins</h2>
        <p><strong>The ecosystem.</strong> A library for everything — routing, state, forms, data — and an answer somewhere for every error you will ever hit.</p>
        <p><strong>Hiring.</strong> More React developers exist than any other frontend pool. A team that knows React is a team you can staff.</p>
        <p><strong>Server rendering.</strong> Next.js makes SSR and static generation a solved problem, with hosting to match.</p>
        <p><strong>Scale patterns.</strong> Years of established practice for apps with fifty engineers and a million lines of code.</p>
      </section>

      <section class="docs-section">
        <h2>Where NMUI wins</h2>
        <p><strong>No build step.</strong> JSX needs a compiler and a bundler. NMUI is an import statement.</p>
        <p><strong>No runtime.</strong> React and ReactDOM ship to every visitor on every page load. NMUI ships nothing — the browser is the runtime.</p>
        <p><strong>M3 built in.</strong> With React you add MUI or another kit — another dependency with its own API to learn, on top of React's.</p>
        <p><strong>Smaller surface.</strong> One element per component family, settings as attributes. There is no framework API to memorize on top of the platform.</p>
      </section>

      <section class="docs-section">
        <h2>When to pick which</h2>
        <p>Pick React when the app is big, the team is big, you need server rendering, or you need a library that already exists for a strange requirement. Pick NMUI when the page is the product, the design is Material 3, and you'd rather ship than configure.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p><a data-link href="/why-nmui">← Why NMUI</a></p>
    </footer>
  </div>`;
}
