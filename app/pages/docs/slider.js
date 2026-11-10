import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Slider — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/slider")}
    <header class="docs-header">
      <h1>Slider</h1>
      <p>Decorates native <code>&lt;input type="range"&gt;</code> element(s) — keyboard, touch, and form behavior come free, and changes take effect immediately, as the guidelines require. The component renders the Expressive visuals (split track, stops, pill handle, value indicator) and syncs them from the input, because the native pseudo-elements can't draw a track in two pieces.</p>
      <p class="docs-note">Variants: bare is the <strong>standard</strong> slider (active track from the start). <code>centered</code> grows the active track from the middle — for values around a zero or default. <code>range</code> takes <em>two</em> authored inputs (start, then end) and selects the span between two handles. <code>vertical</code> stands the slider up — the guidelines say avoid it with <code>range</code> (too much cognitive load), so that combination is on you.</p>
      <p class="docs-note">Sizes are the Expressive five — track height / handle height: <strong>XS</strong> 16/44 (bare), <code>small</code> 24/44, <code>medium</code> 40/52, <code>large</code> 56/68, <code>xlarge</code> 96/108. The handle is a 4dp-wide pill that narrows to 2dp while pressed. Active track and handle are primary; the inactive track is secondary-container; the value indicator is inverse-surface. Every slider also carries a small stop at the end of its inactive track — the accessibility spec's 3:1 contrast anchor for the track's end.</p>
      <p class="docs-note">Keyboard is the platform's: Tab lands on the handle, arrows step by one (or one stop), Home/End jump to the ends. Label the input the native way — <code>aria-label</code> or an associated <code>&lt;label&gt;</code> — and the adjacent text becomes the slider's accessible name.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Standard</h2>
        ${demo(`<nmui-slider id="demo-std"><input type="range" value="40" aria-label="Volume"></nmui-slider>
<output id="demo-std-out" class="docs-output">value: 40</output>`)}
      </section>

      <section class="docs-section">
        <h2>Sizes</h2>
        <p>XS is the default. XL is for hero moments — the guidelines reserve it for when the slider <em>is</em> the screen's main event.</p>
        ${demo(`<div style="display: flex; flex-direction: column; gap: 20px;">
  <nmui-slider><input type="range" value="30" aria-label="Extra small"></nmui-slider>
  <nmui-slider small><input type="range" value="40" aria-label="Small"></nmui-slider>
  <nmui-slider medium><input type="range" value="50" aria-label="Medium"></nmui-slider>
  <nmui-slider large><input type="range" value="60" aria-label="Large"></nmui-slider>
  <nmui-slider xlarge><input type="range" value="70" aria-label="Extra large"></nmui-slider>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Stops</h2>
        <p><code>stops</code> draws an indicator at every step (the input's <code>step</code> does the snapping — native). Stops on the active span take on-primary; the rest take on-secondary-container. Keep the count sane — too many stops crowd the track.</p>
        ${demo(`<nmui-slider stops medium><input type="range" min="0" max="5" step="1" value="3" aria-label="Rating"></nmui-slider>`)}
      </section>

      <section class="docs-section">
        <h2>Value indicator</h2>
        <p><code>label</code> shows the value above the handle while you interact — hover, focus, or drag. Format it by setting <code>slider.formatLabel = (v) =&gt; …</code> in code.</p>
        ${demo(`<div style="padding-top: 56px;">
  <nmui-slider label medium id="demo-fmt"><input type="range" min="0" max="200" value="80" aria-label="Budget"></nmui-slider>
</div>`)}
        <p>When the value also lives in a text field, the guidelines' rule is that the two update each other, and the field is the next Tab stop after the slider:</p>
        ${demo(`<div class="docs-row" style="align-items: center; gap: 16px;">
  <nmui-slider label id="demo-pair" style="flex: 1;"><input type="range" min="0" max="100" value="25" aria-label="Brightness"></nmui-slider>
  <nmui-text-field style="width: 96px;"><label>Brightness</label><input type="number" id="demo-pair-num" min="0" max="100" value="25"></nmui-text-field>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Centered</h2>
        <p>For a range with a meaningful middle — pan, balance, exposure. The end stops mark both extremes.</p>
        ${demo(`<div style="padding-top: 56px;">
  <nmui-slider centered label><input type="range" min="-100" max="100" step="5" value="-25" aria-label="Balance"></nmui-slider>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>Range</h2>
        <p>Author two inputs — start first, end second. Dragging picks the nearer handle and clamps at the other one; each input still Tabs and arrows on its own. Only one value indicator shows at a time.</p>
        ${demo(`<div style="padding-top: 56px;">
  <nmui-slider range label id="demo-range"><input type="range" value="20" aria-label="Lowest price"><input type="range" value="70" aria-label="Highest price"></nmui-slider>
</div>
<output id="demo-range-out" class="docs-output">range: 20 – 70</output>`)}
      </section>

      <section class="docs-section">
        <h2>Inset icon</h2>
        <p>An <code>&lt;icon inset&gt;</code> rides inside the track on M, L, and XL sliders. It sits on the inactive track until the active track is long enough to hold it, then moves over — and you can swap the glyph at zero, like volume becoming mute (try the low end).</p>
        ${demo(`<nmui-slider medium id="demo-inset"><icon inset>volume_up</icon><input type="range" value="55" aria-label="Volume"></nmui-slider>`)}
      </section>

      <section class="docs-section">
        <h2>Vertical</h2>
        <p>Length is <code>--nmui-slider-length</code> (default 200px). Zero stays at the bottom.</p>
        ${demo(`<div style="display: flex; gap: 40px; padding-left: 56px;">
  <nmui-slider vertical label><input type="range" value="65" aria-label="Channel one"></nmui-slider>
  <nmui-slider vertical medium stops><input type="range" min="0" max="4" step="1" value="2" aria-label="Channel two"></nmui-slider>
</div>`)}
      </section>

      <section class="docs-section">
        <h2>States</h2>
        ${demo(`<div style="display: flex; flex-direction: column; gap: 20px;">
  <nmui-slider><input type="range" value="40" aria-label="Enabled"></nmui-slider>
  <nmui-slider><input type="range" value="40" disabled aria-label="Disabled"></nmui-slider>
</div>`)}
        <p>Disabled is painted per part, never as host opacity: active track and handle are on-surface at 38%, the inactive track at 12%.</p>
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        <p>This component fires <strong>no custom events</strong> — the native events on the authored input(s) are the API, with native timing. They bubble, so listening on the host works.</p>
        ${evTable([
          ["input", "the authored input (bubbles)", "e.target.value", "continuously while dragging or stepping — the value takes effect immediately"],
          ["change", "the authored input (bubbles)", "e.target.value", "on release after a drag, and on each keyboard step"],
          ["focusin / focusout", "host (they bubble)", "—", "a handle gains / loses focus; for range, e.target is the start or end input"],
          ["invalid", "the input (does not bubble)", "—", "form validation blocks a submit"],
        ])}
        <p>Programmatic sets mirror the other form controls: <code>slider.value = 60</code> (or <code>valueStart</code> / <code>valueEnd</code> on a range — the setters clamp at the other handle), <code>slider.min</code> / <code>max</code> / <code>step</code> / <code>disabled</code> all delegate to the input and re-sync the visuals, firing no event — native behavior. To fire one from code, set <code>input.value</code> and dispatch an <code>input</code> event on the input yourself.</p>
        <pre><code>const slider = document.querySelector("nmui-slider");
slider.addEventListener("input", (e) =&gt; console.log("live:", e.target.value));
slider.value = 60; // silent, like every native programmatic set</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  const std = mount.querySelector("#demo-std");
  const stdOut = mount.querySelector("#demo-std-out");
  std?.addEventListener("input", (e) => {
    stdOut.textContent = "value: " + e.target.value;
  });

  const fmt = mount.querySelector("#demo-fmt");
  if (fmt) fmt.formatLabel = (v) => "$" + v;

  const pair = mount.querySelector("#demo-pair");
  const pairNum = mount.querySelector("#demo-pair-num");
  const pairInput = pair?.querySelector("input");
  pair?.addEventListener("input", (e) => {
    pairNum.value = e.target.value;
  });
  pairNum?.addEventListener("input", () => {
    if (pairInput && pairNum.value !== "") {
      pairInput.value = pairNum.value;
      pairInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });

  const range = mount.querySelector("#demo-range");
  const rangeOut = mount.querySelector("#demo-range-out");
  range?.addEventListener("input", () => {
    rangeOut.textContent = `range: ${range.valueStart} – ${range.valueEnd}`;
  });

  // Inset icon: swap to the mute glyph at zero, per guidelines.
  const inset = mount.querySelector("#demo-inset");
  const insetIcon = inset?.querySelector("icon[inset]");
  inset?.addEventListener("input", (e) => {
    const v = parseFloat(e.target.value);
    if (insetIcon) insetIcon.textContent = v === 0 ? "volume_off" : v < 50 ? "volume_down" : "volume_up";
  });
}
