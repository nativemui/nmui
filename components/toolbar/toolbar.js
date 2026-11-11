import toolbarStyles from "./toolbar.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(toolbarStyles)) {
  document.adoptedStyleSheets.push(toolbarStyles);
}

/**
 * <nmui-toolbar> — M3 Expressive toolbar. A container for the
 * actions of the current page; the toolbar itself has no
 * interactions — every control inside keeps its own behavior,
 * events, and tab stop (per the accessibility spec, Tab moves
 * through all actions; there is no roving tabindex).
 *
 *   <nmui-toolbar>
 *     <nmui-button icon aria-label="Undo">undo</nmui-button>
 *     ...
 *   </nmui-toolbar>
 *
 * Bare = DOCKED: spans the full width of its container,
 * square corners, no shadow, 64dp tall, items centered with
 * the default 32dp between them and at least 16dp at the
 * edges. Alignment variants for docked:
 *   [start]   items pack to the leading edge
 *   [end]     items pack to the trailing edge
 *   [spread]  items spread edge to edge (space-between)
 * On compact windows (<600dp) a default docked toolbar
 * spreads its items evenly, per the guidelines.
 *
 *   [floating]  a pill that floats above the content:
 *               content-sized, fully rounded, elevated,
 *               8dp padding and gaps. Placement (fixed /
 *               absolute, margins from the window edge) is
 *               the app's job, like the app bar's.
 *   [vertical]  floating only: items stack in a 64dp-wide
 *               column.
 *   [vibrant]   either variant in the vibrant color scheme:
 *               primary-container container; contained
 *               buttons remap per the specs (tonal toggles
 *               ride on surface-container, plain buttons and
 *               standard icon buttons take on-primary-
 *               container; filled stays primary).
 *
 * The bottom app bar is NOT this component: M3 Expressive
 * replaces it with the docked toolbar.
 *
 * Overflow (floating only): the floating toolbar must stay
 * fully on screen, so trailing button-type children that
 * don't fit collapse into an auto-built overflow menu in
 * the trailing slot (guidelines: "put them in an overflow
 * menu in the trailing slot"). Non-button children (text
 * fields, dividers, custom elements) never collapse. A
 * collapsed control stays in the DOM, hidden; its menu item
 * is a proxy labeled from its aria-label (or icon) whose
 * click calls the control's own click(). Give icon buttons
 * aria-labels — they should have them anyway, and the menu
 * reads better for it.
 *
 * Fires NO custom events.
 */
let uid = 0;

export class NMUIToolbar extends HTMLElement {
  #ro = null;
  #mo = null;
  #overflowBtn = null;
  #overflowMenu = null;
  #overflowed = [];
  #lastSize = -1;
  #layingOut = false;

  connectedCallback() {
    this.setAttribute("role", "toolbar");
    this.#syncOrientation();
    if (typeof ResizeObserver !== "undefined") {
      this.#ro = new ResizeObserver(() => this.#layout());
      this.#ro.observe(this);
    }
    this.#mo = new MutationObserver(() => this.#layout());
    this.#mo.observe(this, { childList: true });
    this.#layout();
  }

  disconnectedCallback() {
    this.#ro?.disconnect();
    this.#mo?.disconnect();
  }

  static get observedAttributes() {
    return ["vertical"];
  }

  attributeChangedCallback() {
    this.#syncOrientation();
    this.#layout();
  }

  #syncOrientation() {
    this.setAttribute(
      "aria-orientation",
      this.hasAttribute("vertical") ? "vertical" : "horizontal",
    );
  }

  /** The authored controls (never the generated overflow UI). */
  #items() {
    return [...this.children].filter((el) => !el.hasAttribute("data-overflow-ui"));
  }

  /** Buttons are the collapsible kind; everything else stays. */
  #collapsible(el) {
    return el.matches("nmui-button, button, a");
  }

  #ensureOverflowUI() {
    if (this.#overflowBtn) return;
    const n = ++uid;
    const btn = document.createElement("nmui-button");
    btn.setAttribute("icon", "");
    btn.setAttribute("standard", "");
    btn.setAttribute("data-overflow-ui", "");
    btn.setAttribute("aria-label", "More actions");
    btn.id = `nmui-tb-overflow-${n}`;
    btn.textContent = "more_vert";
    const menu = document.createElement("nmui-menu");
    menu.setAttribute("data-overflow-ui", "");
    menu.setAttribute("anchor", btn.id);
    btn.addEventListener("click", () => menu.toggle());
    this.#overflowBtn = btn;
    this.#overflowMenu = menu;
    this.append(btn, menu);
  }

  #clearOverflow() {
    for (const el of this.#overflowed) el.removeAttribute("data-overflowed");
    this.#overflowed = [];
    if (this.#overflowBtn) this.#overflowBtn.style.display = "none";
    if (this.#overflowMenu) this.#overflowMenu.replaceChildren();
  }

  /**
   * Collapse trailing buttons into the overflow menu until
   * the content fits the host's constrained size. Sizes come
   * from offsetWidth/offsetHeight; when nothing can be
   * measured (not laid out yet) the layout is left alone.
   */
  #layout() {
    if (this.#layingOut || !this.isConnected) return;
    if (!this.hasAttribute("floating")) {
      if (this.#overflowed.length) this.#clearOverflow();
      return;
    }
    const vertical = this.hasAttribute("vertical");
    const avail = vertical ? this.clientHeight : this.clientWidth;
    if (avail <= 0) return;
    this.#layingOut = true;
    try {
      // Unhide everything to measure real sizes (synchronous,
      // so nothing paints in between), then decide the set.
      for (const el of this.#overflowed) el.removeAttribute("data-overflowed");
      const gap = 8;
      const pad = 16; // 8dp padding at both ends
      const items = this.#items();
      const size = (el) => (vertical ? el.offsetHeight : el.offsetWidth);
      let total = pad + items.reduce((sum, el) => sum + size(el), 0) +
        gap * Math.max(0, items.length - 1);
      const overflowed = [];
      if (total > avail) {
        // Reserve the overflow button (48dp target) + its gap.
        total += 48 + gap;
        for (let i = items.length - 1; i >= 0; i--) {
          if (total <= avail) break;
          const el = items[i];
          if (!this.#collapsible(el)) continue;
          if (items.length - overflowed.length <= 1) break; // keep one visible
          overflowed.unshift(el);
          total -= size(el) + gap;
        }
      }
      const sameSet =
        overflowed.length === this.#overflowed.length &&
        overflowed.every((el, i) => el === this.#overflowed[i]);
      for (const el of overflowed) el.setAttribute("data-overflowed", "");
      this.#overflowed = overflowed;
      this.#lastSize = avail;
      if (sameSet) return; // menu + button already reflect this set
      if (!overflowed.length) {
        if (this.#overflowBtn) this.#overflowBtn.style.display = "none";
        if (this.#overflowMenu) this.#overflowMenu.replaceChildren();
        return;
      }
      this.#ensureOverflowUI();
      this.#overflowBtn.style.display = "";
      this.#buildOverflowMenu(overflowed);
    } finally {
      this.#layingOut = false;
    }
  }

  /** Proxy menu items for the collapsed controls. */
  #buildOverflowMenu(overflowed) {
    const frag = document.createDocumentFragment();
    for (const el of overflowed) {
      const item = document.createElement("button");
      item.type = "button";
      const icon = el.querySelector("icon")?.textContent?.trim();
      const label =
        el.getAttribute("aria-label") ||
        (el.textContent || "").trim().replace(/\s+/g, " ");
      if (icon) {
        const ic = document.createElement("icon");
        ic.textContent = icon;
        item.append(ic);
      }
      item.append(document.createTextNode(
        label && label !== icon ? label : (icon || "Action").replace(/_/g, " "),
      ));
      if (el.disabled || el.hasAttribute("disabled")) item.disabled = true;
      item.addEventListener("click", () => el.click());
      frag.append(item);
    }
    this.#overflowMenu.replaceChildren(frag);
  }
}

if (!customElements.get("nmui-toolbar")) {
  customElements.define("nmui-toolbar", NMUIToolbar);
}
