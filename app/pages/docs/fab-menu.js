import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";
import { familyNav } from "./button-family.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "FAB menu — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/button")}
    <header class="docs-header">
      <h1>FAB menu</h1>
      <p><code>&lt;nmui-button fab menu&gt;</code> — a FAB that opens a stack of actions. Button children become the actions (they measure like medium buttons); the remaining content is the FAB's icon. Open, the trigger becomes the circular close button — medium/large triggers shrink to 56 — and the icon swaps to the close glyph. Picking an action, clicking outside, or Escape closes it. <code>open()</code> / <code>close()</code> / <code>toggle()</code> are public.</p>
    </header>

    ${familyNav("/docs/fab-menu")}

    <main>
      <section class="docs-section">
        <h2>Primary set (default)</h2>
        ${demo(`<nmui-button fab menu id="demo-fabmenu">
  <icon>add</icon>
  <nmui-button><icon>note</icon>New note</nmui-button>
  <nmui-button><icon>task</icon>New task</nmui-button>
  <nmui-button><icon>event</icon>New event</nmui-button>
</nmui-button>`)}
        <output id="demo-fabmenu-out" class="docs-output">open it…</output>
        ${evTable([
          ["change (custom)", "the host", "detail: {value, button, open}", "the menu opens or closes — trigger press, picking an action, outside click, Escape, or open() / close() / toggle()"],
          ["click / change", "an action button (bubbles through the host)", "the action's own detail", "an action is picked; the menu closes — tell it from the host's event by e.target"],
        ])}
        <p>The output above already separates the two: host <code>change</code> reports <code>open</code>, action presses arrive as the action's own event. Unlike the silent property sets elsewhere, the public methods <code>open()</code> / <code>close()</code> / <code>toggle()</code> <em>do</em> fire the host's <code>change</code> — they are actions, not state sets. State itself is the <code>[open]</code> attribute.</p>
      </section>

      <section class="docs-section">
        <h2>Secondary set</h2>
        ${demo(`<nmui-button fab menu secondary>
  <icon>add</icon>
  <nmui-button><icon>note</icon>New note</nmui-button>
  <nmui-button><icon>task</icon>New task</nmui-button>
</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Tertiary set</h2>
        ${demo(`<nmui-button fab menu tertiary>
  <icon>add</icon>
  <nmui-button><icon>note</icon>New note</nmui-button>
  <nmui-button><icon>task</icon>New task</nmui-button>
</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Medium trigger — shrinks to the 56 close button</h2>
        ${demo(`<nmui-button fab menu medium>
  <icon>add</icon>
  <nmui-button><icon>note</icon>New note</nmui-button>
  <nmui-button><icon>task</icon>New task</nmui-button>
</nmui-button>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/fab-menu/specs">m3.material.io/components/fab-menu</a></p>
    </footer>
  </div>`;

  const out = mount.querySelector("#demo-fabmenu-out");
  mount.querySelector("#demo-fabmenu")?.addEventListener("change", (e) => {
    if (e.target.id === "demo-fabmenu") out.textContent = `fab menu → open: ${e.detail.open}`;
    else out.textContent = `action → ${e.target.textContent.trim()}`;
  });
}
