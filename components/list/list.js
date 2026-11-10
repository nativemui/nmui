import listStyles from "./list.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(listStyles)) {
  document.adoptedStyleSheets.push(listStyles);
}

/**
 * <nmui-list> — M3 list. One tag, two jobs: bare it's the container,
 * with [item] it's a row. Add [segmented] to the container for the
 * M3 Expressive style — filled rows separated by gaps, with the
 * selected row's corners morphed to 16dp.
 *
 * A row is a leading element, a text column, and trailing content:
 *
 *   <nmui-list>
 *     <nmui-list item value="inbox"><icon>inbox</icon>Inbox</nmui-list>
 *     <nmui-list item value="ada">
 *       <span avatar>AL</span>
 *       <span>Ada Lovelace<small>ada@example.com</small></span>
 *       <span trailing>10:24</span>
 *     </nmui-list>
 *   </nmui-list>
 *
 * Leading: an <icon>, an [avatar] (40dp primary-container circle —
 * initials, or an <img avatar>), or an <img media> thumbnail.
 * Text column: a bare label, or a <span> holding an optional
 * <overline>, the label, and a <small> of supporting text. Trailing:
 * a [trailing] text span, or a control (badge, checkbox, switch,
 * icon button) — controls keep their own clicks.
 *
 * Clicking a row selects it within its list (single-select) and
 * emits "change" with { value, item }. The container is a listbox,
 * rows are options with aria-selected kept in sync. Keyboard: Tab
 * lands on the selected (or first) row; ArrowUp / ArrowDown /
 * Home / End move between rows; Enter / Space activates.
 *
 * The native way works: item.click() selects and fires "change";
 * item.selected = true moves the selection silently; item.value
 * reads and writes the [value] attribute.
 */
class NMUIList extends HTMLElement {
  #ready = false;

  get isItem() {
    return this.hasAttribute("item");
  }

  get value() {
    return this.getAttribute("value");
  }

  set value(v) {
    if (v == null) this.removeAttribute("value");
    else this.setAttribute("value", v);
  }

  get selected() {
    return this.hasAttribute("selected");
  }

  set selected(on) {
    this.toggleAttribute("selected", !!on);
    if (this.isItem) this.setAttribute("aria-selected", on ? "true" : "false");
  }

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;
    if (this.isItem) this.#initItem();
    else this.#initContainer();
  }

  // -- container --------------------------------------------------------------

  #initContainer() {
    if (!this.hasAttribute("role")) this.setAttribute("role", "listbox");

    // Roving tabindex is settled once the rows are in (they may
    // still be parsing when the container connects), and again
    // whenever focus actually lands on a row.
    queueMicrotask(() => this.#syncTabs());
    this.addEventListener("focusin", (e) => {
      if (e.target instanceof NMUIList && e.target.isItem) this.#syncTabs(e.target);
    });

    this.addEventListener("keydown", (e) => {
      if (e.target !== e.currentTarget && !(e.target instanceof NMUIList)) return;
      const item = e.target instanceof NMUIList && e.target.isItem ? e.target : null;
      if (!item) return;
      const items = this.#items();
      const i = items.indexOf(item);
      if (i < 0) return;
      let next = null;
      if (e.key === "ArrowDown") next = items[(i + 1) % items.length];
      else if (e.key === "ArrowUp") next = items[(i - 1 + items.length) % items.length];
      else if (e.key === "Home") next = items[0];
      else if (e.key === "End") next = items[items.length - 1];
      if (next) {
        e.preventDefault();
        this.#syncTabs(next);
        next.focus();
      }
    });
  }

  #items() {
    return [...this.querySelectorAll(":scope > nmui-list[item]:not([disabled])")];
  }

  // One row in the tab order: the selected one, else the first.
  #syncTabs(focusItem = null) {
    const items = this.#items();
    const stop =
      focusItem ||
      items.find((i) => i.hasAttribute("selected")) ||
      items[0];
    items.forEach((i) => i.setAttribute("tabindex", i === stop ? "0" : "-1"));
    this.querySelectorAll(":scope > nmui-list[item][disabled]").forEach((i) =>
      i.setAttribute("tabindex", "-1")
    );
  }

  // -- row ----------------------------------------------------------------------

  #initItem() {
    if (!this.hasAttribute("role")) this.setAttribute("role", "option");
    this.setAttribute("aria-selected", this.selected ? "true" : "false");
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", this.hasAttribute("disabled") ? "-1" : "0");
    }

    this.addEventListener("keydown", (e) => {
      if (e.target !== this) return; // a nested control keeps its keys
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });

    this.addEventListener("click", (e) => {
      if (this.hasAttribute("disabled")) return;
      // A nested control (trailing checkbox, icon button…) is its
      // own action — it keeps the click, the row doesn't select.
      if (e.target !== this && e.target.closest("nmui-checkbox, nmui-switch, nmui-radio, nmui-button, a, button, input")) return;
      const list = this.closest("nmui-list:not([item])");
      if (list) {
        list.querySelectorAll(":scope > nmui-list[item]").forEach((sib) => {
          if (sib !== this) {
            sib.removeAttribute("selected");
            sib.setAttribute("aria-selected", "false");
          }
        });
        list.#syncTabs(this);
      }
      this.selected = true;
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { value: this.value, item: this },
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

if (!customElements.get("nmui-list")) {
  customElements.define("nmui-list", NMUIList);
}

export { NMUIList };
