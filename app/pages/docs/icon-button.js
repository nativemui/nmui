import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, btn, evTable } from "../demo.js";
import { familyNav } from "./button-family.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Icon button — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/button")}
    <header class="docs-header">
      <h1>Icon button</h1>
      <p><code>&lt;nmui-button icon&gt;</code> — the content becomes the icon. Four color styles: filled (the default), tonal, outlined, standard. Icons are filled by default; author <code>&lt;icon outline&gt;</code> for the outlined glyph. Xsmall and small keep a 48dp target under the smaller visual.</p>
    </header>

    ${familyNav("/docs/icon-button")}

    <main>
      <section class="docs-section">
        <h2>Styles</h2>
        ${demo(
          [
            btn("icon", "favorite"),
            btn("icon tonal", "favorite"),
            btn("icon outlined", "favorite"),
            btn("icon standard", "favorite"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Sizes</h2>
        ${demo(
          [
            btn("icon tonal xsmall", "favorite"),
            btn("icon tonal small", "favorite"),
            btn("icon tonal medium", "favorite"),
            btn("icon tonal large", "favorite"),
            btn("icon tonal xlarge", "favorite"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Shapes</h2>
        ${demo(
          [
            btn("icon filled", "settings"),
            btn("icon filled square", "settings"),
            btn("icon filled medium", "settings"),
            btn("icon filled medium square", "settings"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Glyph — filled by default, [outline] on the icon for outlined</h2>
        ${demo(
          [
            btn("icon", "favorite"),
            btn("icon", "<icon outline>favorite</icon>"),
            btn("icon standard", "settings"),
            btn("icon standard", "<icon outline>settings</icon>"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Disabled — every style</h2>
        ${demo(
          [
            btn("icon disabled", "favorite"),
            btn("icon tonal disabled", "favorite"),
            btn("icon outlined disabled", "favorite"),
            btn("icon standard disabled", "favorite"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${demo(`<nmui-button icon filled id="demo-icon-ev" value="fav"><icon>favorite</icon></nmui-button>`)}
        <output id="demo-icon-ev-out" class="docs-output">press it…</output>
        ${evTable([
          ["click", "the host", "—", "every press — pointer, Enter, or Space"],
          ["change (custom)", "the host", "detail: {value, button, event}", "every press, right after click"],
        ])}
        <p>An icon button is a button with only a glyph — the event contract is the standard button's. In code, <code>btn.click()</code> presses it for real; <code>btn.value</code> / <code>btn.disabled</code> properties reflect their attributes and fire nothing when set, the native pattern.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/icon-buttons/specs">m3.material.io/components/icon-buttons</a></p>
    </footer>
  </div>`;

  const iconOut = mount.querySelector("#demo-icon-ev-out");
  mount.querySelector("#demo-icon-ev")?.addEventListener("change", (e) => {
    iconOut.textContent = `change → value: ${e.detail.value}`;
  });
}
