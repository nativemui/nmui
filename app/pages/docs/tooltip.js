import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Tooltip — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/tooltip")}
    <header class="docs-header">
      <h1>Tooltip</h1>
      <p>Extra context for a UI element. A tooltip is a <em>sibling</em> of its anchor — never nested inside it — and names it with <code>anchor="id"</code>, like a menu. With no <code>anchor</code>, the previous element is the anchor. Only one tooltip is open at a time, anywhere on the page: showing one closes any other immediately.</p>
      <p class="docs-note">Plain tooltips label icon-only buttons and fields. Rich tooltips explain a feature, with an optional subhead, links, and up to two text buttons. Never hide critical information in a tooltip — if it must be seen, use a dialog.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Plain</h2>
        <p>Hover (after a 500ms intent delay), focus (immediately), or long-press a button below. The tooltip sits above the button, 4dp away, and lingers 1.5 seconds after you move off. Its text is also wired to the button as <code>aria-describedby</code>, so it's the label a screen reader hears.</p>
        ${demo(`<div style="display: flex; gap: 8px;">
  <nmui-button icon standard id="demo-tt-delete" aria-label="Delete">delete</nmui-button>
  <nmui-tooltip anchor="demo-tt-delete">Delete</nmui-tooltip>
  <nmui-button icon standard id="demo-tt-share" aria-label="Share">share</nmui-button>
  <nmui-tooltip anchor="demo-tt-share">Share</nmui-tooltip>
  <nmui-button icon standard id="demo-tt-settings" aria-label="Settings">settings</nmui-button>
  <nmui-tooltip anchor="demo-tt-settings">Settings</nmui-tooltip>
</div>`)}
        <p>Don't put a plain tooltip on an element that already has label text — it would just repeat the words on the button.</p>
      </section>

      <section class="docs-section">
        <h2>Rich</h2>
        <p>The card sits below its anchor, right-aligned, and shifts in 8dp steps to stay on screen. Your pointer can travel from the anchor into the card — the buttons and links inside stay clickable.</p>
        ${demo(`<nmui-button icon standard id="demo-tt-rich" aria-label="About sharing">info</nmui-button>
<nmui-tooltip rich anchor="demo-tt-rich">
  <span subhead>New: shared folders</span>
  Invite people to a folder and everyone sees the same files, kept in sync automatically.
  <actions>
    <nmui-button text>Learn more</nmui-button>
    <nmui-button text>Try it</nmui-button>
  </actions>
</nmui-tooltip>`)}
        <p>Subheads stay brief — one line. Two buttons stay side by side, never stacked.</p>
      </section>

      <section class="docs-section">
        <h2>Persistent rich</h2>
        <p><code>[persistent]</code> turns off hover entirely. The tooltip appears when the anchor is clicked — or when the app calls <code>show()</code>, to introduce a feature on page load — and stays until the user presses anywhere else or hits Escape. Don't use persistent tooltips on icon buttons.</p>
        ${demo(`<nmui-button id="demo-tt-persist" aria-label="About this feature">New feature</nmui-button>
<nmui-tooltip rich persistent anchor="demo-tt-persist">
  <span subhead>Live previews are here</span>
  Changes to your post now preview as you type, so you can see exactly what readers will get.
  <actions>
    <nmui-button text>Got it</nmui-button>
  </actions>
</nmui-tooltip>`)}
      </section>

      <section class="docs-section">
        <h2>Positioning</h2>
        <p>Plain tooltips default above the anchor and flip below when there's no room — which is also what an app bar's buttons need. Rich tooltips default below-right and flip above when the bottom lacks room, never covering the anchor. Try the top-row button: its tooltip has nowhere to go but down.</p>
        ${demo(`<div style="display: flex; justify-content: center;">
  <nmui-button icon standard id="demo-tt-top" aria-label="Menu">menu</nmui-button>
  <nmui-tooltip anchor="demo-tt-top">Menu</nmui-tooltip>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        <p>The tooltip itself is a messenger, not a control: its events exist so an app can watch it, not so an app has to.</p>
        ${evTable([
          ["open", "the tooltip (bubbles)", "{ tooltip }", "the tooltip appears, by hover, focus, long-press, click (persistent), or show()"],
          ["close", "the tooltip (bubbles)", "{ tooltip }", "the tooltip disappears — the 1.5s linger elapsed, the anchor was clicked, Escape, or an outside press (persistent)"],
        ])}
        <h3>Programmatic control</h3>
        <p><code>show()</code> / <code>hide()</code> / <code>toggle()</code> and the <code>[open]</code> attribute drive it directly — that's how a page-load feature announcement works. Try it against the log:</p>
        ${demo(`<nmui-button icon standard id="demo-tt-prog" aria-label="Help">help</nmui-button>
<nmui-tooltip anchor="demo-tt-prog" id="demo-tt-prog-tip">How this page works</nmui-tooltip>`)}
        <div class="docs-row">
          <nmui-button tonal id="demo-tt-show">Show it in code</nmui-button>
          <nmui-button outlined id="demo-tt-hide">Hide it</nmui-button>
          <nmui-button outlined id="demo-tt-clear">Clear log</nmui-button>
        </div>
        <pre><code id="demo-tt-log">(hover the Help button, then try the buttons)</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  // Events demo: code control + a log of open/close.
  const tip = mount.querySelector("#demo-tt-prog-tip");
  const log = mount.querySelector("#demo-tt-log");
  const say = (line) => {
    if (log.dataset.empty) {
      log.textContent = "";
      delete log.dataset.empty;
    }
    log.textContent += (log.textContent ? "\n" : "") + line;
  };
  log.dataset.empty = "1";
  tip?.addEventListener("open", () => say("open"));
  tip?.addEventListener("close", () => say("close"));
  mount.querySelector("#demo-tt-show")?.addEventListener("click", () => {
    tip.show();
    say('show() called');
  });
  mount.querySelector("#demo-tt-hide")?.addEventListener("click", () => {
    tip.hide();
    say('hide() called');
  });
  mount.querySelector("#demo-tt-clear")?.addEventListener("click", () => {
    log.textContent = "(log cleared)";
    log.dataset.empty = "1";
  });
}
