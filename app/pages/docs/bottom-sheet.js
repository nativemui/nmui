import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Bottom sheets — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/bottom-sheet")}
    <header class="docs-header">
      <h1>Bottom sheets</h1>
      <p><code>&lt;nmui-sheet&gt;</code> anchored to the bottom of the screen, for supplementary content and actions in compact and medium windows. <b>Standard</b> sheets co-exist with the page; <code>[modal]</code> sheets sit over a scrim and must be dismissed. Open state is <code>[open]</code>; drive it with <code>show()</code> / <code>close()</code> / <code>toggle()</code>. The side-anchored sibling lives under <a data-link href="/docs/side-sheet">Side sheets</a> — on expanded screens the guidelines swap one for the other with the same content.</p>
      <p class="docs-note">Geometry: surface-container-low with 28dp top corners at elevation level 1, full width up to 640dp (56dp side margins past that), top margin 72dp (56dp on wide windows). The drag handle is 32×4dp in on-surface-variant, centered in the top 48dp.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Modal bottom sheet</h2>
        <p>The mobile menu alternative. It opens at the <b>half detent</b> — a modal sheet's initial position is capped at 50% of the screen height — and the drag handle takes it the rest of the way: click it (or focus it and press Space) to cycle half → full → closed, or drag it. That cycle is the accessibility story: resizing never requires a drag. Picking an action dismisses the sheet, as do the scrim, Escape, and dragging it down.</p>
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
        <p>No scrim, no blocking: the sheet co-exists with the page, the way a music player rides along while you browse. It opens at the full detent (its content height), and its handle cycles full → half → closed. Dragging it down dismisses it too — from full it snaps to half first, and a drag that pulls it under a fifth of the screen closes it from either detent. Watch the readout for <code>detentchange</code>.</p>
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
        <h2>Events</h2>
        ${evTable([
          ["open", "the host", "{ sheet }", "the sheet opens — [open] set by show(), toggle(), or markup"],
          ["close", "the host", "{ sheet }", "the sheet closes — scrim, Escape, handle cycle, or close()"],
          ["detentchange", "the host", "{ detent, sheet }", "the preset height changes: 'half' or 'full', by handle click, drag snap, or opening"],
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

  const share = $("#demo-share");
  $("#demo-share-open").addEventListener("click", () => share.show());
  share.addEventListener("change", (e) => {
    $("#demo-share-out").textContent = "shared via: " + e.detail.value;
    share.close();
  });

  const player = $("#demo-player");
  const playerOut = $("#demo-player-out");
  $("#demo-player-toggle").addEventListener("click", () => player.toggle());
  player.addEventListener("open", () => (playerOut.textContent = "player open"));
  player.addEventListener("close", () => (playerOut.textContent = "player closed"));
  player.addEventListener(
    "detentchange",
    (e) => (playerOut.textContent = "detent: " + e.detail.detent)
  );
}
