import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Side sheets — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/side-sheet")}
    <header class="docs-header">
      <h1>Side sheets</h1>
      <p><code>&lt;nmui-sheet side&gt;</code> anchored to the inline-end edge — the right in LTR, the left in RTL, so it stays clear of navigation on the leading edge. <b>Standard</b> sheets co-exist with the page; <code>[modal]</code> sheets sit over a scrim and must be dismissed. Open state is <code>[open]</code>; drive it with <code>show()</code> / <code>close()</code> / <code>toggle()</code>. The bottom-anchored sibling lives under <a data-link href="/docs/bottom-sheet">Bottom sheets</a>.</p>
      <p class="docs-note">Geometry: 256dp wide by default, max 400dp (override with <code>--nmui-sheet-width</code>), 24dp content padding, headline in title-large on-surface-variant. The standard sheet is flat <code>surface</code> with square corners, split off by a divider; the modal one is surface-container-low at elevation level 1 with 16dp corners on the edge side. Anatomy: optional <code>[back]</code>, <code>[headline]</code>, content, and an <code>[actions]</code> footer pinned to the bottom over a divider.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Modal side sheet</h2>
        <p>One rule with teeth: a side sheet must <em>always</em> contain a close affordance — author your own <code>[close]</code> element if you want, otherwise the component adds the close button itself. <code>[detached]</code> insets the sheet 16dp with corners all around. Focus moves in on open and returns on close; the surface is a <code>role="dialog"</code>.</p>
        ${demo(`<nmui-button tonal id="demo-filters-open">Filters</nmui-button>
<nmui-button tonal id="demo-filters2-open">Filters, detached</nmui-button>
<output id="demo-filters-out" class="docs-output">no filters applied</output>
<nmui-sheet side modal id="demo-filters">
  <h2 headline>Filters</h2>
  <p>
    <nmui-chip filter selected>Images</nmui-chip>
    <nmui-chip filter>Documents</nmui-chip>
    <nmui-chip filter>Audio</nmui-chip>
  </p>
  <nmui-list>
    <nmui-list item selected><icon>schedule</icon>Recent first</nmui-list>
    <nmui-list item><icon>sort_by_alpha</icon>Name</nmui-list>
    <nmui-list item><icon>straighten</icon>Size</nmui-list>
  </nmui-list>
  <footer actions>
    <nmui-button text id="demo-filters-cancel">Cancel</nmui-button>
    <nmui-button id="demo-filters-save">Save</nmui-button>
  </footer>
</nmui-sheet>
<nmui-sheet side modal detached id="demo-filters2">
  <h2 headline>Filters</h2>
  <p>The detached form floats 16dp off the edges with all four corners rounded — same content, same behavior.</p>
  <footer actions>
    <nmui-button text id="demo-filters2-done">Done</nmui-button>
  </footer>
</nmui-sheet>`)}
      </section>

      <section class="docs-section">
        <h2>Standard side sheet</h2>
        <p>The desktop companion surface: flat <code>surface</code>, square corners, a divider on its leading edge, and no scrim — the page beside it stays live while it's open. In a real layout this docks as a pane and the body shrinks to fit; here it overlays without blocking. It still carries its close button, like every side sheet.</p>
        ${demo(`<nmui-button tonal id="demo-details-open">Photo details</nmui-button>
<nmui-sheet side id="demo-details">
  <h2 headline>Details</h2>
  <p><strong>IMG_2041.jpg</strong></p>
  <p>4032 × 3024 · 3.1 MB<br>Taken Nov 8, 2026, 4:12 PM<br>Iola, Kansas</p>
  <nmui-divider></nmui-divider>
  <p>Shared with 3 people. Stored in <em>Camera uploads</em>.</p>
</nmui-sheet>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["open", "the host", "{ sheet }", "the sheet opens — [open] set by show(), toggle(), or markup"],
          ["close", "the host", "{ sheet }", "the sheet closes — scrim, Escape, the close affordance, or close()"],
        ])}
        <p class="docs-note">Bottom sheets additionally fire <code>detentchange</code> for their preset heights; side sheets have no detents. See <a data-link href="/docs/bottom-sheet">Bottom sheets</a>.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  const $ = (sel) => mount.querySelector(sel);

  const filters = $("#demo-filters");
  $("#demo-filters-open").addEventListener("click", () => filters.show());
  $("#demo-filters-cancel").addEventListener("click", () => filters.close());
  $("#demo-filters-save").addEventListener("click", () => {
    $("#demo-filters-out").textContent = "filters saved";
    filters.close();
  });
  const filters2 = $("#demo-filters2");
  $("#demo-filters2-open").addEventListener("click", () => filters2.show());
  $("#demo-filters2-done").addEventListener("click", () => filters2.close());

  const details = $("#demo-details");
  $("#demo-details-open").addEventListener("click", () => details.show());
}
