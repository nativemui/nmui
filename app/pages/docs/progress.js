import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Progress indicators — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/progress")}
    <header class="docs-header">
      <h1>Progress indicators</h1>
      <p><code>&lt;nmui-progress&gt;</code> — the status of a process in real time, for waits over ~5s or progress you can measure (short indeterminate waits belong to the loading indicator). Two variants — linear (default) and <code>[circular]</code> — in two generations: the M3 baseline (flat, fixed 4dp) and M3 Expressive (configurable thickness, and the <code>[wavy]</code> shape). <code>[value]</code> is 0–1; omit it for indeterminate.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Linear — determinate & indeterminate</h2>
        <p>Note the anatomy from the specs: primary active indicator, secondary-container track, a 4dp gap, and the 4dp <strong>stop indicator</strong> dot at the end of the track — required when the track's contrast is under 3:1, so it always ships on determinate linear indicators. At very low values the active indicator starts as a dot.</p>
        ${demo(`<nmui-progress value="0.25" aria-label="Uploading file, 25 percent"></nmui-progress>
<nmui-progress value="0.6" aria-label="Uploading file, 60 percent"></nmui-progress>
<nmui-progress value="0.95" aria-label="Uploading file, 95 percent"></nmui-progress>
<nmui-progress aria-label="Loading article"></nmui-progress>`)}
      </section>

      <section class="docs-section">
        <h2>Wavy — the Expressive shape</h2>
        <p><code>[wavy]</code> puts the sine wave on the <strong>active indicator only</strong> — the track underneath stays a straight line, with the usual 4dp gap before the track remainder and the stop dot. Wavelength 40dp, amplitude 1.5dp at the default thickness (scaling with thicker tracks), drawn at the element's real pixel width so the wave keeps its size at any container width; the container grows to fit it.</p>
        ${demo(`<nmui-progress wavy value="0.6" aria-label="Uploading file, wavy"></nmui-progress>
<nmui-progress wavy aria-label="Loading article, wavy"></nmui-progress>`)}
      </section>

      <section class="docs-section">
        <h2>Thickness — Expressive configuration</h2>
        <p>Baseline is fixed at 4dp; Expressive makes the track thickness configurable. Set it with the <code>--nmui-progress-thickness</code> property (a plain number of dp). The same configuration should be used for every instance of a process.</p>
        ${demo(`<nmui-progress value="0.6" style="--nmui-progress-thickness:10" aria-label="Thick progress"></nmui-progress>
<nmui-progress wavy value="0.6" style="--nmui-progress-thickness:8" aria-label="Thick wavy progress"></nmui-progress>
<nmui-progress circular value="0.6" style="--nmui-progress-thickness:8" aria-label="Thick circular progress"></nmui-progress>`)}
      </section>

      <section class="docs-section">
        <h2>Circular</h2>
        <p>Centered in an element — a card, or inside a button for an action in progress (use the flat shape in very small buttons; the wave isn't visible at that size). Size with CSS <code>width</code>/<code>height</code> (specs: 24–240dp). Circular indicators never carry a stop dot.</p>
        ${demo(`<nmui-progress circular value="0.6" aria-label="Uploading file, circular"></nmui-progress>
<nmui-progress circular aria-label="Loading article, circular"></nmui-progress>
<nmui-progress circular wavy value="0.6" aria-label="Wavy circular progress"></nmui-progress>
<nmui-progress circular wavy aria-label="Wavy circular progress, indeterminate"></nmui-progress>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["(none)", "—", "—", "a progress indicator dispatches no events — it only reflects a process"],
        ])}
        <p>The native way works: <code>progress.value</code> reads the progress as a number (or <code>null</code> when indeterminate); setting it — <code>progress.value = 0.75</code>, or removing it with <code>progress.value = null</code> — redraws and keeps <code>aria-valuenow</code> in sync. Semantics: <code>role="progressbar"</code>; give it an <code>aria-label</code> that says what is progressing ("Uploading file"), as every demo here does. Reduced motion isn't altered — progress motion is information, and the indeterminate animations simply keep reporting that work is ongoing.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/progress-indicators/specs">m3.material.io/components/progress-indicators</a></p>
    </footer>
  </div>`;
}
