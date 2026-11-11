import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, esc } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "State — nmui docs";

/* The store itself — this is the live code, and the page prints it
   from this same function (createStore.toString()), so the printed
   code can never drift from the code that runs the demo. */
function createStore(initial) {
  let value = initial;
  const listeners = new Set();
  return {
    get() {
      return value;
    },
    set(next) {
      const resolved = typeof next === "function" ? next(value) : next;
      if (Object.is(value, resolved)) return;
      value = resolved;
      listeners.forEach((fn) => fn(value));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

/* Wiring for the cart demo below — also printed from its own source. */
function wireCartDemo(store) {
  const badge = document.querySelector("#state-badge");
  const readout = document.querySelector("#state-readout");
  const render = (n) => {
    badge.label = String(n);
    readout.textContent = `${n} item${n === 1 ? "" : "s"} in the cart`;
  };
  store.subscribe(render);
  render(store.get());
  document
    .querySelector("#state-add")
    .addEventListener("click", () => store.set((n) => n + 1));
  document
    .querySelector("#state-clear")
    .addEventListener("click", () => store.set(0));
}

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/state")}
    <header class="docs-header">
      <h1>State</h1>
      <p>Not part of Material 3 — an optional extra. This is the exact state pattern this site's demos run on: a value, a set, and a list of subscribers. About twenty-five lines, no library. Copy it into your app.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>The store</h2>
        <p>State lives in your JavaScript. A store is one value and the functions that touch it: <code>get</code> reads it, <code>set</code> replaces it (or updates it with a function), <code>subscribe</code> runs your function on every change and hands back an unsubscribe. <code>set</code> skips notifying when the value didn't actually change.</p>
        <pre><code>${esc(createStore.toString())}</code></pre>
      </section>

      <section class="docs-section">
        <h2>Wiring it to components</h2>
        <p>One store, two places showing it. The cart count lives in the store; the badge on the cart button and the readout below it are both subscribers, so they can never disagree. Add an item and both update; clear it and both reset.</p>
        ${demo(`<div class="state-demo"><nmui-badge id="state-badge">0<nmui-button icon standard>shopping_cart</nmui-button></nmui-badge><nmui-button tonal id="state-add">Add item</nmui-button><nmui-button outlined id="state-clear">Clear</nmui-button><nmui-body medium id="state-readout">0 items in the cart</nmui-body></div>`)}
        <p class="docs-note">The badge's count changes through its <code>label</code> property — setting the badge's <code>textContent</code> would replace the button it wraps.</p>
        <pre><code>${esc(wireCartDemo.toString())}</code></pre>
        <p>That is the whole pattern: the store holds the value, components subscribe to it, and clicks call <code>set</code>. Nothing else in the app needs to know the store exists.</p>
      </section>

      <section class="docs-section">
        <h2>When you need more</h2>
        <p>One store per concern — a cart store, a theme store, a filter store — instead of one giant object. A derived value is just a <code>subscribe</code> that calls <code>set</code> on another store. Persistence is a <code>subscribe</code> that writes <code>localStorage</code>. If the state ever outgrows this shape — dozens of stores, async flows, time travel — that is the point where a real state library earns its keep. Until then, this is all there is.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>Not M3 — this site's state pattern, like its router. The library doesn't ship a store; the pattern is small enough to copy.</p>
    </footer>
  </div>`;

  wireCartDemo(createStore(0));
}
