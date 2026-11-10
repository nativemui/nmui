import tooltipStyles from "./tooltip.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(tooltipStyles)) {
  document.adoptedStyleSheets.push(tooltipStyles);
}

/**
 * <nmui-tooltip> — M3 tooltip. Lives inside its anchor; shows on
 * hover/focus of the anchor.
 *
 *   <nmui-button icon aria-label="Delete">
 *     delete<nmui-tooltip>Delete</nmui-tooltip>
 *   </nmui-button>
 *
 * [rich] for the rich tooltip (title + actions via light DOM).
 *
 *   <nmui-button icon>info
 *     <nmui-tooltip rich>
 *       <strong>Sync status</strong>
 *       <span>Last synced 2m ago.</span>
 *       <actions><nmui-button text>Retry</nmui-button></actions>
 *     </nmui-tooltip>
 *   </nmui-button>
 */
class NMUITooltip extends HTMLElement {
  #ready = false;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    if (!this.hasAttribute("role")) this.setAttribute("role", "tooltip");

    const anchor = this.closest("nmui-button") || this.parentElement;
    if (!anchor || anchor === document.body) return;

    const show = () => this.setAttribute("open", "");
    const hide = () => this.removeAttribute("open");

    anchor.addEventListener("mouseenter", show);
    anchor.addEventListener("mouseleave", hide);
    anchor.addEventListener("focusin", show);
    anchor.addEventListener("focusout", hide);
  }
}

if (!customElements.get("nmui-tooltip")) {
  customElements.define("nmui-tooltip", NMUITooltip);
}

export { NMUITooltip };
