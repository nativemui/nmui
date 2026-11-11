import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, btn, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Button — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/button")}
    <header class="docs-header">
      <h1>Button</h1>
      <p>The common button. <code>&lt;nmui-button&gt;</code> — variant, size, and shape are bare attributes. One page per button type; this page is only the standard button and all of its options.</p>
    </header>


    <main>
      <section class="docs-section">
        <h2>Variants</h2>
        ${demo(
          [
            btn("elevated", "Elevated"),
            btn("filled", "Filled"),
            btn("tonal", "Tonal"),
            btn("outlined", "Outlined"),
            btn("text", "Text"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Sizes</h2>
        ${demo(
          [
            btn("tonal xsmall", "Xsmall"),
            btn("tonal small", "Small"),
            btn("tonal medium", "Medium"),
            btn("tonal large", "Large"),
            btn("tonal xlarge", "Xlarge"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Shapes — press and hold: round morphs toward square, square toward its pressed shape</h2>
        ${demo([btn("tonal medium", "Round"), btn("tonal medium square", "Square")].join("\n"))}
      </section>

      <section class="docs-section">
        <h2>With icon</h2>
        ${demo(`<nmui-button filled><icon>send</icon>Send</nmui-button>
<nmui-button tonal medium><icon>download</icon>Download</nmui-button>
<nmui-button outlined>Next<icon>arrow_forward</icon></nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Disabled — every variant</h2>
        ${demo(
          [
            btn("elevated disabled", "Elevated"),
            btn("filled disabled", "Filled"),
            btn("tonal disabled", "Tonal"),
            btn("outlined disabled", "Outlined"),
            btn("text disabled", "Text"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Ripple and focus</h2>
        ${demo(btn("filled", "Press me"))}
        <p class="docs-note">Every press ripples from the press point — pointer or keyboard (keyboard activation ripples from the center). Tab to a button and the focus ring appears; it uses the button's own content color, so it stays visible on every variant — a primary ring would vanish into a filled button. Mouse clicks don't show the ring: that's focus-visible doing its job. Disabled buttons leave the tab order entirely.</p>
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${demo(`<nmui-button outlined id="demo-event" value="hello">Click me</nmui-button>`)}
        <output id="demo-event-out" class="docs-output">waiting…</output>
        ${evTable([
          ["click", "the host", "—", "every press — pointer, Enter, or Space"],
          ["change (custom)", "the host", "detail: {value, button, event}", "every press, right after click; value is the host's value attribute"],
        ])}
        <p>Pressed in code, the native way also works: <code>btn.click()</code> performs a full press (ripple, <code>click</code>, then <code>change</code>). The properties <code>btn.value</code>, <code>btn.selected</code>, and <code>btn.disabled</code> reflect their attributes — setting them in code updates the button but fires no event, exactly like setting a native button's properties. The component ignores presses on a disabled button — no <code>change</code> fires.</p>
        <pre><code>const btn = document.querySelector("#save");

btn.addEventListener("change", (e) =&gt; {
  console.log("pressed, value:", e.detail.value);
});

btn.disabled = true;   // attribute + visuals update; no event
btn.click();           // a full press, from code</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/buttons/specs">m3.material.io/components/buttons</a></p>
    </footer>
  </div>`;

  const out = mount.querySelector("#demo-event-out");
  mount.querySelector("#demo-event")?.addEventListener("change", (e) => {
    out.textContent = `change → value: ${e.detail.value}`;
  });
}
