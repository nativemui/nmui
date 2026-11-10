import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Divider — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/divider")}
    <header class="docs-header">
      <h1>Divider</h1>
      <p><code>&lt;nmui-divider&gt;</code> — a 1dp rule in outline-variant that groups content and builds hierarchy. Visible but not bold, and only where open space can't group things on its own. Three horizontal forms — full width, <code>inset</code>, <code>middle-inset</code> — plus a <code>vertical</code> form for rows. It is decorative: no content, no events.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Full width</h2>
        <p>For separating larger sections of unrelated content, or interactive from non-interactive areas of a container. Use it sparingly — a wall of rules reads as clutter.</p>
        ${demo(`<p>Above the rule</p>
<nmui-divider></nmui-divider>
<p>Below the rule</p>`)}
      </section>

      <section class="docs-section">
        <h2>Inset — [inset]</h2>
        <p>16dp in from the leading edge, flush at the trailing edge. For related items inside one section — the classic list look, where the rule aligns with the text and skips the icon or avatar anchoring each row.</p>
        ${demo(`<p>First item</p>
<nmui-divider inset></nmui-divider>
<p>Second item</p>
<nmui-divider inset></nmui-divider>
<p>Third item</p>`)}
      </section>

      <section class="docs-section">
        <h2>Middle inset — [middle-inset]</h2>
        <p>16dp in from both edges. The inset form for content that is itself padded on both sides, so the rule floats between the margins instead of running to one edge.</p>
        ${demo(`<p>First item</p>
<nmui-divider middle-inset></nmui-divider>
<p>Second item</p>`)}
      </section>

      <section class="docs-section">
        <h2>Vertical — [vertical]</h2>
        <p>For larger screens: separating content arranged in a row, like text beside media. It stretches to the row's height; <code>[inset]</code> and <code>[middle-inset]</code> inset its ends the same way they inset the horizontal edges.</p>
        ${demo(`<div style="display:flex;align-items:center;height:64px">
  <span>Left</span>
  <nmui-divider vertical></nmui-divider>
  <span>Middle</span>
  <nmui-divider vertical inset></nmui-divider>
  <span>Right</span>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["(none)", "—", "—", "a divider dispatches no custom events and receives no interaction — it is not focusable or clickable"],
        ])}
        <p>Semantics are the whole API: the element carries <code>role="separator"</code> (what a native <code>&lt;hr&gt;</code> exposes), and a <code>[vertical]</code> divider adds <code>aria-orientation="vertical"</code>, kept in sync if you toggle the attribute in code. M3 counts dividers as decorative — they have no contrast minimums — so the rest is pure CSS: restyle or hide it like any element.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/divider/specs">m3.material.io/components/divider</a></p>
    </footer>
  </div>`;
}
