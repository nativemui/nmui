import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Search — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/search")}
    <header class="docs-header">
      <h1>Search</h1>
      <p>M3 search in the contained style: a search bar that opens a view of suggestions or results. The component decorates a native input and provides the chrome — the view's content is yours, authored as a list (the container is empty by default; use <code>&lt;nmui-list&gt;</code>).</p>
      <p class="docs-note">Spec geometry: the bar is 56dp tall with full corners, filled surface-container-high at elevation level 1; the input text is on-surface and the hinted text (the input's <code>placeholder</code>, which is also the view's accessible label) is on-surface-variant. Trailing: at most two icon actions, plus an avatar at 30dp. The open docked view shares the bar's filled container at elevation level 2, min height 240dp, results capped at 2/3 of the screen height.</p>
      <p class="docs-note">Two things are deliberately not built. The divided (baseline) style, because M3 Expressive marks it "not recommended — use contained." And the search app bar, which is a separate component (an app bar variant), not part of search itself.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Search bar</h2>
        <p>With no <code>[view]</code> content, it's just the bar: leading search icon, hinted text, and a clear button that appears once there's text (Escape clears too). Trailing actions are authored with <code>[trailing]</code>; an <code>&lt;img avatar trailing&gt;</code> sits last at 30dp.</p>
        ${demo(`<nmui-search><input type="search" placeholder="Search"></nmui-search>
<nmui-search>
  <input type="search" placeholder="Search your messages">
  <nmui-button icon trailing aria-label="Voice search">mic</nmui-button>
</nmui-search>
<nmui-search>
  <input type="search" placeholder="Search contacts">
  <nmui-button icon trailing aria-label="Voice search">mic</nmui-button>
  <img avatar trailing src="/assets/mark.svg" alt="">
</nmui-search>`)}
      </section>

      <section class="docs-section">
        <h2>Docked</h2>
        <p>The desktop/tablet layout: focus the bar and the view docks below it in the same filled container. Suggestions can appear before typing; here the list filters as you type. Choosing one fills the input, fires <code>select</code>, and closes the view. Escape or an outside click dismisses it; the back behavior is the scrim's job in this layout, so there's no back button.</p>
        ${demo(`<nmui-search id="demo-docked">
  <input type="search" placeholder="Search components">
  <nmui-list view id="demo-docked-list">
    <nmui-list item value="Button"><icon>smart_button</icon>Button</nmui-list>
    <nmui-list item value="Checkbox"><icon>check_box</icon>Checkbox</nmui-list>
    <nmui-list item value="Chip"><icon>sell</icon>Chip</nmui-list>
    <nmui-list item value="Date picker"><icon>calendar_month</icon>Date picker</nmui-list>
    <nmui-list item value="Divider"><icon>horizontal_rule</icon>Divider</nmui-list>
    <nmui-list item value="List"><icon>list</icon>List</nmui-list>
    <nmui-list item value="Menu"><icon>menu</icon>Menu</nmui-list>
    <nmui-list item value="Navigation"><icon>navigation</icon>Navigation</nmui-list>
    <nmui-list item value="Radio"><icon>radio_button_checked</icon>Radio</nmui-list>
    <nmui-list item value="Search"><icon>search</icon>Search</nmui-list>
  </nmui-list>
</nmui-search>
<output id="demo-docked-out" class="docs-output">nothing selected yet</output>`)}
      </section>

      <section class="docs-section">
        <h2>Full-screen</h2>
        <p>The compact-window layout: add <code>[fullscreen]</code> and the open view fills the screen on surface-container-low. The leading icon gives way to a back button, which releases the view and returns the bar to its original state — the guidelines' back behavior. Recent searches lead, with a category label on the list.</p>
        ${demo(`<nmui-search fullscreen id="demo-full">
  <input type="search" placeholder="Search recipes">
  <nmui-list view>
    <nmui-list item value="Pasta"><icon>history</icon>Pasta</nmui-list>
    <nmui-list item value="Pancakes"><icon>history</icon>Pancakes</nmui-list>
    <nmui-list item value="Peanut noodles"><icon>history</icon>Peanut noodles</nmui-list>
    <nmui-list item value="Pizza dough"><icon>history</icon>Pizza dough</nmui-list>
  </nmui-list>
</nmui-search>
<output id="demo-full-out" class="docs-output">nothing selected yet</output>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        <p>Three custom events for the view's lifecycle and the pick; everything about the text itself stays native — listen to the input for <code>input</code> / <code>change</code>, and wrap the search in a <code>&lt;form&gt;</code> if you want a submit on Enter (an input of type <code>search</code> also fires the native <code>search</code> event on Enter in Chromium).</p>
        ${evTable([
          ["open", "the host", "{ search }", "the view opens — input focus, typing after a dismissal, or open()"],
          ["close", "the host", "{ search }", "the view closes — Escape, outside click, back button, a selection, or close()"],
          ["select", "the host", "{ value, item, search }", "a list item in the view is chosen; the input is filled with the value and the view closes"],
          ["input / change", "the input (native)", "read e.target.value", "typing, clearing, and programmatic fills do not fire these"],
        ])}
        <pre><code>const search = document.querySelector("#site-search");

search.addEventListener("select", (e) =&gt; {
  navigate("/components/" + e.detail.value.toLowerCase());
});</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  // Docked demo: live filtering + selection readout.
  const docked = mount.querySelector("#demo-docked");
  const dockedInput = docked.querySelector("input");
  const dockedItems = [...docked.querySelectorAll("nmui-list [item]")];
  dockedInput.addEventListener("input", () => {
    const q = dockedInput.value.trim().toLowerCase();
    dockedItems.forEach((item) => {
      item.style.display = item.textContent.toLowerCase().includes(q)
        ? ""
        : "none";
    });
  });
  docked.addEventListener("select", (e) => {
    mount.querySelector("#demo-docked-out").textContent =
      "selected: " + e.detail.value;
  });

  const full = mount.querySelector("#demo-full");
  full.addEventListener("select", (e) => {
    mount.querySelector("#demo-full-out").textContent =
      "selected: " + e.detail.value;
  });
}
