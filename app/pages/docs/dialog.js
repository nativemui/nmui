import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Dialog — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/dialog")}
    <header class="docs-header">
      <h1>Dialog</h1>
      <p>A modal surface over a scrim, dedicated to a single task: an alert, a confirmation, a short form. The headline and supporting text are light DOM, the actions are an <code>&lt;actions&gt;</code> row of buttons, and any child with <code>data-close</code> dismisses the dialog when clicked. Escape and scrim clicks close it too.</p>
      <p class="docs-note">A dialog interrupts. Reach for it when the user must act — a destructive confirmation, a required choice — not for information that can wait. If it doesn't need an answer, a snackbar carries it without stopping anyone.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Basic</h2>
        <p>Centered, 280–560dp wide, 28dp corners. Headline in headline-small, supporting text in body-medium, text buttons at the end with 8dp between them. State is the <code>[open]</code> attribute; <code>show()</code> and <code>close()</code> drive it.</p>
        ${demo(`<nmui-button tonal id="demo-open-basic">Delete item</nmui-button>
<nmui-dialog id="demo-dlg-basic">
  <headline>Delete item?</headline>
  <p>This can't be undone.</p>
  <actions>
    <nmui-button text data-close>Cancel</nmui-button>
    <nmui-button text data-close>Delete</nmui-button>
  </actions>
</nmui-dialog>`)}
      </section>

      <section class="docs-section">
        <h2>With icon</h2>
        <p>An <code>&lt;icon&gt;</code> as the first child — 24dp, secondary color — centers the headline and supporting text. The actions stay at the end. Without an icon, everything start-aligns, like the dialog above.</p>
        ${demo(`<nmui-button tonal id="demo-open-icon">Delete forever</nmui-button>
<nmui-dialog id="demo-dlg-icon">
  <icon>delete</icon>
  <headline>Permanently delete?</headline>
  <p>Deleting this item will remove it immediately. You can't undo this action.</p>
  <actions>
    <nmui-button text data-close>Cancel</nmui-button>
    <nmui-button text data-close>Delete</nmui-button>
  </actions>
</nmui-dialog>`)}
      </section>

      <section class="docs-section">
        <h2>Full-screen</h2>
        <p><code>[fullscreen]</code> takes the whole screen (capped at 560dp wide) for a task with real content — creating or editing an entry. The component builds a 56dp header: a close affordance, the headline, and your actions, over a divider. The rest of the content scrolls under it.</p>
        ${demo(`<nmui-button tonal id="demo-open-full">New event</nmui-button>
<nmui-dialog fullscreen id="demo-dlg-full">
  <headline>New event</headline>
  <p>Saved events appear on your calendar.</p>
  <nmui-text-field><label>Event name</label><input value="Launch day"></nmui-text-field>
  <actions>
    <nmui-button text data-close>Save</nmui-button>
  </actions>
</nmui-dialog>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        <p>The buttons inside a dialog report themselves — a click on Delete is the button's own event. The dialog's events exist so an app can watch it open and close, whichever way it happened.</p>
        ${evTable([
          ["open", "the dialog (bubbles)", "{ dialog }", "the dialog appears — show(), toggle(), or [open] is set in markup or code"],
          ["close", "the dialog (bubbles)", "{ dialog }", "the dialog disappears — close(), Escape, a scrim click, or a [data-close] child"],
        ])}
        <h3>Programmatic control</h3>
        <p><code>show()</code> / <code>close()</code> / <code>toggle()</code> and the <code>[open]</code> attribute are the same state. Try them against the log:</p>
        ${demo(`<nmui-button tonal id="demo-open-events">Open the events dialog</nmui-button>
<nmui-dialog id="demo-dlg-events">
  <headline>Dialog events</headline>
  <p>Every way this dialog opens or closes lands in the log below.</p>
  <actions>
    <nmui-button text data-close>OK</nmui-button>
  </actions>
</nmui-dialog>`)}
        <div class="docs-row">
          <nmui-button tonal id="demo-ev-show">Show it in code</nmui-button>
          <nmui-button outlined id="demo-ev-close">Close it</nmui-button>
          <nmui-button outlined id="demo-ev-clear">Clear log</nmui-button>
        </div>
        <pre><code id="demo-ev-log">(open the dialog, then try the buttons)</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  const wire = (openId, dlgId) => {
    const dlg = mount.querySelector(dlgId);
    mount.querySelector(openId)?.addEventListener("click", () => dlg.show());
  };
  wire("#demo-open-basic", "#demo-dlg-basic");
  wire("#demo-open-icon", "#demo-dlg-icon");
  wire("#demo-open-full", "#demo-dlg-full");
  wire("#demo-open-events", "#demo-dlg-events");

  // Events demo: code control + a log of open/close.
  const dlg = mount.querySelector("#demo-dlg-events");
  const log = mount.querySelector("#demo-ev-log");
  const say = (line) => {
    if (log.dataset.empty) {
      log.textContent = "";
      delete log.dataset.empty;
    }
    log.textContent += (log.textContent ? "\n" : "") + line;
  };
  log.dataset.empty = "1";
  dlg?.addEventListener("open", () => say("open"));
  dlg?.addEventListener("close", () => say("close"));
  mount.querySelector("#demo-ev-show")?.addEventListener("click", () => {
    dlg.show();
    say("show() called");
  });
  mount.querySelector("#demo-ev-close")?.addEventListener("click", () => {
    dlg.close();
    say("close() called");
  });
  mount.querySelector("#demo-ev-clear")?.addEventListener("click", () => {
    log.textContent = "(log cleared)";
    log.dataset.empty = "1";
  });
}
