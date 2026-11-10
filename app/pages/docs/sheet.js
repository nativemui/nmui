import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Sheets — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/sheet")}
    <header class="docs-header">
      <h1>Sheets</h1>
      <p>One element, <code>&lt;nmui-sheet&gt;</code>, for both families: bare it's a bottom sheet, <code>[side]</code> anchors it to the inline-end edge. Each comes in two variants — <b>standard</b>, which co-exists with the page, and <code>[modal]</code>, which sits over a scrim and must be dismissed. Open state is <code>[open]</code>; drive it with <code>show()</code> / <code>close()</code> / <code>toggle()</code>.</p>
      <p class="docs-note">Bottom sheet geometry: surface-container-low with 28dp top corners at elevation level 1, full width up to 640dp (56dp side margins past that), top margin 72dp (56dp on wide windows). Side sheets: 256dp wide by default (max 400dp; override with <code>--nmui-sheet-width</code>), 24dp content padding, headline in title-large on-surface-variant. The standard side sheet is flat <code>surface</code> split off by a divider; the modal one is surface-container-low with 16dp corners on the edge side. On expanded screens the guidelines swap a bottom sheet for a side sheet with the same content — that's the app's call, made with these same two forms.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Modal bottom sheet</h2>
        <p>The mobile menu alternative. It opens at the <b>half detent</b> — a modal sheet's initial position is capped at 50% of the screen height — and the drag handle takes it the rest of the way: click it (or focus it and press Space) to cycle half → full → closed, or drag it. That cycle is the accessibility story: resizing never requires a drag. Picking an action dismisses the sheet, as do the scrim and Escape.</p>
        ${demo(`<nmui-button tonal id="demo-share-open">Share photo</nmui-button>
<output id="demo-share-out" class="docs-output">nothing shared yet</output>
<nmui-sheet modal id="demo-share">
  <nmui-list>
    <nmui-list item value="Copy link"><icon>link</icon>Copy link</nmui-list>
    <nmui-list item value="Email"><icon>mail</icon>Email</nmui-list>
    <nmui-list item value="Messages"><icon>chat</icon>Messages</nmui-list>
    <nmui-list item value="Save to Files"><icon>folder</icon>Save to Files</nmui-list>
    <nmui-list item value="Add to album"><icon>photo_library</icon>Add to album</nmui-list>
    <nmui-list item value="Print"><icon>print</icon>Print</nmui-list>
    <nmui-list item value="AirDrop"><icon>ios_share</icon>AirDrop</nmui-list>
    <nmui-list item value="Report"><icon>flag</icon>Report</nmui-list>
  </nmui-list>
</nmui-sheet>`)}
      </section>

      <section class="docs-section">
        <h2>Standard bottom sheet</h2>
        <p>No scrim, no blocking: the sheet co-exists with the page, the way a music player rides along while you browse. It opens at the full detent (its content height), and its handle cycles full → half → full instead of closing — a persistent surface is closed by the app, not by its handle. Watch the readout for <code>detentchange</code>.</p>
        ${demo(`<nmui-button tonal id="demo-player-toggle">Toggle player</nmui-button>
<output id="demo-player-out" class="docs-output">player closed</output>
<nmui-sheet id="demo-player">
  <div style="display:flex;align-items:center;gap:16px;padding:4px 0 12px">
    <icon style="font-size:40px">album</icon>
    <div style="flex:1;display:flex;flex-direction:column">
      <strong>Midnight Run</strong>
      <small style="opacity:0.7">The Night Signals — Neon District</small>
    </div>
    <nmui-button icon aria-label="Play">play_arrow</nmui-button>
    <nmui-button icon aria-label="Next track">skip_next</nmui-button>
  </div>
  <nmui-list>
    <nmui-list item><icon>queue_music</icon>Up next</nmui-list>
    <nmui-list item><icon>lyrics</icon>Lyrics</nmui-list>
    <nmui-list item><icon>devices</icon>Play on…</nmui-list>
  </nmui-list>
</nmui-sheet>`)}
      </section>

      <section class="docs-section">
        <h2>Modal side sheet</h2>
        <p>Anchored to the right (the left in RTL) so it stays clear of navigation on the leading edge. The anatomy is headline + content + action buttons, and one rule with teeth: a side sheet must <em>always</em> contain a close affordance — author your own <code>[close]</code> element if you want, otherwise the component adds the close button itself. <code>[detached]</code> insets the sheet 16dp with corners all around. Focus moves in on open and returns on close; the surface is a <code>role="dialog"</code>.</p>
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
          ["close", "the host", "{ sheet }", "the sheet closes — scrim, Escape, handle cycle, close affordance, or close()"],
          ["detentchange", "the host (bottom sheets)", "{ detent, sheet }", "the preset height changes: 'half' or 'full', by handle click, drag snap, or opening"],
        ])}
        <pre><code>const sheet = document.querySelector("#share");

sheet.addEventListener("detentchange", (e) =&gt; {
  console.log("sheet height:", e.detail.detent); // "half" | "full"
});</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  const $ = (sel) => mount.querySelector(sel);

  // Modal bottom: open, pick-to-dismiss.
  const share = $("#demo-share");
  $("#demo-share-open").addEventListener("click", () => share.show());
  share.addEventListener("change", (e) => {
    $("#demo-share-out").textContent = "shared via: " + e.detail.value;
    share.close();
  });

  // Standard bottom: toggle + detent readout.
  const player = $("#demo-player");
  const playerOut = $("#demo-player-out");
  $("#demo-player-toggle").addEventListener("click", () => player.toggle());
  player.addEventListener("open", () => (playerOut.textContent = "player open"));
  player.addEventListener("close", () => (playerOut.textContent = "player closed"));
  player.addEventListener(
    "detentchange",
    (e) => (playerOut.textContent = "detent: " + e.detail.detent)
  );

  // Modal side: filters (+ detached twin).
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

  // Standard side.
  const details = $("#demo-details");
  $("#demo-details-open").addEventListener("click", () => details.show());
}
