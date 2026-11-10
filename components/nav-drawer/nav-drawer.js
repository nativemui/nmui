import navDrawerStyles from "./nav-drawer.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(navDrawerStyles)) {
  document.adoptedStyleSheets.push(navDrawerStyles);
}

/**
 * <nmui-nav-drawer> — M3 navigation drawer. Decorates <a> / <button>
 * children as destinations with an active pill.
 *
 *   <nmui-nav-drawer>
 *     <headline small>Mail</headline>
 *     <a data-link href="/" selected><icon>inbox</icon>Inbox</a>
 *     <a data-link href="/sent"><icon>send</icon>Sent</a>
 *   </nmui-nav-drawer>
 *
 * [modal] slides over content with a scrim — toggle with [open]
 * (or show()/close()). Without [modal] it's the standard in-flow drawer.
 * Emits "change" with { value, destination }.
 */
class NMUINavDrawer extends HTMLElement {
  #ready = false;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    // Modal drawers need a panel wrapper (the host is the scrim).
    if (this.hasAttribute("modal") && !this.querySelector(":scope > drawer")) {
      const drawer = document.createElement("drawer");
      while (this.firstChild) drawer.appendChild(this.firstChild);
      this.appendChild(drawer);
    }

    const scope = () => this.querySelector(":scope > drawer") || this;
    const dests = () => [...scope().querySelectorAll(":scope > a, :scope > button")];

    const select = (d, emit) => {
      dests().forEach((x) => x.removeAttribute("selected"));
      if (d) {
        d.setAttribute("selected", "");
        if (emit) {
          this.dispatchEvent(
            new CustomEvent("change", {
              detail: { value: d.getAttribute("value") ?? d.textContent.trim(), destination: d },
              bubbles: true,
              composed: true,
            })
          );
        }
      }
    };

    dests().forEach((d) => d.addEventListener("click", () => {
      select(d, true);
      if (this.hasAttribute("modal")) this.close();
    }));

    if (this.hasAttribute("modal")) {
      this.addEventListener("click", (e) => {
        if (e.target === this) this.close();
      });
      this.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.close();
      });
      new MutationObserver(() => {
        document.body.style.overflow = this.hasAttribute("open") ? "hidden" : "";
      }).observe(this, { attributes: true, attributeFilter: ["open"] });
    }

    if (!this.querySelector(":scope > [selected]")) select(dests()[0], false);
  }

  show() {
    this.setAttribute("open", "");
  }

  close() {
    this.removeAttribute("open");
  }
}

if (!customElements.get("nmui-nav-drawer")) {
  customElements.define("nmui-nav-drawer", NMUINavDrawer);
}

export { NMUINavDrawer };
