import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Switch — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/switch")}
    <header class="docs-header">
      <h1>Switch</h1>
      <p>Decorates a native checkbox input — forms, validation, and keyboard behavior come free — and gives it <code>role="switch"</code>, since that's what assistive tech should announce. The label text is wrapped in a native <code>&lt;label&gt;</code> at runtime, so it is the input's accessible name and clicking it toggles natively. A switch is a <em>setting</em>: its effect starts immediately, with no save step. For choices that wait for a submit, use a checkbox; for one-of-many, a radio.</p>
      <p class="docs-note">Spec geometry: track 52×32dp with a 2dp outline (off only), handle 16dp off / 24dp on / 28dp while pressed, 40dp state layer, 48dp target. Off: surface-container-highest track, outline handle. On: primary track, on-primary handle. Hover, focus, and press deepen the handle (on-surface-variant off, primary-container on) over the state layer at 8% / 12% / 12%. The label stays on-surface in every state.</p>
      <p class="docs-note">Keyboard is the platform's: Tab lands on the handle, Space (or Enter, per the accessibility table) toggles. Programmatic sets work the same as the other form controls: <code>input.checked = true</code> fires no event, and the component still re-syncs, because the input's own setters are reflected to the host.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Settings</h2>
        <p>The canonical use: a stacked list of standalone options, each taking effect the moment it flips. Labels describe what the control does when it's <em>on</em> — short and direct.</p>
        ${demo(`<div style="display: flex; flex-direction: column; align-items: flex-start;">
  <nmui-switch><input type="checkbox" name="demo-set" value="wifi" checked>Wi-Fi</nmui-switch>
  <nmui-switch><input type="checkbox" name="demo-set" value="bluetooth">Bluetooth</nmui-switch>
  <nmui-switch><input type="checkbox" name="demo-set" value="dnd">Do Not Disturb</nmui-switch>
</div>
<output id="demo-set-out" class="docs-output">wifi: on · bluetooth: off · dnd: off</output>`)}
      </section>

      <section class="docs-section">
        <h2>Icons</h2>
        <p>Author an <code>&lt;icon&gt;</code> for the off state and an <code>&lt;icon selected&gt;</code> for the on state — either or both. With any icon the handle is 24dp in both states. The guidelines are blunt about glyph choice: the icon must read as a binary, like check / x. A moon or a pencil is decoration, not information.</p>
        ${demo(`<div style="display: flex; flex-direction: column; align-items: flex-start;">
  <nmui-switch><input type="checkbox" checked><icon>close</icon><icon selected>check</icon>Both states</nmui-switch>
  <nmui-switch><input type="checkbox"><icon selected>check</icon>Selected only</nmui-switch>
  <nmui-switch><input type="checkbox">No icons</nmui-switch>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>States</h2>
        ${demo(`<div style="display: flex; flex-direction: column; align-items: flex-start;">
  <nmui-switch><input type="checkbox">Off</nmui-switch>
  <nmui-switch><input type="checkbox" checked>On</nmui-switch>
  <nmui-switch><input type="checkbox" disabled>Off, disabled</nmui-switch>
  <nmui-switch><input type="checkbox" checked disabled>On, disabled</nmui-switch>
</div>`)}
        <p>Hover for the state layer, Tab to one for the focus layer, press and hold for the 28dp pressed handle. Disabled is painted per part from the tokens — track on-surface at 12%, handle at 38% (a solid surface disc when on) — never as host opacity.</p>
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        <p>This component fires <strong>no custom events</strong> — it decorates a native input, so every event is a native input event, with native timing.</p>
        ${evTable([
          ["change", "the authored input (bubbles)", "e.target.checked / .value", "after a toggle — click, label click, Space, or input.click()"],
          ["input", "the authored input (bubbles)", "e.target.checked / .value", "just before change, on the same toggle"],
          ["click", "host or input", "—", "any click on the track, the handle, or the label"],
          ["focusin / focusout", "host (they bubble)", "—", "the handle gains / loses focus; plain focus / blur do not bubble — attach those to the input"],
          ["invalid", "the input (does not bubble)", "—", "form validation blocks a submit, e.g. a required switch left off"],
        ])}
        <h3>The native way works too</h3>
        <p>Because the input stays a real input, the whole native toolbox applies: <code>name</code> / <code>value</code> in form data, <code>required</code> validation, and <code>form.reset()</code> (the component re-syncs after a reset). Setting state in code — <code>input.checked = true</code> — updates the switch on screen but fires <strong>no event</strong>: native behavior, not a gap. When you want the event as well, call <code>input.click()</code>. Try both against the log:</p>
        ${demo(`<nmui-switch id="demo-ev-sw"><input type="checkbox" id="demo-ev-input">Airplane mode</nmui-switch>`)}
        <div class="docs-row">
          <nmui-button tonal id="demo-ev-set">Set input.checked = true in code</nmui-button>
          <nmui-button tonal id="demo-ev-click">Call input.click()</nmui-button>
          <nmui-button outlined id="demo-ev-clear">Clear log</nmui-button>
        </div>
        <pre><code id="demo-ev-log">(flip the switch, then try the two buttons)</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  // Settings demo readout.
  const setOut = mount.querySelector("#demo-set-out");
  mount.addEventListener("change", (e) => {
    if (e.target?.name === "demo-set") {
      const states = [...mount.querySelectorAll('input[name="demo-set"]')]
        .map((i) => `${i.value}: ${i.checked ? "on" : "off"}`)
        .join(" · ");
      setOut.textContent = states;
    }
  });

  // Events demo: contrast a programmatic set (no event) with
  // input.click() (full event sequence).
  const evInput = mount.querySelector("#demo-ev-input");
  const evLog = mount.querySelector("#demo-ev-log");
  const evSay = (line) => {
    if (evLog.dataset.empty) {
      evLog.textContent = "";
      delete evLog.dataset.empty;
    }
    evLog.textContent += (evLog.textContent ? "\n" : "") + line;
  };
  evLog.dataset.empty = "1";
  ["click", "input", "change"].forEach((name) => {
    evInput?.addEventListener(name, () => {
      evSay(`${name} → checked: ${evInput.checked}`);
    });
  });
  mount.querySelector("#demo-ev-set")?.addEventListener("click", () => {
    evInput.checked = true;
    evSay("code set input.checked = true → no event fired (native behavior); the switch still updated");
  });
  mount.querySelector("#demo-ev-click")?.addEventListener("click", () => {
    evSay("code called input.click() →");
    evInput.click();
  });
  mount.querySelector("#demo-ev-clear")?.addEventListener("click", () => {
    evLog.textContent = "(log cleared)";
    evLog.dataset.empty = "1";
  });
}
