import sheetStyles from "./sheet.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(sheetStyles)) {
  document.adoptedStyleSheets.push(sheetStyles);
}

/**
 * <nmui-sheet> — M3 bottom sheet / side sheet.
 *
 *   <nmui-sheet id="s">
 *     <headline>Drafts</headline>
 *     <nmui-list>…</nmui-list>
 *   </nmui-sheet>
 *
 * [modal] adds a scrim (click/Escape closes). [side] docks to the
 * inline-end edge instead of the bottom. Toggle with [open]
 * (or show()/close()); emits "close".
 */
class NMUISheet extends HTMLElement {
  #ready = false;
  #lastFocus = null;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    if (!this.querySelector(":scope > surface")) {
      const surface = document.createElement("surface");
      while (this.firstChild) surface.appendChild(this.firstChild);
      this.appendChild(surface);
    }

    this.addEventListener("click", (e) => {
      if (e.target === this && this.hasAttribute("modal")) this.close();
      if (e.target instanceof Element && e.target.closest("[data-close]")) this.close();
    });
    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });

    new MutationObserver(() => {
      if (this.hasAttribute("open")) {
        this.#lastFocus = document.activeElement;
        if (this.hasAttribute("modal")) document.body.style.overflow = "hidden";
      } else {
        if (this.hasAttribute("modal")) document.body.style.overflow = "";
        this.#lastFocus?.focus?.();
      }
    }).observe(this, { attributes: true, attributeFilter: ["open"] });
  }

  show() {
    this.setAttribute("open", "");
  }

  close() {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
  }
}

if (!customElements.get("nmui-sheet")) {
  customElements.define("nmui-sheet", NMUISheet);
}

export { NMUISheet };
