/* Avanthi Institute of Engineering & Technology – website + CMS server */
const path = require("path");
const fs = require("fs");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const store = require("./lib/store");
const auth = require("./lib/auth");
const { ORIGIN } = require("./lib/html");
const assets = require("./lib/assets");
const { buildNavIndex, trailFor, sectionFor } = require("./lib/nav");

const ROOT = path.join(__dirname, "..");
const PORT = process.env.PORT || 8080;
const ASSET_DIR = path.join(store.DATA_DIR, "assets"); // local files override the original /assets/*

const app = express();
app.set("trust proxy", true);
app.set("view engine", "ejs");
app.set("views", path.join(ROOT, "views"));
app.disable("x-powered-by");
Object.assign(app.locals, require("./lib/view-helpers"));

app.use(
  helmet({
    frameguard: false, // allow embedding in the preview iframe
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
        "img-src": ["'self'", "data:", "blob:", "https:"],
        "media-src": ["'self'", "https:"],
        "frame-src": ["'self'", ORIGIN, "https://www.youtube.com", "https://www.youtube-nocookie.com", "https://www.google.com", "https://maps.google.com", "https://docs.google.com", "https://drive.google.com", "https://player.vimeo.com"],
        "connect-src": ["'self'"],
        "object-src": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
      },
    },
  })
);
app.use(compression());
const json8 = express.json({ limit: "8mb" });
app.use((req, res, next) => (req.path === "/api/admin/import" ? next() : json8(req, res, next)));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

/* ---------------- data helpers ---------------- */
const site = () => store.load("site", {});
const pages = () => store.load("pages", {});
const stats = () => store.load("stats", { total: 0, daily: {}, pages: {} });
const messages = () => store.load("messages", { list: [] });
const activity = () => store.load("activity", { list: [] });

function log(user, action, target) {
  const a = activity();
  a.list.unshift({ at: new Date().toISOString(), user: user ? user.username : "system", action, target: String(target || "").slice(0, 200) });
  a.list.length = Math.min(a.list.length, 500);
  store.save("activity", { backup: false });
}

let navVersion = 0;
let navIndex = null;
function getNavIndex() {
  if (!navIndex || navIndex.v !== navVersion) navIndex = { v: navVersion, idx: buildNavIndex(site().nav || []) };
  return navIndex.idx;
}

/* ---------------- static ---------------- */
app.use("/static/vendor/jodit", express.static(path.join(ROOT, "node_modules/jodit/es2021"), { maxAge: "7d" }));
app.use("/static", express.static(path.join(ROOT, "public"), { maxAge: process.env.NODE_ENV === "production" ? "1d" : 0 }));

/* /assets/* — serve locally uploaded / mirrored file if present, otherwise the original site's file */
/* ---------------- shared locals ---------------- */
app.use((req, res, next) => {
  const s = site();
  res.locals.site = s;
  res.locals.S = s.settings || {};
  res.locals.path = req.path;
  res.locals.user = auth.current(req);
  res.locals.visitors = stats().total;
  res.locals.today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  res.locals.isExternal = (h) => /^https?:\/\//i.test(h || "") && !String(h).startsWith(ORIGIN);
  res.locals.isFile = (h) => /\.(pdf|docx?|xlsx?|pptx?|jpe?g|png)(\?|$)/i.test(h || "");
  res.locals.linkAttrs = (h) => (res.locals.isExternal(h) || res.locals.isFile(h) ? ' target="_blank" rel="noopener"' : "");
  next();
});

/* Media and documents from the original site: local upload first, then the
   cache, then proxied from the college site, then a friendly fallback. */
app.get("/assets/*", (req, res) => {
  let rel;
  try { rel = decodeURIComponent(req.path.slice("/assets/".length)); } catch { return res.status(400).end(); }
  assets.serve(req, res, rel, ASSET_DIR, "assets/");
});

/* ---------------- visitor counter ---------------- */
function countVisit(req, res, key) {
  if (/bot|crawl|spider|slurp/i.test(req.headers["user-agent"] || "")) return;
  const s = stats();
  const today = new Date().toISOString().slice(0, 10);
  s.pages[key] = (s.pages[key] || 0) + 1;
  if (!/(?:^|;\s*)v=1/.test(req.headers.cookie || "")) {
    s.total++;
    s.daily[today] = (s.daily[today] || 0) + 1;
    res.append("Set-Cookie", "v=1; Path=/; Max-Age=21600; SameSite=Lax");
  }
  store.save("stats", { backup: false });
}

/* ---------------- public pages ---------------- */
app.get(["/index.html", "/index.php", "/home"], (req, res) => res.redirect(301, "/"));
// legacy static files from the first version of this repo
for (const [from, to] of Object.entries({
  // old static files from the first version of this repo
  "/about.html": "/about", "/courses.html": "/courses", "/gallery.html": "/photo_gallery", "/contact.html": "/contact_us", "/principal.html": "/principal",
  // pages the college has removed but still links to
  "/civil": "/courses", "/StudentExperimentalLearning_2021": "/curriculam_enrichment",
})) {
  app.get(from, (req, res) => res.redirect(301, to));
}

app.get("/", (req, res) => {
  countVisit(req, res, "/");
  res.render("home", { title: (site().settings || {}).seoTitle });
});

app.get(["/contact_us", "/contact"], (req, res) => {
  countVisit(req, res, "contact_us");
  res.render("contact", { title: "Contact Us", sent: req.query.sent === "1", trail: trailFor(getNavIndex(), "/contact_us") });
});

/* enquiry / contact form (also footer quick contact) */
const enquiryHits = new Map();
app.post("/enquiry", (req, res) => {
  const b = req.body || {};
  const wantsJson = (req.headers.accept || "").includes("application/json");
  const done = (code, msg) => (wantsJson ? res.status(code).json(code < 300 ? { ok: true } : { error: msg }) : code < 300 ? res.redirect(303, (b.back && String(b.back).startsWith("/") ? b.back : "/contact_us") + (String(b.back || "").includes("?") ? "&" : "?") + "sent=1#enquiry") : res.status(code).send(msg));
  if (b.website) return done(200); // honeypot
  const now = Date.now();
  const hits = (enquiryHits.get(req.ip) || []).filter((t) => now - t < 3600_000);
  if (hits.length >= 8) return done(429, "Too many messages, please try later.");
  const clean = (v, n) => String(v || "").replace(/[<>]/g, "").trim().slice(0, n);
  /* The admission form (/admissionforms) uses the original site's field names. */
  const isAdmission = !!(b.fullnames || b.courses || b.qualifications);
  const extra = {};
  for (const [k, n] of [["birth", 40], ["addresss", 400], ["courses", 120], ["qualifications", 160], ["messages", 2000]]) {
    const v = clean(b[k], n);
    if (v) extra[k] = v;
  }
  const msg = {
    id: Math.random().toString(36).slice(2, 10) + now.toString(36),
    name: clean(b.name || b.fullnames, 120),
    email: clean(b.email || b.emails, 160),
    phone: clean(b.phone || b.contacts, 30),
    subject: clean(b.subject, 160) || (isAdmission ? "Admission enquiry" : "Website enquiry"),
    message: (() => {
      const body = clean(b.message ?? b.messages, 4000);
      if (!isAdmission) return body;
      const details = [
        "Course interested: " + (extra.courses || "—"),
        extra.qualifications ? "Qualification: " + extra.qualifications : "",
        extra.birth ? "Date of birth: " + extra.birth : "",
        extra.addresss ? "Address: " + extra.addresss : "",
      ].filter(Boolean).join("\n");
      return [body, details].filter(Boolean).join("\n\n");
    })(),
    page: clean(b.back, 200) || (isAdmission ? "/admissionforms" : ""),
    at: new Date().toISOString(),
    read: false,
  };
  if (Object.keys(extra).length) msg.extra = extra;
  if (!msg.name || (!msg.email && !msg.phone) || !msg.message) return done(400, "Please fill name, email or phone, and message.");
  if (msg.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(msg.email)) return done(400, "Please enter a valid email.");
  hits.push(now);
  enquiryHits.set(req.ip, hits);
  messages().list.unshift(msg);
  store.save("messages", { backup: false });
  done(201);
});

/* site search */
function plain(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&amp;|&#\d+;|&\w+;/g, " ").replace(/\s+/g, " ").trim();
}
app.get("/search", (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 100);
  let results = [];
  if (q.length >= 2) {
    const terms = q.toLowerCase().split(/\s+/);
    const s = site();
    const docs = [];
    for (const p of Object.values(pages())) {
      if (p.status !== "published") continue;
      if (p.slug.includes("?") && /Content will be placed later/i.test(p.html)) continue;
      docs.push({ title: p.title + (p.subtitle ? " – " + p.subtitle : ""), href: "/" + encodeURI(p.slug), text: plain(p.html), type: "Page" });
    }
    for (const n of ["results", "notifications", "timetables"]) for (const it of s[n] || []) docs.push({ title: it.title, href: it.href, text: it.year || "", type: n === "results" ? "Exam result" : n === "notifications" ? "Notification" : "Time table" });
    for (const e of s.events || []) docs.push({ title: e.title, href: e.href, text: "", type: "Event" });
    (function walk(items, trail) {
      for (const it of items) {
        docs.push({ title: it.label, href: it.href, text: trail.join(" › "), type: "Menu" });
        walk(it.children || [], trail.concat(it.label));
      }
    })(s.nav || [], []);
    for (const d of docs) {
      const t = d.title.toLowerCase(), x = d.text.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (t.includes(term)) score += 10;
        else if (x.includes(term)) score += 1;
        else { score = 0; break; }
      }
      if (score && d.href && d.href !== "#") {
        let snippet = "";
        const i = x.indexOf(terms[0]);
        if (d.type === "Page" && i >= 0) snippet = (i > 60 ? "…" : "") + d.text.slice(Math.max(0, i - 60), i + 140) + "…";
        results.push({ ...d, score, snippet });
      }
    }
    const seen = new Set();
    results = results.sort((a, b) => b.score - a.score).filter((r) => (seen.has(r.href) ? false : seen.add(r.href))).slice(0, 60);
  }
  res.render("search", { title: q ? `Search: ${q}` : "Search", q, results });
});

app.get("/robots.txt", (req, res) => res.type("text/plain").send(`User-agent: *\nDisallow: /admin\nDisallow: /api/\nSitemap: ${req.protocol}://${req.get("host")}/sitemap.xml\n`));
app.get("/sitemap.xml", (req, res) => {
  const base = `${req.protocol}://${req.get("host")}`;
  const urls = ["/"].concat(Object.values(pages()).filter((p) => p.status === "published" && !p.slug.includes("?")).map((p) => "/" + encodeURI(p.slug)));
  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${base}${u.replace(/&/g, "&amp;")}</loc></url>`).join("")}</urlset>`);
});

/* ---------------- admin ---------------- */
app.get(["/admin", "/admin/*"], (req, res) => res.render("admin", { layout: false }));
app.use("/api/admin", require("./routes/admin")({ store, auth, site, pages, stats, messages, activity, log, onNavChange: () => navVersion++, ASSET_DIR, ROOT }));

/* ---------------- CMS pages (catch-all, same URLs as the original site) ---------------- */
app.get("/*", (req, res, next) => {
  let slug;
  try { slug = decodeURIComponent(req.path.slice(1)).replace(/\/$/, ""); } catch { return next(); }
  if (!slug || slug.startsWith("api/")) return next();
  const raw = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?") + 1) : "";
  let q = "";
  try { q = raw ? decodeURIComponent(raw.replace(/\+/g, " ")) : ""; } catch { q = raw; }
  const all = pages();
  let page = (q && all[slug + "?" + q]) || all[slug];
  if (!page && /\.html?$/.test(slug)) return res.redirect(301, "/" + slug.replace(/\.html?$/, ""));
  if (!page) {
    // case-insensitive fallback
    const k = Object.keys(all).find((x) => x.toLowerCase() === (slug + (q ? "?" + q : "")).toLowerCase() || x.toLowerCase() === slug.toLowerCase());
    page = k && all[k];
  }
  if (!page) return next();
  const user = res.locals.user;
  if (page.status !== "published" && !user) return next();
  countVisit(req, res, page.slug);
  const idx = getNavIndex();
  const base = page.slug.replace(/\?.*$/, "");
  const trail = trailFor(idx, "/" + encodeURI(base)) || trailFor(idx, "/" + base);
  const section = sectionFor(idx, "/" + encodeURI(base)) || sectionFor(idx, "/" + base);
  res.render("page", { title: page.title, page, trail, section, isCommittee: page.html.includes("finance-container") });
});

/* 404 + errors */
app.use((req, res) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ error: "Not found" });
  // documents linked outside /assets on the original site (e.g. /CurriculamAnalysis/…pdf)
  if (/\.(pdf|docx?|xlsx?|pptx?|jpe?g|png|gif|webp|mp4|zip)$/i.test(req.path)) {
    let rel = req.path.slice(1);
    try { rel = decodeURIComponent(rel); } catch {}
    return assets.serve(req, res, rel, null);
  }
  // pages / files the college site itself has removed
  let rel = req.path.slice(1);
  try { rel = decodeURIComponent(rel); } catch {}
  if (rel && assets.isKnownMissing(rel)) {
    return assets.serve(req, res, rel, null);
  }
  res.status(404).render("404", { title: "Page not found" });
});
app.use((err, req, res, next) => {
  console.error(err);
  if (req.path.startsWith("/api/")) return res.status(err.status || 500).json({ error: err.message || "Server error" });
  res.status(500).send("Something went wrong.");
});

auth.users(); // ensure default admin exists

// Listen only when started directly. On serverless hosts (Vercel) the app is
// imported by api/index.js and the platform handles the HTTP server.
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AIETM website running on http://0.0.0.0:${PORT}  (admin: /admin)`);
  });
}

module.exports = app;
