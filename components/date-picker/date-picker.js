import datePickerStyles from "./date-picker.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(datePickerStyles)) {
  document.adoptedStyleSheets.push(datePickerStyles);
}

/* -- date helpers (pure — no DOM) -------------------------------------------
   Values are ISO calendar dates (YYYY-MM-DD) in local time. Parsing an
   ISO date with `new Date("2026-11-04")` would land on UTC midnight and
   shift the day in negative-offset timezones, so ISO strings are always
   built and read from local components. */

function isoOf(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseISO(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.getFullYear() === Number(m[1]) &&
    d.getMonth() === Number(m[2]) - 1 &&
    d.getDate() === Number(m[3])
    ? d
    : null;
}

const dtf = (opts) => new Intl.DateTimeFormat(undefined, opts);

// The locale's first weekday as a JS getDay() number (0 = Sunday).
// Intl.Locale.weekInfo counts Monday = 1 … Sunday = 7, hence % 7.
function weekStart() {
  try {
    const info = new Intl.Locale(dtf().resolvedOptions().locale).weekInfo;
    return info ? info.firstDay % 7 : 0;
  } catch (e) {
    return 0;
  }
}

// The 42 cells of a month view: the 1st placed under its weekday,
// leading/trailing cells filled with the neighbouring months' days
// (the spec's "outside month date" element).
function monthCells(cursor, start) {
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const lead = (new Date(y, m, 1).getDay() - start + 7) % 7;
  const t0 = new Date(y, m, 1 - lead);
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(t0.getFullYear(), t0.getMonth(), t0.getDate() + i);
    return { date, outside: date.getMonth() !== m };
  });
}

// A horizontal swipe on the day grid pages the month: left = next
// month, right = previous (the M3 guidelines' swipe navigation).
// Pure geometry: the gesture must travel at least 48px and be
// clearly more horizontal than vertical. Returns +1 / -1 / 0.
function swipeDir(dx, dy) {
  if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy) * 1.5) return 0;
  return dx < 0 ? 1 : -1;
}

// Typed dates: ISO always works; anything else is read as three numbers
// in the locale's own month/day/year order (learned from Intl), so the
// field accepts exactly the format it displays. Returns a Date, null
// for empty text, undefined for text that isn't a real date.
let _order = null;
function typedOrder() {
  if (_order) return _order;
  const order = [];
  for (const p of dtf({ year: "numeric", month: "numeric", day: "numeric" }).formatToParts(new Date(2001, 0, 2))) {
    if (p.type === "month" || p.type === "day" || p.type === "year") order.push(p.type);
  }
  return (_order = order.length === 3 ? order : ["month", "day", "year"]);
}

function typedPattern() {
  return dtf({ year: "numeric", month: "numeric", day: "numeric" })
    .formatToParts(new Date(2001, 0, 2))
    .map((p) =>
      p.type === "month" ? "MM" : p.type === "day" ? "DD" : p.type === "year" ? "YYYY" : p.value
    )
    .join("");
}

function parseTyped(text) {
  const t = (text || "").trim();
  if (!t) return null;
  const iso = parseISO(t);
  if (iso) return iso;
  const nums = t.match(/\d+/g);
  if (!nums || nums.length !== 3) return undefined;
  const got = {};
  typedOrder().forEach((k, i) => (got[k] = Number(nums[i])));
  let { year, month, day } = got;
  if (year < 100) year += 2000;
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day
    ? d
    : undefined;
}

const fmtField = (d) => (d ? dtf({ year: "numeric", month: "numeric", day: "numeric" }).format(d) : "");
const fmtFull = (d) => dtf({ weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(d);

let uid = 0;

/**
 * <nmui-date-picker> — M3 date pickers. One tag, three variants, all
 * decorating an authored field:
 *
 *   <nmui-date-picker>
 *     <label>Birthday</label>
 *     <input>
 *   </nmui-date-picker>
 *
 * Bare = the DOCKED picker: an outlined text field (the spec's field)
 * with a calendar panel below it. [modal] = the MODAL picker: the
 * field opens a dialog with a headline, and its edit icon swaps the
 * calendar for typed fields — the modal date input, which the
 * guidelines define as a view of the modal, not a separate variant.
 * [range] = range selection, a modal configuration in the specs, so
 * [range] always opens the modal surface. The modal's supporting
 * text defaults to "Select date" / "Select date range"; override it
 * with [label].
 *
 * The calendar is tentative until confirmed: day clicks move the
 * selection, OK commits (field text, [value], and a "change" event),
 * and Cancel / Escape / an outside press throws the tentative
 * selection away. Swiping the day grid left or right pages the
 * month (days view). In the docked picker, typing in the field commits
 * directly instead — Enter or blur with a parseable date (ISO, or the
 * locale's own numeric order), and an empty field clears the value;
 * the modal's field is a read-only trigger, and its typing lives in
 * the input view. [min] / [max] (ISO dates) disable the days outside
 * them.
 *
 * Attributes: [value] and [end] hold the committed ISO dates (end is
 * the range's second date), [min] / [max] bound the calendar, [open]
 * reflects the surface. Properties mirror them — picker.value,
 * picker.end, picker.date, picker.endDate — and set silently, the
 * native way. open() / close() / toggle() drive the surface.
 *
 * Events (all bubble): "change" on commit, detail
 * { value, date, end, endDate, picker, event } (end/endDate are null
 * outside [range]); "open" and "close" as the surface comes and
 * goes, detail { picker }. The inner input keeps its own native
 * events — its "change" bubbles too, told apart by its target.
 */
class NMUIDatePicker extends HTMLElement {
  #ready = false;
  #input = null;
  #toggle = null;
  #surface = null; // <calendar> when docked, <dialog> when modal
  #view = "days"; // days | months | years | input
  #cursor = new Date(); // the month on display (day pinned to 1)
  #sel = null; // tentative selection
  #selEnd = null;
  #swipeAt = 0; // when the last swipe paged the month (click guard)

  get #modal() {
    return this.hasAttribute("modal") || this.hasAttribute("range");
  }

  get #range() {
    return this.hasAttribute("range");
  }

  get value() {
    return this.getAttribute("value");
  }

  set value(v) {
    if (v == null || v === "") this.removeAttribute("value");
    else this.setAttribute("value", String(v));
    this.#syncField();
  }

  get end() {
    return this.getAttribute("end");
  }

  set end(v) {
    if (v == null || v === "") this.removeAttribute("end");
    else this.setAttribute("end", String(v));
    this.#syncField();
  }

  get date() {
    return parseISO(this.value);
  }

  set date(d) {
    this.value = d ? isoOf(d) : null;
  }

  get endDate() {
    return parseISO(this.end);
  }

  set endDate(d) {
    this.end = d ? isoOf(d) : null;
  }

  get #min() {
    return parseISO(this.getAttribute("min"));
  }

  get #max() {
    return parseISO(this.getAttribute("max"));
  }

  #disabled(d) {
    const min = this.#min;
    const max = this.#max;
    return (min && d < min) || (max && d > max);
  }

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    this.#input = this.querySelector(":scope > input");
    if (!this.#input) return;

    // Associate the authored label with the input (the checkbox
    // pattern) so the field has an accessible name and the label
    // focuses the field when clicked.
    const label = this.querySelector(":scope > label");
    if (label && !label.htmlFor) {
      if (!this.#input.id) this.#input.id = `nmui-dp-${++uid}`;
      label.htmlFor = this.#input.id;
    }

    if (!this.#input.hasAttribute("placeholder")) this.#input.setAttribute("placeholder", " ");
    this.#input.setAttribute("autocomplete", "off");
    // Modal (and therefore range) fields are triggers: typing lives in
    // the dialog's input view, so the field itself is read-only.
    if (this.#modal) this.#input.readOnly = true;

    // The field's trailing icon button (the spec's field icon button).
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.toggleAttribute("toggle", true);
    toggle.setAttribute("aria-label", "Choose date");
    toggle.innerHTML = "<icon>calendar_month</icon>";
    toggle.disabled = this.#input.disabled;
    this.appendChild(toggle);
    this.#toggle = toggle;
    toggle.addEventListener("click", () => this.togglePicker());

    this.#surface = document.createElement(this.#modal ? "dialog" : "calendar");
    this.#surface.setAttribute(
      "aria-label",
      this.getAttribute("label") || label?.textContent.trim() || "Choose date"
    );
    this.appendChild(this.#surface);
    if (this.#modal) {
      this.#surface.addEventListener("cancel", (e) => {
        e.preventDefault();
        this.#cancel(null);
      });
      this.#surface.addEventListener("click", (e) => {
        // A press on the backdrop: the dialog itself is the target and
        // the point falls outside its box.
        if (e.target !== this.#surface) return;
        const r = this.#surface.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
          this.#cancel(null);
        }
      });
    }

    this.#syncField();

    // Typing commits: Enter, or the input's own change (blur).
    this.#input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (this.#modal && !this.hasAttribute("open")) return this.open();
        this.#commitTyped(e);
      }
    });
    // One Escape path for the docked surface, wherever focus sits in
    // the host (the modal's Escape arrives as the dialog's cancel).
    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.#modal && this.hasAttribute("open")) {
        this.#cancel(e);
      }
    });
    this.#input.addEventListener("change", (e) => {
      // The calendar's own commits rewrite the field text; only a
      // genuinely different typed value is a commit.
      if (this.#input.value !== this.#fieldText()) this.#commitTyped(e);
    });
    this.#input.addEventListener("focus", () => {
      if (!this.#modal && !this.hasAttribute("open")) this.open();
    });
    this.#input.addEventListener("click", () => {
      if (this.#modal && !this.hasAttribute("open")) this.open();
    });

    document.addEventListener("pointerdown", (e) => {
      if (!this.#modal && this.hasAttribute("open") && !this.contains(e.target)) {
        this.#cancel(null);
      }
    });

    this.#surface.addEventListener("click", (e) => this.#onSurfaceClick(e));
    this.#surface.addEventListener("keydown", (e) => this.#onSurfaceKeydown(e));

    // Swipe navigation (days view): a horizontal swipe across the
    // day grid pages the month — left for next, right for previous.
    // The gesture is judged on pointerup; the click that follows a
    // real swipe is swallowed by the #swipeAt guard in
    // #onSurfaceClick, so a swipe never also picks a day.
    let swipeStart = null;
    this.#surface.addEventListener("pointerdown", (e) => {
      swipeStart =
        this.#view === "days" && e.target instanceof Element && e.target.closest("grid")
          ? { x: e.clientX, y: e.clientY }
          : null;
    });
    this.#surface.addEventListener("pointerup", (e) => {
      if (!swipeStart) return;
      const dir = swipeDir(e.clientX - swipeStart.x, e.clientY - swipeStart.y);
      swipeStart = null;
      if (!dir) return;
      this.#swipeAt = Date.now();
      this.#cursor = new Date(this.#cursor.getFullYear(), this.#cursor.getMonth() + dir, 1);
      this.#render();
    });
    this.#surface.addEventListener("pointercancel", () => (swipeStart = null));

    // Programmatic [value] / [end] changes (setAttribute) re-sync the
    // field and, while open, the calendar — same as the properties.
    new MutationObserver(() => {
      this.#syncField();
      if (this.hasAttribute("open")) {
        this.#sel = this.date;
        this.#selEnd = this.endDate;
        this.#render();
      }
    }).observe(this, { attributes: true, attributeFilter: ["value", "end"] });

    // Form reset: the input falls back to its authored value; the
    // picker's committed value follows it, silently (the checkbox
    // pattern). Deferred a tick — reset applies after the event.
    const form = this.#input.form;
    if (form) {
      form.addEventListener("reset", () => {
        setTimeout(() => {
          const d = parseTyped(this.#input.value);
          this.removeAttribute("error");
          if (d) this.setAttribute("value", isoOf(d));
          else this.removeAttribute("value");
          this.removeAttribute("end");
          this.#syncField();
        }, 0);
      });
    }
  }

  /* -- the surface -------------------------------------------------- */

  open() {
    if (this.hasAttribute("open")) return;
    this.#sel = this.date;
    this.#selEnd = this.endDate;
    const anchor = this.#sel || new Date();
    this.#cursor = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    this.#view = "days";
    this.setAttribute("open", "");
    this.#render();
    if (this.#modal) {
      this.#surface.showModal();
      // Modal focus starts on the grid's resting day (the docked
      // surface leaves focus in the field instead).
      this.#surface
        .querySelector('day > button[tabindex="0"]')
        ?.focus({ preventScroll: true });
    }
    this.dispatchEvent(
      new CustomEvent("open", { detail: { picker: this }, bubbles: true, composed: true })
    );
  }

  close() {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    if (this.#modal && this.#surface.open) this.#surface.close();
    this.dispatchEvent(
      new CustomEvent("close", { detail: { picker: this }, bubbles: true, composed: true })
    );
  }

  togglePicker() {
    if (this.hasAttribute("open")) this.#cancel(null);
    else this.open();
  }

  #cancel(event) {
    // Tentative state is thrown away; the field may have been showing
    // nothing tentative (typing commits directly), so just close.
    this.#sel = this.date;
    this.#selEnd = this.endDate;
    this.close();
    if (event) event.preventDefault();
  }

  #commit(event) {
    if (this.#range) {
      if (this.#sel) this.setAttribute("value", isoOf(this.#sel));
      else this.removeAttribute("value");
      if (this.#selEnd) this.setAttribute("end", isoOf(this.#selEnd));
      else this.removeAttribute("end");
    } else if (this.#sel) {
      this.setAttribute("value", isoOf(this.#sel));
    } else {
      this.removeAttribute("value");
    }
    this.removeAttribute("error");
    this.#syncField();
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          value: this.value,
          date: this.date,
          end: this.#range ? this.end : null,
          endDate: this.#range ? this.endDate : null,
          picker: this,
          event,
        },
        bubbles: true,
        composed: true,
      })
    );
    this.close();
    if (this.#modal) this.#toggle.focus();
  }

  #commitTyped(event) {
    const d = parseTyped(this.#input.value);
    if (d === undefined) {
      this.setAttribute("error", "");
      return;
    }
    this.removeAttribute("error");
    this.#sel = d;
    if (!this.#range) this.#selEnd = null;
    this.#commit(event);
  }

  #fieldText() {
    if (this.#range) {
      const a = this.date;
      const b = this.endDate;
      if (!a) return "";
      return b ? `${fmtField(a)} – ${fmtField(b)}` : fmtField(a);
    }
    return fmtField(this.date);
  }

  #syncField() {
    if (!this.#input) return;
    if (document.activeElement !== this.#input) {
      this.#input.value = this.#fieldText();
    }
    this.#toggle?.setAttribute("aria-expanded", String(this.hasAttribute("open")));
  }

  /* -- rendering ------------------------------------------------------ */

  #render() {
    const keepFocus = this.#surface.contains(document.activeElement)
      ? document.activeElement.dataset.fk
      : null;
    this.#surface.innerHTML = this.#modal ? this.#modalHTML() : this.#dockedHTML();
    if (this.#view === "years") {
      this.#surface
        .querySelector("years [selected]")
        ?.scrollIntoView({ block: "center" });
    }
    if (keepFocus) {
      this.#surface.querySelector(`[data-fk="${keepFocus}"]`)?.focus({ preventScroll: true });
    }
    this.#syncField();
  }

  #headHTML(modal) {
    const y = this.#cursor.getFullYear();
    const monthName = dtf({ month: "long" }).format(this.#cursor);
    if (modal) {
      // Modal header: one combined month+year menu button (it opens
      // the year view) and the prev/next month pair.
      const prevLabel = this.#view === "months" ? "Previous year" : "Previous month";
      const nextLabel = this.#view === "months" ? "Next year" : "Next month";
      return `<cal-head><button type="button" menu-btn data-fk="menu" aria-haspopup="true" aria-expanded="${this.#view === "years"}">${monthName} ${y}<icon>arrow_drop_down</icon></button><span nav-btns><button type="button" icon-btn prev data-fk="prev" aria-label="${prevLabel}"><icon>chevron_left</icon></button><button type="button" icon-btn next data-fk="next" aria-label="${nextLabel}"><icon>chevron_right</icon></button></span></cal-head>`;
    }
    // Docked header (the spec diagram): the month and the year each
    // get a menu button flanked by their own prev/next arrows. Each
    // selector gets half the 360dp surface, so the docked month
    // button carries the SHORT month name ("Nov", not "November") —
    // the full name cannot fit between two 48dp arrows in ~168dp,
    // and the long form pushed the year arrows off the panel. The
    // month LIST still shows full names; the modal's combined
    // button (above) keeps the long name too.
    const monthNameShort = dtf({ month: "short" }).format(this.#cursor);
    const inMonths = this.#view === "months";
    const inYears = this.#view === "years";
    const mPrev = inMonths || inYears ? "Previous year" : "Previous month";
    const mNext = inMonths || inYears ? "Next year" : "Next month";
    const yPrev = inYears ? "Previous years" : "Previous year";
    const yNext = inYears ? "Next years" : "Next year";
    return `<cal-head><span head-group><button type="button" icon-btn data-fk="pm" aria-label="${mPrev}"><icon>chevron_left</icon></button><button type="button" menu-btn data-fk="month" aria-haspopup="true" aria-expanded="${inMonths}" aria-label="${monthName}">${monthNameShort}<icon>arrow_drop_down</icon></button><button type="button" icon-btn data-fk="nm" aria-label="${mNext}"><icon>chevron_right</icon></button></span><span head-group><button type="button" icon-btn data-fk="py" aria-label="${yPrev}"><icon>chevron_left</icon></button><button type="button" menu-btn data-fk="year" aria-haspopup="true" aria-expanded="${inYears}">${y}<icon>arrow_drop_down</icon></button><button type="button" icon-btn data-fk="ny" aria-label="${yNext}"><icon>chevron_right</icon></button></span></cal-head>`;
  }

  #daysHTML() {
    const start = weekStart();
    const todayIso = isoOf(new Date());
    const selIso = this.#sel ? isoOf(this.#sel) : null;
    const endIso = this.#selEnd ? isoOf(this.#selEnd) : null;
    // Roving tabindex rests on the tentative selection, else today,
    // else the 1st of the displayed month.
    const tabIso =
      selIso && parseISO(selIso)?.getMonth() === this.#cursor.getMonth()
        ? selIso
        : todayIso && parseISO(todayIso)?.getMonth() === this.#cursor.getMonth()
          ? todayIso
          : isoOf(new Date(this.#cursor.getFullYear(), this.#cursor.getMonth(), 1));

    let html = `<grid>`;
    for (let i = 0; i < 7; i++) {
      const wd = new Date(2023, 0, 1 + ((start + i) % 7)); // 2023-01-01 was a Sunday
      html += `<dow>${dtf({ weekday: "narrow" }).format(wd)}</dow>`;
    }
    for (const { date, outside } of monthCells(this.#cursor, start)) {
      const iso = isoOf(date);
      const inRange =
        this.#range && this.#sel && this.#selEnd && date > this.#sel && date < this.#selEnd;
      const attrs = [
        outside ? " outside" : "",
        iso === todayIso ? " today" : "",
        iso === selIso ? " starts" : "",
        iso === endIso ? " ends" : "",
        inRange ? " inrange" : "",
      ].join("");
      html += `<day${attrs}><button type="button" data-iso="${iso}" data-fk="day-${iso}" tabindex="${iso === tabIso ? "0" : "-1"}" aria-label="${fmtFull(date)}"${this.#disabled(date) ? " disabled" : ""}>${date.getDate()}</button></day>`;
    }
    return html + `</grid>`;
  }

  #monthsHTML() {
    const y = this.#cursor.getFullYear();
    const selM = this.#sel ? this.#sel.getMonth() : -1;
    const selY = this.#sel ? this.#sel.getFullYear() : -1;
    let html = `<months>`;
    for (let m = 0; m < 12; m++) {
      const d = new Date(y, m, 1);
      const name = dtf({ month: "long" }).format(d);
      const dead =
        (this.#min && new Date(y, m + 1, 0) < this.#min) ||
        (this.#max && d > this.#max);
      html += `<button type="button" data-month="${m}" data-fk="month-${m}"${m === selM && y === selY ? " selected" : ""}${dead ? " disabled" : ""}>${name}${m === selM && y === selY ? "<icon>check</icon>" : ""}</button>`;
    }
    return html + `</months>`;
  }

  #yearsHTML() {
    const minY = this.#min ? this.#min.getFullYear() : 1900;
    const maxY = this.#max ? this.#max.getFullYear() : 2100;
    const selY = this.#sel ? this.#sel.getFullYear() : -1;
    const thisY = new Date().getFullYear();
    let html = `<years>`;
    for (let y = minY; y <= maxY; y++) {
      html += `<button type="button" data-year="${y}" data-fk="year-${y}"${y === selY ? " selected" : ""}${y === thisY ? " today" : ""}>${y}</button>`;
    }
    return html + `</years>`;
  }

  #viewHTML() {
    if (this.#view === "months") return this.#monthsHTML();
    if (this.#view === "years") return this.#yearsHTML();
    return this.#daysHTML();
  }

  #actionsHTML() {
    return `<actions><button type="button" text-btn cancel data-fk="cancel">Cancel</button><button type="button" text-btn ok data-fk="ok">OK</button></actions>`;
  }

  #dockedHTML() {
    return `${this.#headHTML(false)}${this.#viewHTML()}${this.#actionsHTML()}`;
  }

  #modalHTML() {
    const label =
      this.getAttribute("label") || (this.#range ? "Select date range" : "Select date");
    let headline;
    if (this.#range) {
      const short = (d) => dtf({ month: "short", day: "numeric" }).format(d);
      headline = `${this.#sel ? short(this.#sel) : "Start"} – ${this.#selEnd ? short(this.#selEnd) : "End"}`;
    } else {
      headline = dtf({ weekday: "short", month: "short", day: "numeric" }).format(
        this.#sel || new Date()
      );
    }
    const head = `<header><div><supporting>${label}</supporting><headline large${this.#range ? " range" : ""}>${headline}</headline></div><button type="button" icon-btn mode data-fk="mode" aria-label="${this.#view === "input" ? "Show calendar" : "Type a date"}"><icon>${this.#view === "input" ? "calendar_month" : "edit"}</icon></button></header><divider></divider>`;

    if (this.#view === "input") {
      const fields = this.#range
        ? `<field><label>Start date</label><input data-end="start" placeholder="${typedPattern()}"></field><field><label>End date</label><input data-end="end" placeholder="${typedPattern()}"></field>`
        : `<field><label>Date</label><input data-end="start" placeholder="${typedPattern()}"></field>`;
      return `${head}<input-view>${fields}</input-view>${this.#actionsHTML()}`;
    }
    return `${head}${this.#headHTML(true)}${this.#viewHTML()}${this.#actionsHTML()}`;
  }

  /* -- surface interaction --------------------------------------------- */

  #onSurfaceClick(e) {
    // The click trailing a swipe is the gesture's tail, not a press.
    if (Date.now() - this.#swipeAt < 400) return;
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;

    if (t.closest("[cancel]")) return this.#cancel(e);
    if (t.closest("[ok]")) {
      if (this.#view === "input") return this.#commitInputView(e);
      return this.#commit(e);
    }
    if (t.closest("[mode]")) {
      this.#view = this.#view === "input" ? "days" : "input";
      this.#render();
      if (this.#view === "input") {
        const first = this.#surface.querySelector("input-view input");
        if (first) {
          first.value = fmtField(this.#sel);
          first.focus();
          first.select();
        }
      }
      return;
    }
    if (t.closest("[prev]") || t.closest("[next]")) {
      const dir = t.closest("[prev]") ? -1 : 1;
      if (this.#view === "months") {
        this.#cursor = new Date(this.#cursor.getFullYear() + dir, this.#cursor.getMonth(), 1);
      } else {
        this.#cursor = new Date(this.#cursor.getFullYear(), this.#cursor.getMonth() + dir, 1);
      }
      return this.#render();
    }
    // Docked header: four arrows — a pair for the month, a pair for
    // the year. In the month/year views both pairs move the cursor
    // year (that's what those views display); in the year view the
    // year pair pages the year list itself instead.
    const dockedNav = [
      ["pm", "month", -1],
      ["nm", "month", 1],
      ["py", "year", -1],
      ["ny", "year", 1],
    ].find(([fk]) => t.closest(`[data-fk='${fk}']`));
    if (dockedNav) {
      const [, unit, dir] = dockedNav;
      if (this.#view === "years" && unit === "year") {
        this.#surface.querySelector("years")?.scrollBy({ top: dir * 288 });
        return;
      }
      if (this.#view === "days" && unit === "month") {
        this.#cursor = new Date(this.#cursor.getFullYear(), this.#cursor.getMonth() + dir, 1);
      } else {
        this.#cursor = new Date(this.#cursor.getFullYear() + dir, this.#cursor.getMonth(), 1);
      }
      return this.#render();
    }
    const menuMonth = t.closest("[data-fk='month']");
    const menuYear = t.closest("[data-fk='year']");
    const menuBoth = t.closest("[data-fk='menu']");
    if (menuMonth) {
      this.#view = this.#view === "months" ? "days" : "months";
      return this.#render();
    }
    if (menuYear || menuBoth) {
      this.#view = this.#view === "years" ? "days" : "years";
      return this.#render();
    }
    const monthBtn = t.closest("[data-month]");
    if (monthBtn) {
      this.#cursor = new Date(this.#cursor.getFullYear(), Number(monthBtn.dataset.month), 1);
      this.#view = "days";
      return this.#render();
    }
    const yearBtn = t.closest("[data-year]");
    if (yearBtn) {
      this.#cursor = new Date(Number(yearBtn.dataset.year), this.#cursor.getMonth(), 1);
      this.#view = "days";
      return this.#render();
    }
    const dayBtn = t.closest("day > button");
    if (dayBtn && !dayBtn.disabled) {
      const d = parseISO(dayBtn.dataset.iso);
      if (!d) return;
      if (this.#range) {
        if (!this.#sel || (this.#sel && this.#selEnd)) {
          this.#sel = d;
          this.#selEnd = null;
        } else if (d < this.#sel) {
          this.#sel = d;
        } else {
          this.#selEnd = d;
        }
      } else {
        this.#sel = d;
      }
      if (d.getMonth() !== this.#cursor.getMonth()) {
        this.#cursor = new Date(d.getFullYear(), d.getMonth(), 1);
      }
      return this.#render();
    }
  }

  #commitInputView(e) {
    const startInput = this.#surface.querySelector("input[data-end='start']");
    const endInput = this.#surface.querySelector("input[data-end='end']");
    const start = parseTyped(startInput?.value);
    const end = endInput ? parseTyped(endInput?.value) : null;
    if (start === undefined || end === undefined) {
      this.#surface.querySelector("input-view").setAttribute("error", "");
      return;
    }
    this.#sel = start;
    this.#selEnd = this.#range ? end : null;
    if (this.#sel && this.#selEnd && this.#selEnd < this.#sel) {
      [this.#sel, this.#selEnd] = [this.#selEnd, this.#sel];
    }
    this.#commit(e);
  }

  #onSurfaceKeydown(e) {
    const t = e.target instanceof Element ? e.target : null;
    const dayBtn = t?.closest("day > button");
    if (!dayBtn) return;
    const d = parseISO(dayBtn.dataset.iso);
    if (!d) return;
    const focusDate = (next) => {
      if (this.#disabled(next)) return;
      this.#cursor = new Date(next.getFullYear(), next.getMonth(), 1);
      this.#render();
      this.#surface.querySelector(`[data-fk="day-${isoOf(next)}"]`)?.focus({ preventScroll: true });
    };
    const move = (days) => {
      e.preventDefault();
      focusDate(new Date(d.getFullYear(), d.getMonth(), d.getDate() + days));
    };
    // Page keys move by whole months/years, keeping the day of month
    // (clamped to the target month's length) — APG grid pattern.
    const moveMonths = (months) => {
      e.preventDefault();
      const y = d.getFullYear() + Math.floor((d.getMonth() + months) / 12);
      const m = ((d.getMonth() + months) % 12 + 12) % 12;
      const day = Math.min(d.getDate(), new Date(y, m + 1, 0).getDate());
      focusDate(new Date(y, m, day));
    };
    switch (e.key) {
      case "ArrowLeft": return move(-1);
      case "ArrowRight": return move(1);
      case "ArrowUp": return move(-7);
      case "ArrowDown": return move(7);
      case "PageUp": return moveMonths(e.shiftKey ? -12 : -1);
      case "PageDown": return moveMonths(e.shiftKey ? 12 : 1);
      case "Home": return move(-((d.getDay() - weekStart() + 7) % 7));
      case "End": return move(6 - ((d.getDay() - weekStart() + 7) % 7));
    }
  }
}

if (!customElements.get("nmui-date-picker")) {
  customElements.define("nmui-date-picker", NMUIDatePicker);
}

export { NMUIDatePicker };
