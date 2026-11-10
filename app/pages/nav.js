// Page chrome moved into the app shell (app.js) — an expanded
// <nmui-navigation rail> — so pages no longer render their own nav.
// The export stays because every page still calls it; it renders
// nothing now.
export function nav() {
  return "";
}
