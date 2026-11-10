import snackbarStyles from "./snackbar.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(snackbarStyles)) {
  document.adoptedStyleSheets.push(snackbarStyles);
}

/**
 * <nmui-snackbar> — M3 snackbar. A brief, low-priority
 * message at the bottom of the screen; it never moves
 * focus and never blocks the page (role="status" announces
 * it politely).
 *
 *   <nmui-snackbar id="saved">
 *     <span>Draft saved</span>
 *     <nmui-button text>Undo</nmui-button>
 *   </nmui-snackbar>
 *   saved.show();            // or show("Different text")
 *
 * Children: the message in a <span> (or any element — the
 * first non-button child is the message slot), at most ONE
 * action (an <nmui-button text> or <button>), and an
 * optional close affordance marked [close].
 *
 * Timing (accessibility spec): a snackbar WITH an action
 * never auto-dismisses — it stays until the action is taken
 * or it's dismissed. Without an action it auto-dismisses
 * after [duration] ms (default 4000; the acceptable window
 * is 4–10s). [persistent] never auto-dismisses either way.
 *
 * Only one snackbar shows at a time: show() dismisses any
 * other open snackbar first (an updated message replaces an
 * outdated one, per the guidelines).
 *
 * [long-action] puts the action on its own line under the
 * text, right-aligned — the configuration for long actions.
 * [start] anchors the bar to the bottom-start on wide
 * layouts instead of centering it.
 *
 * Events: open / close {snackbar}; action {action,
 * snackbar, event} when the action is clicked (the close
 * affordance dismisses WITHOUT firing action). Escape
 * dismisses while the snackbar has focus.
 */
let current = null; // the one visible snackbar, if any

class NMUISnackbar extends HTMLElement {
  #ready = false;
  #timer = 0;
  #exitTimer = 0;
  #msg = null;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    if (!this.hasAttribute("role")) this.setAttribute("role", "status");

    this.#msg = this.querySelector(
      ":scope > :not(nmui-button):not(button):not([close])"
    );
    if (!this.#msg) {
      this.#msg = document.createElement("span");
      this.prepend(this.#msg);
    }

    this.addEventListener("click", (e) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      if (el.closest("[close]")) {
        this.dismiss();
        return;
      }
      const action = el.closest("nmui-button, button");
      if (action) {
        this.dispatchEvent(
          new CustomEvent("action", {
            detail: { action, snackbar: this, event: e },
            bubbles: true,
            composed: true,
          })
        );
        this.dismiss();
      }
    });
    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.dismiss();
    });

    new MutationObserver(() => {
      if (this.hasAttribute("open")) this.#opened();
      else this.#closed();
    }).observe(this, { attributes: true, attributeFilter: ["open"] });
    if (this.hasAttribute("open")) this.#opened();
  }

  disconnectedCallback() {
    if (current === this) current = null;
    clearTimeout(this.#timer);
    clearTimeout(this.#exitTimer);
  }

  #hasAction() {
    return !!this.querySelector(":scope > nmui-button, :scope > button:not([close])");
  }

  #opened() {
    clearTimeout(this.#exitTimer);
    this.removeAttribute("closing");
    if (current && current !== this) current.dismiss();
    current = this;
    clearTimeout(this.#timer);
    if (!this.hasAttribute("persistent") && !this.#hasAction()) {
      const ms = parseInt(this.getAttribute("duration") || "4000", 10);
      this.#timer = setTimeout(() => this.dismiss(), Number.isFinite(ms) ? ms : 4000);
    }
    this.dispatchEvent(
      new CustomEvent("open", {
        detail: { snackbar: this },
        bubbles: true,
        composed: true,
      })
    );
  }

  #closed() {
    if (current === this) current = null;
    clearTimeout(this.#timer);
    this.dispatchEvent(
      new CustomEvent("close", {
        detail: { snackbar: this },
        bubbles: true,
        composed: true,
      })
    );
  }

  show(message) {
    if (message != null && this.#msg) this.#msg.textContent = message;
    clearTimeout(this.#exitTimer);
    this.removeAttribute("closing");
    const was = this.hasAttribute("open");
    this.setAttribute("open", "");
    // The observer fires #opened on a fresh open; an
    // already-open snackbar re-arms directly (no change
    // reaches the observer).
    if (was) this.#opened();
  }

  dismiss() {
    clearTimeout(this.#timer);
    if (!this.hasAttribute("open") || this.hasAttribute("closing")) return;
    this.setAttribute("closing", "");
    this.#exitTimer = setTimeout(() => {
      this.removeAttribute("closing");
      this.removeAttribute("open");
    }, 200);
  }
}

if (!customElements.get("nmui-snackbar")) {
  customElements.define("nmui-snackbar", NMUISnackbar);
}

export { NMUISnackbar };
