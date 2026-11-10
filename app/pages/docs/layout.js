import layoutPageStyles from "./layout.css" with { type: "css" };
import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { esc } from "../demo.js";
import "../../../layout/panes.js"; // drag-handle behavior for Panes[resizable]

for (const s of [layoutPageStyles, docsStyles]) {
  if (!document.adoptedStyleSheets.includes(s)) {
    document.adoptedStyleSheets.push(s);
  }
}

export const title = "Layout — nmui docs";

/* Resizable demo: drag the corner and the panes reflow via container
   queries — no JavaScript. Output and code from the same markup. */
const frame = (html, hint = "drag the corner to resize — panes reflow, no JavaScript") => `
  <div class="demo-frame">${html}</div>
  <p class="demo-hint">${hint}</p>
  <pre><code>${esc(html)}</code></pre>`;

const split = `<Panes>
  <Pane flexible>
    <div class="demo-pane">
      <strong>Pane one</strong>
      <p>Flexible — grows and shrinks.</p>
    </div>
  </Pane>
  <Pane flexible>
    <div class="demo-pane">
      <strong>Pane two</strong>
      <p>Flexible — the spacer stays centered.</p>
    </div>
  </Pane>
</Panes>`;

const fixedFlexible = `<Panes>
  <Pane fixed>
    <div class="demo-pane">
      <strong>Fixed</strong>
      <p>360px. Width never changes with space.</p>
    </div>
  </Pane>
  <Pane flexible>
    <div class="demo-pane">
      <strong>Flexible</strong>
      <p>Takes whatever is left.</p>
    </div>
  </Pane>
</Panes>`;

const resizable = `<Panes resizable id="demo-resize">
  <Pane fixed>
    <div class="demo-pane">
      <strong>Drag me</strong>
      <p>Snaps to 360 / 412. Double-click collapses.</p>
    </div>
  </Pane>
  <Pane flexible>
    <div class="demo-pane">
      <strong>Flexible</strong>
      <p>Reload the page — the width is remembered.</p>
    </div>
  </Pane>
</Panes>`;

const floatingDemo = `<Panes>
  <Pane flexible>
    <div class="demo-pane">
      <strong>Content</strong>
      <p>The floating pane is an overlay — never a grid item.</p>
      <p><button id="demo-float-open">Show floating pane</button></p>
    </div>
  </Pane>
  <Pane floating hidden id="demo-float-pane">
    <strong>Floating</strong>
    <p>Centered like a dialog. The app toggles <code>hidden</code>.</p>
    <p><button id="demo-float-close">Close</button></p>
  </Pane>
</Panes>`;

const levitateDemo = `<Panes>
  <Pane flexible>
    <div class="demo-pane">
      <strong>Primary</strong>
      <p>Shrink below 840px — the second pane floats instead of hiding.</p>
    </div>
  </Pane>
  <Pane flexible levitate="floating">
    <div class="demo-pane">
      <strong>Levitating</strong>
      <p>Co-planar when room allows.</p>
    </div>
  </Pane>
</Panes>`;

const reflowDemo = `<Panes>
  <Pane flexible>
    <div class="demo-pane">
      <strong>Primary</strong>
      <p>Shrink below 840px — reflow stacks instead of hiding.</p>
    </div>
  </Pane>
  <Pane flexible reflow>
    <div class="demo-pane">
      <strong>Reflow</strong>
      <p>Still here, just underneath.</p>
    </div>
  </Pane>
</Panes>`;

const overridesDemo = `<Panes>
  <Pane flexible>
    <div class="demo-pane">
      <strong>Primary</strong>
      <p>Drag the frame: the panel docks, then floats, then joins the grid.</p>
    </div>
  </Pane>
  <Pane fixed docked medium="floating" expanded="coplanar">
    <div class="demo-pane">
      <strong>Panel</strong>
      <p>docked → floating → co-planar</p>
    </div>
  </Pane>
</Panes>`;

const feed = `<Panes feed>
  <div class="demo-pane"><strong>Card one</strong><p>…</p></div>
  <div class="demo-pane"><strong>Card two</strong><p>…</p></div>
  <div class="demo-pane"><strong>Card three</strong><p>…</p></div>
  <div class="demo-pane"><strong>Card four</strong><p>…</p></div>
</Panes>`;

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/layout")}
    <header class="docs-header">
      <h1>Layout</h1>
      <p>M3 panes as pure CSS. <code>&lt;Panes&gt;</code> responds to
      the space it's <em>given</em> — resize the demos and watch.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Breakpoints</h2>
        <p>compact &lt;600 · medium 600–839 · expanded 840–1199 · large 1200–1599 · x-large 1600+</p>
        <p>Pane counts follow the spec: one pane on compact/medium, two on
        expanded/large, up to three on x-large.</p>
      </section>

      <section class="docs-section">
        <h2>Scaffold</h2>
        <p>M3 structures every adaptive layout into <strong>bars</strong>,
        <strong>rails</strong>, and <strong>panes</strong> — those are the only
        three scaffold parts. Bars frame the screen (top app bar, bottom
        navigation bar); rails fill the perimeter (navigation rail lives on the
        leading rail); panes are the content center. Panes ship now; bars and
        rails are next.</p>
      </section>

      <section class="docs-section">
        <h2>Panes describe behavior, not content</h2>
        <p>A "list-detail" is a content concept — the same panes could hold
        list-list. So a <code>&lt;Pane&gt;</code> takes two independent axes,
        one attribute each. A bare <code>&lt;Pane&gt;</code> is flexible and
        persistent:</p>
        <pre><code>${esc(`<Pane fixed>                  sizing: fixed | flexible (default flexible)
<Pane temporary>              lifetime: temporary | persistent (default persistent)`)}</code></pre>
        <p>1–3 panes per layout, in order — the first is primary. All layouts
        need at least one flexible pane. The fixed pane can come first or last
        in DOM order, whichever fits the content.</p>
      </section>

      <section class="docs-section">
        <h2>Split</h2>
        <p>Two flexible panes <em>are</em> a split-pane — nothing to declare on
        <code>&lt;Panes&gt;</code>. Spacer visually centered, 50/50 by default:</p>
        ${frame(split)}
      </section>

      <section class="docs-section">
        <h2>Fixed-and-flexible</h2>
        <p>Put <code>fixed</code> on one pane and the layout follows — fixed
        pane first or last, whichever fits the content:</p>
        ${frame(fixedFlexible)}
      </section>

      <section class="docs-section">
        <h2>Resizable</h2>
        <p>Add <code>resizable</code> and import <code>layout/panes.js</code> —
        it inserts the drag handle. Drag to resize (snaps to 360/412),
        double-click to collapse the fixed pane entirely — the spec's own
        single-pane ↔ two-pane switch. Persistent panes remember their width
        across reloads and breakpoints; mark a pane
        <code>temporary</code> to opt out:</p>
        ${frame(resizable, "drag the divider between the panes — double-click collapses it")}
      </section>

      <section class="docs-section">
        <h2>Display</h2>
        <p>Non-primary panes choose where they live: co-planar (default),
        <code>floating</code> (centered like a dialog), or <code>docked</code>
        (pinned to the bottom like a sheet). Overlays are never grid items —
        put them last. Visibility is the app's job:</p>
        ${frame(floatingDemo, "click the button — the app toggles hidden")}
      </section>

      <section class="docs-section">
        <h2>Adapt</h2>
        <p>What a non-primary pane does when space runs out. <code>showhide</code>
        (default) hides everything but the first pane below expanded.
        <code>levitate="floating|docked"</code> stays co-planar when room
        allows and lifts over everything when not. <code>reflow</code> stacks
        vertically instead of hiding:</p>
        ${frame(levitateDemo)}
        ${frame(reflowDemo)}
      </section>

      <section class="docs-section">
        <h2>Breakpoint overrides</h2>
        <p>Display per breakpoint, mobile-first — the named breakpoint and up.
        Base <em>is</em> compact, so there's no <code>compact=</code>. This is
        the spec's levitate chain; <code>large=</code> and <code>xlarge=</code>
        work the same:</p>
        ${frame(overridesDemo, "drag the frame — docked, floating, then co-planar")}
      </section>

      <section class="docs-section">
        <h2>Show and hide</h2>
        <p>Below expanded, two-pane layouts become a navigation stack: only the
        <strong>first</strong> pane shows. Panes go in order — first is primary.
        To navigate, reorder the panes. Click a conversation, then shrink the
        frame below 840px — the back button appears:</p>
        ${frame(`<Panes id="demo-inbox">
  <Pane fixed>
    <div class="demo-pane demo-inbox-list">
      <strong>Conversations</strong>
      <button data-convo="0">Ada</button>
      <button data-convo="1">Grace</button>
      <button data-convo="2">Margaret</button>
    </div>
  </Pane>
  <Pane flexible>
    <div class="demo-pane">
      <button data-back id="demo-inbox-back">← Back</button>
      <strong id="demo-inbox-name">Ada</strong>
      <p id="demo-inbox-msg">Hey — are we still on for Friday?</p>
    </div>
  </Pane>
</Panes>`)}
      </section>

      <section class="docs-section">
        <h2>Feed</h2>
        <p>Reflowing card grid — no queries needed, <code>auto-fill</code> does it:</p>
        ${frame(feed)}
      </section>
    </main>
  </div>`;

  // Floating demo: the app owns visibility.
  mount.querySelector("#demo-float-open")?.addEventListener("click", () => {
    mount.querySelector("#demo-float-pane")?.removeAttribute("hidden");
  });
  mount.querySelector("#demo-float-close")?.addEventListener("click", () => {
    mount.querySelector("#demo-float-pane")?.setAttribute("hidden", "");
  });

  // Inbox demo: picking a conversation swaps the detail content and moves
  // the detail pane first (first pane is primary — that's what the stack
  // shows). Back moves the list pane first again.
  const convos = [
    { name: "Ada", msg: "Hey — are we still on for Friday?" },
    { name: "Grace", msg: "The compiler is finally happy." },
    { name: "Margaret", msg: "LGTM. Ship it." },
  ];
  const inbox = mount.querySelector("#demo-inbox");
  if (inbox) {
    const [listPane, detailPane] = inbox.querySelectorAll(":scope > Pane");
    const name = mount.querySelector("#demo-inbox-name");
    const msg = mount.querySelector("#demo-inbox-msg");
    inbox.querySelectorAll("[data-convo]").forEach((b) =>
      b.addEventListener("click", () => {
        const c = convos[+b.dataset.convo];
        name.textContent = c.name;
        msg.textContent = c.msg;
        inbox.prepend(detailPane);
      })
    );
    mount.querySelector("#demo-inbox-back")?.addEventListener("click", () => {
      inbox.prepend(listPane);
    });
  }
}
