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
        <h2>Events</h2>
        ${evTable([
          ["change (custom)", "the menu", "detail: {value, selected, item, menu}", "an item is picked. selected is true/false in select menus (single-select, [multiple]); plain action menus report undefined"],
          ["open (custom)", "the menu", "detail: {menu}", "the menu opens, however it was opened"],
          ["close (custom)", "the menu", "detail: {menu}", "the menu closes — selection, Escape, outside press, Tab, or scroll"],
          ["click (native)", "the item button (bubbles)", "—", "items are real buttons; their clicks bubble through the menu. The menu acts on them itself, so prefer change"],
        ])}
        <p>The native way: open and close with <code>menu.show()</code> / <code>menu.close()</code> / <code>menu.toggle()</code>, or set the <code>[open]</code> attribute — every path runs the same placement and fires the same events. Setting an item's <code>[selected]</code> attribute by hand moves its check mark and <code>aria-checked</code> with no event, same as setting a checkbox's <code>checked</code>. The anchor is wired for you: it gets <code>aria-haspopup="menu"</code>, a synced <code>aria-expanded</code>, and ArrowDown/ArrowUp open the menu from it. Inside, arrows move (disabled items can be focused but not picked, per the accessibility spec), Home/End jump, typing letters jumps to the next item starting with them, Escape closes the innermost menu, and focus returns to the anchor on close.</p>
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
}
