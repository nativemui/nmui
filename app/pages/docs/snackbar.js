import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Snackbar — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/snackbar")}
    <header class="docs-header">
      <h1>Snackbar</h1>
      <p>A brief, low-priority message about a process the app has performed. It appears at the bottom, never interrupts, never moves focus — <code>role="status"</code> announces it politely — and only one snackbar is ever on screen: calling <code>show()</code> replaces whatever is currently up.</p>
      <p class="docs-note">Container: inverse-surface, 4dp corners, elevation level 3, 48dp tall on one line. Supporting text is body-medium in inverse-on-surface; the single optional action is a text button in inverse-primary (never filled or elevated — the guidelines call that out); the optional close icon is 24dp in inverse-on-surface. Keep the text to one line when you can; two lines is the compact maximum.</p>
      <p class="docs-note">Timing is the accessibility spec's, not a preference: a snackbar <strong>with an action never auto-dismisses</strong> — people get to read and act at their own pace. Without an action it dismisses itself after <code>duration</code> ms (default 4000; the acceptable window is 4–10 seconds), and <code>persistent</code> stays until dismissed either way. On web, pair auto-dismissing messages with inline feedback near the trigger — the guidelines require the information to live somewhere that doesn't vanish.</p>
      <p class="docs-note">Call <code>show()</code> (or <code>show("New text")</code>) and <code>dismiss()</code>, or toggle the <code>open</code> attribute. Escape dismisses a snackbar that has focus. Avoid icons and links inside the message — the guidelines steer both to other components.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Single line</h2>
        <p>No action, so this one dismisses itself after four seconds. Watch the trigger button: its label changes too — that's the inline-feedback half of the web accessibility rule.</p>
        ${demo(`<nmui-button tonal id="demo-save">Save draft</nmui-button>
<nmui-snackbar id="demo-plain"><span>Draft saved</span></nmui-snackbar>`)}
      </section>

      <section class="docs-section">
        <h2>With action</h2>
        <p>An action makes the snackbar stay put until it's used or dismissed — no countdown. Clicking the action fires <code>action</code> and dismisses.</p>
        ${demo(`<nmui-button tonal id="demo-archive">Archive email</nmui-button>
<output id="demo-archive-out" class="docs-output">inbox: 1 message</output>
<nmui-snackbar id="demo-action">
  <span>Email archived</span>
  <nmui-button text>Undo</nmui-button>
</nmui-snackbar>`)}
      </section>

      <section class="docs-section">
        <h2>With close icon</h2>
        <p>Mark any element <code>close</code> and it becomes the dismiss affordance — it dismisses <em>without</em> firing <code>action</code>. A dismiss action is optional, since plain snackbars dismiss themselves.</p>
        ${demo(`<nmui-button tonal id="demo-offline">Go offline</nmui-button>
<nmui-snackbar id="demo-closeable" persistent>
  <span>You're offline. Changes will sync later.</span>
  <nmui-button text icon close aria-label="Dismiss"><icon>close</icon></nmui-button>
</nmui-snackbar>`)}
      </section>

      <section class="docs-section">
        <h2>Longer action</h2>
        <p>When the action's label is long, <code>long-action</code> moves it to its own line under the text, right-aligned — one of the spec's five configurations.</p>
        ${demo(`<nmui-button tonal id="demo-long">Delete photo</nmui-button>
<nmui-snackbar id="demo-long-snack" long-action>
  <span>Photo moved to trash. It will be permanently deleted in 30 days unless you restore it.</span>
  <nmui-button text>Restore from trash</nmui-button>
</nmui-snackbar>`)}
      </section>

      <section class="docs-section">
        <h2>One at a time</h2>
        <p>Consecutive snackbars never stack or sit side by side — a new <code>show()</code> immediately replaces the current one, which is also how an updated message supersedes an outdated one.</p>
        ${demo(`<div class="docs-row">
  <nmui-button tonal id="demo-first">First message</nmui-button>
  <nmui-button tonal id="demo-second">Second message</nmui-button>
</div>
<nmui-snackbar id="demo-queue-a"><span>Upload started</span></nmui-snackbar>
<nmui-snackbar id="demo-queue-b"><span>Upload complete</span></nmui-snackbar>`)}
      </section>

      <section class="docs-section">
        <h2>Placement</h2>
        <p>Centered at the bottom by default, inset 8dp from the edges on compact screens. <code>start</code> anchors it to the bottom-start on wide layouts instead. Either way it floats in front of content but should never cover navigation or a FAB — nudge it with CSS margins in your app if something lives down there.</p>
        ${demo(`<nmui-button tonal id="demo-start">Show start-anchored</nmui-button>
<nmui-snackbar id="demo-start-snack" start><span>Anchored to the start edge</span></nmui-snackbar>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["open", "the snackbar (bubbles)", "{ snackbar }", "the bar finished opening"],
          ["close", "the snackbar (bubbles)", "{ snackbar }", "the bar finished closing — timeout, action, close affordance, Escape, or replacement"],
          ["action", "the snackbar (bubbles)", "{ action, snackbar, event }", "the action was clicked; the bar dismisses itself right after"],
        ])}
        <pre><code>snack.addEventListener("action", () =&gt; undoArchive());
snack.show();              // stays: it has an action
plain.show("Draft saved"); // gone in 4s — no action
plain.dismiss();</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  const save = mount.querySelector("#demo-save");
  const plain = mount.querySelector("#demo-plain");
  save?.addEventListener("click", () => {
    plain.show();
    const original = save.textContent;
    save.textContent = "Saved";
    setTimeout(() => (save.textContent = original), 2000);
  });

  const archiveOut = mount.querySelector("#demo-archive-out");
  const actionSnack = mount.querySelector("#demo-action");
  mount.querySelector("#demo-archive")?.addEventListener("click", () => {
    archiveOut.textContent = "inbox: 0 messages";
    actionSnack.show();
  });
  actionSnack?.addEventListener("action", () => {
    archiveOut.textContent = "inbox: 1 message (restored)";
  });

  const closeable = mount.querySelector("#demo-closeable");
  mount.querySelector("#demo-offline")?.addEventListener("click", () => closeable.show());

  const longSnack = mount.querySelector("#demo-long-snack");
  mount.querySelector("#demo-long")?.addEventListener("click", () => longSnack.show());

  const qa = mount.querySelector("#demo-queue-a");
  const qb = mount.querySelector("#demo-queue-b");
  mount.querySelector("#demo-first")?.addEventListener("click", () => qa.show());
  mount.querySelector("#demo-second")?.addEventListener("click", () => qb.show());

  const startSnack = mount.querySelector("#demo-start-snack");
  mount.querySelector("#demo-start")?.addEventListener("click", () => startSnack.show());
}
