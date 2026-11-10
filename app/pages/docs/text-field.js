import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Text field — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/text-field")}
    <header class="docs-header">
      <h1>Text field</h1>
      <p>Decorates a native input or textarea plus its label. Filled or <code>outlined</code>; <code>error</code> for invalid state; <code>&lt;small&gt;</code> for supporting text.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Filled</h2>
        ${demo(`<nmui-text-field>
  <label>Name</label>
  <input>
  <small>Supporting text</small>
</nmui-text-field>`)}
      </section>

      <section class="docs-section">
        <h2>Outlined and error</h2>
        ${demo(`<nmui-text-field outlined>
  <label>Email</label>
  <input type="email">
</nmui-text-field>
<nmui-text-field outlined error>
  <label>Email</label>
  <input type="email" value="not-an-email">
  <small>Enter a valid email</small>
</nmui-text-field>`)}
      </section>

      <section class="docs-section">
        <h2>Textarea</h2>
        ${demo(`<nmui-text-field outlined>
  <label>Notes</label>
  <textarea></textarea>
</nmui-text-field>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;
}
