import searchStyles from "./search.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(searchStyles)) {
  document.adoptedStyleSheets.push(searchStyles);
}

const SEARCH_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14" fill="currentColor"/></svg>';
const CLEAR_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 5.7 18.3 4.3 16.9 9.2 12 4.3 7.1l1.4-1.4 4.9 4.9 6.3-6.3z" fill="currentColor"/></svg>';

/**
 * <nmui-search> — M3 search bar. Decorates a native search input with a
 * leading icon and a clear button.
 *
 *   <nmui-search><input type="search" placeholder="Search"></nmui-search>
 *
 * Emits native input/change from the inner input. Escape clears.
 */
class NMUISearch extends HTMLElement {
  #ready = false;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    const input = this.querySelector(":scope > input");
    if (!input) return;

    const lead = document.createElement("icon");
    lead.setAttribute("lead", "");
    lead.innerHTML = SEARCH_SVG;
    this.prepend(lead);

    const clear = document.createElement("button");
    clear.type = "button";
    clear.setAttribute("clear", "");
    clear.setAttribute("aria-label", "Clear search");
    clear.innerHTML = CLEAR_SVG;
    clear.hidden = true;
    this.appendChild(clear);

    const sync = () => {
      clear.hidden = !input.value;
    };
    input.addEventListener("input", sync);
    clear.addEventListener("click", () => {
      input.value = "";
      sync();
      input.focus();
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && input.value) {
        input.value = "";
        sync();
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    sync();
  }
}

if (!customElements.get("nmui-search")) {
  customElements.define("nmui-search", NMUISearch);
}

export { NMUISearch };
