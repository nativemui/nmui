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
        <p><strong>The ecosystem, answered.</strong> Most of that ecosystem exists to fill gaps the platform has since closed. Routing, state, theming — <a data-link href="/docs/router">the Router guide</a>, <a data-link href="/docs/state">the State guide</a>, and the Theming tool cover each in a page, no install. What's left is your app, and your app is plain JavaScript.</p>
        <p><strong>Hiring, answered.</strong> The hiring pool for NMUI is every web developer alive. It is HTML, CSS, and JavaScript — no framework to already know, no six-month ramp to hire for.</p>
        <p><strong>Server rendering, answered.</strong> Most pages don't need it. Static hosting, the router, and the page you're reading — that's the stack. Next.js is a good answer to a problem most pages don't have.</p>
        <p><strong>Scale patterns, answered.</strong> Those patterns exist to manage complexity React creates — build config, state libraries, version churn across fifty engineers. Remove the framework and most of the complexity goes with it.</p>
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
