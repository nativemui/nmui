/* Panes — resizable behavior.
 *
 * <Panes> is pure CSS until you add `resizable`:
 *
 *   <Panes resizable id="inbox">
 *     <Pane fixed>…</Pane>
 *     <Pane flexible>…</Pane>
 *   </Panes>
 *
 * Import this module once; it enhances every Panes[resizable] in the
 * document — present and future (the demo router re-renders pages).
 * Light DOM, no custom elements: the tag is the API, the module is the
 * behavioral decorator.
 *
 * Spec behavior (m3.material.io/foundations/layout/scaffold/panes):
 * - fixed-and-flexible: the handle resizes the fixed pane, snaps to 360/412
 *   on release, and double-click (or Enter) fully collapses/expands it —
 *   the spec's own single-pane ↔ two-pane switch.
 * - split: the handle adjusts both flexible panes, snapping so a pane lands
 *   on 360/412 or the spacer back to centered; double-click resets 50/50.
 * - persistent (the default) remembers widths in localStorage, even across
 *   breakpoint changes — a collapsed pane stays collapsed. Any
 *   <Pane temporary> (or a missing id) skips persistence.
 * - keyboard: arrows nudge, Enter toggles. The handle is role="separator".
 */

const SNAP_WIDTHS = [360, 412];
const SNAP_TOLERANCE = 16;
const COLLAPSE_AT = 120;
const KEY_STEP = 16;

function loadState(key) {
  if (!key) return null;
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function saveState(key, state) {
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* storage unavailable — resizing still works, just not remembered */
  }
}

function enhance(panes) {
  if (panes.dataset.panesEnhanced) return;
  const children = [...panes.querySelectorAll(":scope > Pane")];
  if (children.length !== 2) return; // drag handles need exactly two panes
  // Overlays aren't grid items — resizable expects two co-planar panes.
  if (
    children.some((p) =>
      ["floating", "docked", "levitate", "reflow"].some((a) =>
        p.hasAttribute(a)
      )
    )
  )
    return;
  panes.dataset.panesEnhanced = "1";

  const firstPane = () => panes.querySelector(":scope > Pane");
  // Panes can be reordered to navigate the single-pane stack (first is
  // primary), so derive this fresh on every use, not once at enhance.
  const fixedFirst = () =>
    panes.querySelector(":scope > Pane[fixed]") === firstPane();
  const split = !panes.querySelector(":scope > Pane[fixed]"); // both flexible
  const temporary = children.some((p) => p.hasAttribute("temporary"));
  const key = temporary || !panes.id ? null : "nmui.panes." + panes.id;

  const state = Object.assign(
    split ? { ratio: 0.5 } : { w: 360, collapsed: false },
    loadState(key) || {}
  );

  const handle = document.createElement("div");
  handle.className = "panes-handle";
  handle.setAttribute("role", "separator");
  handle.setAttribute("aria-orientation", "vertical");
  handle.setAttribute("tabindex", "0");
  handle.setAttribute(
    "aria-label",
    split ? "Resize panes" : "Resize fixed pane"
  );
  panes.appendChild(handle);

  const rtl = () => getComputedStyle(panes).direction === "rtl";
  const spacer = () =>
    parseFloat(getComputedStyle(panes).getPropertyValue("--nmui-spacer")) ||
    24;

  function render(persist = true) {
    if (split) {
      panes.style.setProperty("--panes-split", state.ratio * 100 + "%");
      handle.setAttribute("aria-valuemin", "0");
      handle.setAttribute("aria-valuemax", "100");
      handle.setAttribute(
        "aria-valuenow",
        String(Math.round(state.ratio * 100))
      );
    } else {
      panes.style.setProperty("--panes-fixed", state.w + "px");
      panes.toggleAttribute("data-collapsed", state.collapsed);
    }
    placeHandle();
    if (persist) saveState(key, state);
  }

  function placeHandle() {
    const r = panes.getBoundingClientRect();
    const fixedW = state.collapsed ? 0 : state.w;
    const boundary = split
      ? r.width * state.ratio
      : fixedFirst()
        ? fixedW
        : r.width - fixedW;
    // the handle straddles the divider, centered on the spacer gap
    handle.style.insetInlineStart = `calc(${boundary}px + ${spacer() / 2}px - 12px)`;
  }

  // pointer x → distance from the inline-start edge to the divider
  function dividerAt(clientX) {
    const r = panes.getBoundingClientRect();
    const x = rtl() ? r.right - clientX : clientX - r.left;
    return x - spacer() / 2;
  }

  function snap(w) {
    for (const s of SNAP_WIDTHS) {
      if (Math.abs(w - s) <= SNAP_TOLERANCE) return s;
    }
    return Math.round(w);
  }

  let dragging = false;
  handle.addEventListener("pointerdown", (e) => {
    dragging = true;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  handle.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const r = panes.getBoundingClientRect();
    if (split) {
      state.ratio = Math.min(
        0.8,
        Math.max(0.2, dividerAt(e.clientX) / r.width)
      );
    } else if (!state.collapsed) {
      const w = fixedFirst()
        ? dividerAt(e.clientX)
        : r.width - dividerAt(e.clientX);
      state.w = Math.min(r.width * 0.8, Math.max(0, w));
    }
    render(false);
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    if (split) {
      const r = panes.getBoundingClientRect();
      const leftW = r.width * state.ratio;
      state.ratio =
        Math.abs(leftW - r.width / 2) <= SNAP_TOLERANCE
          ? 0.5
          : snap(leftW) / r.width;
      state.ratio = Math.min(0.8, Math.max(0.2, state.ratio));
    } else if (state.w < COLLAPSE_AT) {
      state.collapsed = true;
    } else {
      state.collapsed = false;
      state.w = snap(state.w);
    }
    render();
  };
  handle.addEventListener("pointerup", endDrag);
  handle.addEventListener("pointercancel", endDrag);

  const toggle = () => {
    if (split) {
      state.ratio = 0.5;
    } else {
      state.collapsed = !state.collapsed;
      if (!state.collapsed && state.w < COLLAPSE_AT) state.w = 360;
    }
    render();
  };
  handle.addEventListener("dblclick", toggle);
  handle.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 64 : KEY_STEP;
    const r = panes.getBoundingClientRect();
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const dir = (e.key === "ArrowRight") !== rtl() ? 1 : -1;
      if (split) {
        state.ratio = Math.min(
          0.8,
          Math.max(0.2, state.ratio + (dir * step) / r.width)
        );
      } else {
        state.collapsed = false;
        const w = fixedFirst() ? state.w + dir * step : state.w - dir * step;
        state.w = Math.min(r.width * 0.8, Math.max(0, w));
      }
      render();
    }
  });

  new ResizeObserver(placeHandle).observe(panes);

  render(false);
}

document.querySelectorAll("Panes[resizable]").forEach(enhance);
new MutationObserver((muts) => {
  for (const m of muts) {
    for (const n of m.addedNodes) {
      if (n.nodeType !== 1) continue;
      if (n.matches?.("Panes[resizable]")) enhance(n);
      n.querySelectorAll?.("Panes[resizable]").forEach(enhance);
    }
  }
}).observe(document.documentElement, { childList: true, subtree: true });

export { enhance as enhancePanes };
