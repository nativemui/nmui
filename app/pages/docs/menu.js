import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Menu — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/menu")}
    <header class="docs-header">
      <h1>Menu</h1>
      <p>A menu shows a temporary set of actions in front of everything else. <code>&lt;nmui-menu&gt;</code> anchors to another element by id; its items are native <code>&lt;button&gt;</code> children. Bare is the baseline menu; <code>[vertical]</code> is the M3 Expressive vertical menu, and <code>[vibrant]</code> is the vertical menu in the tertiary color mapping.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Baseline</h2>
        <p class="demo-hint">112–280dp wide, 4dp corners, 48dp items. Items take a leading icon, a trailing text span, and dividers between groups. Redo is disabled — per the accessibility spec it can still receive focus, it just can't be picked.</p>
        ${demo(`<nmui-button id="m-base-btn" tonal>Open menu</nmui-button>
<nmui-menu anchor="m-base-btn" id="m-base">
  <button value="undo"><icon>undo</icon>Undo<span trailing>Ctrl Z</span></button>
  <button value="redo" disabled><icon>redo</icon>Redo<span trailing>Ctrl Y</span></button>
  <nmui-divider></nmui-divider>
  <button value="cut"><icon>content_cut</icon>Cut</button>
  <button value="copy"><icon>content_copy</icon>Copy</button>
  <button value="paste"><icon>content_paste</icon>Paste</button>
</nmui-menu>
<output id="m-base-out" class="docs-output">nothing picked yet</output>`)}
      </section>

      <section class="docs-section">
        <h2>Vertical</h2>
        <p class="demo-hint">The Expressive menu: rounded container, pill items, and <code>&lt;section title="…"&gt;</code> groups split by gaps instead of dividers. The item authored with <code>[selected]</code> makes it a single-select menu — picking another item moves the selection and its check mark.</p>
        ${demo(`<nmui-button id="m-vert-btn" tonal>Line spacing</nmui-button>
<nmui-menu anchor="m-vert-btn" id="m-vert" vertical>
  <section title="Spacing">
    <button value="single">Single</button>
    <button value="1.15">1.15</button>
    <button value="1.5" selected>1.5</button>
    <button value="double">Double</button>
  </section>
  <section title="Custom">
    <button value="custom">Custom spacing…</button>
  </section>
</nmui-menu>
<output id="m-vert-out" class="docs-output">selected: 1.5</output>`)}
      </section>

      <section class="docs-section">
        <h2>Vibrant</h2>
        <p class="demo-hint">The vertical menu in the tertiary mapping — higher emphasis, so the guidelines say to use it sparingly. The selected item goes full tertiary.</p>
        ${demo(`<nmui-button id="m-vib-btn" tonal>Sort by</nmui-button>
<nmui-menu anchor="m-vib-btn" id="m-vib" vibrant>
  <button value="name" selected><icon>sort_by_alpha</icon>Name</button>
  <button value="date"><icon>schedule</icon>Date added</button>
  <button value="size"><icon>storage</icon>Size</button>
</nmui-menu>
<output id="m-vib-out" class="docs-output">selected: name</output>`)}
      </section>

      <section class="docs-section">
        <h2>Submenu</h2>
        <p class="demo-hint">A menu placed directly after an item becomes its submenu — the item gains a trailing arrow and opens it on click, ArrowRight, or hover. The submenu opens beside the item, flipping to the other side at the window edge.</p>
        ${demo(`<nmui-button id="m-sub-btn" tonal>File</nmui-button>
<nmui-menu anchor="m-sub-btn" id="m-sub">
  <button value="new"><icon>note_add</icon>New</button>
  <button value="open"><icon>folder_open</icon>Open…</button>
  <button value="recent">Recent</button>
  <nmui-menu id="m-sub-recent">
    <button value="r1">quarterly-report.docx</button>
    <button value="r2">budget-2026.xlsx</button>
    <button value="r3">roadmap.md</button>
  </nmui-menu>
  <nmui-divider></nmui-divider>
  <button value="share"><icon>share</icon>Share</button>
</nmui-menu>
<output id="m-sub-out" class="docs-output">nothing picked yet</output>`)}
      </section>

      <section class="docs-section">
        <h2>Multi-select</h2>
        <p class="demo-hint">A <code>[multiple]</code> menu toggles items and stays open until it's dismissed — the dietary-options pattern from the guidelines.</p>
        ${demo(`<nmui-button id="m-multi-btn" tonal>Dietary</nmui-button>
<nmui-menu anchor="m-multi-btn" id="m-multi" multiple>
  <button value="vegan" selected>Vegan</button>
  <button value="nut-free" selected>Nut-free</button>
  <button value="gluten-free">Gluten-free</button>
  <button value="halal">Halal</button>
</nmui-menu>
<output id="m-multi-out" class="docs-output">vegan, nut-free</output>`)}
      </section>

      <section class="docs-section">
        <h2>From a split button</h2>
        <p class="demo-hint">One of the four openings in the menu guidelines: the split button's arrow reveals the menu. The split's <code>[open]</code> state and the menu drive each other, same as the demo on the Split button page.</p>
        ${demo(`<nmui-button split tonal id="m-split">
  <nmui-button>Slideshow</nmui-button>
  <nmui-button icon>arrow_drop_up</nmui-button>
</nmui-button>
<nmui-menu anchor="m-split" id="m-split-menu">
  <button value="presenter"><icon>present_to_all</icon>Open presenter view</button>
  <button value="beginning"><icon>start</icon>Start from beginning</button>
  <button value="slideshow"><icon>play_circle</icon>Start slideshow</button>
</nmui-menu>
<output id="m-split-out" class="docs-output">click the arrow…</output>`)}
      </section>

      <section class="docs-section">
        <h2>Context menu</h2>
        <p class="demo-hint">A menu in context, next to the content it acts on: right-click (or press-and-hold) inside the box. The menu has no anchor — the page calls <code>menu.showAt(x, y)</code> from its <code>contextmenu</code> handler and suppresses the browser's own menu. Items carry their glyphs as trailing icons, like the guidelines' edit menu.</p>
        ${demo(`<div class="menu-context" id="m-ctx-area">
  <p>…as Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections…</p>
  <p class="demo-hint">Right-click anywhere in this box.</p>
</div>
<nmui-menu id="m-ctx">
  <button value="undo">Undo<icon trailing>undo</icon></button>
  <button value="redo" disabled>Redo<icon trailing>redo</icon></button>
  <nmui-divider></nmui-divider>
  <button value="cut">Cut<icon trailing>content_cut</icon></button>
  <button value="copy">Copy<icon trailing>content_copy</icon></button>
  <button value="paste">Paste<icon trailing>content_paste</icon></button>
</nmui-menu>
<output id="m-ctx-out" class="docs-output">nothing picked yet</output>`)}
      </section>

      <section class="docs-section">
        <h2>From a text field</h2>
        <p class="demo-hint">The exposed dropdown: the field shows the current value, the menu offers the choices, and picking one writes it back into the field. The selected item carries the check.</p>
        ${demo(`<nmui-text-field outlined id="m-field">
  <label>Phone type</label>
  <input readonly value="Mobile">
  <icon>arrow_drop_down</icon>
</nmui-text-field>
<nmui-menu anchor="m-field" id="m-field-menu">
  <button value="Business"><icon>work</icon>Business</button>
  <button value="Mobile" selected><icon>smartphone</icon>Mobile</button>
  <button value="Home"><icon>home</icon>Home</button>
</nmui-menu>
<output id="m-field-out" class="docs-output">value: Mobile</output>`)}
      </section>

      <section class="docs-section">
        <h2>From a filter chip</h2>
        <p class="demo-hint">A chip can be a menu's anchor too — the trail selector from the guidelines. Picking a trail rewrites the chip's label to match.</p>
        ${demo(`<nmui-chip assist id="m-chip"><icon>directions_bike</icon><span id="m-chip-label">Cycling</span><icon>arrow_drop_down</icon></nmui-chip>
<nmui-menu anchor="m-chip" id="m-chip-menu">
  <button value="Running"><icon>directions_run</icon>Running</button>
  <button value="Walking"><icon>directions_walk</icon>Walking</button>
  <button value="Hiking"><icon>hiking</icon>Hiking</button>
  <button value="Cycling" selected><icon>directions_bike</icon>Cycling</button>
</nmui-menu>
<output id="m-chip-out" class="docs-output">selected: Cycling</output>`)}
      </section>

      <section class="docs-section">
        <h2>Submenu in a vertical menu</h2>
        <p class="demo-hint">The guidelines' submenu rule — it opens next to the parent item without overlapping it (and flips to the other side at the window edge). Same mechanism as the File demo above, in the vertical variant: Line spacing opens its own menu beside it.</p>
        ${demo(`<nmui-button id="m-vsub-btn" tonal>Paragraph</nmui-button>
<nmui-menu anchor="m-vsub-btn" id="m-vsub" vertical>
  <button value="bullets"><icon>format_list_bulleted</icon>Bullets</button>
  <button value="numbering"><icon>format_list_numbered</icon>Numbering</button>
  <button value="spacing">Line spacing</button>
  <nmui-menu vertical id="m-vsub-spacing">
    <button value="single">Single</button>
    <button value="1.15">1.15</button>
    <button value="1.5" selected>1.5</button>
    <button value="double">Double</button>
  </nmui-menu>
  <nmui-divider></nmui-divider>
  <button value="clear"><icon>format_clear</icon>Clear formatting</button>
</nmui-menu>
<output id="m-vsub-out" class="docs-output">nothing picked yet</output>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["change (custom)", "the menu", "detail: {value, selected, item, menu}", "an item is picked. selected is true/false in select menus (single-select, [multiple]); plain action menus report undefined"],
          ["open (custom)", "the menu", "detail: {menu}", "the menu opens, however it was opened"],
          ["close (custom)", "the menu", "detail: {menu}", "the menu closes — selection, Escape, outside press, Tab, or scroll"],
          ["click (native)", "the item button (bubbles)", "—", "items are real buttons; their clicks bubble through the menu. The menu acts on them itself, so prefer change"],
        ])}
        <p>The native way: open and close with <code>menu.show()</code> / <code>menu.close()</code> / <code>menu.toggle()</code>, or set the <code>[open]</code> attribute — every path runs the same placement and fires the same events. Setting an item's <code>[selected]</code> attribute by hand moves its check mark and <code>aria-checked</code> with no event, same as setting a checkbox's <code>checked</code>. The anchor is wired for you: it gets <code>aria-haspopup="menu"</code>, a synced <code>aria-expanded</code>, and ArrowDown/ArrowUp open the menu from it. Inside, arrows move (disabled items can be focused but not picked, per the accessibility spec), Home/End jump, typing letters jumps to the next item starting with them, Escape closes the innermost menu, and focus returns to the anchor on close. A menu with no anchor opens at a point instead — <code>menu.showAt(x, y)</code>, the context-menu pattern.</p>
        <output id="menu-log" class="docs-output">events will appear here…</output>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/menus">m3.material.io/components/menus</a></p>
    </footer>
  </div>`;

  const log = mount.querySelector("#menu-log");
  const show = (id, text) => {
    const out = mount.querySelector(id);
    if (out) out.textContent = text;
  };
  const wire = (btnId, menuId, onPick) => {
    const btn = mount.querySelector(`#${btnId}`);
    const menu = mount.querySelector(`#${menuId}`);
    btn?.addEventListener("click", () => menu.toggle());
    menu?.addEventListener("change", (e) => {
      log.textContent = `change → value: ${e.detail.value}, selected: ${e.detail.selected}`;
      onPick?.(e);
    });
    menu?.addEventListener("close", () => {
      log.textContent = `close (${menuId})`;
    });
    return menu;
  };

  wire("m-base-btn", "m-base", (e) =>
    show("#m-base-out", `picked: ${e.detail.value}`)
  );
  wire("m-vert-btn", "m-vert", (e) =>
    show("#m-vert-out", `selected: ${e.detail.value}`)
  );
  wire("m-vib-btn", "m-vib", (e) =>
    show("#m-vib-out", `selected: ${e.detail.value}`)
  );
  wire("m-sub-btn", "m-sub", (e) =>
    show("#m-sub-out", `picked: ${e.detail.value}`)
  );
  const multi = wire("m-multi-btn", "m-multi", () => {
    const picked = [...multi.querySelectorAll("button[selected]")].map(
      (b) => b.value ?? b.textContent.trim()
    );
    show("#m-multi-out", picked.join(", ") || "none");
  });

  const split = mount.querySelector("#m-split");
  const splitMenu = mount.querySelector("#m-split-menu");
  split?.addEventListener("change", (e) => {
    if (e.detail.open === undefined) {
      show("#m-split-out", "main button → change");
      return;
    }
    e.detail.open ? splitMenu.show() : splitMenu.close();
    show("#m-split-out", `arrow → open: ${e.detail.open}`);
  });
  splitMenu?.addEventListener("change", (e) =>
    show("#m-split-out", `picked: ${e.detail.value}`)
  );
  splitMenu?.addEventListener("close", () => {
    if (split.hasAttribute("open")) {
      split.removeAttribute("open");
      split
        .querySelector("nmui-button:last-child")
        ?.setAttribute("aria-expanded", "false");
    }
  });

  const ctxArea = mount.querySelector("#m-ctx-area");
  const ctxMenu = mount.querySelector("#m-ctx");
  ctxArea?.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    ctxMenu.showAt(e.clientX, e.clientY);
  });
  ctxMenu?.addEventListener("change", (e) =>
    show("#m-ctx-out", `picked: ${e.detail.value}`)
  );

  const field = mount.querySelector("#m-field");
  const fieldMenu = mount.querySelector("#m-field-menu");
  field?.addEventListener("click", () => fieldMenu.toggle());
  fieldMenu?.addEventListener("change", (e) => {
    field.querySelector("input").value = e.detail.value;
    show("#m-field-out", `value: ${e.detail.value}`);
  });

  const chip = mount.querySelector("#m-chip");
  const chipMenu = mount.querySelector("#m-chip-menu");
  chip?.addEventListener("click", () => chipMenu.toggle());
  chipMenu?.addEventListener("change", (e) => {
    mount.querySelector("#m-chip-label").textContent = e.detail.value;
    show("#m-chip-out", `selected: ${e.detail.value}`);
  });

  wire("m-vsub-btn", "m-vsub", (e) =>
    show("#m-vsub-out", `picked: ${e.detail.value}`)
  );
}
