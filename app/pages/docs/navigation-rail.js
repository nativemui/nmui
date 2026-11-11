import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Navigation rail — nmui docs";

const DESTS = `<button selected><icon>home</icon>Home</button>
  <button><icon>search</icon>Search</button>
  <button><icon>favorite</icon>Favorites</button>
  <button><icon>settings</icon>Settings</button>`;

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/navigation-rail")}
    <header class="docs-header">
      <h1>Navigation rail</h1>
      <p><code>&lt;nmui-navigation rail&gt;</code> — one element, role as a bare attribute. M3 Expressive retires the baseline rail: <code>[collapsed]</code> (96dp) replaces it, <code>[expanded]</code> is 360dp, the spec range's max. Destinations are <code>&lt;a&gt;</code> / <code>&lt;button&gt;</code> children — an <code>&lt;icon&gt;</code> plus a one-word label. A <code>&lt;section&gt;</code> after a destination groups secondary destinations under it: that destination becomes the group's toggle, gains a caret, and opens or closes the group inline instead of selecting. Groups start closed (author <code>[open]</code> on the section to start one open) and never show in the collapsed rail, where the parent stands for them. This app's own shell, on the left, works exactly this way.</p>
    </header>


    <main>
      <section class="docs-section">
        <h2>Collapsed — standard</h2>
        ${demo(`<div class="nav-demo">
  <nmui-navigation rail collapsed>
    <header><nmui-button icon>menu</nmui-button></header>
    <nmui-button fab><icon>edit</icon></nmui-button>
    ${DESTS}
  </nmui-navigation>
  <div class="nav-demo-body">Content sits beside a standard rail.</div>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Expanded — standard</h2>
        ${demo(`<div class="nav-demo">
  <nmui-navigation rail expanded>
    <header><nmui-button icon>menu_open</nmui-button></header>
    <nmui-button fab extended><icon>edit</icon>Compose</nmui-button>
    ${DESTS}
  </nmui-navigation>
  <div class="nav-demo-body">The indicator is the whole item; the label sits inside it.</div>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Centered — [center], for tablets</h2>
        ${demo(`<div class="nav-demo">
  <nmui-navigation rail collapsed center>
    ${DESTS}
  </nmui-navigation>
  <div class="nav-demo-body">Destinations align as a group: top by default, center with [center]. The menu and FAB always stay at the top. A <code>&lt;footer&gt;</code> child is the rail's bottom row — it never scrolls with the destinations: a row of icon buttons expanded, stacked and centered collapsed.</div>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Secondary destinations — groups with a toggle parent</h2>
        ${demo(`<div class="nav-demo">
  <nmui-navigation rail expanded>
    <header><nmui-button icon>menu_open</nmui-button></header>
    <button><icon>alarm</icon>Alarm</button>
    <button><icon>schedule</icon>Clock</button>
    <button><icon>hourglass_empty</icon>Timer</button>
    <section title="Sleep well" open>
      <button><icon>bedtime</icon>Schedule</button>
      <button><icon>bar_chart</icon>Stats</button>
      <button><icon>music_note</icon>Sleep sounds</button>
    </section>
    <button><icon>timer</icon>Stopwatch</button>
  </nmui-navigation>
  <div class="nav-demo-body">Timer heads the "Sleep well" group: its caret gives it away, and clicking it opens or closes the group inline — it never selects and fires no change. The group is authored [open] here; delete the attribute and it starts closed. When a group is open, the parent and its children share one tinted rounded container and the children are pills inside it — the block itself is what says they belong together. The parent has no hover effect while its group is open: its background is the static container tint, and hovering it paints nothing over that; only the children highlight on hover. A group inside a group nests the same way: its parent keeps its pill (28dp top, 8dp bottom corners) and its children are bare text rows on a plain block below it, never pills inside pills — the first child sits near the top of its own block, and the corners facing each other across the gap are small (8dp) so the gap reads as one clean strip. The destinations list scrolls when it overflows, but the bar itself is hidden. In the collapsed rail the group hides whole and Timer stands for it, a plain row like any other destination. Groups only ever open by clicking the parent. (The grouping itself is the M3 Clock pattern; the toggle is how nmui makes the parent readable.)</div>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Modal — [modal], opened on demand</h2>
        ${demo(`<nmui-button tonal id="demo-rail-open">Open modal rail</nmui-button>
<nmui-navigation rail expanded modal id="demo-modal-rail">
  <header><nmui-button icon id="demo-rail-close">menu_open</nmui-button></header>
  ${DESTS}
</nmui-navigation>`)}
        <output id="demo-rail-out" class="docs-output">pick a destination…</output>
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["change (custom)", "the rail host", "detail: {value, destination}", "a destination is clicked; value is its value attribute, else its href, else its label text; destination is the element. A group parent is the exception: clicking it toggles its section and fires no change — read the state from the section's [open] and the parent's aria-expanded"],
          ["click", "a destination (bubbles)", "—", "same press, native — anchors still navigate; the component never preventDefaults"],
        ])}
        <p>One trap, visible in this page's own wiring: other buttons inside the rail (the header buttons, a FAB) fire their own <code>change</code> events, which bubble through the rail. Check <code>e.detail.destination</code> to take only the rail's. Opening and closing a modal rail fires <strong>no event</strong> — call <code>show()</code> / <code>close()</code> / <code>toggle()</code> and read state from the <code>[open]</code> attribute.</p>
        <p>The native way works for selection too: a destination's <code>.click()</code> selects it and fires <code>change</code> (an anchor also follows its href, as anchors do); setting <code>[selected]</code> on a destination in code moves the pill silently, no event. A group parent's <code>.click()</code> toggles its group instead, and setting or removing the section's <code>[open]</code> attribute in code opens or closes it directly.</p>
        <pre><code>rail.addEventListener("change", (e) =&gt; {
  if (!e.detail.destination) return;  // not a destination pick
  console.log("go to:", e.detail.value);
});</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/navigation-rail/specs">m3.material.io/components/navigation-rail</a></p>
    </footer>
  </div>`;

  const out = mount.querySelector("#demo-rail-out");
  const modalRail = mount.querySelector("#demo-modal-rail");
  mount.querySelector("#demo-rail-open")?.addEventListener("click", () => {
    modalRail.show();
  });
  mount.querySelector("#demo-rail-close")?.addEventListener("click", () => {
    modalRail.close();
    out.textContent = "closed from the header button";
  });
  modalRail?.addEventListener("change", (e) => {
    if (!e.detail.destination) return; // the rail's own event, not a child's
    out.textContent = `change → ${e.detail.value} (rail closed)`;
  });
}
