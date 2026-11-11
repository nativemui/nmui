import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, btn, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Toggle button — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/button")}
    <header class="docs-header">
      <h1>Toggle button</h1>
      <p><code>&lt;nmui-button toggle&gt;</code> — a button with a persistent selected state. Clicking flips <code>[selected]</code> and <code>aria-pressed</code>. Colors follow the spec's per-variant table, and a selected toggle rests square (round when <code>[square]</code>). There is no toggle text button.</p>
    </header>


    <main>
      <section class="docs-section">
        <h2>Variants — unselected</h2>
        ${demo(
          [
            btn("toggle elevated", "Elevated"),
            btn("toggle filled", "Filled"),
            btn("toggle tonal", "Tonal"),
            btn("toggle outlined", "Outlined"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Variants — selected</h2>
        ${demo(
          [
            btn("toggle elevated selected", "Elevated"),
            btn("toggle filled selected", "Filled"),
            btn("toggle tonal selected", "Tonal"),
            btn("toggle outlined selected", "Outlined"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Sizes</h2>
        ${demo(
          [
            btn("toggle tonal xsmall", "Xsmall"),
            btn("toggle tonal small", "Small"),
            btn("toggle tonal medium", "Medium"),
            btn("toggle tonal large", "Large"),
            btn("toggle tonal xlarge", "Xlarge"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>Shapes — square rests round when selected</h2>
        ${demo(
          [
            btn("toggle tonal medium square", "Square"),
            btn("toggle tonal medium square selected", "Square selected"),
          ].join("\n")
        )}
      </section>

      <section class="docs-section">
        <h2>With icon</h2>
        ${demo(`<nmui-button toggle filled id="demo-toggle"><icon>wifi</icon>Wi-Fi</nmui-button>
<nmui-button toggle tonal selected><icon>bluetooth</icon>Bluetooth</nmui-button>
<nmui-button toggle tonal><icon>mic</icon><icon selected>mic_off</icon>Mic</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Disabled</h2>
        ${demo(
          [
            btn("toggle tonal disabled", "Unselected"),
            btn("toggle tonal selected disabled", "Selected"),
          ].join("\n")
        )}
        <output id="demo-toggle-out" class="docs-output">toggle the Wi-Fi button…</output>
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["click", "the host", "—", "every press — pointer, Enter, or Space"],
          ["change (custom)", "the host", "detail: {value, button, selected, event}", "every press, after the flip; selected is the new state"],
        ])}
        <p>The demo above logs <code>change</code> from the Wi-Fi button. State is readable any time as <code>btn.selected</code> or the <code>[selected]</code> attribute (and mirrored to <code>aria-pressed</code>). The native way works in code too: <code>btn.selected = true</code> sets the state and the visuals but fires no event — like <code>input.checked = true</code>; <code>btn.click()</code> flips it <em>and</em> fires <code>click</code> + <code>change</code>. Inside a group, the group owns selection — a grouped toggle does not flip itself; listen on the group instead.</p>
        <pre><code>wifi.addEventListener("change", (e) =&gt; {
  console.log("wifi on:", e.detail.selected);
});</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/buttons/specs">m3.material.io/components/buttons</a></p>
    </footer>
  </div>`;

  const out = mount.querySelector("#demo-toggle-out");
  mount.querySelector("#demo-toggle")?.addEventListener("change", (e) => {
    out.textContent = `change → selected: ${e.detail.selected}`;
  });
}
