import sheetStyles from "./sheet.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(sheetStyles)) {
  document.adoptedStyleSheets.push(sheetStyles);
}

/**
 * <nmui-sheet> — M3 bottom sheets and side sheets, one element.
 *
 *   <nmui-sheet modal>…</nmui-sheet>        bottom sheet, modal
 *   <nmui-sheet>…</nmui-sheet>              bottom, standard
 *   <nmui-sheet side modal>…</nmui-sheet>   side sheet, modal
 *   <nmui-sheet side>…</nmui-sheet>         side, standard
 *
 * Standard sheets co-exist with the page (no scrim); modal
 * sheets sit over a scrim and must be dismissed (scrim click,
 * Escape, or an action inside). Open state is [open];
 * show() / close() / toggle() drive it, and the element fires
 * open / close {sheet}.
 *
 * Bottom sheets get a drag handle — a real button, per the
 * accessibility spec: it leads the tab order, and selecting it
 * cycles the sheet's preset heights (detents) so resizing
 * never requires a drag. Dragging it works too; on release the
 * sheet snaps to the nearest detent, or closes if pulled far
 * enough down. The modal bottom sheet opens at the half detent
 * (its initial position is capped at 50% of the screen) and
 * cycles half → full → closed; the standard one opens full and
 * cycles full → half → closed. [nohandle] omits the handle.
 * Detent changes fire detentchange {detent, sheet}.
 *
 * Side sheets follow their own anatomy: an optional [back]
 * element and [headline] form the header with a close button —
 * a close affordance is REQUIRED inside a side sheet, so the
 * component adds one when the author doesn't supply a [close]
 * element. An [actions] footer pins to the bottom. Side sheets
 * anchor to the inline-end edge (the right in LTR, the left in
 * RTL); width is 256dp by default, max 400dp, overridable with
 * --nmui-sheet-width. [detached] insets a modal side sheet by
 * 16dp with corners all around.
 *
 * Modal sheets move focus into the sheet on open and return it
 * on close; the surface carries role="dialog".
 */
class NMUISheet extends HTMLElement {
  #ready = false;
  #surface = null;
  #handle = null;
  #detent = null;
  #lastFocus = null;
  #prevOverflow = "";

  get detent() {
    return this.#detent;
  }

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;
    const modal = this.hasAttribute("modal");
    const side = this.hasAttribute("side");

    // Scrim (modal only).
    if (modal) {
      const scrim = document.createElement("scrim");
      scrim.addEventListener("click", () => this.close());
      this.appendChild(scrim);
    }

    // Surface + content wrapping. Authored chrome (headline /
    // back / close / actions for side sheets) stays at surface
    // level; everything else scrolls inside <content>.
    const surface = document.createElement("surface");
    surface.setAttribute("role", "dialog");
    if (modal) surface.setAttribute("aria-modal", "true");
    this.#surface = surface;
    const content = document.createElement("content");
    const scrimEl = this.querySelector(":scope > scrim");
    const chrome = [];
    for (const child of [...this.childNodes]) {
      if (child === scrimEl) continue;
      if (
        side &&
        child instanceof Element &&
        (child.hasAttribute("headline") ||
          child.hasAttribute("back") ||
          child.hasAttribute("close") ||
          child.hasAttribute("actions"))
      ) {
        chrome.push(child);
      } else {
        content.appendChild(child);
      }
    }

    if (side) {
      const header = document.createElement("header");
      const back = chrome.find((el) => el.hasAttribute("back"));
      const headline = chrome.find((el) => el.hasAttribute("headline"));
      let closeBtn = chrome.find((el) => el.hasAttribute("close"));
      if (back) header.appendChild(back);
      if (headline) {
        header.appendChild(headline);
        surface.setAttribute("aria-label", headline.textContent.trim());
      }
      if (!closeBtn) {
        closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.setAttribute("close", "");
        closeBtn.setAttribute("aria-label", "Close");
        const icon = document.createElement("icon");
        icon.textContent = "close";
        closeBtn.appendChild(icon);
      }
      header.appendChild(closeBtn);
      closeBtn.addEventListener("click", () => this.close());
      if (back) back.addEventListener("click", () => this.close());
      surface.appendChild(header);
    }

    surface.appendChild(content);
    const actions = chrome.find((el) => el.hasAttribute("actions"));
    if (side && actions) surface.appendChild(actions);
    this.appendChild(surface);

    // Drag handle (bottom sheets).
    if (!side && !this.hasAttribute("nohandle")) {
      const handle = document.createElement("button");
      handle.type = "button";
      handle.setAttribute("handle", "");
      handle.setAttribute("aria-label", "Resize sheet");
      const pill = document.createElement("span");
      pill.setAttribute("pill", "");
      handle.appendChild(pill);
      handle.addEventListener("click", () => {
        if (this.#suppressClick) return;
        this.#cycleDetent();
      });
      handle.addEventListener("pointerdown", (e) => this.#dragStart(e));
      surface.prepend(handle);
      this.#handle = handle;
    }

    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        this.close();
      }
    });

    new MutationObserver(() => {
      if (this.hasAttribute("open")) this.#opened();
      else this.#closed();
    }).observe(this, { attributes: true, attributeFilter: ["open"] });
    if (this.hasAttribute("open")) this.#opened();
  }

  show() {
    this.setAttribute("open", "");
  }

  close() {
    this.removeAttribute("open");
  }

  toggle() {
    if (this.hasAttribute("open")) this.close();
    else this.show();
  }

  #opened() {
    if (!this.hasAttribute("side")) {
      this.#setDetent(this.hasAttribute("modal") ? "half" : "full");
    }
    if (this.hasAttribute("modal")) {
      this.#lastFocus = document.activeElement;
      this.#prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const first = this.#surface.querySelector(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      first?.focus();
    }
    this.dispatchEvent(
      new CustomEvent("open", {
        detail: { sheet: this },
        bubbles: true,
        composed: true,
      })
    );
  }

  #closed() {
    this.#detent = null;
    this.removeAttribute("detent");
    if (this.#surface) this.#surface.style.maxHeight = "";
    if (this.hasAttribute("modal")) {
      document.body.style.overflow = this.#prevOverflow;
      this.#lastFocus?.focus?.();
      this.#lastFocus = null;
    }
    this.dispatchEvent(
      new CustomEvent("close", {
        detail: { sheet: this },
        bubbles: true,
        composed: true,
      })
    );
  }

  #setDetent(detent) {
    this.#detent = detent;
    if (detent) this.setAttribute("detent", detent);
    else this.removeAttribute("detent");
    this.dispatchEvent(
      new CustomEvent("detentchange", {
        detail: { detent, sheet: this },
        bubbles: true,
        composed: true,
      })
    );
  }

  #cycleDetent() {
    // Each variant cycles through its detents and out: the
    // modal sheet opens at half (half → full → closed), the
    // standard sheet opens at full (full → half → closed).
    if (this.#detent === "half") {
      if (this.hasAttribute("modal")) this.#setDetent("full");
      else this.close();
    } else if (this.hasAttribute("modal")) {
      this.close();
    } else {
      this.#setDetent("half");
    }
  }

  #dragStart(e) {
    if (e.button !== undefined && e.button !== 0) return;
    const surface = this.#surface;
    const startY = e.clientY;
    const startH = surface.getBoundingClientRect().height;
    const maxH = window.innerHeight;
    let lastH = startH;
    let moved = false;
    this.#handle.setPointerCapture?.(e.pointerId);
    const move = (ev) => {
      if (Math.abs(ev.clientY - startY) > 6) moved = true;
      if (!moved) return;
      lastH = Math.min(maxH, Math.max(0, startH + (startY - ev.clientY)));
      surface.style.maxHeight = `${lastH}px`;
    };
    const up = () => {
      this.#handle.removeEventListener("pointermove", move);
      this.#handle.removeEventListener("pointerup", up);
      this.#handle.removeEventListener("pointercancel", up);
      // A plain click (no real drag) belongs to the cycle.
      if (!moved) return;
      surface.style.maxHeight = "";
      // A drag that ends in a click must not also cycle.
      this.#suppressClick = true;
      setTimeout(() => (this.#suppressClick = false), 0);
      if (lastH < window.innerHeight * 0.2) {
        this.close();
      } else if (lastH > window.innerHeight * 0.75) {
        this.#setDetent("full");
      } else {
        this.#setDetent("half");
      }
    };
    this.#handle.addEventListener("pointermove", move);
    this.#handle.addEventListener("pointerup", up);
    this.#handle.addEventListener("pointercancel", up);
  }

  #suppressClick = false;
}

if (!customElements.get("nmui-sheet")) {
  customElements.define("nmui-sheet", NMUISheet);
}

export { NMUISheet };
