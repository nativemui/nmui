import docsStyles from "../docs.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "NMUI vs Tailwind";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    <header class="docs-header">
      <h1>NMUI vs Tailwind</h1>
      <p>Tailwind is utility-first CSS — compose styles from classes. It is not a component library, and that is the whole difference.</p>
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
            <tr><td>Tailwind</td><td>Yes, in practice</td><td>None (it's CSS)</td><td>Bring your own — utilities, not components</td></tr>
          </tbody>
        </table>
        </div>
      </section>

      <section class="docs-section">
        <h2>Where Tailwind wins</h2>
        <p><strong>Total control.</strong> Every pixel is yours — no component opinions to fight when the design goes off-script.</p>
        <p><strong>Fast once fluent.</strong> The classes become muscle memory, and you rarely leave your markup file.</p>
        <p><strong>No JS opinions.</strong> It is CSS. Pair it with anything — React, Vue, vanilla, whatever the app already is.</p>
      </section>

      <section class="docs-section">
        <h2>Where NMUI wins</h2>
        <p><strong>Actual components.</strong> Tailwind gives you classes; you build every dialog, menu, and nav rail yourself — behavior included. NMUI ships the components.</p>
        <p><strong>M3 built in.</strong> Tailwind has no opinion about Material. Getting to M3 means designing every component's states, motion, and elevation yourself.</p>
        <p><strong>No build step.</strong> Tailwind's build scans your markup to generate CSS. NMUI is an import statement.</p>
        <p><strong>Behavior, not just looks.</strong> Ripples, focus, keyboard, selection, dialogs — NMUI components do things, not just look like things.</p>
      </section>

      <section class="docs-section">
        <h2>When to pick which</h2>
        <p>Pick Tailwind when you want full control and you're happy building components from utilities. Pick NMUI when you want the components already built, in Material 3 — and when you'd rather write <code>&lt;nmui-button tonal&gt;</code> than a dozen classes that approximate a button.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p><a data-link href="/why-nmui">← Why NMUI</a></p>
    </footer>
  </div>`;
}
