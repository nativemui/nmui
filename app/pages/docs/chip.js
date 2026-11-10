import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Chip — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/chip")}
    <header class="docs-header">
      <h1>Chip</h1>
      <p><code>&lt;nmui-chip&gt;</code> — one tag, four roles: <code>[assist]</code> (default), <code>[filter]</code>, <code>[input]</code>, <code>[suggestion]</code>, plus <code>[elevated]</code>. Chips come in sets — a single chip by itself is a guidelines don't.</p>
      <p class="docs-note">Spec geometry, shared by all four roles: 32dp tall, 8dp corners, label-large text, 18dp icons, 8dp between elements, 16dp side padding (8dp where a side carries an icon, 4dp leading for an avatar). The visible box is 32dp but the target is the guidelines' 48dp minimum — it extends past the box. Flat chips are outlined in outline-variant (the Aug 2024 stroke softening — the draft used the old outline role); elevated chips fill surface-container-low at level 1 with no outline, for use on images. State layers run on the chip's label color role at the standard 8% hover / 12% pressed.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Assist</h2>
        <p>Smart, contextual actions — verb-first labels, primary leading icon. Momentary: a press fires <code>change</code> and nothing stays selected.</p>
        ${demo(`<nmui-chip assist><icon>calendar_month</icon>Add to calendar</nmui-chip>
<nmui-chip assist><icon>directions_car</icon>12 mins away</nmui-chip>
<nmui-chip assist>Set alarm</nmui-chip>`)}
      </section>

      <section class="docs-section">
        <h2>Filter</h2>
        <p>Click toggles <code>[selected]</code>; the component's checkmark appears in place of any authored leading icon, and the chip fills secondary-container. Multi-select is the chip's nature — single-select sets (deselecting siblings) are the app's call, driven by the <code>change</code> event. <code>aria-pressed</code> tracks the state.</p>
        ${demo(`<nmui-chip filter>Docs</nmui-chip>
<nmui-chip filter selected>Slides</nmui-chip>
<nmui-chip filter selected>Sheets</nmui-chip>
<nmui-chip filter>Images</nmui-chip>
<nmui-chip filter><icon>restaurant</icon>Food</nmui-chip>`)}
      </section>

      <section class="docs-section">
        <h2>Input</h2>
        <p>Discrete pieces of user-entered data. Clicking the chip selects it (secondary-container, <code>aria-selected</code>); the trailing icon is a separate action with its own 48dp target — clicking it asks for removal with a <code>close</code> event instead of selecting, and removing the element is the app's job. A selected chip also asks on Delete/Backspace. Try all three on these:</p>
        ${demo(`<nmui-chip input>Ana<icon>close</icon></nmui-chip>
<nmui-chip input>Ben<icon>close</icon></nmui-chip>
<nmui-chip input><img avatar src="/assets/mark.svg" alt="">Cy<icon>close</icon></nmui-chip>`)}
        <p class="docs-note">A leading <code>&lt;img avatar&gt;</code> renders at 24dp with 12dp corners and 4dp leading padding, per the input chip table. (The demo uses the nmui mark as a stand-in portrait.)</p>
      </section>

      <section class="docs-section">
        <h2>Suggestion</h2>
        <p>Product-generated suggestions — quick replies, search starters. Momentary like assist, with an on-surface-variant label.</p>
        ${demo(`<nmui-chip suggestion>Thanks!</nmui-chip>
<nmui-chip suggestion>Sounds good</nmui-chip>
<nmui-chip suggestion>What song is this?</nmui-chip>`)}
      </section>

      <section class="docs-section">
        <h2>Elevated</h2>
        <p>For chips over images or dynamic backgrounds: surface-container-low fill, level 1, no outline.</p>
        ${demo(`<nmui-chip assist elevated><icon>photo</icon>Add photos</nmui-chip>
<nmui-chip filter elevated>Near me</nmui-chip>
<nmui-chip suggestion elevated>Directions</nmui-chip>`)}
      </section>

      <section class="docs-section">
        <h2>Disabled</h2>
        <p>Explicit colors, never host opacity: flat chips get an on-surface 10% outline and 38% content; elevated chips an on-surface 12% fill; a selected filter/input chip keeps its secondary-container family at 38%. Disabled chips leave the tab order and fire nothing.</p>
        ${demo(`<nmui-chip assist disabled><icon>calendar_month</icon>Add to calendar</nmui-chip>
<nmui-chip filter disabled>Docs</nmui-chip>
<nmui-chip filter selected disabled>Slides</nmui-chip>
<nmui-chip input disabled>Ana<icon>close</icon></nmui-chip>
<nmui-chip suggestion disabled>Thanks!</nmui-chip>
<nmui-chip assist elevated disabled>Add photos</nmui-chip>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["change (custom)", "the chip host", "detail: {value, selected, chip, event}", "every press that isn't a remove — assist/suggestion fire it momentarily; filter/input fire it after toggling [selected]"],
          ["close (custom)", "an [input] chip host", "detail: {chip}", "the trailing icon is clicked, or Delete/Backspace is pressed on a selected input chip; the app removes the chip"],
          ["click", "the chip host", "—", "every press — pointer, Enter, or Space (the keyboard synthesizes click)"],
        ])}
        <p>Selection state is readable any time as <code>chip.selected</code> / <code>[selected]</code> (filter chips mirror it to <code>aria-pressed</code>, input chips to <code>aria-selected</code>). Give chips a <code>value</code> attribute when the label text isn't the identifier you want in <code>detail</code>. Live log — every chip on this page reports here:</p>
        <pre><code id="demo-chip-log">(press any chip above…)</code></pre>
        <h3>The native way works too</h3>
        <p><code>chip.click()</code> is a real press — toggle, <code>change</code>, and even navigation if the chip has <code>[href]</code> (assist/suggestion chips with <code>href</code> act as links: <code>change</code> fires, then the press navigates, like an <code>&lt;a&gt;</code>). Setting <code>chip.selected = true</code> or <code>chip.disabled = true</code> in code updates the attribute, the visuals, and the ARIA, but fires no event — the native pattern, same as <code>input.checked = true</code>. And <code>chip.remove()</code> is all a removal ever is: the <code>close</code> event asks, your listener removes.</p>
        <pre><code>document.querySelectorAll("nmui-chip[input]").forEach((chip) =&gt; {
  chip.addEventListener("close", (e) =&gt; e.detail.chip.remove());
});

filters.addEventListener("change", (e) =&gt; {
  console.log("filter:", e.detail.value, "→", e.detail.selected);
});</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/chips/specs">m3.material.io/components/chips</a></p>
    </footer>
  </div>`;

  // Input chips: close asks, the app removes.
  mount.querySelectorAll("nmui-chip[input]").forEach((chip) => {
    chip.addEventListener("close", (e) => e.detail.chip.remove());
  });

  // Events log: every chip on the page reports its change/close.
  const chipLog = mount.querySelector("#demo-chip-log");
  let chipLogEmpty = true;
  const chipSay = (line) => {
    if (chipLogEmpty) {
      chipLog.textContent = "";
      chipLogEmpty = false;
    }
    chipLog.textContent += (chipLog.textContent ? "\n" : "") + line;
  };
  mount.querySelectorAll("nmui-chip").forEach((chip) => {
    const label =
      [...chip.childNodes]
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent.trim())
        .join(" ") || "(unlabeled)";
    chip.addEventListener("change", (e) => {
      chipSay(`change → "${label}" selected: ${e.detail.selected}`);
    });
    chip.addEventListener("close", () => {
      chipSay(`close → "${label}" (removed by the app listener)`);
    });
  });
}
