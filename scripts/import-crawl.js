#!/usr/bin/env node
/**
 * Imports the crawled copy of https://avanthienggcollege.ac.in (in ./_crawl)
 * into the CMS database (./data/pages.json + ./data/site.json).
 *
 *   node scripts/import-crawl.js            # import pages + build site.json (keeps existing users)
 *   node scripts/import-crawl.js --pages    # only re-import pages
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const cheerio = require("cheerio");
const { cleanHtml, ORIGIN } = require("../server/lib/html");

const ROOT = path.join(__dirname, "..");
const CRAWL = path.join(ROOT, "_crawl", "avanthienggcollege.ac.in");
const DATA_DIR = path.join(ROOT, "data");
const onlyPages = process.argv.includes("--pages");

if (!fs.existsSync(CRAWL)) {
  console.error("No crawl found at", CRAWL);
  process.exit(1);
}
fs.mkdirSync(DATA_DIR, { recursive: true });

/* ---------------------------------------------------------- */
const files = fs.readdirSync(CRAWL).filter((f) => f.endsWith(".html"));
const keyOf = (f) => f.replace(/\.html$/, "");
const pageKeys = new Set(files.map(keyOf).filter((k) => k !== "index"));

/** Map any href found on the original site to the local equivalent. */
function makeLinker(baseKey) {
  const base = ORIGIN + "/" + baseKey.replace(/\?.*$/, "");
  return function link(href) {
    if (href == null) return href;
    href = String(href).trim();
    if (!href || href === "#" || href === "#!" || /^javascript:/i.test(href)) return "#";
    if (/^(mailto|tel|whatsapp|sms):/i.test(href)) return href;
    if (href.startsWith("#")) return href;
    let url;
    try { url = new URL(href, base + (href.startsWith("?") ? "" : "")); } catch { return href; }
    if (!/(^|\.)avanthienggcollege\.ac\.in$/i.test(url.hostname)) return url.href;
    let p = url.pathname.replace(/\/{2,}/g, "/");
    if (p === "/" || /^\/index(\.php|\.html)?$/i.test(p)) return "/" + url.hash;
    if (/^\/assets\//i.test(p)) return p + url.search;
    const slug = decodeURIComponent(p.slice(1)).replace(/\/$/, "");
    const withQuery = slug + (url.search ? decodeURIComponent(url.search) : "");
    if (pageKeys.has(withQuery)) return "/" + encodeURI(withQuery).replace(/#/g, "%23") + url.hash;
    if (pageKeys.has(slug)) return "/" + encodeURI(slug) + (url.search || "") + url.hash;
    if (/\.[a-z0-9]{2,5}$/i.test(p)) return p; // other files (served/redirected by /assets fallback logic)
    return url.href; // page that does not exist on the original either
  };
}

/* ---------------------------------------------------------- */
function titleCase(s) {
  return s.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractPage(key) {
  const raw = fs.readFileSync(path.join(CRAWL, key + ".html"), "utf8");
  const $ = cheerio.load(raw);
  const w = $("#wrapper").length ? $("#wrapper") : $("body");
  w.find("header, footer, script, style, link, noscript, meta, #floatingVideo, .scrollToTop, .quick-contact-form").remove();

  let title =
    $(".inner-header h2").first().text() ||
    $(".inner-header h1").first().text() ||
    $(".inner-header h3").first().text() ||
    $(".finance-title h2").first().text() ||
    $("title").text().split("|")[0];
  title = title.replace(/\s+/g, " ").trim();
  if (!title || /^[a-z0-9_]+$/i.test(title)) title = titleCase(title || key.replace(/\?.*/, ""));

  // Sub-title for tabbed committee sub-pages, e.g. "Committee Members · 2024-25"
  let subtitle = "";
  const q = key.includes("?") ? new URLSearchParams(key.split("?")[1]) : null;
  if (q) {
    const parts = [];
    const activeSec = w.find(".finance-sidebar a.active").first().text().trim();
    if (activeSec) parts.push(activeSec);
    const yr = q.get("year");
    if (yr) parts.push(yr);
    subtitle = parts.join(" · ");
  }

  w.find(".inner-header").remove();
  w.find(".finance-title-section, .finance-title-space").remove();

  const html = cleanHtml(w.html() || "", makeLinker(key));
  return { title, subtitle, html };
}

/* ---------------------------------------------------------- */
const pages = {};
let n = 0;
for (const f of files) {
  const key = keyOf(f);
  if (key === "index") continue;
  try {
    const { title, subtitle, html } = extractPage(key);
    pages[key] = {
      slug: key,
      title,
      subtitle,
      html,
      status: "published",
      source: ORIGIN + "/" + key,
      updatedAt: new Date().toISOString(),
      updatedBy: "import",
    };
    n++;
  } catch (e) {
    console.warn("! failed", key, e.message);
  }
}
fs.writeFileSync(path.join(DATA_DIR, "pages.json"), JSON.stringify(pages));
console.log(`Imported ${n} pages → data/pages.json (${(fs.statSync(path.join(DATA_DIR, "pages.json")).size / 1e6).toFixed(1)} MB)`);

if (onlyPages) process.exit(0);

/* ---------------------------------------------------------- */
/* Navigation tree from the original "menuzord" mega menu       */
const home$ = cheerio.load(fs.readFileSync(path.join(CRAWL, "about.html"), "utf8"));
const homeLink = makeLinker("index");
let idc = 0;
const nid = () => "n" + (++idc).toString(36);
function walk(ul) {
  const out = [];
  home$(ul).children("li").each((_, li) => {
    const a = home$(li).children("a").first();
    const label = a.text().replace(/\s+/g, " ").trim();
    if (!label) return;
    let children = [];
    home$(li).children("ul, div").each((__, sub) => {
      if (sub.tagName === "ul") children = children.concat(walk(sub));
      else home$(sub).find("> ul").each((___, s2) => (children = children.concat(walk(s2))));
    });
    const href = homeLink(a.attr("href") || "#");
    if (href === "#" && !children.length) return; // empty placeholder items (original has them commented out)
    out.push({ id: nid(), label, href, children });
  });
  return out;
}
const nav = walk(home$("ul.menuzord-menu").first());
const FEATURED = ["Home", "About", "Governance & Leadership", "Academics", "R24 Regulation & Syllabus", "Exam (Autonomous)", "Training & Placement Cell", "Infrastracture", "Students", "Placements"];
nav.forEach((n) => (n.featured = FEATURED.includes(n.label)));

const topLinks = [];
home$(".header-top a").each((_, a) => {
  const label = home$(a).text().replace(/\s+/g, " ").trim();
  if (label) topLinks.push({ label, href: homeLink(home$(a).attr("href")) });
});

/* ---------------------------------------------------------- */
/* Homepage bits (hero, popup, videos) from original index.html */
const idx$ = cheerio.load(fs.readFileSync(path.join(CRAWL, "index.html"), "utf8"));
const uniq = (a) => [...new Set(a)];
const hero = uniq(
  idx$("img")
    .map((_, e) => idx$(e).attr("src") || "")
    .get()
    .filter((s) => /carousel-images\/\d+\.(jpe?g|png)$/i.test(s))
    .map((s) => homeLink(s))
);
const idxRaw = fs.readFileSync(path.join(CRAWL, "index.html"), "utf8").replace(/<!--[\s\S]*?-->/g, "").replace(/^\s*\/\/.*$/gm, "");
const arr = (re) => { const m = idxRaw.match(re); return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : []; };
const popups = uniq(arr(/customImages\s*=\s*\[([^\]]*)\]/).map(homeLink));
const videos = uniq([...idxRaw.matchAll(/"((?:https?:\/\/avanthienggcollege\.ac\.in\/)?assets\/videos\/[^"]+?\.mp4)"/gi)].map((m) => homeLink(m[1])));
const institutions = [];
home$("footer a").each((_, a) => {
  const t = home$(a).text().replace(/\s+/g, " ").trim();
  const m = t.match(/^(.*?)\s*((?:EAMCET|ICET) Code:\s*\w+)$/);
  if (m) institutions.push({ name: m[1].trim(), code: m[2].replace(/:\s*/, ": "), href: homeLink(home$(a).attr("href")) === "/" ? "/" : "" });
});

/* ---------------------------------------------------------- */
/* Lists already curated from the homepage (assets/js/data.js)  */
const legacy = fs.readFileSync(path.join(ROOT, "scripts", "seed-home.js"), "utf8");
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(legacy + "\nthis.DATA = DATA;", ctx);
const D = ctx.DATA;
const L = (h) => homeLink(h);
const uid = () => Math.random().toString(36).slice(2, 10);

const site = {
  settings: {
    name: "Avanthi Institute of Engineering & Technology",
    shortName: "AIETM",
    tagline: "Top Engineering College Narsipatnam",
    logo: "/assets/images/logoo/logo2.png",
    naacLogo: "/assets/images/logoo/naac-logo.jpg",
    naacLink: "/assets/pdf/AIETM_NAAC_SSR.pdf",
    seoTitle: "Best Engineering College Narsipatnam | B. Tech College | Top MBA College",
    seoDescription:
      "Avanthi Institute of Engineering & Technology (AIETM), Narsipatnam – NAAC A+ accredited engineering college offering B.Tech, M.Tech, MBA, MCA and Polytechnic programmes.",
    address: "Tamaram, Makavarapalem, Narsipatnam(R.D), Visakapatnam Dist-531113 AP India",
    contactAddress: D.college.contactAddress,
    admissionPhone: D.college.admissionPhone,
    otherPhone: D.college.otherPhone,
    fax: D.college.fax,
    email: D.college.email,
    hours: "Monday to Saturday: 09:00 AM – 06:00 PM",
    hoursClosed: "Sunday: Closed & all official holidays",
    mapEmbed:
      "https://maps.google.com/maps?q=Avanthi%20Institute%20of%20Engineering%20and%20Technology%20Makavarapalem%20Narsipatnam&t=&z=14&ie=UTF8&iwloc=&output=embed",
    applyLink: "/admissionforms",
    brochureLink: "/assets/pdf/AIETM-ADMISSIONS%20BROUCHURE%20-%202025.pdf",
    footerCredit: "Copyright ©2022 All Rights Reserved · Designed & Developed by Sunraise Solutions",
    popupEnabled: true,
    videoEnabled: true,
    heroTitle: "Top Engineering College Narsipatnam",
    heroText:
      "To develop highly skilled professionals with ethics and human values — B.Tech, M.Tech, MBA, MCA & Polytechnic programmes on a NAAC A+ accredited campus.",
    awardTitle: "NAAC A+ Grade — honoured by APSCHE",
    awardText: D.award.text,
    vision: D.vision,
  },
  topLinks,
  nav,
  hero: hero.map((src) => ({ id: uid(), image: src, caption: "" })),
  popups: popups.map((src) => ({ id: uid(), image: src, link: "" })),
  videos: videos.map((src) => ({ id: uid(), src })),
  quick: D.quick.map((q) => ({ id: uid(), label: q.label, href: L(q.href), icon: q.icon, hot: !!q.hot })),
  awardImages: D.award.images.map((s) => ({ id: uid(), image: L(s) })),
  results: D.results.map(([year, title, href]) => ({ id: uid(), year, title, href: L(href) })),
  notifications: D.notifications.map(([year, title, href]) => ({ id: uid(), year, title, href: L(href) })),
  timetables: D.timetables.map(([title, href]) => ({ id: uid(), title, href: L(href) })),
  mission: D.mission.map((text) => ({ id: uid(), text })),
  objectives: D.objectives.map((text) => ({ id: uid(), text })),
  features: D.features.map((text) => ({ id: uid(), text })),
  courses: D.courses.flatMap((g) => g.rows.map(([program, branches]) => ({ id: uid(), group: g.group, program, branches }))),
  cultural: D.cultural.map(([image, title]) => ({ id: uid(), image: L(image), title })),
  events: D.events.map(([image, title, href]) => ({ id: uid(), image: L(image), title, href: L(href) })),
  info: D.info.map(([label, href]) => ({ id: uid(), label, href: L(href) })),
  institutions: institutions.map((i) => ({ id: uid(), ...i })),
};

fs.writeFileSync(path.join(DATA_DIR, "site.json"), JSON.stringify(site, null, 1));
const count = (t) => t.reduce((a, x) => a + 1 + count(x.children || []), 0);
console.log(`site.json: ${nav.length} top menus / ${count(nav)} menu links, ${hero.length} hero slides, ${popups.length} popups, ${videos.length} videos`);

/* Link report */
let ext = 0, local = 0;
for (const p of Object.values(pages)) {
  for (const m of p.html.matchAll(/href="([^"]+)"/g)) {
    if (m[1].startsWith(ORIGIN)) ext++;
    else if (m[1].startsWith("/")) local++;
  }
}
console.log(`links → local: ${local}, still pointing to original domain (page missing there too): ${ext}`);
