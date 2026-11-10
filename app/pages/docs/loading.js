import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Loading indicator — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/loading")}
    <header class="docs-header">
      <h1>Loading indicator</h1>
      <p><code>&lt;nmui-loading&gt;</code> — the M3 Expressive loading indicator, for short indeterminate waits (200ms–5s). It replaces the indeterminate circular progress indicator: a shape that morphs to capture attention, never a percentage. The morph runs through the platform's seven shapes — soft burst, 9-sided cookie, pentagon, pill, sunny, 4-sided cookie, oval — one morph every 650ms while slowly rotating, all generated and interpolated by hand (no dependencies). For waits over 5s, or progress you can measure, use a progress indicator instead — and never transition a loading indicator into one.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Default</h2>
        <p>48dp, with the shape in a 38dp area, in primary on the surface. Place it directly on a surface, centered in the element that's loading.</p>
        ${demo(`<nmui-loading aria-label="Loading articles"></nmui-loading>`)}
      </section>

      <section class="docs-section">
        <h2>Contained — [contained]</h2>
        <p>For placement over other content — pull-to-refresh is the classic case. The container is a primary-container circle and the shape switches to on-primary-container so it keeps its contrast on top of content.</p>
        ${demo(`<div style="background:var(--md-sys-color-surface-container-high,#ece6f0);border-radius:12px;padding:24px;display:flex;gap:24px;align-items:center">
  <span>Your feed</span>
  <nmui-loading contained aria-label="Refreshing feed"></nmui-loading>
  <span>New posts are on the way…</span>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Sizes</h2>
        <p>The specs allow 24–240dp. Size the host with CSS <code>width</code>/<code>height</code> — the shape area scales with it and keeps the 38:48 ratio. (There is no size attribute; the old draft's <code>[small]</code> is gone.)</p>
        ${demo(`<nmui-loading style="width:24px;height:24px" aria-label="Loading, small"></nmui-loading>
<nmui-loading aria-label="Loading, default"></nmui-loading>
<nmui-loading style="width:96px;height:96px" aria-label="Loading, large"></nmui-loading>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["(none)", "—", "—", "a loading indicator dispatches no events — it only ever reflects an ongoing process; remove the element when the process finishes"],
        ])}
        <p>Semantics: the element carries <code>role="progressbar"</code> with no value (indeterminate), per the accessibility specs. The default <code>aria-label</code> is "Loading" — set your own to say <em>what</em> is loading ("Loading articles", "Refreshing page"), as the demos above do. Under <code>prefers-reduced-motion</code> the morph slows to 2.4s per shape and the rotation stops.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/loading-indicator/specs">m3.material.io/components/loading-indicator</a></p>
    </footer>
  </div>`;
}
