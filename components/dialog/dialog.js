import dialogStyles from "./dialog.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(dialogStyles)) {
  document.adoptedStyleSheets.push(dialogStyles);
}

/**
 * <nmui-dialog> — M3 dialog: a modal surface over a scrim.
 *
 * Bare = basic dialog; [fullscreen] = full-screen dialog.
 *
 * Light DOM (basic): an optional <icon>, a <headline>, supporting
 * text, and an <actions> row of buttons. With an icon the headline
 * and text center; without one they start-align. The actions stay
 * at the end either way.
 *
 *   <nmui-dialog id="confirm">
 *     <icon>delete</icon>
 *     <headline>Delete item?</headline>
 *     <p>This can't be undone.</p>
 *     <actions>
 *       <nmui-button text data-close>Cancel</nmui-button>
 *       <nmui-button text data-close>Delete</nmui-button>
 *     </actions>
 *   </nmui-dialog>
 *
 * Full-screen: the headline and actions move into a header (with a
 * close affordance the component adds) over a divider, and the
 * remaining content scrolls under it.
 *
 * State is [open]; show() / close() / toggle() drive it. Scrim
 * clicks, Escape, and any [data-close] child close it. Emits
 * open / close with { dialog }.
 */
class NMUIDialog extends HTMLElement {
  #ready = false;
  #lastFocus = null;
  #openState = false;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    if (!this.hasAttribute("role")) this.setAttribute("role", "dialog");
    if (!this.hasAttribute("aria-modal")) this.setAttribute("aria-modal", "true");
    if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", "-1");

    // The host is the scrim; the card is a created <surface>.
    let surface = this.querySelector(":scope > surface");
    if (!surface) {
      surface = document.createElement("surface");
      while (this.firstChild) surface.appendChild(this.firstChild);
      this.appendChild(surface);
    }

    if (this.hasAttribute("fullscreen")) this.#buildHeader(surface);

    this.addEventListener("click", (e) => {
      if (e.target === this) {
        this.close(); // scrim
      } else if (e.target instanceof Element && e.target.closest("[data-close]")) {
        this.close();
      }
    });
    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });

    new MutationObserver(() => this.#sync()).observe(this, {
      attributes: true,
      attributeFilter: ["open"],
    });

    this.#sync();
  }

  // Full-screen dialogs carry a header: a close affordance, the
  // headline, and the actions, over a divider. Everything else is
  // the body, wrapped in <content> so it scrolls under the header.
  #buildHeader(surface) {
    const header = document.createElement("header");

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "close";
    closeBtn.setAttribute("aria-label", "Close dialog");
    const icon = document.createElement("icon");
    icon.textContent = "close";
    closeBtn.appendChild(icon);
    closeBtn.addEventListener("click", () => this.close());
    header.appendChild(closeBtn);

    const headline = surface.querySelector(":scope > headline, :scope > nmui-title");
    if (headline) header.appendChild(headline);
    const actions = surface.querySelector(":scope > actions");
    if (actions) header.appendChild(actions);

    const content = document.createElement("content");
    while (surface.firstChild) content.appendChild(surface.firstChild);
    surface.appendChild(header);
    surface.appendChild(content);
  }

  // One state path for every route in: show()/close() call it
  // directly (so the events fire synchronously, like the other
  // components), the MutationObserver calls it for attribute
  // changes made elsewhere, and the guard keeps the two from
  // double-firing.
  #sync() {
    const open = this.hasAttribute("open");
    if (open === this.#openState) return;
    this.#openState = open;
    if (open) {
      this.#lastFocus = document.activeElement;
      document.body.style.overflow = "hidden";
      const focusable = this.querySelector(
        "surface :is(nmui-button, button, input, select, textarea, [href], [tabindex]):not(.close)"
      );
      (focusable || this).focus();
      this.dispatchEvent(
        new CustomEvent("open", { bubbles: true, composed: true, detail: { dialog: this } })
      );
    } else {
      document.body.style.overflow = "";
      this.#lastFocus?.focus?.();
      this.dispatchEvent(
        new CustomEvent("close", { bubbles: true, composed: true, detail: { dialog: this } })
      );
    }
  }

  show() {
    if (!this.hasAttribute("open")) {
      this.setAttribute("open", "");
      this.#sync();
    }
  }

  close() {
    if (this.hasAttribute("open")) {
      this.removeAttribute("open");
      this.#sync();
    }
  }

  toggle() {
    if (this.hasAttribute("open")) this.close();
    else this.show();
  }
}

if (!customElements.get("nmui-dialog")) {
  customElements.define("nmui-dialog", NMUIDialog);
}

export { NMUIDialog };
