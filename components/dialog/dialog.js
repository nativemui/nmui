import dialogStyles from "./dialog.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(dialogStyles)) {
  document.adoptedStyleSheets.push(dialogStyles);
}

/**
 * <nmui-dialog> — M3 dialog. A modal surface with scrim.
 *
 * Light DOM: <headline> (or <nmui-title>) for the title, free content,
 * and an [actions] row for buttons.
 *
 *   <nmui-dialog id="confirm">
 *     <headline>Delete item?</headline>
 *     <p>This can't be undone.</p>
 *     <actions>
 *       <nmui-button text data-close>Cancel</nmui-button>
 *       <nmui-button text>Delete</nmui-button>
 *     </actions>
 *   </nmui-dialog>
 *
 * Toggle with [open] (or show()/close()). Escape and scrim clicks close
 * it; [data-close] on a child closes it too. Emits "close".
 */
class NMUIDialog extends HTMLElement {
  #ready = false;
  #lastFocus = null;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    if (!this.hasAttribute("role")) this.setAttribute("role", "dialog");
    if (!this.hasAttribute("aria-modal")) this.setAttribute("aria-modal", "true");

    // The host is the scrim; wrap content in <surface> for the card.
    if (!this.querySelector(":scope > surface")) {
      const surface = document.createElement("surface");
      while (this.firstChild) surface.appendChild(this.firstChild);
      this.appendChild(surface);
    }

    this.addEventListener("click", (e) => {
      if (e.target === this) this.close(); // scrim
      if (e.target instanceof Element && e.target.closest("[data-close]")) this.close();
    });
    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });

    new MutationObserver(() => {
      if (this.hasAttribute("open")) this.#onOpen();
      else this.#onClose();
    }).observe(this, { attributes: true, attributeFilter: ["open"] });

    if (this.hasAttribute("open")) this.#onOpen();
  }

  #onOpen() {
    this.#lastFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    const focusable = this.querySelector("nmui-button, button, input, [tabindex]");
    (focusable || this).focus?.();
    if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", "-1");
  }

  #onClose() {
    document.body.style.overflow = "";
    this.#lastFocus?.focus?.();
  }

  show() {
    this.setAttribute("open", "");
    this.dispatchEvent(new CustomEvent("open", { bubbles: true, composed: true }));
  }

  close() {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
  }
}

if (!customElements.get("nmui-dialog")) {
  customElements.define("nmui-dialog", NMUIDialog);
}

export { NMUIDialog };
