/* Navigation helpers: breadcrumbs + "in this section" menus derived from the nav tree */

function norm(h) {
  if (!h) return "";
  try { h = decodeURI(h); } catch {}
  return h.replace(/[#].*$/, "").replace(/\/$/, "").toLowerCase();
}

function buildNavIndex(nav) {
  const map = new Map(); // href -> { trail:[{label,href}], parent }
  (function walk(items, trail, parent) {
    for (const it of items) {
      const t = trail.concat({ label: it.label, href: it.href });
      const k = norm(it.href);
      if (k && k !== "#" && k.startsWith("/") && !map.has(k)) map.set(k, { trail: t, parent, item: it });
      walk(it.children || [], t, it);
    }
  })(nav, [], null);
  return map;
}

function trailFor(idx, href) {
  const e = idx.get(norm(href));
  return e ? e.trail : null;
}

/** Sibling links for the side menu */
function sectionFor(idx, href) {
  const e = idx.get(norm(href));
  if (!e || !e.parent) return null;
  const items = (e.parent.children || []).filter((c) => c.href && c.href !== "#" || (c.children || []).length);
  if (items.length < 2) return null;
  return { title: e.parent.label, items, current: norm(href) };
}

module.exports = { buildNavIndex, trailFor, sectionFor, norm };
