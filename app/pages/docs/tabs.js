import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Tabs — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/tabs")}
    <header class="docs-header">
      <h1>Tabs</h1>
      <p>Decorates <code>&lt;a&gt;</code> / <code>&lt;button&gt;</code> children as an ARIA tablist. Tabs organize <em>related</em> content at the same hierarchy level — not sequential content like chapters. Keep labels short; past four or five tabs the row gets cramped, and at that point the scrollable variant is the better tool.</p>
      <p class="docs-note">Two variants. <strong>Primary</strong> (bare): the main destinations, icon + label stacked in a 64dp container (48dp label-only), active icon and label in primary, and a 3dp indicator that hugs the tab's content — inset 2dp a side, minimum 24dp. <strong>Secondary</strong> (<code>[secondary]</code>): a second level inside a content area, always below primary tabs; label only, the active label in on-surface, and a simpler 2dp indicator across the whole tab. Both sit on surface over a 1dp outline-variant divider, and divide the row into equal sections.</p>
      <p class="docs-note">Keyboard follows the ARIA tab pattern: Tab enters the row on the <em>active</em> tab (roving tabindex), Left / Right move and activate, Home / End jump, disabled tabs are skipped, and Space / Enter activate a focused tab (native button behavior). Selection in code works too: setting <code>[selected]</code> on a tab from outside re-syncs the row silently.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Primary</h2>
        <p>With panels: give a tab <code>controls="panel-id"</code> and that element becomes its tabpanel — aria-controls / aria-labelledby are wired for you, and only the selected tab's panel shows. The tabs below switch real panels.</p>
        ${demo(`<nmui-tabs>
  <button selected controls="tabp-flights"><icon>flight</icon>Flights</button>
  <button controls="tabp-trips"><icon>luggage</icon>Trips</button>
  <button controls="tabp-explore"><icon>explore</icon>Explore</button>
</nmui-tabs>
<div id="tabp-flights" style="padding: 16px 4px;">Flights panel — book a trip.</div>
<div id="tabp-trips" style="padding: 16px 4px;">Trips panel — your saved itineraries.</div>
<div id="tabp-explore" style="padding: 16px 4px;">Explore panel — destinations and deals.</div>`)}
        <p>Label-only primary tabs (48dp), and the <code>[inline]</code> configuration — icon beside the label instead of stacked:</p>
        ${demo(`<nmui-tabs>
  <button selected>All</button>
  <button>Images</button>
  <button>Videos</button>
  <button>News</button>
</nmui-tabs>
<nmui-tabs style="margin-top: 16px;">
  <button selected inline><icon>photo_library</icon>Library</button>
  <button inline><icon>folder</icon>Albums</button>
  <button inline><icon>ios_share</icon>Shared</button>
</nmui-tabs>`)}
      </section>

      <section class="docs-section">
        <h2>Secondary</h2>
        <p>A second level under a primary row. Functionally identical — same keyboard, same event — just quieter styling.</p>
        ${demo(`<nmui-tabs>
  <button selected><icon>storefront</icon>Shop</button>
  <button><icon>shopping_bag</icon>Orders</button>
</nmui-tabs>
<nmui-tabs secondary>
  <button selected>Overview</button>
  <button>Specifications</button>
  <button>Reviews</button>
</nmui-tabs>`)}
      </section>

      <section class="docs-section">
        <h2>Badges</h2>
        <p>An <code>&lt;nmui-badge&gt;</code> inside a tab rides along — inline after the label, or overlapping the stacked icon. Clear it once the user has seen the tab's content.</p>
        ${demo(`<nmui-tabs>
  <button selected><icon>mail</icon>Inbox<nmui-badge>3</nmui-badge></button>
  <button><icon>send</icon>Sent</button>
  <button><icon>drafts</icon>Drafts<nmui-badge>1</nmui-badge></button>
</nmui-tabs>`)}
      </section>

      <section class="docs-section">
        <h2>Scrollable</h2>
        <p><code>[scrollable]</code> sizes each tab to its label and scrolls the row — the variant for longer labels and larger sets. (In a full-screen app layout, the guidelines offset the first tab 52dp from the leading edge so it's clear more content is available; that's the app's layout job, not the component's.)</p>
        ${demo(`<nmui-tabs scrollable>
  <button selected>Tab one</button>
  <button>Tab two</button>
  <button>A longer tab three</button>
  <button>Tab four</button>
  <button>Tab five</button>
  <button>Tab six</button>
  <button>Tab seven</button>
  <button>Tab eight</button>
</nmui-tabs>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["change", "nmui-tabs (the host)", "{ value, tab, tabs }", "a tab is selected — click, arrow keys, Home / End; value = the tab's value attribute or its label text. Not fired for the initial selection"],
          ["click", "the tab (bubbles)", "—", "any press on a tab, before selection"],
          ["keydown", "the tab (bubbles)", "e.key", "Left / Right / Home / End are handled by the component; other keys pass through"],
        ])}
        <h3>Setting the tab in code</h3>
        <p>Add <code>selected</code> to a tab from outside and the row re-syncs — indicator, tabindex, panels — <em>without</em> firing <code>change</code>: that event is reserved for user-facing selection, the same rule as the other components. When you want the event as well, <code>tab.click()</code> is the full press.</p>
        ${demo(`<nmui-tabs id="demo-ev-tabs">
  <button selected>First</button>
  <button>Second</button>
  <button>Third</button>
</nmui-tabs>`)}
        <div class="docs-row">
          <nmui-button tonal id="demo-ev-set">Set the Third tab selected in code</nmui-button>
          <nmui-button tonal id="demo-ev-click">Call the Second tab's .click()</nmui-button>
          <nmui-button outlined id="demo-ev-clear">Clear log</nmui-button>
        </div>
        <pre><code id="demo-ev-log">(click the tabs, then try the two buttons)</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  // Events demo: code-set (silent) vs .click() (full selection).
  const evTabs = mount.querySelector("#demo-ev-tabs");
  const evLog = mount.querySelector("#demo-ev-log");
  const evSay = (line) => {
    if (evLog.dataset.empty) {
      evLog.textContent = "";
      delete evLog.dataset.empty;
    }
    evLog.textContent += (evLog.textContent ? "\n" : "") + line;
  };
  evLog.dataset.empty = "1";
  evTabs?.addEventListener("change", (e) => {
    evSay(`change → value: "${e.detail.value}"`);
  });
  mount.querySelector("#demo-ev-set")?.addEventListener("click", () => {
    evTabs.querySelectorAll("[role=tab]")[2].setAttribute("selected", "");
    evSay("code added selected to the Third tab → no change event; the row still re-synced");
  });
  mount.querySelector("#demo-ev-click")?.addEventListener("click", () => {
    evSay("code called the Second tab's .click() →");
    evTabs.querySelectorAll("[role=tab]")[1].click();
  });
  mount.querySelector("#demo-ev-clear")?.addEventListener("click", () => {
    evLog.textContent = "(log cleared)";
    evLog.dataset.empty = "1";
  });
}
