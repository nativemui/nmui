import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Toolbars — nmui docs";

const stage = (inner, height = 190) => `
  <div style="position: relative; height: ${height}px; border-radius: 12px; background: var(--md-sys-color-surface-container-low, #f7f2fa); overflow: hidden; padding: 16px;">
    <p style="margin: 0; color: var(--md-sys-color-on-surface-variant, #49454f);">Page content underneath. The toolbar floats above it — where it sits is the app's layout, the same way the app bar doesn't position itself.</p>
    ${inner}
  </div>`;

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/toolbar")}
    <header class="docs-header">
      <h1>Toolbars</h1>
      <p>A container for the actions of the current page — buttons, icon buttons, text fields, or any component, in slots. The toolbar itself has no interactions: every control inside keeps its own behavior and its own tab stop. All toolbars are 64dp tall with at least 16dp of outside padding.</p>
      <p class="docs-note">Bare is the <strong>docked toolbar</strong>: full width, square corners, no shadow — it replaces the bottom app bar, which M3 Expressive no longer recommends (don't round a docked toolbar's corners; that implies it expands). <code>[floating]</code> is the pill that floats above the content, for contextual actions. Either takes <code>[vibrant]</code> for the high-emphasis color scheme. Never show a toolbar and a navigation bar at the same time — navigation bars own primary pages, toolbars own the pages after them.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Docked</h2>
        <p>Global actions that stay the same across pages. Items center by default with 32dp between them; on compact windows (under 600dp) a default docked toolbar spreads its items evenly instead.</p>
        ${demo(`<nmui-toolbar aria-label="Document actions">
  <nmui-button icon standard aria-label="Undo">undo</nmui-button>
  <nmui-button icon standard aria-label="Redo">redo</nmui-button>
  <nmui-button icon standard aria-label="Print">print</nmui-button>
  <nmui-button icon standard aria-label="Share">share</nmui-button>
  <nmui-button>Save</nmui-button>
</nmui-toolbar>`)}
      </section>

      <section class="docs-section">
        <h2>Docked alignment</h2>
        <p><code>[start]</code> and <code>[end]</code> pack the items to an edge; <code>[spread]</code> pushes them apart — the layout for centering one key action with the rest at the edges on larger windows. On big screens, dividers can organize a long toolbar into groups.</p>
        ${demo(`<nmui-toolbar start aria-label="Start aligned">
  <nmui-button icon standard aria-label="Back">arrow_back</nmui-button>
  <nmui-button icon standard aria-label="Archive">archive</nmui-button>
  <nmui-button icon standard aria-label="Delete">delete</nmui-button>
</nmui-toolbar>
<nmui-toolbar spread aria-label="Spread" style="margin-top: 12px;">
  <nmui-button icon standard aria-label="Close">close</nmui-button>
  <nmui-button>Publish</nmui-button>
  <nmui-button icon standard aria-label="More options">more_vert</nmui-button>
</nmui-toolbar>`)}
      </section>

      <section class="docs-section">
        <h2>Vibrant</h2>
        <p>The vibrant scheme (primary-container) draws attention to the controls — or signals a temporary mode change, like entering edit mode. The buttons inside remap per the specs: filled stays primary, plain and standard icon buttons take on-primary-container, tonal toggles ride on surface-container.</p>
        ${demo(`<nmui-toolbar vibrant aria-label="Edit selection">
  <nmui-button icon standard aria-label="Close">close</nmui-button>
  <nmui-button icon tonal aria-label="Pin">push_pin</nmui-button>
  <nmui-button icon standard aria-label="Archive">archive</nmui-button>
  <nmui-button icon standard aria-label="Delete">delete</nmui-button>
  <nmui-button text>Select all</nmui-button>
</nmui-toolbar>`)}
      </section>

      <section class="docs-section">
        <h2>Floating</h2>
        <p>Contextual actions for the content under it. The container is only as big as its items — don't pad it out — and it keeps a minimum 16dp from the window's edges. Elevation is on by default; on a visually distinct background it can come off (that's the surface doing the work, so here it stays).</p>
        ${demo(stage(`<nmui-toolbar floating aria-label="Photo actions" style="position: absolute; left: 50%; bottom: 16px; transform: translateX(-50%);">
  <nmui-button icon standard aria-label="Crop">crop</nmui-button>
  <nmui-button icon standard aria-label="Tune">tune</nmui-button>
  <nmui-button icon standard aria-label="Rotate">rotate_right</nmui-button>
  <nmui-button icon filled aria-label="Filters">filter_vintage</nmui-button>
</nmui-toolbar>`))}
        <p>One action can carry the emphasis — here a filled icon button among standard ones. Don't emphasize two at once.</p>
      </section>

      <section class="docs-section">
        <h2>Floating with a FAB</h2>
        <p>A FAB pairs <em>beside</em> the toolbar (not inside it) for the single highest-priority action of the view.</p>
        ${demo(stage(`<div style="position: absolute; left: 50%; bottom: 16px; transform: translateX(-50%); display: flex; align-items: center; gap: 16px;">
  <nmui-toolbar floating aria-label="Message actions">
    <nmui-button icon standard aria-label="Reply">reply</nmui-button>
    <nmui-button icon standard aria-label="Forward">forward</nmui-button>
    <nmui-button icon standard aria-label="Star">star</nmui-button>
  </nmui-toolbar>
  <nmui-button fab aria-label="Compose">edit</nmui-button>
</div>`))}
      </section>

      <section class="docs-section">
        <h2>Vertical floating</h2>
        <p><code>[vertical]</code> stacks the pill into a 64dp column for larger windows — place it on the edge opposite the navigation rail, with at least 24dp of margin, and keep the buttons narrow or default width so the column stays compact. Vertical toolbars aren't recommended on compact windows; they cover too much.</p>
        ${demo(stage(`<nmui-toolbar floating vertical aria-label="Drawing tools" style="position: absolute; right: 24px; top: 50%; transform: translateY(-50%);">
  <nmui-button icon standard aria-label="Brush">brush</nmui-button>
  <nmui-button icon standard aria-label="Shapes">shapes</nmui-button>
  <nmui-button icon standard aria-label="Text">title</nmui-button>
  <nmui-button icon standard aria-label="Eraser">ink_eraser</nmui-button>
</nmui-toolbar>`, 260))}
      </section>

      <section class="docs-section">
        <h2>Overflow</h2>
        <p>A floating toolbar must stay fully on screen — it never runs off the edge. When the trailing buttons don't fit, the component collapses them into an overflow menu in the trailing slot, and brings them back when there's room again. Non-button children (a text field, a divider) never collapse. This stage is narrow on purpose: the last actions live behind the ⋮ button.</p>
        ${demo(`<div style="position: relative; height: 150px; max-width: 340px; border-radius: 12px; background: var(--md-sys-color-surface-container-low, #f7f2fa); overflow: hidden;">
  <nmui-toolbar floating aria-label="Formatting" style="position: absolute; left: 16px; right: 16px; bottom: 16px; width: auto;">
    <nmui-button icon standard aria-label="Undo">undo</nmui-button>
    <nmui-button icon standard aria-label="Redo">redo</nmui-button>
    <nmui-button icon standard aria-label="Bold">format_bold</nmui-button>
    <nmui-button icon standard aria-label="Italic">format_italic</nmui-button>
    <nmui-button icon standard aria-label="Underline">format_underlined</nmui-button>
    <nmui-button icon standard aria-label="Insert link">link</nmui-button>
    <nmui-button icon standard aria-label="Insert image">image</nmui-button>
  </nmui-toolbar>
</div>`)}
        <p>The collapsed controls stay in the DOM, hidden — the menu items are proxies labeled from each control's <code>aria-label</code> and icon, and picking one clicks the real control. That's one more reason icon buttons need real labels.</p>
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        <p>This component fires <strong>no custom events</strong> and adds no keyboard behavior of its own — per the accessibility spec, Tab lands on the first action and moves through all of them (no roving tabindex), and Space/Enter activate the focused control.</p>
        ${evTable([
          ["click / change", "the controls inside (they bubble through the toolbar)", "whatever the control reports", "a button or toggle inside is used — listen on the control, or delegate from the toolbar"],
          ["—", "the toolbar itself", "—", "the container is inert: role=\"toolbar\" with aria-orientation is its whole API"],
        ])}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;
}
