import docsStyles from "../docs.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "NMUI vs Material Web";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    <header class="docs-header">
      <h1>NMUI vs Material Web</h1>
      <p>Material Web is Google's official M3 web components, built on Lit. NMUI is the same spec with the runtime removed.</p>
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
            <tr><td>Material Web</td><td>Usually (Lit components, normally bundled)</td><td>Lit</td><td>Built in (Google's own)</td></tr>
          </tbody>
        </table>
        </div>
      </section>

      <section class="docs-section">
        <h2>Where Material Web wins</h2>
        <p><strong>Official.</strong> Google's own components — the closest thing to a reference implementation of the spec.</p>
        <p><strong>Web components.</strong> Real custom elements, framework-agnostic, usable anywhere a browser runs.</p>
        <p><strong>Fidelity.</strong> It tracks the spec as it evolves, because the people writing the spec write the components.</p>
      </section>

      <section class="docs-section">
        <h2>Where NMUI wins</h2>
        <p><strong>Official, answered.</strong> Official is a strong argument, and NMUI doesn't claim to be Google. What it claims is the same public spec, zero dependencies, and a smaller surface. The spec belongs to everyone; anyone can build to it.</p>
        <p><strong>Web components, answered.</strong> NMUI is web components too — real custom elements, framework-agnostic. The difference is what ships with them: Lit, or nothing.</p>
        <p><strong>Fidelity, answered.</strong> Fidelity to the spec is the whole project here as well — the tokens, the motion, the elevation are the spec's own values. The difference is NMUI doesn't need a runtime to render them.</p>
      </section>

      <section class="docs-section">
        <h2>When to pick which</h2>
        <p>Pick Material Web when you want Google's official components and don't mind the Lit runtime. Pick NMUI when you want Material 3 with literally zero dependencies.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p><a data-link href="/why-nmui">← Why NMUI</a></p>
    </footer>
  </div>`;
}
