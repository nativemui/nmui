import searchStyles from "./search.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(searchStyles)) {
  document.adoptedStyleSheets.push(searchStyles);
}

/**
 * <nmui-search> — M3 search (bar + view), contained style.
 * Decorates a native search input; the view's content is
 * authored, typically an <nmui-list> of suggestions/results.
 *
 *   <nmui-search>
 *     <input type="search" placeholder="Search components">
 *     <nmui-list view>
 *       <nmui-list item value="button"><icon>search</icon>Button</nmui-list>
 *     </nmui-list>
 *   </nmui-search>
 *
 * Authoring:
 *   <input>            the search field (required). Its
 *                      placeholder is the hinted search text and
 *                      the view's accessible label.
 *   [leading] child    replaces the default search icon (an
 *                      icon or an icon button, e.g. a menu).
 *   [trailing] child   trailing actions, in order (max two per
 *                      the guidelines, plus an <img avatar>
 *                      at 30dp). The component's own clear
 *                      button is added after them (before an
 *                      avatar) and shows when there's text.
 *   [view] child       the suggestions/results surface. It
 *                      opens when the input gains focus.
 *   [fullscreen]       on the host: the open view fills the
 *                      screen (compact windows); otherwise it
 *                      docks below the bar (medium/expanded).
 *
 * Behavior: focusing the input opens the view; typing reopens
 * a dismissed view. Escape closes the view (or clears the text
 * when the view is already closed); an outside click closes
 * it. In the full-screen layout a back button replaces the
 * leading content while open — it closes the view, per the
 * guidelines' back behavior. Choosing a list item in the view
 * fills the input with it, fires `select`, and closes.
 *
 * Events: open / close {search}; select {value, item, search}.
 * The input's own events (input, change, search, submit via a
 * wrapping form) stay native.
 *
 * Not built: the divided (baseline) style — M3 Expressive
 * marks it "not recommended, use contained" — and the search
 * app bar, which is a separate component.
 */
let uid = 0;

class NMUISearch extends HTMLElement {
  #ready = false;
  #input = null;
  #view = null;
  #clear = null;
  #back = null;
  #leadSlot = null;
  #dismissed = false;
  #prevOverflow = "";

  get value() {
    return this.#input?.value ?? "";
  }

  set value(v) {
    if (!this.#input) return;
    this.#input.value = v ?? "";
    this.#syncClear();
  }

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    this.#input = this.querySelector(":scope > input");
    if (!this.#input) return;
    const input = this.#input;

    // --- the bar ------------------------------------------------
    const bar = document.createElement("bar");

    // Leading: the authored [leading] child, else a plain
    // (non-functional) search icon, per the guidelines.
    const leadSlot = document.createElement("leading");
    this.#leadSlot = leadSlot;
    const authoredLead = this.querySelector(":scope > [leading]");
    if (authoredLead) leadSlot.appendChild(authoredLead);
    else {
      const icon = document.createElement("icon");
      icon.textContent = "search";
      icon.setAttribute("aria-hidden", "true");
      leadSlot.appendChild(icon);
    }
    bar.appendChild(leadSlot);

    // Back button: full-screen open state only, swapped in for
    // the leading content while the view is open.
    const back = document.createElement("button");
    back.type = "button";
    back.setAttribute("back", "");
    back.setAttribute("aria-label", "Back");
    const backIcon = document.createElement("icon");
    backIcon.textContent = "arrow_back";
    back.appendChild(backIcon);
    back.hidden = true;
    back.addEventListener("click", () => this.close());
    this.#back = back;
    bar.appendChild(back);

    bar.appendChild(input);

    // Trailing: authored [trailing] children in order, then the
    // clear button (before a trailing avatar, if one exists).
    const trailing = [...this.querySelectorAll(":scope > [trailing]")];
    const clear = document.createElement("button");
    clear.type = "button";
    clear.setAttribute("clear", "");
    clear.setAttribute("aria-label", "Clear search");
    const clearIcon = document.createElement("icon");
    clearIcon.textContent = "close";
    clear.appendChild(clearIcon);
    clear.hidden = true;
    clear.addEventListener("click", () => {
      input.value = "";
      this.#syncClear();
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    });
    this.#clear = clear;
    const avatar = trailing.find((el) => el.hasAttribute("avatar"));
    for (const el of trailing) {
      if (el === avatar) bar.appendChild(clear);
      bar.appendChild(el);
    }
    if (!avatar) bar.appendChild(clear);

    this.prepend(bar);

    // --- the view -----------------------------------------------
    const authored = this.querySelector(":scope > [view]");
    if (authored) {
      const view = document.createElement("view");
      view.id = `nmui-search-view-${++uid}`;
      view.setAttribute("role", "region");
      view.setAttribute(
        "aria-label",
        input.placeholder || "Search suggestions"
      );
      view.appendChild(authored);
      this.appendChild(view);
      this.#view = view;
      input.setAttribute("aria-expanded", "false");
      input.setAttribute("aria-controls", view.id);
    }

    // --- behavior -----------------------------------------------
    input.addEventListener("focus", () => {
      if (this.#view && !this.#dismissed) this.open();
    });
    input.addEventListener("blur", () => {
      this.#dismissed = false;
    });
    input.addEventListener("input", () => {
      this.#syncClear();
      if (this.#view) {
        this.#dismissed = false;
        this.open();
      }
    });
    bar.addEventListener("pointerdown", () => {
      this.#dismissed = false;
    });
    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.hasAttribute("open")) {
          e.preventDefault();
          e.stopPropagation();
          this.close();
        } else if (document.activeElement === input && input.value) {
          input.value = "";
          this.#syncClear();
          input.dispatchEvent(new Event("input", { bubbles: true }));
          // The input handler reopens the view — stay closed.
          this.close();
        }
      }
      if (
        e.key === "ArrowDown" &&
        document.activeElement === input &&
        this.hasAttribute("open")
      ) {
        const first = this.#view?.querySelector(
          "nmui-list [item], [item], button, a[href]"
        );
        if (first) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    document.addEventListener("pointerdown", this.#onDocDown);

    // Choosing a suggestion: the view's list fires change.
    this.addEventListener("change", (e) => {
      if (!this.#view || !this.#view.contains(e.target)) return;
      if (e.target === input) return;
      const item = e.detail?.item ?? e.target;
      const value =
        e.detail?.value ??
        item.getAttribute?.("value") ??
        item.textContent.trim();
      input.value = value;
      this.#syncClear();
      this.dispatchEvent(
        new CustomEvent("select", {
          detail: { value, item, search: this },
          bubbles: true,
          composed: true,
        })
      );
      this.close();
      input.blur();
    });

    new MutationObserver(() => {
      if (this.hasAttribute("open")) this.#opened();
      else this.#closed();
    }).observe(this, { attributes: true, attributeFilter: ["open"] });
    if (this.hasAttribute("open")) this.#opened();
    this.#syncClear();
  }

  disconnectedCallback() {
    document.removeEventListener("pointerdown", this.#onDocDown);
  }

  #onDocDown = (e) => {
    if (!this.hasAttribute("open")) return;
    if (this.contains(e.target)) return;
    this.close();
  };

  #syncClear() {
    if (this.#clear) this.#clear.hidden = !this.#input.value;
  }

  open() {
    if (!this.#view) return;
    this.setAttribute("open", "");
  }

  close() {
    this.#dismissed = true;
    this.removeAttribute("open");
  }

  #opened() {
    this.#input.setAttribute("aria-expanded", "true");
    if (this.hasAttribute("fullscreen")) {
      this.#prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      if (this.#back) this.#back.hidden = false;
      if (this.#leadSlot) this.#leadSlot.hidden = true;
    }
    this.dispatchEvent(
      new CustomEvent("open", {
        detail: { search: this },
        bubbles: true,
        composed: true,
      })
    );
  }

  #closed() {
    this.#input.setAttribute("aria-expanded", "false");
    if (this.hasAttribute("fullscreen")) {
      document.body.style.overflow = this.#prevOverflow;
      if (this.#back) this.#back.hidden = true;
      if (this.#leadSlot) this.#leadSlot.hidden = false;
    }
    this.dispatchEvent(
      new CustomEvent("close", {
        detail: { search: this },
        bubbles: true,
        composed: true,
      })
    );
  }
}

if (!customElements.get("nmui-search")) {
  customElements.define("nmui-search", NMUISearch);
}

export { NMUISearch };
