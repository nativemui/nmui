import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Text field — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/text-field")}
    <header class="docs-header">
      <h1>Text field</h1>
      <p>Decorates a native input or textarea plus its <code>&lt;label&gt;</code> — forms, validation, and keyboard behavior come free. The label is tied to the input at runtime, so it is the field's accessible name, and it floats when the field is focused or populated. Every text field should have a label; keep it short and never truncated.</p>
      <p class="docs-note">Two variants, same behavior: bare is <strong>filled</strong> (surface-container-highest, rounded top corners, a bottom active indicator), <code>[outlined]</code> is quieter (a full outline whose top edge grows a notch for the floated label). Container 56dp, text and label body-large, icons 24dp, supporting text body-small. Don't intermix the two variants inside one form region — separate them by section.</p>
      <p class="docs-note">Programmatic sets work like the other form controls: <code>input.value = "x"</code> fires no event, and the component still re-syncs (the input's own setters are reflected to the host). The host's <code>.value</code> delegates to the input, and a form reset re-syncs.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Filled</h2>
        ${demo(`<div style="display: flex; gap: 16px; flex-wrap: wrap;">
  <nmui-text-field><label>First name</label><input autocomplete="given-name"></nmui-text-field>
  <nmui-text-field><label>Last name</label><input autocomplete="family-name" value="Stuckey"></nmui-text-field>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Outlined</h2>
        ${demo(`<div style="display: flex; gap: 16px; flex-wrap: wrap;">
  <nmui-text-field outlined><label>Email</label><input type="email"></nmui-text-field>
  <nmui-text-field outlined><label>City</label><input value="Kansas City"></nmui-text-field>
</div>`)}
        <p>Watch the top edge as a label floats: the outline opens a notch exactly the label's width — no background paint behind the text, so the field sits correctly on any surface.</p>
      </section>

      <section class="docs-section">
        <h2>Supporting text & errors</h2>
        <p>A <code>&lt;small&gt;</code> is supporting text. A <code>&lt;small error&gt;</code> is error text: while the host carries <code>[error]</code> it <em>replaces</em> the supporting text (never stacks under it, so the layout doesn't jump), the field takes the error colors, an error icon appears, and the input gets <code>aria-invalid</code> with its <code>aria-describedby</code> repointed at the error text. Your validation sets and clears <code>[error]</code> — try it:</p>
        ${demo(`<nmui-text-field outlined id="demo-err-field">
  <label>Email</label>
  <input type="email" id="demo-err-input" value="not-an-email">
  <small>Use your company email</small>
  <small error>Enter a valid email address</small>
</nmui-text-field>`)}
        <div class="docs-row">
          <nmui-button tonal id="demo-err-check">Validate</nmui-button>
          <output id="demo-err-out" class="docs-output">not validated yet</output>
        </div>
      </section>

      <section class="docs-section">
        <h2>Prefix & suffix</h2>
        <p><code>&lt;span prefix&gt;</code> and <code>&lt;span suffix&gt;</code> ride inside the field — a currency symbol, a unit, a domain. They appear once the label has floated (focused or populated), and they're wired into the input's <code>aria-describedby</code>, since a screen reader should hear "Euro" or "at gmail dot com", not just the glyph.</p>
        ${demo(`<div style="display: flex; gap: 16px; flex-wrap: wrap;">
  <nmui-text-field outlined><label>Amount</label><span prefix>$</span><input type="number" value="42"></nmui-text-field>
  <nmui-text-field outlined><label>Username</label><input value="banning"><span suffix>@gmail.com</span></nmui-text-field>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Icons</h2>
        <p><code>&lt;icon leading&gt;</code> and <code>&lt;icon trailing&gt;</code> are 24dp adornments. A trailing element that's interactive — a button — keeps its own clicks. The accessibility guidelines' own example is the password field: the trailing button's label says what it does, "Show password" / "Hide password".</p>
        ${demo(`<div style="display: flex; gap: 16px; flex-wrap: wrap;">
  <nmui-text-field><icon leading>search</icon><label>Search</label><input></nmui-text-field>
  <nmui-text-field outlined>
    <label>Password</label>
    <input type="password" id="demo-pw-input" value="hunter2">
    <nmui-button icon standard trailing id="demo-pw-toggle" aria-label="Show password">visibility</nmui-button>
  </nmui-text-field>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Character counter</h2>
        <p>Give the input a <code>maxlength</code> and the counter appears on its own — no extra markup. It reads "Character count, n/max" to assistive tech and turns error-colored if code pushes the value past the limit.</p>
        ${demo(`<nmui-text-field outlined>
  <label>Display name</label>
  <input maxlength="20" value="Banning">
  <small>Shown next to your posts</small>
</nmui-text-field>`)}
      </section>

      <section class="docs-section">
        <h2>Text area</h2>
        <p>Author a <code>&lt;textarea&gt;</code> instead of an input. On the web a text area (fixed height from its <code>rows</code>, scrolling internally) is preferred over an auto-growing field — it says up front that a longer answer is welcome.</p>
        ${demo(`<nmui-text-field outlined>
  <label>Notes</label>
  <textarea rows="4"></textarea>
  <small>Anything we should know?</small>
</nmui-text-field>`)}
      </section>

      <section class="docs-section">
        <h2>Disabled & read-only</h2>
        ${demo(`<div style="display: flex; gap: 16px; flex-wrap: wrap;">
  <nmui-text-field><label>Disabled</label><input value="Can't edit" disabled></nmui-text-field>
  <nmui-text-field outlined><label>Read-only</label><input value="Can select, can't edit" readonly></nmui-text-field>
</div>`)}
        <p>Disabled is painted per part from the tokens (filled container on-surface at 4%, text and label at 38%, outlined frame at 12%) — never as host opacity. Read-only keeps the regular styling, per the guidelines.</p>
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        <p>This component fires <strong>no custom events</strong> — it decorates a native input, so every event is a native input event, with native timing.</p>
        ${evTable([
          ["input", "the authored input (bubbles)", "e.target.value", "every keystroke / edit, as the value changes"],
          ["change", "the authored input (bubbles)", "e.target.value", "when the field loses focus after an edit"],
          ["focus / blur", "the input (focusin / focusout bubble to the host)", "—", "the field gains / loses focus; the label floats on focus"],
          ["invalid", "the input (does not bubble)", "—", "form validation blocks a submit, e.g. a required field left empty"],
          ["click", "host or input", "—", "clicks on the container focus the input; a trailing button keeps its own click"],
        ])}
        <h3>The native way works too</h3>
        <p><code>name</code> / <code>value</code> in form data, <code>required</code> and <code>maxlength</code> validation, <code>form.reset()</code> — all native. Setting state in code — <code>input.value = "x"</code> or the host's <code>field.value = "x"</code> — updates the field on screen but fires <strong>no event</strong>: native behavior, not a gap. Try both against the log:</p>
        ${demo(`<nmui-text-field outlined id="demo-ev-field"><label>Log field</label><input id="demo-ev-input"></nmui-text-field>`)}
        <div class="docs-row">
          <nmui-button tonal id="demo-ev-set">Set the value in code</nmui-button>
          <nmui-button tonal id="demo-ev-type">Type "hi" with events</nmui-button>
          <nmui-button outlined id="demo-ev-clear">Clear log</nmui-button>
        </div>
        <pre><code id="demo-ev-log">(type in the field, then try the two buttons)</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  // Error demo: a real validity check driving [error].
  const errField = mount.querySelector("#demo-err-field");
  const errInput = mount.querySelector("#demo-err-input");
  const errOut = mount.querySelector("#demo-err-out");
  mount.querySelector("#demo-err-check")?.addEventListener("click", () => {
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(errInput.value);
    errField.toggleAttribute("error", !ok);
    errOut.textContent = ok ? "valid — [error] cleared" : "invalid — [error] set; fix the address and validate again";
  });

  // Password demo: the guidelines' show/hide trailing button.
  const pwInput = mount.querySelector("#demo-pw-input");
  const pwToggle = mount.querySelector("#demo-pw-toggle");
  pwToggle?.addEventListener("click", () => {
    const show = pwInput.type === "password";
    pwInput.type = show ? "text" : "password";
    pwToggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
    const icon = pwToggle.querySelector("icon");
    if (icon) icon.textContent = show ? "visibility_off" : "visibility";
  });

  // Events demo: code set (no event) vs dispatched typing.
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
  ["input", "change"].forEach((name) => {
    evInput?.addEventListener(name, () => {
      evSay(`${name} → value: "${evInput.value}"`);
    });
  });
  mount.querySelector("#demo-ev-set")?.addEventListener("click", () => {
    evInput.value = "set in code";
    evSay('code set input.value = "set in code" → no event fired (native behavior); the label still floated');
  });
  mount.querySelector("#demo-ev-type")?.addEventListener("click", () => {
    evInput.value = "";
    for (const ch of "hi") {
      evInput.value += ch;
      evInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    evSay("— each keystroke fired its own input event");
  });
  mount.querySelector("#demo-ev-clear")?.addEventListener("click", () => {
    evLog.textContent = "(log cleared)";
    evLog.dataset.empty = "1";
  });
}
