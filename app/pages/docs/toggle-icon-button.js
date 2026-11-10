import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, btn, evTable } from "../demo.js";
import { familyNav } from "./button-family.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Toggle icon button — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/button")}
    <header class="docs-header">
      <h1>Toggle icon button</h1>
      <p><code>&lt;nmui-button icon toggle&gt;</code> — an icon button with a selected state. Unselected draws the <em>outlined</em> glyph; selected fills it. Colors follow the icon-button spec table per style, and the resting shape morphs round → square on selection.</p>
    </header>

    ${familyNav("/docs/toggle-icon-button")}

    <main>
      <section class="docs-section">
        <h2>Styles — unselected / selected pairs</h2>
        ${demo(
          [
            btn("icon toggle", "favorite"),
            btn("icon toggle selected", "favorite"),
            btn("icon toggle tonal", "bookmark"),
            btn("icon toggle tonal selected", "bookmark"),
            btn("icon toggle outlined", "star"),
            btn("icon toggle outlined selected", "star"),
            btn("icon toggle standard", "thumb_up"),
            btn("icon toggle standard selected", "thumb_up"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Sizes</h2>
        ${demo(
          [
            btn("icon toggle xsmall", "favorite"),
            btn("icon toggle small selected", "favorite"),
            btn("icon toggle medium", "favorite"),
            btn("icon toggle large selected", "favorite"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Shapes — square rests round when selected</h2>
        ${demo(
          [
            btn("icon toggle square medium", "favorite"),
            btn("icon toggle square medium selected", "favorite"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Two icons — [selected] on an icon swaps the glyph</h2>
        ${demo(
          btn(
            "icon toggle",
            "<icon>mic</icon><icon selected>mic_off</icon>"
          )
        )}
      </section>

      <section class="docs-section">
        <h2>Disabled</h2>
        ${demo(
          [
            btn("icon toggle disabled", "favorite"),
            btn("icon toggle selected disabled", "favorite"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${demo(`<nmui-button icon toggle id="demo-ticon-ev"><icon>favorite</icon></nmui-button>`)}
        <output id="demo-ticon-ev-out" class="docs-output">press it…</output>
        ${evTable([
          ["click", "the host", "—", "every press — pointer, Enter, or Space"],
          ["change (custom)", "the host", "detail: {value, button, selected, event}", "every press, after the flip; selected is the new state"],
        ])}
        <p>State lives in <code>btn.selected</code> / <code>[selected]</code> (mirrored to <code>aria-pressed</code>; the glyph fills when selected). In code: <code>btn.selected = true</code> sets state silently — no event, the native pattern; <code>btn.click()</code> flips it and fires both events.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/icon-buttons/specs">m3.material.io/components/icon-buttons</a></p>
    </footer>
  </div>`;

  const ticonOut = mount.querySelector("#demo-ticon-ev-out");
  mount.querySelector("#demo-ticon-ev")?.addEventListener("change", (e) => {
    ticonOut.textContent = `change → selected: ${e.detail.selected}`;
  });
}
