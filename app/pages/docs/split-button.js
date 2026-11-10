import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";
import { familyNav } from "./button-family.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Split button — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/button")}
    <header class="docs-header">
      <h1>Split button</h1>
      <p><code>&lt;nmui-button split&gt;</code> — a common button joined to a menu icon button. The host copies its variant and size to both children. Clicking the arrow toggles <code>[open]</code> on the host: the arrow button becomes a circle and its arrow rotates up.</p>
    </header>

    ${familyNav("/docs/split-button")}

    <main>
      <section class="docs-section">
        <h2>Sizes — declared once, on the host</h2>
        ${demo(`<nmui-button split tonal xsmall>
  <nmui-button>Send</nmui-button>
  <nmui-button icon>arrow_drop_down</nmui-button>
</nmui-button>
<nmui-button split tonal>
  <nmui-button>Send</nmui-button>
  <nmui-button icon>arrow_drop_down</nmui-button>
</nmui-button>
<nmui-button split tonal medium>
  <nmui-button>Send</nmui-button>
  <nmui-button icon>arrow_drop_down</nmui-button>
</nmui-button>
<nmui-button split tonal large>
  <nmui-button>Send</nmui-button>
  <nmui-button icon>arrow_drop_down</nmui-button>
</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Variants</h2>
        ${demo(`<nmui-button split filled>
  <nmui-button>Send</nmui-button>
  <nmui-button icon>arrow_drop_down</nmui-button>
</nmui-button>
<nmui-button split outlined>
  <nmui-button>Send</nmui-button>
  <nmui-button icon>arrow_drop_down</nmui-button>
</nmui-button>
<nmui-button split elevated>
  <nmui-button>Send</nmui-button>
  <nmui-button icon>arrow_drop_down</nmui-button>
</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>With a menu</h2>
        <p class="demo-hint">The arrow's <code>[open]</code> state drives a real <code>&lt;nmui-menu&gt;</code> anchored to the split button; when the menu closes itself (a pick, Escape, an outside press) the split's <code>[open]</code> is cleared to match.</p>
        ${demo(`<nmui-button split tonal id="demo-split">
  <nmui-button>Send</nmui-button>
  <nmui-button icon>arrow_drop_down</nmui-button>
</nmui-button>
<nmui-menu anchor="demo-split" id="demo-split-menu">
  <button value="now">Send now</button>
  <button value="schedule">Schedule send</button>
  <button value="draft">Save draft</button>
</nmui-menu>
<output id="demo-split-out" class="docs-output">click the arrow…</output>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["change (custom)", "the host", "detail: {value, button, open, event}", "the arrow is pressed; open is the new state, button is the arrow"],
          ["click / change", "the action button (bubbles through the host)", "the action button's own detail", "the main action is pressed — check e.target / detail.button to tell it from the arrow"],
        ])}
        <p>Two buttons, two jobs: the host intercepts the arrow's <code>change</code>, flips its own <code>[open]</code> (and the arrow's <code>aria-expanded</code>), and re-emits it as the host's <code>change</code> — the log above is that event. The action button keeps its own standard-button contract. In code, the arrow button's <code>.click()</code> opens/closes the split the native way; there is no <code>open()</code> method on a split — state is the <code>[open]</code> attribute.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/split-button/overview">m3.material.io/components/split-button</a></p>
    </footer>
  </div>`;

  const out = mount.querySelector("#demo-split-out");
  const split = mount.querySelector("#demo-split");
  const menu = mount.querySelector("#demo-split-menu");

  split?.addEventListener("change", (e) => {
    if (e.detail.open === undefined) {
      out.textContent = "main button → change";
      return;
    }
    e.detail.open ? menu.show() : menu.close();
    out.textContent = `arrow → open: ${e.detail.open}`;
  });

  menu?.addEventListener("change", (e) => {
    out.textContent = `picked → ${e.detail.value}`;
  });

  menu?.addEventListener("close", () => {
    if (split.hasAttribute("open")) {
      split.removeAttribute("open");
      split
        .querySelector("nmui-button:last-child")
        ?.setAttribute("aria-expanded", "false");
    }
  });
}
