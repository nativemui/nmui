import tabsStyles from "./tabs.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(tabsStyles)) {
  document.adoptedStyleSheets.push(tabsStyles);
}

/**
 * <nmui-tabs> — M3 tabs. Decorates <a> / <button> children; an animated
 * indicator tracks the selected tab.
 *
 *   <nmui-tabs>
 *     <a selected><icon>home</icon>Home</a>
 *     <a><icon>search</icon>Search</a>
 *   </nmui-tabs>
 *
 * [secondary] for the secondary tab style. Emits "change" with { value, tab }.
 */
class NMUITabs extends HTMLElement {
  #ready = false;
  #indicator = null;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    if (!this.hasAttribute("role")) this.setAttribute("role", "tablist");

    this.#indicator = document.createElement("indicator");
    this.appendChild(this.#indicator);

    const tabs = () => [...this.querySelectorAll(":scope > a, :scope > button")];

    const select = (tab, emit) => {
      tabs().forEach((t) => {
        t.removeAttribute("selected");
        t.setAttribute("aria-selected", "false");
      });
      if (tab) {
        tab.setAttribute("selected", "");
        tab.setAttribute("aria-selected", "true");
        this.#move(tab);
        if (emit) {
          this.dispatchEvent(
            new CustomEvent("change", {
              detail: { value: tab.getAttribute("value") ?? tab.textContent.trim(), tab },
              bubbles: true,
              composed: true,
            })
          );
        }
      }
    };

    tabs().forEach((t) => {
      t.setAttribute("role", "tab");
      if (!t.hasAttribute("tabindex")) t.setAttribute("tabindex", "0");
      t.addEventListener("click", (e) => {
        // Let in-app [data-link] anchors navigate; still track selection.
        select(t, true);
      });
      t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const list = tabs();
          const i = list.indexOf(t);
          const next = list[(i + (e.key === "ArrowRight" ? 1 : -1) + list.length) % list.length];
          next.focus();
          select(next, true);
        }
      });
    });

    select(this.querySelector(":scope > [selected]") || tabs()[0], false);
    window.addEventListener("resize", () => {
      const sel = this.querySelector(":scope > [selected]");
      if (sel) this.#move(sel);
    });
  }

  #move(tab) {
    const host = this.getBoundingClientRect();
    const r = tab.getBoundingClientRect();
    this.#indicator.style.transform = `translateX(${r.left - host.left}px)`;
    this.#indicator.style.width = `${r.width}px`;
  }
}

if (!customElements.get("nmui-tabs")) {
  customElements.define("nmui-tabs", NMUITabs);
}

export { NMUITabs };
