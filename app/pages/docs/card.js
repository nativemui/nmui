import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Card — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/card")}
    <header class="docs-header">
      <h1>Card</h1>
      <p><code>&lt;nmui-card&gt;</code> — one element, three variants. Elevated (the default) is surface-container-low at level 1, rising to level 2 on hover. Filled is surface-container-highest at level 0, rising to level 1 on hover. Outlined is surface with an outline-variant border at level 0, rising to level 1 on hover. Shape is a 12dp radius, padding 16dp, text start-aligned. Content is free light DOM. Pressed tints the container 12% toward on-surface; focus shows an outline. Hover, pressed, and ripple belong to directly actionable (<code>[href]</code>) cards only — a non-actionable card has no hover state. Dragging is app behavior; the card only owns the dragged look (<code>[dragging]</code> lifts it to level 3).</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Elevated</h2>
        ${demo(`<nmui-card elevated>
  <headline small>Elevated</headline>
  <p>Rises above the surface.</p>
</nmui-card>`)}
      </section>

      <section class="docs-section">
        <h2>Filled</h2>
        ${demo(`<nmui-card filled>
  <headline small>Filled</headline>
  <p>Flat, tonal fill.</p>
</nmui-card>`)}
      </section>

      <section class="docs-section">
        <h2>Outlined</h2>
        ${demo(`<nmui-card outlined>
  <headline small>Outlined</headline>
  <p>Flat, hairline border.</p>
</nmui-card>`)}
      </section>

      <section class="docs-section">
        <h2>Clickable</h2>
        ${demo(`<nmui-card outlined href="/docs/card">
  <headline small>Clickable</headline>
  <p>The whole card is the link — keyboard-operable with Enter or Space. Clicking this one reloads this page.</p>
</nmui-card>`)}
        <p class="docs-note">Hover it and it lifts, press it and it ripples — only directly actionable cards do that. Tab to it and the focus ring shows for keyboard focus, not mouse clicks.</p>
      </section>

      <section class="docs-section">
        <h2>Disabled</h2>
        ${demo(`<nmui-card filled disabled>
  <headline small>Disabled</headline>
  <p>Faded, flat, and unwired.</p>
</nmui-card>`)}
      </section>

      <section class="docs-section">
        <h2>Draggable</h2>
        <div id="drag-box" style="position: relative; min-height: 220px; border: 1px dashed var(--md-sys-color-outline-variant, #cac4d0); border-radius: 12px; overflow: hidden;">
          <nmui-card elevated id="drag-card" style="position: absolute; left: 16px; top: 16px; width: 240px; cursor: grab; touch-action: none;">
            <headline small>Drag me</headline>
            <p>Pointer-drag this card around the box. While dragging it rises to level 3.</p>
          </nmui-card>
        </div>
        <p class="docs-note">Dragging is app behavior — this demo wires pointer events to the card and toggles [dragging] while it moves. The card itself only owns the dragged look.</p>
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["— no custom events —", "—", "—", "the card never dispatches its own event"],
          ["click", "an [href] card (the host)", "—", "a press anywhere on the card; the card then navigates to its href — your listener still runs"],
          ["keydown → click", "an [href] card", "—", "Enter or Space on a focused card synthesizes a click, so keyboard presses arrive as click too"],
          ["click / pointer events", "interactive children (they bubble through the card)", "the child's own detail", "buttons and links inside any card keep their own contracts — the drag demo above is the app wiring pointer events itself"],
        ])}
        <p>The native way works: <code>card.setAttribute("href", "/somewhere")</code> in code makes a plain card clickable — the listeners check <code>[href]</code> when the event happens, not once at setup (and an author-set <code>tabindex</code> no longer unwires the card). <code>card.click()</code> in code is a real press, navigation included — call it only when you mean to go. A plain card with no <code>[href]</code> fires nothing of its own and adds no behavior to clicks beyond letting them bubble.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/cards/specs">m3.material.io/components/cards</a></p>
    </footer>
  </div>`;

  const box = mount.querySelector("#drag-box");
  const dragCard = mount.querySelector("#drag-card");
  if (box && dragCard) {
    let grabX = 0, grabY = 0, dragging = false;
    dragCard.addEventListener("pointerdown", (e) => {
      dragging = true;
      grabX = e.clientX - dragCard.offsetLeft;
      grabY = e.clientY - dragCard.offsetTop;
      dragCard.setAttribute("dragging", "");
      dragCard.style.cursor = "grabbing";
      dragCard.setPointerCapture(e.pointerId);
    });
    dragCard.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const maxX = box.clientWidth - dragCard.offsetWidth;
      const maxY = box.clientHeight - dragCard.offsetHeight;
      dragCard.style.left = `${Math.max(0, Math.min(maxX, e.clientX - grabX))}px`;
      dragCard.style.top = `${Math.max(0, Math.min(maxY, e.clientY - grabY))}px`;
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      dragCard.removeAttribute("dragging");
      dragCard.style.cursor = "grab";
    };
    dragCard.addEventListener("pointerup", endDrag);
    dragCard.addEventListener("pointercancel", endDrag);
  }
}
