import carouselStyles from "./carousel.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(carouselStyles)) {
  document.adoptedStyleSheets.push(carouselStyles);
}

/**
 * <nmui-carousel> — M3 carousel. Children are the items; the
 * component moves them into a <view> that scrolls.
 *
 * Layouts (pick one; bare is multi-browse):
 *   (default)      multi-browse — at least one large, one medium,
 *                  and one small item visible at a time; the medium
 *                  is the item after the large one, or the one
 *                  before it at the end of the strip
 *   [uncontained]  items scroll to the edge, one size, no sizing
 *                  changes, free scrolling (no snap)
 *   [multi-aspect] the uncontained multi-aspect ratio layout —
 *                  items of various widths (9:16 up to 16:9)
 *   [hero]         at least one large and one small item; one
 *                  item at a time
 *   [full-screen]  one edge-to-edge large item at a time,
 *                  scrolling vertically (portrait only)
 * Configurations:
 *   [center]       centers the current item — hero + center is
 *                  the center-aligned hero layout (one large
 *                  centered, one small preview each side)
 *
 * Item sizes are dynamic on multi-browse and hero: JS watches
 * the scroll and marks the leading item (or the centered item,
 * with [center]) large, the next one medium on multi-browse,
 * everything else small. Large is min(480px, 45%) — set
 * --nmui-carousel-large-max to change its max width; medium
 * is min(300px, 25%); small is 48px (inside the spec's 40–56
 * range). Uncontained, multi-aspect, and full-screen items
 * keep the author's size.
 *
 * Scrolling: snap-scrolling (mandatory snap) on multi-browse,
 * hero, and full-screen; free scrolling on uncontained layouts.
 * Item images get a parallax drift via object-position as they
 * move (the image content moves slower than its frame).
 *
 * Keyboard: Tab reaches the items (items without a focusable
 * descendant get tabindex 0); arrows move between items,
 * Enter/Space activate whatever the item itself is (a link, a
 * card with href — the carousel doesn't hijack activation).
 * Clicking an item makes it the large item and scrolls toward
 * it (to the leading edge, or to the center with [center]);
 * the click's lead sticks until the next scroll gesture hands
 * back to the geometric layout. A wheel over the strip scrolls
 * it horizontally, chaining to the page at either edge.
 * Emits "change" { index } when the leading/centered item
 * changes. Reduced motion: no size changes, no parallax, all
 * items stay one size.
 *
 * Deliberately no arrow buttons: the accessibility guidance
 * forbids buttons inside or beside the carousel container —
 * navigation is scroll, swipe, snap, and keyboard. The
 * "Show all" button for scrolling pages is app-level (below
 * the carousel), not the component's.
 *
 *   <nmui-carousel>
 *     <img src="a.jpg" alt="First">
 *     <img src="b.jpg" alt="Second">
 *     <img src="c.jpg" alt="Third">
 *   </nmui-carousel>
 */
class NMUICarousel extends HTMLElement {
  #ready = false;
  #view = null;
  #lastIndex = -1;
  #raf = 0;
  #reduced = false;
  #suppressClick = false;
  // Click-set lead; cleared by the next scroll gesture
  // (pointerdown, wheel, arrow keys, resize), which hands
  // back to the geometric lead.
  #clickLead = null;
  #onResize = () => {
    this.#clickLead = null;
    this.#onScroll();
  };

  get #layout() {
    if (this.hasAttribute("full-screen")) return "full-screen";
    if (this.hasAttribute("multi-aspect")) return "multi-aspect";
    if (this.hasAttribute("uncontained")) return "uncontained";
    if (this.hasAttribute("hero")) return "hero";
    return "multi-browse";
  }

  // Layouts whose items change size as they move.
  get #dynamic() {
    return this.#layout === "multi-browse" || this.#layout === "hero";
  }

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;
    this.#reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!this.hasAttribute("role")) this.setAttribute("role", "region");
    if (!this.hasAttribute("aria-roledescription")) {
      this.setAttribute("aria-roledescription", "carousel");
    }
    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", "Carousel");
    }

    this.#view = document.createElement("view");
    while (this.firstChild) this.#view.appendChild(this.firstChild);
    this.appendChild(this.#view);

    // Every item must be reachable by keyboard: items without a
    // focusable descendant get tabindex 0.
    for (const item of this.#view.children) {
      if (
        item.tabIndex < 0 &&
        !item.querySelector(
          "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"
        )
      ) {
        item.tabIndex = 0;
      }
    }

    this.#view.addEventListener(
      "scroll",
      () => {
        if (this.#raf) return;
        this.#raf = requestAnimationFrame(() => {
          this.#raf = 0;
          this.#onScroll();
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", this.#onResize);
    this.#view.addEventListener("keydown", (e) => this.#onKey(e));
    // Images arriving late change the layout; re-measure then.
    this.#view.addEventListener("load", () => this.#onScroll(), true);

    // Drag to scroll: mouse users have no horizontal wheel and
    // the scrollbar is hidden, so without this the strip is
    // unreachable with a mouse. Mouse only — touch keeps native
    // scrolling. A drag that actually moved suppresses the click
    // that follows it, so dragging a card never activates it;
    // a plain click (no movement) behaves exactly as normal.
    let drag = null;
    this.#view.addEventListener("pointerdown", (e) => {
      // Any new scroll gesture hands back to geometry.
      this.#clickLead = null;
      if (e.pointerType !== "mouse") return;
      drag = {
        x: e.clientX,
        y: e.clientY,
        left: this.#view.scrollLeft,
        top: this.#view.scrollTop,
        moved: false,
      };
    });
    this.#view.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        if (!drag.moved) {
          drag.moved = true;
          this.setAttribute("dragging", "");
        }
      }
      if (!drag.moved) return;
      if (this.#layout === "full-screen") {
        this.#view.scrollTop = drag.top - dy;
      } else {
        this.#view.scrollLeft = drag.left - dx;
      }
    });
    const endDrag = () => {
      if (drag?.moved) {
        // Suppress only the click that lands right after this
        // drag; the flag expires on its own, so releasing a drag
        // outside the strip can't eat a later real click.
        this.#suppressClick = true;
        setTimeout(() => {
          this.#suppressClick = false;
        }, 300);
      }
      this.removeAttribute("dragging");
      drag = null;
    };
    this.#view.addEventListener("pointerup", endDrag);
    this.#view.addEventListener("pointercancel", endDrag);
    this.#view.addEventListener("pointerleave", () => {
      this.removeAttribute("dragging");
      drag = null;
    });
    this.#view.addEventListener(
      "click",
      (e) => {
        if (!this.#suppressClick) return;
        this.#suppressClick = false;
        e.stopPropagation();
        e.preventDefault();
      },
      true
    );

    // Clicking an item makes it the large item and scrolls
    // toward it (to the leading edge, or to the center on
    // center layouts). Controls inside an item (links, buttons,
    // inputs) keep their own behavior — only clicks on the item
    // itself move it. The click's lead sticks until the next
    // scroll gesture hands back to geometry.
    this.#view.addEventListener("click", (e) => {
      if (this.#layout === "full-screen") return;
      let item = e.target;
      while (
        item &&
        item !== this.#view &&
        item.parentElement !== this.#view
      ) {
        item = item.parentElement;
      }
      if (!item || item === this.#view) return;
      let n = e.target;
      while (n && n !== item) {
        if (n.matches?.("a[href], button, input, select, textarea")) return;
        n = n.parentElement;
      }
      const items = this.#items();
      const idx = items.indexOf(item);
      if (idx < 0) return;
      const view = this.#view;
      const vr = view.getBoundingClientRect();
      const r = item.getBoundingClientRect();
      const scrollable = view.scrollWidth > view.clientWidth + 1;
      if (!scrollable) {
        if (!this.#dynamic || this.#reduced) return;
        this.#clickLead = idx;
        this.#applySizes(idx);
        if (idx !== this.#lastIndex) {
          this.#lastIndex = idx;
          this.dispatchEvent(
            new CustomEvent("change", {
              detail: { index: idx },
              bubbles: true,
              composed: true,
            })
          );
        }
        return;
      }
      let target;
      if (this.hasAttribute("center")) {
        target =
          r.left - vr.left + view.scrollLeft + r.width / 2 - vr.width / 2;
      } else {
        const pad =
          parseFloat(getComputedStyle(view).paddingInlineStart) || 0;
        target = r.left - vr.left + view.scrollLeft - pad;
      }
      // The click makes the item large even if the strip can't
      // scroll far enough to bring it to the front — a scroll
      // container can never put its last item at the leading
      // edge. Set before scrolling, so the scroll events the
      // animation fires keep the clicked sizes (no flicker).
      if (this.#dynamic && !this.#reduced) {
        this.#clickLead = idx;
        this.#applySizes(idx);
        if (idx !== this.#lastIndex) {
          this.#lastIndex = idx;
          this.dispatchEvent(
            new CustomEvent("change", {
              detail: { index: idx },
              bubbles: true,
              composed: true,
            })
          );
        }
      }
      view.scrollTo({
        left: target,
        behavior: this.#reduced ? "auto" : "smooth",
      });
    });

    // A wheel over the strip scrolls it horizontally (touchpads
    // included: vertical wheel input maps to horizontal scroll);
    // at either edge the event passes through, so the strip
    // never traps page scrolling.
    this.#view.addEventListener(
      "wheel",
      (e) => {
        this.#clickLead = null;
        if (this.#layout === "full-screen") return;
        const view = this.#view;
        if (view.scrollWidth <= view.clientWidth + 1) return;
        let d = e.deltaX || e.deltaY;
        if (e.deltaMode === 1) d *= 16;
        const max = view.scrollWidth - view.clientWidth;
        if (
          (d > 0 && view.scrollLeft < max - 1) ||
          (d < 0 && view.scrollLeft > 0)
        ) {
          e.preventDefault();
          view.scrollLeft += d;
        }
      },
      { passive: false }
    );

    // Center-aligned layouts start with the first item centered.
    // Assigned directly to the strip (scrollIntoView would also
    // move the page if the carousel starts below the fold).
    if (this.hasAttribute("center")) {
      requestAnimationFrame(() => {
        const first = this.#view.children[0];
        if (first) {
          const vr = this.#view.getBoundingClientRect();
          const fr = first.getBoundingClientRect();
          this.#view.scrollLeft =
            fr.left -
            vr.left +
            this.#view.scrollLeft +
            fr.width / 2 -
            vr.width / 2;
        }
      });
    }
    requestAnimationFrame(() => this.#onScroll());
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.#onResize);
  }

  #items() {
    return [...this.#view.children];
  }

  // The item the layout is built around: the item whose start
  // edge is nearest the strip's leading edge, or the item
  // nearest the center with [center]. Nearest-start, not
  // first-past-the-edge: the old rule could never advance when
  // the scroll range was shorter than the large item, which
  // froze the sizes mid-strip (fixed 0.15.4). Nearest-start
  // tracks the drag progressively, and at a settled snap
  // position it IS the snapped item.
  #leadIndex() {
    const items = this.#items();
    if (!items.length) return 0;
    const view = this.#view;
    const vr = view.getBoundingClientRect();
    if (this.hasAttribute("center")) {
      const vc = vr.left + vr.width / 2;
      let best = 0;
      let bestD = Infinity;
      items.forEach((it, i) => {
        const r = it.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - vc);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best;
    }
    const style = getComputedStyle(view);
    const pad = parseFloat(style.paddingInlineStart) || 0;
    const edge = vr.left + pad;
    let best = 0;
    let bestD = Infinity;
    items.forEach((it, i) => {
      const d = Math.abs(it.getBoundingClientRect().left - edge);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  }

  #onScroll() {
    const items = this.#items();
    if (!items.length) return;
    if (this.#dynamic && !this.#reduced) {
      // A click overrides the geometric lead until the next
      // scroll gesture hands back to geometry.
      const lead = this.#clickLead ?? this.#leadIndex();
      this.#applySizes(lead);
      if (lead !== this.#lastIndex) {
        this.#lastIndex = lead;
        this.dispatchEvent(
          new CustomEvent("change", {
            detail: { index: lead },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
    // Parallax on item images: the image content drifts against
    // its frame (object-position, so nothing overflows its box).
    // Direction: an item left of center shows more of its image's
    // left side, as if the content lagged behind the frame.
    if (!this.#reduced && this.#layout !== "full-screen") {
      const view = this.#view;
      const vr = view.getBoundingClientRect();
      const vc = vr.left + vr.width / 2;
      for (const it of items) {
        const img =
          it.tagName === "IMG" ? it : it.querySelector(":scope > img");
        if (!img) continue;
        const r = it.getBoundingClientRect();
        const rel = (r.left + r.width / 2 - vc) / vr.width;
        img.style.objectPosition = `${Math.max(
          0,
          Math.min(100, 50 + rel * 100)
        )}% 50%`;
      }
    }
  }

  #applySizes(lead) {
    const items = this.#items();
    const multi =
      this.#layout === "multi-browse" && !this.hasAttribute("center");
    // The medium is the item after the large one — except at the
    // end of the strip, where there is nothing after it, so the
    // medium is the item just before the large one. Either way
    // there is always a large and a medium on screen.
    let medium = -1;
    if (multi) {
      medium = lead + 1 < items.length ? lead + 1 : lead - 1;
    }
    items.forEach((it, i) => {
      it.setAttribute(
        "data-size",
        i === lead ? "large" : i === medium ? "medium" : "small"
      );
    });
  }

  #target(item) {
    if (item.tabIndex >= 0) return item;
    return (
      item.querySelector(
        "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"
      ) || item
    );
  }

  #onKey(e) {
    const next = e.key === "ArrowRight" || e.key === "ArrowDown";
    const prev = e.key === "ArrowLeft" || e.key === "ArrowUp";
    if (!next && !prev) return;
    this.#clickLead = null;
    const view = this.#view;
    let el = document.activeElement;
    if (!view.contains(el)) return;
    while (el && el.parentElement !== view) el = el.parentElement;
    if (!el) return;
    const items = this.#items();
    const i = items.indexOf(el);
    const j = next
      ? Math.min(items.length - 1, i + 1)
      : Math.max(0, i - 1);
    if (j === i) return;
    e.preventDefault();
    const t = this.#target(items[j]);
    t.focus({ preventScroll: true });
    items[j].scrollIntoView({
      behavior: this.#reduced ? "auto" : "smooth",
      inline: this.hasAttribute("center") ? "center" : "start",
      block: this.#layout === "full-screen" ? "start" : "nearest",
    });
  }
}

if (!customElements.get("nmui-carousel")) {
  customElements.define("nmui-carousel", NMUICarousel);
}

export { NMUICarousel };
