import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Connected button group — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/button")}
    <header class="docs-header">
      <h1>Connected button group</h1>
      <p><code>&lt;nmui-button group connected&gt;</code> — buttons joined into one shape: 2dp apart, fully round outside, inner corners sized by the group (XS 4 · S/M 8 · L 16 · XL 20). A selected button becomes fully round. Connected groups replace the old segmented button, which M3 Expressive no longer recommends.</p>
    </header>


    <main>
      <section class="docs-section">
        <h2>Single-select (default)</h2>
        ${demo(`<nmui-button group connected id="demo-connected">
  <nmui-button value="counts" selected>Counts</nmui-button>
  <nmui-button value="rates">Rates</nmui-button>
  <nmui-button value="shares">Shares</nmui-button>
</nmui-button>`)}
        <output id="demo-connected-out" class="docs-output">pick one…</output>
      </section>

      <section class="docs-section">
        <h2>Sizes — inner corners follow the host size</h2>
        ${demo(`<nmui-button group connected xsmall>
  <nmui-button selected>Day</nmui-button>
  <nmui-button>Week</nmui-button>
  <nmui-button>Month</nmui-button>
</nmui-button>
<nmui-button group connected medium>
  <nmui-button selected>Day</nmui-button>
  <nmui-button>Week</nmui-button>
  <nmui-button>Month</nmui-button>
</nmui-button>
<nmui-button group connected large>
  <nmui-button selected>Day</nmui-button>
  <nmui-button>Week</nmui-button>
  <nmui-button>Month</nmui-button>
</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Square</h2>
        ${demo(`<nmui-button group connected square>
  <nmui-button selected>Day</nmui-button>
  <nmui-button>Week</nmui-button>
  <nmui-button>Month</nmui-button>
</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Multi-select — [multiple], toggle children</h2>
        ${demo(`<nmui-button group connected multiple>
  <nmui-button toggle value="bold">Bold</nmui-button>
  <nmui-button toggle value="italic">Italic</nmui-button>
  <nmui-button toggle value="underline">Underline</nmui-button>
</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Variants — declared once, on the host</h2>
        ${demo(`<nmui-button group connected tonal>
  <nmui-button selected>Day</nmui-button>
  <nmui-button>Week</nmui-button>
  <nmui-button>Month</nmui-button>
</nmui-button>
<nmui-button group connected outlined>
  <nmui-button selected>Day</nmui-button>
  <nmui-button>Week</nmui-button>
  <nmui-button>Month</nmui-button>
</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["change (custom)", "the group host", "detail: {value, button, event} — plus selected in [multiple]", "a child is picked; value / button are the picked child's"],
        ])}
        <p>Same contract as the standard group — connected only changes the geometry. Listen on the <strong>host</strong>: child <code>change</code> events are swallowed and re-emitted from the group (the demo at the top of this page logs it). A child's <code>.click()</code> picks it and fires the group's <code>change</code>; setting a child's <code>selected</code> property changes the visuals silently, no event — the native pattern.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/button-groups/specs">m3.material.io/components/button-groups</a></p>
    </footer>
  </div>`;

  const out = mount.querySelector("#demo-connected-out");
  mount.querySelector("#demo-connected")?.addEventListener("change", (e) => {
    out.textContent = `group change → value: ${e.detail.value}`;
  });
}
