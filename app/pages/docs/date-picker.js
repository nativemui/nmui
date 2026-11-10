import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Date picker — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/date-picker")}
    <header class="docs-header">
      <h1>Date picker</h1>
      <p><code>&lt;nmui-date-picker&gt;</code> decorates an authored field — a <code>&lt;label&gt;</code> and an <code>&lt;input&gt;</code> — in the specs' three variants: bare is the <strong>docked</strong> picker, <code>[modal]</code> the <strong>modal</strong> picker, and <code>[range]</code> adds range selection. Values are ISO dates: the committed date lives in the host's <code>[value]</code> (and <code>[end]</code> for a range), while the field shows the locale's format.</p>
      <p class="docs-note">Spec geometry, both surfaces: 360dp wide, surface-container-high. Day cells are 48dp targets carrying a 40dp circle, in 48dp rows under a 40dp weekday row; the docked panel rounds at corner-large (16dp), the modal dialog at corner-extra-large (28dp) at level 3. Selected dates fill primary, today wears a primary ring inside its circle, range middles sit on a secondary-container band, a picked month fills surface-variant, a picked year fills primary. The docked field is the spec's outlined text field. Names, week start, and typed-date order all come from the locale via <code>Intl</code>.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Docked</h2>
        <p>The field opens a calendar panel below it. Month and year are menu buttons — the month list and year grid replace the calendar, per the guidelines — and the arrows page. The docked month button shows the <strong>short</strong> month name (<em>Nov</em>, not <em>November</em>): each selector gets half the 360dp panel, and the full name cannot fit between its two arrows — the month list itself still shows full names. Swiping the day grid left or right pages the month, too. Selection is tentative until <strong>OK</strong>: Cancel, Escape, or pressing outside throws it away. Typing in the field commits directly (ISO, or the locale's own numeric order); an unparseable entry turns the field to its error state instead, and an empty field clears the value.</p>
        ${demo(`<nmui-date-picker value="2026-11-04">
  <label>Birthday</label>
  <input>
</nmui-date-picker>`)}
        <p class="docs-note">Keyboard, from a focused day: arrows move by day and week, PageUp / PageDown by month (with Shift, by year), Home / End to the week's edges. The day grid keeps one tab stop and moves it with the arrows.</p>
      </section>

      <section class="docs-section">
        <h2>Bounded with min and max</h2>
        <p><code>[min]</code> / <code>[max]</code> take ISO dates; days outside them render disabled and can't be picked, and months that fall entirely outside disappear from the month list. Type a bad date in this one (<code>13/40/2026</code>) to see the error state.</p>
        ${demo(`<nmui-date-picker value="2026-11-04" min="2026-08-01" max="2027-01-31">
  <label>Appointment</label>
  <input>
</nmui-date-picker>`)}
      </section>

      <section class="docs-section">
        <h2>Modal</h2>
        <p><code>[modal]</code> turns the field into a trigger — it's read-only, and a click (or Enter) opens the dialog: supporting text (the <code>[label]</code> attribute, default "Select date"), the tentative date as the headline, a divider, then the calendar. The edit icon in the header swaps the calendar for typed fields — that's the <strong>modal date input</strong>, a view of the modal in the guidelines, not a third tag — and the calendar icon swaps back. OK commits, Cancel / Escape / a press on the scrim reverts.</p>
        ${demo(`<nmui-date-picker modal value="2026-11-04">
  <label>Appointment</label>
  <input>
</nmui-date-picker>`)}
      </section>

      <section class="docs-section">
        <h2>Modal range</h2>
        <p><code>[range]</code> is a modal configuration in the specs, so it always opens the dialog, with the headline stepped down to title-large to carry both dates. Click one day for the start and another for the end — the days between sit on the secondary-container band, and a third click starts over. The dialog's input view carries two fields here (Start date / End date). The committed pair lands in <code>[value]</code> and <code>[end]</code>.</p>
        ${demo(`<nmui-date-picker modal range value="2026-11-10" end="2026-11-17">
  <label>Trip</label>
  <input>
</nmui-date-picker>`)}
        <p class="docs-note">Not in this pass: the full-screen modal the guidelines recommend on compact breakpoints, and scroll-wheel month navigation. Swipe navigation <em>is</em> in: swipe the day grid left for the next month, right for the previous one (the modal surface swipes too).</p>
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["change (custom)", "the picker host", "detail: {value, date, end, endDate, picker, event}", "a commit: OK in the calendar or input view, or a typed date committed in a docked field. end / endDate are null outside [range]; date is a Date, value its ISO string"],
          ["open (custom)", "the picker host", "detail: {picker}", "the panel or dialog opens — field focus or click, the field's icon button, or open()"],
          ["close (custom)", "the picker host", "detail: {picker}", "the surface closes. After OK a change fires first; after Cancel / Escape / an outside press, close fires alone and nothing was committed"],
          ["change (native)", "the inner <input>", "the input's value", "the input's own change, bubbling up from typing commits. Tell it from the custom one by target: the input here, the host there"],
          ["input (native)", "the inner <input>", "the input's value", "every keystroke in a docked field (modal fields are read-only triggers)"],
        ])}
        <p>Live log — every picker on this page reports here:</p>
        <pre><code id="demo-dp-log">(open a picker, pick a date, press OK…)</code></pre>
        <h3>The native way works too</h3>
        <p><code>picker.value = "2027-01-15"</code> sets the attribute and the field text follows, silently — no event, like <code>input.checked = true</code>. <code>picker.date</code> and <code>picker.endDate</code> are the same values as <code>Date</code> objects. <code>open()</code>, <code>close()</code>, and <code>toggle()</code> drive the surface from code, and if the field sits in a form, a form reset puts the picker's value back to whatever the field resets to, silently. Clicking the field is the everyday path; <code>picker.click()</code> on the host does nothing special — drive the input or the methods instead.</p>
        <pre><code>picker.addEventListener("change", (e) =&gt; {
  console.log(e.detail.value, e.detail.date);
  if (e.detail.end) console.log("→", e.detail.end);
});

picker.value = "2027-01-15"; // silent: attribute + field update
picker.open();</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/date-pickers/specs">m3.material.io/components/date-pickers</a></p>
    </footer>
  </div>`;

  // Events log: every picker on the page reports its custom events.
  const log = mount.querySelector("#demo-dp-log");
  let logEmpty = true;
  const say = (line) => {
    if (logEmpty) {
      log.textContent = "";
      logEmpty = false;
    }
    log.textContent += (log.textContent ? "\n" : "") + line;
  };
  mount.querySelectorAll("nmui-date-picker").forEach((picker) => {
    const name =
      picker.querySelector(":scope > label")?.textContent.trim() || "(unlabeled)";
    picker.addEventListener("change", (e) => {
      say(
        `change → "${name}": ${e.detail.value ?? "—"}${e.detail.end ? ` → ${e.detail.end}` : ""}`
      );
    });
    picker.addEventListener("open", () => say(`open → "${name}"`));
    picker.addEventListener("close", () => say(`close → "${name}"`));
  });
}
