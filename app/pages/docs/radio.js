import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Radio — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/radio")}
    <header class="docs-header">
      <h1>Radio</h1>
      <p>Decorates native radio inputs — grouping, forms, validation, and keyboard behavior come free. The <code>name</code> attribute groups radios natively: selecting one clears the others. The label text is wrapped in a native <code>&lt;label&gt;</code> at runtime, so it is the input's accessible name and clicking it selects natively.</p>
      <p class="docs-note">Spec geometry: 20dp icon (2dp ring, 10dp dot), 40dp state layer, 48dp target (the row height — 14dp padding-block around the 20dp icon). Selected ring and dot are primary; the unselected ring is on-surface-variant; the state layer is on-surface unselected and primary selected (hover 8%, focus 12%, pressed 12%). The label stays on-surface whatever the state; disabled is on-surface at 38% for ring, dot, and label alike.</p>
      <p class="docs-note">Keyboard is the platform's: Tab lands on the selected radio (or the first if none is), the arrows move <em>and</em> select with wrap-around, and Space selects the focused radio. A group may start with nothing selected, but once something is selected it can't be unselected by clicking — give people a way out (a "None" option) when they need one.</p>
      <p class="docs-note">Programmatic sets work: <code>input.checked = true</code> fires no change event, and the radio the platform silently unchecks fires nothing either, so the component reflects sets through accessors that re-sync the whole group after delegating to the native setter — the input stays native, so forms and <code>:checked</code> matching still work.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Group</h2>
        <p>One selection from a visible list — five or fewer options is the guidelines' sweet spot; past that, consider a menu. Stacked vertically, with one option pre-selected.</p>
        ${demo(`<div style="display: flex; flex-direction: column; align-items: flex-start;">
  <nmui-radio><input type="radio" name="demo-sort" value="relevance" checked>Relevance</nmui-radio>
  <nmui-radio><input type="radio" name="demo-sort" value="newest">Newest</nmui-radio>
  <nmui-radio><input type="radio" name="demo-sort" value="price-up">Price: low to high</nmui-radio>
  <nmui-radio><input type="radio" name="demo-sort" value="price-down">Price: high to low</nmui-radio>
</div>
<output id="demo-sort-out" class="docs-output">sort: relevance</output>`)}
      </section>

      <section class="docs-section">
        <h2>States</h2>
        ${demo(`<div style="display: flex; flex-direction: column; align-items: flex-start;">
  <nmui-radio><input type="radio" name="demo-st-a" value="off">Unselected</nmui-radio>
  <nmui-radio><input type="radio" name="demo-st-a" value="on" checked>Selected</nmui-radio>
  <nmui-radio><input type="radio" name="demo-st-b" value="off" disabled>Disabled</nmui-radio>
  <nmui-radio><input type="radio" name="demo-st-b" value="on" checked disabled>Disabled, selected</nmui-radio>
</div>`)}
        <p>Hover a radio for the state layer, Tab to one for the focus layer, press down for the pressed layer.</p>
      </section>

      <section class="docs-section">
        <h2>Starting empty</h2>
        <p>A group can start with nothing selected. Notice the way out once you've picked: the last option is the accessibility guidance's escape hatch, so the choice is never a trap.</p>
        ${demo(`<div style="display: flex; flex-direction: column; align-items: flex-start;">
  <nmui-radio><input type="radio" name="demo-ring" value="callisto">Callisto</nmui-radio>
  <nmui-radio><input type="radio" name="demo-ring" value="ganymede">Ganymede</nmui-radio>
  <nmui-radio><input type="radio" name="demo-ring" value="luna">Luna</nmui-radio>
  <nmui-radio><input type="radio" name="demo-ring" value="none">No ringtone</nmui-radio>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        <p>This component fires <strong>no custom events</strong> — it decorates a native input, so every event is a native input event, with native timing. One radio-specific wrinkle: when the selection moves, <code>change</code> fires on the <em>newly selected</em> input only. The radio that lost the selection fires nothing — read the group's state from the event, or from the form, not from the old input.</p>
        ${evTable([
          ["change", "the newly selected input", "read e.target.checked / .value", "after a selection — click, label click, arrow key, Space, or input.click()"],
          ["input", "the newly selected input", "read e.target.checked / .value", "just before change, on a user selection"],
          ["click", "host or input", "—", "any click on the icon, the label, or the row"],
          ["focusin / focusout", "host (they bubble)", "—", "the group's focused radio gains / loses focus; plain focus / blur do not bubble — attach those to the input"],
          ["invalid", "the input (does not bubble)", "—", "form validation blocks a submit, e.g. a required group with nothing selected"],
        ])}
        <pre><code>document.querySelectorAll('input[name="size"]').forEach((input) =&gt; {
  input.addEventListener("change", (e) =&gt; {
    console.log("size:", e.target.value); // only the newly selected one fires
  });
});</code></pre>
        <h3>The native way works too</h3>
        <p>Because the input stays a real input, the whole native toolbox applies: <code>name</code> / <code>value</code> in form data, <code>required</code> validation (a required group with no selection blocks submit), and <code>form.reset()</code> (the component re-syncs the group after a reset). Setting state in code — <code>input.checked = true</code> — updates every radio in the group on screen, including clearing the one that was selected, but fires <strong>no event</strong>: that is native browser behavior, not a gap. When you want the event as well, call <code>input.click()</code> — it selects and fires <code>click</code> → <code>input</code> → <code>change</code> exactly like a user press. Try both against the log:</p>
        ${demo(`<div style="display: flex; flex-direction: column; align-items: flex-start;">
  <nmui-radio><input type="radio" name="demo-ev" value="small">Small</nmui-radio>
  <nmui-radio><input type="radio" name="demo-ev" value="medium" checked>Medium</nmui-radio>
  <nmui-radio><input type="radio" name="demo-ev" value="large">Large</nmui-radio>
</div>`)}
        <div class="docs-row">
          <nmui-button tonal id="demo-ev-set">Set Large's input.checked = true in code</nmui-button>
          <nmui-button tonal id="demo-ev-click">Call Small's input.click()</nmui-button>
          <nmui-button outlined id="demo-ev-clear">Clear log</nmui-button>
        </div>
        <pre><code id="demo-ev-log">(pick a size, then try the two buttons)</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  // Group demo readout.
  mount.addEventListener("change", (e) => {
    if (e.target?.name === "demo-sort") {
      mount.querySelector("#demo-sort-out").textContent =
        "sort: " + e.target.value;
    }
  });

  // Events demo: log what the group's inputs fire; contrast a
  // programmatic set (no event, whole group re-syncs) with
  // input.click() (full event sequence).
  const evInputs = [...mount.querySelectorAll('input[name="demo-ev"]')];
  const evLog = mount.querySelector("#demo-ev-log");
  const evSay = (line) => {
    if (evLog.dataset.empty) {
      evLog.textContent = "";
      delete evLog.dataset.empty;
    }
    evLog.textContent += (evLog.textContent ? "\n" : "") + line;
  };
  evLog.dataset.empty = "1";
  evInputs.forEach((input) => {
    ["click", "input", "change"].forEach((name) => {
      input.addEventListener(name, () => {
        evSay(`${name} on "${input.value}" → checked: ${input.checked}`);
      });
    });
  });
  mount.querySelector("#demo-ev-set")?.addEventListener("click", () => {
    evInputs.find((i) => i.value === "large").checked = true;
    evSay("code set Large.checked = true → no event fired (native behavior); the group still updated");
  });
  mount.querySelector("#demo-ev-click")?.addEventListener("click", () => {
    evSay("code called Small.click() →");
    evInputs.find((i) => i.value === "small").click();
  });
  mount.querySelector("#demo-ev-clear")?.addEventListener("click", () => {
    evLog.textContent = "(log cleared)";
    evLog.dataset.empty = "1";
  });
}
