import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Checkbox — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/checkbox")}
    <header class="docs-header">
      <h1>Checkbox</h1>
      <p>Decorates a native input — forms, validation, and keyboard behavior come free. The label text is wrapped in a native <code>&lt;label&gt;</code> at runtime, so it is the input's accessible name and clicking it toggles natively.</p>
      <p class="docs-note">Spec geometry: 18dp container, 2dp corners, 18dp icon, 40dp state layer, 48dp target (the row height — 15dp padding-block around the 18dp box). State layer: on-surface unselected, primary selected/indeterminate, error in error; hover 8%, focus 12%, pressed 12%. Label text stays on-surface whatever the state (38% when disabled). The old draft's focus outline never matched anything — the mark is prepended before the input, so <code>input + mark</code> selected nothing; focus now shows the state layer instead, which is the spec's focus indication.</p>
      <p class="docs-note">Programmatic sets work: <code>input.checked = true</code> and <code>input.indeterminate = true</code> fire no change event and touch no attribute, so the component reflects them through accessors that sync the host after delegating to the native setter — the input stays native, so forms and <code>:checked</code> matching still work. <code>[error]</code> is a host attribute the app sets, e.g. after validation.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>States</h2>
        ${demo(`<nmui-checkbox><input type="checkbox">Unchecked</nmui-checkbox>
<nmui-checkbox><input type="checkbox" checked>Checked</nmui-checkbox>
<nmui-checkbox><input type="checkbox" disabled>Disabled</nmui-checkbox>
<nmui-checkbox><input type="checkbox" checked disabled>Disabled checked</nmui-checkbox>
<nmui-checkbox><input type="checkbox"></nmui-checkbox>`)}
        <p>Hover a box for the state layer, Tab to one for the focus layer, press down for the pressed layer. The last box has no label — just the box.</p>
      </section>

      <section class="docs-section">
        <h2>Parent and children</h2>
        <p>The guidelines' pattern: the parent checks or unchecks all children; when some but not all children are checked, the parent goes indeterminate; checking an indeterminate parent checks everything.</p>
        ${demo(`<div style="display: flex; flex-direction: column; align-items: flex-start;">
  <nmui-checkbox id="demo-parent"><input type="checkbox">Select all</nmui-checkbox>
  <nmui-checkbox class="demo-child"><input type="checkbox">Apples</nmui-checkbox>
  <nmui-checkbox class="demo-child"><input type="checkbox" checked>Oranges</nmui-checkbox>
  <nmui-checkbox class="demo-child"><input type="checkbox">Bananas</nmui-checkbox>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Error</h2>
        <p>Error states exist for unselected, selected, and indeterminate (new in the current spec).</p>
        ${demo(`<nmui-checkbox error><input type="checkbox">Required, unselected</nmui-checkbox>
<nmui-checkbox error><input type="checkbox" checked>Required, selected</nmui-checkbox>
<nmui-checkbox error id="demo-err-ind"><input type="checkbox">Required, indeterminate</nmui-checkbox>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        <p>This component fires <strong>no custom events</strong> — it decorates a native input, so every event is a native input event, with native timing. Attach listeners to the input; <code>change</code>, <code>input</code>, and <code>click</code> also bubble, so listening on the <code>&lt;nmui-checkbox&gt;</code> host (or a surrounding form) works too.</p>
        ${evTable([
          ["change", "the input", "read e.target.checked / .indeterminate", "after a toggle — click, label click, Space, or input.click()"],
          ["input", "the input", "read e.target.checked", "just before change, on a user toggle"],
          ["click", "host or input", "—", "any click on the box, the label, or the row"],
          ["focusin / focusout", "host (they bubble)", "—", "the input gains / loses focus; plain focus / blur do not bubble — attach those to the input"],
          ["invalid", "the input (does not bubble)", "—", "form validation blocks a submit, e.g. a required box left unchecked"],
        ])}
        <pre><code>const input = document.querySelector("#terms input");

input.addEventListener("change", (e) =&gt; {
  console.log("agreed:", e.target.checked);
});</code></pre>
        <h3>The native way works too</h3>
        <p>Because the input stays a real input, the whole native toolbox applies: <code>name</code> / <code>value</code> in form data, <code>required</code> validation, <code>form.reset()</code> (the component re-syncs after a reset). Setting state in code — <code>input.checked = true</code>, <code>.indeterminate</code>, <code>.disabled</code> — updates the box on screen, but fires <strong>no event</strong>: that is native browser behavior, not a gap. When you want the events as well, call <code>input.click()</code> instead — it toggles and fires <code>click</code> → <code>input</code> → <code>change</code> exactly like a user press. Try both against the log:</p>
        ${demo(`<nmui-checkbox id="demo-ev"><input type="checkbox">Log my events</nmui-checkbox>`)}
        <div class="docs-row">
          <nmui-button tonal id="demo-ev-set">Set input.checked = true in code</nmui-button>
          <nmui-button tonal id="demo-ev-click">Call input.click()</nmui-button>
          <nmui-button outlined id="demo-ev-clear">Clear log</nmui-button>
        </div>
        <pre><code id="demo-ev-log">(toggle the box, then try the two buttons)</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  // Parent/child wiring (the guidelines' pattern).
  const parent = mount.querySelector("#demo-parent input");
  const children = [...mount.querySelectorAll(".demo-child input")];
  const refresh = () => {
    const n = children.filter((c) => c.checked).length;
    parent.checked = n === children.length;
    parent.indeterminate = n > 0 && n < children.length;
  };
  parent.addEventListener("change", () => {
    children.forEach((c) => {
      c.checked = parent.checked;
    });
    parent.indeterminate = false;
  });
  children.forEach((c) => c.addEventListener("change", refresh));
  refresh();

  mount.querySelector("#demo-err-ind input").indeterminate = true;

  // Events demo: log what the demo box's input fires, and contrast a
  // programmatic property set (no events) with input.click() (all).
  const evInput = mount.querySelector("#demo-ev input");
  const evLog = mount.querySelector("#demo-ev-log");
  const evSay = (line) => {
    if (evLog.dataset.empty) {
      evLog.textContent = "";
      delete evLog.dataset.empty;
    }
    evLog.textContent += (evLog.textContent ? "\n" : "") + line;
  };
  evLog.dataset.empty = "1";
  ["click", "input", "change", "focusin", "focusout"].forEach((name) => {
    evInput.addEventListener(name, () => {
      evSay(name + " → checked: " + evInput.checked);
    });
  });
  mount.querySelector("#demo-ev-set")?.addEventListener("click", () => {
    evInput.checked = true;
    evSay("code set input.checked = true → no event fired (native behavior); the box still updated");
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
