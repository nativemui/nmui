import tooltipStyles from "./tooltip.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(tooltipStyles)) {
  document.adoptedStyleSheets.push(tooltipStyles);
}

/**
 * <nmui-tooltip> — M3 tooltip. A sibling of its anchor (never
 * nested inside it), resolved like the menu's anchor:
 *
 *   <nmui-button icon standard id="fav" aria-label="Favorite">favorite</nmui-button>
 *   <nmui-tooltip anchor="fav">Add to favorites</nmui-tooltip>
 *
 * With no [anchor], the previous element sibling is the
 * anchor. The anchor gets aria-describedby pointing at the
 * tooltip (unless the tooltip is rich with interactive
 * content — then its controls are reached by Tab instead,
 * in the spec's order: parent, then the tooltip's own
 * links and buttons; focus is never trapped).
 *
 * Bare = PLAIN: a brief label for an element with no text
 * of its own (inverse-surface, body-small, single line).
 * Shows on hover (after a 500ms delay), on focus
 * (immediately), or on a touch long-press; hides 1.5
 * seconds after the pointer leaves — the spec's linger —
 * or on blur, click, or Escape. Positioned above the
 * anchor, 4dp away (8dp when the anchor has no visual
 * boundary, like bare text), flipping below when there
 * isn't room above — which is also what an app bar needs.
 *
 *   <nmui-tooltip rich anchor="share">
 *     <span subhead>New: shared folders</span>
 *     Invite people and everyone sees the same files.
 *     <actions>
 *       <nmui-button text>Learn more</nmui-button>
 *     </actions>
 *   </nmui-tooltip>
 *
 * [rich]: surface-container card (optional [subhead],
 * supporting text, up to two text buttons/links in an
 * <actions> row; interactive content stays clickable —
 * the pointer can travel from the anchor into the
 * tooltip). Positioned below the anchor, right-aligned,
 * shifted in 8dp steps to stay on screen, never covering
 * the anchor. Transient like plain by default.
 *
 * [persistent] (rich only): hover does NOT trigger it. It
 * appears when the anchor is clicked, or when the app
 * calls show() (e.g. on page load, to introduce a feature),
 * and stays until the user interacts with something else —
 * an outside press or Escape dismisses it.
 *
 * Only one tooltip is open at a time, across the whole
 * page: showing one closes any other immediately.
 *
 * API: show() / hide() / toggle(), the [open] attribute,
 * and open / close events with detail { tooltip }.
 */
let uid = 0;
let current = null; // the one open tooltip, if any

const SHOW_DELAY = 500; // hover intent, plain and rich
const HIDE_DELAY = 1500; // the spec's departure linger

export class NMUITooltip extends HTMLElement {
  #anchor = null;
  #showTimer = 0;
  #hideTimer = 0;
  #pressTimer = 0;
  #onDocDown = null;

  connectedCallback() {
    if (!this.id) this.id = `nmui-tt-${++uid}`;
    if (!this.hasAttribute("role")) this.setAttribute("role", "tooltip");
    this.#anchor = this.#resolveAnchor();
    if (!this.#anchor) return;
    const anchor = this.#anchor;

    // Screen-reader wiring: plain tooltips (and rich ones
    // without interactive content) describe their anchor.
    if (!this.#hasInteractive()) {
      const described = (anchor.getAttribute("aria-describedby") || "")
        .split(/\s+/).filter(Boolean);
      if (!described.includes(this.id)) {
        described.push(this.id);
        anchor.setAttribute("aria-describedby", described.join(" "));
      }
    }

    const persistent = this.hasAttribute("persistent");
    if (!persistent) {
      anchor.addEventListener("pointerenter", this.#onEnter);
      anchor.addEventListener("pointerleave", this.#onLeave);
      anchor.addEventListener("focusin", this.#onFocusIn);
      anchor.addEventListener("focusout", this.#onFocusOut);
      anchor.addEventListener("pointerdown", this.#onPress);
      anchor.addEventListener("pointerup", this.#onRelease);
      anchor.addEventListener("click", this.#onClickDismiss);
      this.addEventListener("pointerenter", this.#onEnter);
      this.addEventListener("pointerleave", this.#onLeave);
    } else {
      anchor.addEventListener("click", this.#onClickToggle);
    }
    anchor.addEventListener("keydown", this.#onKey);
    this.addEventListener("keydown", this.#onKey);
  }

  disconnectedCallback() {
    this.#clearTimers();
    if (current === this) current = null;
    this.#unwatchDoc();
  }

  #resolveAnchor() {
    const id = this.getAttribute("anchor");
    if (id) {
      const el = this.ownerDocument.getElementById(id);
      if (el) return el;
    }
    const prev = this.previousElementSibling;
    return prev && prev !== this ? prev : null;
  }

  #hasInteractive() {
    return !!this.querySelector("a[href], button, nmui-button, input, [tabindex]");
  }

  // --- trigger handlers (bound as fields) --------------------

  #onEnter = () => {
    this.#clearHide();
    if (this.hasAttribute("open")) return;
    this.#clearShow();
    this.#showTimer = setTimeout(() => this.show(), SHOW_DELAY);
  };

  #onLeave = () => {
    this.#clearShow();
    this.#scheduleHide();
  };

  #onFocusIn = () => {
    this.#clearHide();
    this.show();
  };

  #onFocusOut = (e) => {
    // Moving focus into the tooltip itself (rich actions)
    // is not leaving.
    if (e.relatedTarget && this.contains(e.relatedTarget)) return;
    this.#scheduleHide();
  };

  #onPress = (e) => {
    if (e.pointerType !== "touch") return;
    this.#clearShow();
    this.#pressTimer = setTimeout(() => this.show(), SHOW_DELAY);
  };

  #onRelease = () => {
    clearTimeout(this.#pressTimer);
  };

  #onClickDismiss = () => {
    // Activating the anchor dismisses its plain tooltip.
    if (!this.hasAttribute("rich")) this.hide();
  };

  #onClickToggle = () => this.toggle();

  #onKey = (e) => {
    if (e.key === "Escape" && this.hasAttribute("open")) {
      e.stopPropagation();
      this.hide();
    }
  };

  // --- timers --------------------------------------------------

  #clearShow() {
    clearTimeout(this.#showTimer);
    this.#showTimer = 0;
  }

  #clearHide() {
    clearTimeout(this.#hideTimer);
    this.#hideTimer = 0;
  }

  #clearTimers() {
    this.#clearShow();
    this.#clearHide();
    clearTimeout(this.#pressTimer);
  }

  #scheduleHide() {
    this.#clearHide();
    if (!this.hasAttribute("open")) return;
    this.#hideTimer = setTimeout(() => this.hide(), HIDE_DELAY);
  }

  // --- public API ------------------------------------------------

  get #isOpen() {
    return this.hasAttribute("open");
  }

  show() {
    if (this.#isOpen || !this.#anchor) return;
    if (current && current !== this) current.hide();
    current = this;
    this.#clearTimers();
    this.setAttribute("open", "");
    this.#position();
    window.addEventListener("resize", this.#reposition);
    window.addEventListener("scroll", this.#reposition, true);
    if (this.hasAttribute("persistent")) this.#watchDoc();
    this.dispatchEvent(
      new CustomEvent("open", { bubbles: true, detail: { tooltip: this } }),
    );
  }

  hide() {
    if (!this.#isOpen) return;
    this.#clearTimers();
    this.removeAttribute("open");
    if (current === this) current = null;
    window.removeEventListener("resize", this.#reposition);
    window.removeEventListener("scroll", this.#reposition, true);
    this.#unwatchDoc();
    this.dispatchEvent(
      new CustomEvent("close", { bubbles: true, detail: { tooltip: this } }),
    );
  }

  toggle() {
    if (this.#isOpen) this.hide();
    else this.show();
  }

  #reposition = () => {
    if (this.#isOpen) this.#position();
  };

  #watchDoc() {
    if (this.#onDocDown) return;
    this.#onDocDown = (e) => {
      if (!this.contains(e.target) && !this.#anchor?.contains(e.target)) {
        this.hide();
      }
    };
    document.addEventListener("pointerdown", this.#onDocDown, true);
  }

  #unwatchDoc() {
    if (!this.#onDocDown) return;
    document.removeEventListener("pointerdown", this.#onDocDown, true);
    this.#onDocDown = null;
  }

  // --- positioning -------------------------------------------------

  /**
   * Fixed positioning from the anchor's rect. Plain: centered
   * above (4dp gap, 8dp for boundary-less anchors), flipped
   * below when the top lacks room. Rich: below the anchor,
   * right-aligned, shifted in 8dp steps inside the viewport
   * (8dp margins), flipped above when the bottom lacks room.
   * Neither ever covers the anchor.
   */
  #position() {
    const a = this.#anchor.getBoundingClientRect();
    const t = this.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 8;
    let x;
    let y;
    if (this.hasAttribute("rich")) {
      const gap = 8;
      x = a.right - t.width;
      y = a.bottom + gap;
      if (y + t.height > vh - margin) y = a.top - gap - t.height;
      x = Math.min(x, vw - margin - t.width);
      x = Math.max(x, margin);
      // Dynamic positioning adjusts in 8dp increments.
      x = Math.round(x / 8) * 8;
      y = Math.max(y, margin);
    } else {
      const bounded = this.#anchor.matches(
        "button, a, input, select, textarea, nmui-button, nmui-chip, [tabindex]",
      );
      const gap = bounded ? 4 : 8;
      x = a.left + (a.width - t.width) / 2;
      y = a.top - gap - t.height;
      if (y < margin) y = a.bottom + gap;
      x = Math.min(Math.max(x, margin), vw - margin - t.width);
    }
    this.style.left = `${Math.round(x)}px`;
    this.style.top = `${Math.round(y)}px`;
  }
}

if (!customElements.get("nmui-tooltip")) {
  customElements.define("nmui-tooltip", NMUITooltip);
}
