import snackbarStyles from "./snackbar.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(snackbarStyles)) {
  document.adoptedStyleSheets.push(snackbarStyles);
}

/**
 * <nmui-snackbar> — M3 snackbar. A brief message with an optional action.
 *
 *   <nmui-snackbar id="saved">
 *     <span>Draft saved</span>
 *     <nmui-button text>Undo</nmui-button>
 *   </nmui-snackbar>
 *
 * Call show() / show(message) / dismiss(), or toggle [open]. Auto-hides
 * after 4s unless [persistent]. Action clicks dismiss and emit "action".
 */
class NMUISnackbar extends HTMLElement {
  #ready = false;
  #timer = 0;
  #msg = null;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    if (!this.hasAttribute("role")) this.setAttribute("role", "status");

    this.#msg = this.querySelector(":scope > span");
    if (!this.#msg) {
      this.#msg = document.createElement("span");
      this.prepend(this.#msg);
    }

    this.addEventListener("click", (e) => {
      const action = e.target instanceof Element ? e.target.closest("nmui-button, button") : null;
      if (action) {
        this.dispatchEvent(
          new CustomEvent("action", { detail: { action, event: e }, bubbles: true, composed: true })
        );
        this.dismiss();
      }
    });

    new MutationObserver(() => this.#arm()).observe(this, {
      attributes: true,
      attributeFilter: ["open"],
    });
    if (this.hasAttribute("open")) this.#arm();
  }

  #arm() {
    clearTimeout(this.#timer);
    if (this.hasAttribute("open") && !this.hasAttribute("persistent")) {
      this.#timer = setTimeout(() => this.dismiss(), 4000);
    }
  }

  show(message) {
    if (message != null && this.#msg) this.#msg.textContent = message;
    this.setAttribute("open", "");
  }

  dismiss() {
    clearTimeout(this.#timer);
    this.removeAttribute("open");
  }
}

if (!customElements.get("nmui-snackbar")) {
  customElements.define("nmui-snackbar", NMUISnackbar);
}

export { NMUISnackbar };
