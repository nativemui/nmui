import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";
import { familyNav } from "./button-family.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Button group — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/button")}
    <header class="docs-header">
      <h1>Button group</h1>
      <p><code>&lt;nmui-button group&gt;</code> — buttons that share a width and react to each other: the selected button changes color, rests as a rounded square, and takes its extra room from its neighbours, so it grows from its own center while distant buttons stay put; pressing one does the same, briefly. Children may be plain buttons (the group selects them) or <code>[toggle]</code> buttons. The host's variant and size are copied to children that don't declare their own. Spacing follows the spec's size table (XS 18 · S 12 · M/L/XL 8).</p>
    </header>

    ${familyNav("/docs/button-group")}

    <main>
      <section class="docs-section">
        <h2>Variants — declared once, on the host</h2>
        ${demo(`<nmui-button group filled>
  <nmui-button selected>Day</nmui-button>
  <nmui-button>Week</nmui-button>
  <nmui-button>Month</nmui-button>
</nmui-button>
<nmui-button group tonal>
  <nmui-button selected>Day</nmui-button>
  <nmui-button>Week</nmui-button>
  <nmui-button>Month</nmui-button>
</nmui-button>
<nmui-button group outlined>
  <nmui-button selected>Day</nmui-button>
  <nmui-button>Week</nmui-button>
  <nmui-button>Month</nmui-button>
</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Sizes</h2>
        ${demo(`<nmui-button group tonal xsmall>
  <nmui-button selected>Day</nmui-button>
  <nmui-button>Week</nmui-button>
  <nmui-button>Month</nmui-button>
</nmui-button>
<nmui-button group tonal medium>
  <nmui-button selected>Day</nmui-button>
  <nmui-button>Week</nmui-button>
  <nmui-button>Month</nmui-button>
</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Single-select (default)</h2>
        ${demo(`<nmui-button group tonal id="demo-group">
  <nmui-button value="day" selected>Day</nmui-button>
  <nmui-button value="week">Week</nmui-button>
  <nmui-button value="month">Month</nmui-button>
</nmui-button>`)}
        <output id="demo-group-out" class="docs-output">pick one…</output>
      </section>

      <section class="docs-section">
        <h2>Multi-select — [multiple], toggle children</h2>
        ${demo(`<nmui-button group multiple tonal>
  <nmui-button toggle value="bold">Bold</nmui-button>
  <nmui-button toggle value="italic">Italic</nmui-button>
  <nmui-button toggle value="underline">Underline</nmui-button>
</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Mixed — label buttons and icon buttons</h2>
        ${demo(`<nmui-button group tonal>
  <nmui-button icon>format_align_left</nmui-button>
  <nmui-button selected>Center</nmui-button>
  <nmui-button icon>format_align_right</nmui-button>
</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["change (custom)", "the group host", "detail: {value, button, event} — plus selected in [multiple]", "a child is picked; value / button are the picked child's"],
        ])}
        <p>Listen on the <strong>host</strong>, not the children: each child's own <code>change</code> is swallowed and re-emitted from the group with the picked button in <code>detail</code> — the single-select demo above logs exactly that. Give children <code>value</code> attributes or read <code>detail.button.textContent</code>. In code, a child's <code>.click()</code> picks it and fires the group's <code>change</code>; setting a child's <code>selected</code> property (or <code>[selected]</code> attribute) changes the visuals silently, with no event — the native pattern.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/button-groups/specs">m3.material.io/components/button-groups</a></p>
    </footer>
  </div>`;

  const out = mount.querySelector("#demo-group-out");
  mount.querySelector("#demo-group")?.addEventListener("change", (e) => {
    out.textContent = `group change → value: ${e.detail.value}`;
  });
}
