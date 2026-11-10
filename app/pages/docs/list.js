import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "List — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/list")}
    <header class="docs-header">
      <h1>List</h1>
      <p><code>&lt;nmui-list&gt;</code> — one tag, two jobs: bare it's the container, with <code>[item]</code> it's a row. A row is a leading element (icon, avatar, or media), a text column (overline, label, supporting text), and trailing content (text or a control). Clicking a row selects it within its list and fires <code>change</code>. Add <code>[segmented]</code> to the container for the M3 Expressive style.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Standard — one line</h2>
        <p>56dp rows: a leading icon, a label, optional trailing text. The selected row is highlighted — try clicking, or Tab in and use the arrow keys.</p>
        ${demo(`<nmui-list>
  <nmui-list item value="inbox" selected><icon>inbox</icon>Inbox<span trailing>24</span></nmui-list>
  <nmui-list item value="sent"><icon>send</icon>Sent</nmui-list>
  <nmui-list item value="drafts"><icon>draft</icon>Drafts<span trailing>3</span></nmui-list>
</nmui-list>`)}
      </section>

      <section class="docs-section">
        <h2>Two and three lines</h2>
        <p>Wrap the text in a <code>&lt;span&gt;</code>: a <code>&lt;small&gt;</code> inside it is supporting text (72dp rows). Add an <code>&lt;overline&gt;</code> as well and the row grows to 88dp and top-aligns, so long supporting text reads from the top.</p>
        ${demo(`<nmui-list>
  <nmui-list item value="ada">
    <span avatar>AL</span>
    <span>Ada Lovelace<small>ada@example.com</small></span>
    <span trailing>10:24</span>
  </nmui-list>
  <nmui-list item value="release">
    <img media src="/assets/mark.svg" alt="">
    <span><overline>Release notes</overline>Version 0.27.0<small>Lists grow up: segmented style, three-line rows, roving keyboard focus, and selection that a screen reader can see.</small></span>
  </nmui-list>
</nmui-list>`)}
      </section>

      <section class="docs-section">
        <h2>Trailing controls</h2>
        <p>A control in the trailing slot is its own action: clicking it does not select the row. One selection interaction per row — don't stack a checkbox on a row that also selects.</p>
        ${demo(`<nmui-list>
  <nmui-list item value="wifi">
    <icon>wifi</icon>
    <span>Wi-Fi<small>Connected to Studio</small></span>
    <nmui-switch><input type="checkbox" checked aria-label="Wi-Fi"></nmui-switch>
  </nmui-list>
  <nmui-list item value="news">
    <icon>mail</icon>
    <span>Newsletter<small>Weekly digest</small></span>
    <nmui-badge>3</nmui-badge>
  </nmui-list>
</nmui-list>`)}
      </section>

      <section class="docs-section">
        <h2>Segmented — the Expressive style</h2>
        <p><code>[segmented]</code> on the container: filled rows separated by gaps instead of dividers, 16dp corners on the group's outer edges and 4dp between rows. The selected row morphs to 16dp all around and takes the highlight fill.</p>
        ${demo(`<nmui-list segmented>
  <nmui-list item value="periwinkle" selected><icon>palette</icon>Periwinkle</nmui-list>
  <nmui-list item value="sage"><icon>palette</icon>Sage</nmui-list>
  <nmui-list item value="ochre"><icon>palette</icon>Ochre</nmui-list>
</nmui-list>`)}
      </section>

      <section class="docs-section">
        <h2>Multi-action</h2>
        <p>Supplementary actions live in the trailing slot — here a bookmark and an overflow button per row. Each keeps its own click and its own focus; the row's body stays the primary action.</p>
        ${demo(`<nmui-list>
  <nmui-list item value="strangers">
    <img media draggable="false" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%2337474f'/%3E%3Ctext x='28' y='37' font-size='24' text-anchor='middle' fill='white' font-family='sans-serif'%3ES%3C/text%3E%3C/svg%3E" alt="">
    <span>Strangers<small>Trapezoid</small></span>
    <nmui-button icon standard aria-label="Bookmark Strangers"><icon>bookmark</icon></nmui-button>
    <nmui-button icon standard aria-label="More actions for Strangers"><icon>more_vert</icon></nmui-button>
  </nmui-list>
  <nmui-list item value="decorations">
    <img media draggable="false" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%236a1b9a'/%3E%3Ctext x='28' y='37' font-size='24' text-anchor='middle' fill='white' font-family='sans-serif'%3ED%3C/text%3E%3C/svg%3E" alt="">
    <span>Decorations<small>Personal Voice</small></span>
    <nmui-button icon standard aria-label="Bookmark Decorations"><icon>bookmark</icon></nmui-button>
    <nmui-button icon standard aria-label="More actions for Decorations"><icon>more_vert</icon></nmui-button>
  </nmui-list>
</nmui-list>`)}
      </section>

      <section class="docs-section">
        <h2>Reordering</h2>
        <p>Drag a row by its handle. Reordering is app behavior — the component's part is the <code>[dragging]</code> state, which lifts the row with a level-3 shadow. This demo also follows the guidelines' content-color note: the dragged row takes a vibrant tint from its cover art, applied for the interaction. (Pointer only — the specs don't define keyboard reordering.)</p>
        ${demo(`<nmui-list id="reorder-list">
  <nmui-list item value="strangers" style="--tint:#f8bbd0">
    <img media draggable="false" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%23ad1457'/%3E%3Ctext x='28' y='37' font-size='24' text-anchor='middle' fill='white' font-family='sans-serif'%3ES%3C/text%3E%3C/svg%3E" alt="">
    <span>Strangers<small>Trapezoid</small><small>Warped Speed</small></span>
    <icon data-drag>drag_handle</icon>
  </nmui-list>
  <nmui-list item value="21st" style="--tint:#e1bee7">
    <img media draggable="false" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%236a1b9a'/%3E%3Ctext x='28' y='37' font-size='24' text-anchor='middle' fill='white' font-family='sans-serif'%3E2%3C/text%3E%3C/svg%3E" alt="">
    <span>21st Century Strangers<small>For Now</small><small>NBR</small></span>
    <icon data-drag>drag_handle</icon>
  </nmui-list>
  <nmui-list item value="decorations" style="--tint:#c8e6c9">
    <img media draggable="false" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%232e7d32'/%3E%3Ctext x='28' y='37' font-size='24' text-anchor='middle' fill='white' font-family='sans-serif'%3ED%3C/text%3E%3C/svg%3E" alt="">
    <span>Decorations<small>Personal Voice</small><small>AMB Music</small></span>
    <icon data-drag>drag_handle</icon>
  </nmui-list>
  <nmui-list item value="play" style="--tint:#ffe0b2">
    <img media draggable="false" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%23e65100'/%3E%3Ctext x='28' y='37' font-size='24' text-anchor='middle' fill='white' font-family='sans-serif'%3EP%3C/text%3E%3C/svg%3E" alt="">
    <span>Play It As It Lays<small>Kim Petras</small><small>Feed the Beast</small></span>
    <icon data-drag>drag_handle</icon>
  </nmui-list>
</nmui-list>
<output class="docs-output" id="reorder-out"></output>`)}
      </section>

      <section class="docs-section">
        <h2>Disabled</h2>
        ${demo(`<nmui-list>
  <nmui-list item value="alpha"><icon>folder</icon>Alpha</nmui-list>
  <nmui-list item value="beta" disabled><icon>folder</icon><span>Beta<small>Unavailable right now</small></span></nmui-list>
</nmui-list>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["change (custom)", "the row (bubbles through the list)", "detail: {value, item}", "a row is clicked or activated with Enter / Space and becomes the selection; a click on a nested trailing control does not fire it"],
          ["click", "the row", "—", "native — fires for every press, including on a row that was already selected"],
        ])}
        <output class="docs-output" id="list-log">click a row…</output>
        <p>The native way works: <code>item.click()</code> selects and fires <code>change</code>; <code>item.selected = true</code> moves the pill silently (and keeps <code>aria-selected</code> in sync); <code>item.value</code> reads and writes the <code>[value]</code> attribute. Selection is single — selecting a row clears its siblings; for multi-select, put checkboxes in the rows and let them carry the state. Keyboard: Tab lands on the selected (or first) row, ArrowUp / ArrowDown / Home / End move between rows.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/lists/specs">m3.material.io/components/lists</a></p>
    </footer>
  </div>`;

  const log = mount.querySelector("#list-log");
  mount.querySelectorAll("nmui-list:not([item])").forEach((list) => {
    list.addEventListener("change", (e) => {
      if (e.detail?.item) log.textContent = `change → value: ${JSON.stringify(e.detail.value)}`;
    });
  });

  // Reordering demo: drag by the handle. The dragged row leaves
  // the flow and floats (a placeholder holds its slot); the other
  // rows FLIP-animate into their new spots as the placeholder
  // moves, so nothing teleports. Dropping settles the row into
  // the placeholder's position.
  const rList = mount.querySelector("#reorder-list");
  if (rList) {
    const out = mount.querySelector("#reorder-out");
    const showOrder = () => {
      out.textContent =
        "order: " +
        [...rList.querySelectorAll(":scope > nmui-list[item]")]
          .map((i) => i.value)
          .join(" → ");
    };
    showOrder();
    const rows = () => [...rList.querySelectorAll(":scope > nmui-list[item]")];
    let drag = null;

    const flip = (move) => {
      const before = new Map(rows().map((r) => [r, r.offsetTop]));
      move();
      rows().forEach((r) => {
        if (r === drag?.item) return;
        const dy = before.get(r) - r.offsetTop;
        if (!dy) return;
        r.style.transition = "none";
        r.style.transform = `translateY(${dy}px)`;
        requestAnimationFrame(() => {
          r.style.transition = "transform 180ms cubic-bezier(0.2, 0, 0, 1)";
          r.style.transform = "";
        });
      });
    };

    rList.querySelectorAll("[data-drag]").forEach((handle) => {
      handle.addEventListener("pointerdown", (e) => {
        const item = handle.closest("nmui-list[item]");
        // Capture the authored style BEFORE any drag styling is
        // written — the drop restores exactly this. (Capturing it
        // after Object.assign below was the v0.27.3 drop bug: the
        // "saved" style already contained position:absolute and
        // the final top, so the dropped row stayed floating.)
        const savedStyle = item.getAttribute("style") || "";
        const listRect = rList.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const ph = document.createElement("span");
        ph.className = "reorder-ph";
        ph.style.height = `${itemRect.height}px`;
        rList.insertBefore(ph, item);
        item.setAttribute("dragging", "");
        Object.assign(item.style, {
          position: "absolute",
          left: "0",
          right: "0",
          top: `${itemRect.top - listRect.top + rList.scrollTop}px`,
          margin: "0",
          zIndex: "2",
        });
        drag = {
          item,
          ph,
          savedStyle,
          startY: e.clientY,
          startTop: itemRect.top - listRect.top + rList.scrollTop,
          top: itemRect.top - listRect.top + rList.scrollTop,
          height: itemRect.height,
          listH: listRect.height,
        };
        handle.setPointerCapture(e.pointerId);
        e.preventDefault();
      });

      // Settle the placeholder under the dragged row's center,
      // trading places one sibling at a time — and keep going
      // until nothing is crossed. A fast drag can jump several
      // rows in a single pointermove; stopping after one trade
      // (the first cut) left the slot lagging rows behind the
      // pointer, so the drop landed in the wrong place.
      const settle = () => {
        const { item, ph } = drag;
        const center = drag.top + drag.height / 2;
        for (;;) {
          const siblings = rows().filter((s) => s !== item);
          let traded = false;
          for (const sib of siblings) {
            const sibMid = sib.offsetTop + sib.offsetHeight / 2;
            const phBefore = ph.compareDocumentPosition(sib) & Node.DOCUMENT_POSITION_FOLLOWING;
            if (phBefore && center > sibMid) {
              flip(() => rList.insertBefore(ph, sib.nextSibling));
              traded = true;
              break;
            }
            if (!phBefore && center < sibMid) {
              flip(() => rList.insertBefore(ph, sib));
              traded = true;
              break;
            }
          }
          if (!traded) return;
        }
      };

      handle.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const maxTop = drag.listH - drag.height;
        drag.top = Math.min(Math.max(drag.startTop + (e.clientY - drag.startY), 0), maxTop);
        drag.item.style.top = `${drag.top}px`;
        settle();
      });

      const end = (e) => {
        if (!drag) return;
        // Settle once more at the release point before dropping.
        if (e?.clientY != null) {
          const maxTop = drag.listH - drag.height;
          drag.top = Math.min(Math.max(drag.startTop + (e.clientY - drag.startY), 0), maxTop);
          drag.item.style.top = `${drag.top}px`;
          settle();
        }
        const { item, ph } = drag;
        rList.insertBefore(item, ph);
        ph.remove();
        item.removeAttribute("dragging");
        item.setAttribute("style", drag.savedStyle);
        drag = null;
        showOrder();
      };
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
    });
  }
}
