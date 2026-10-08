/* Admin REST API (all routes require a signed-in user; some require the admin role) */
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { sanitize } = require("../lib/html");

module.exports = function ({ store, auth, site, pages, stats, messages, activity, log, onNavChange, ASSET_DIR }) {
  const r = express.Router();
  const UPLOAD_DIR = path.join(ASSET_DIR, "uploads");
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  /* ---------- auth ---------- */
  r.post("/login", express.json(), auth.login);
  r.post("/logout", auth.logout);
  r.get("/me", (req, res) => {
    const u = auth.current(req);
    if (!u) return res.status(401).json({ error: "Not signed in" });
    res.json({ user: auth.publicUser(u) });
  });

  const any = auth.requireAuth();
  const admin = auth.requireAuth("admin");

  r.post("/password", any, auth.changePassword);

  /* ---------- validation helpers ---------- */
  const strip = (v, n = 2000) => String(v ?? "").replace(/<[^>]*>/g, "").trim().slice(0, n);
  function safeHref(v) {
    v = String(v ?? "").trim();
    if (!v) return "";
    if (/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(v)) return v.slice(0, 1000);
    if (/^javascript:/i.test(v)) return "#";
    return "/" + v.replace(/^\.?\/*/, "");
  }
  const id = () => Math.random().toString(36).slice(2, 10);

  // field name → kind
  const HREF_FIELDS = new Set(["href", "image", "src", "link", "logo", "naacLogo", "naacLink", "applyLink", "brochureLink", "mapEmbed"]);
  const BOOL_FIELDS = new Set(["hot", "featured", "popupEnabled", "videoEnabled", "isNew", "hidden"]);
  function cleanItem(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj || {})) {
      if (!/^[a-zA-Z][\w]{0,40}$/.test(k)) continue;
      if (k === "children") out.children = Array.isArray(v) ? v.map(cleanItem) : [];
      else if (BOOL_FIELDS.has(k)) out[k] = !!v;
      else if (HREF_FIELDS.has(k)) out[k] = safeHref(v);
      else out[k] = strip(v, k === "text" || k.endsWith("Text") || k === "seoDescription" ? 5000 : 1000);
    }
    if (!out.id && !("name" in out && "tagline" in out)) out.id = id();
    return out;
  }

  const ARRAY_SECTIONS = ["topLinks", "nav", "hero", "popups", "videos", "quick", "awardImages", "results", "notifications", "timetables", "mission", "objectives", "features", "courses", "cultural", "events", "info", "institutions"];

  /* ---------- site content ---------- */
  r.get("/site", any, (req, res) => res.json(site()));

  r.put("/site/:section", any, (req, res) => {
    const sec = req.params.section;
    const s = site();
    if (sec === "settings") {
      if (typeof req.body !== "object" || Array.isArray(req.body)) return res.status(400).json({ error: "Expected object" });
      const cleaned = cleanItem(req.body);
      delete cleaned.id;
      s.settings = { ...s.settings, ...cleaned };
    } else if (ARRAY_SECTIONS.includes(sec)) {
      if (!Array.isArray(req.body)) return res.status(400).json({ error: "Expected array" });
      s[sec] = req.body.map(cleanItem);
      if (sec === "nav") onNavChange();
    } else return res.status(404).json({ error: "Unknown section" });
    store.save("site");
    log(req.user, "updated", sec);
    res.json({ ok: true, data: s[sec] });
  });

  /* ---------- pages ---------- */
  r.get("/pages", any, (req, res) => {
    const q = String(req.query.q || "").toLowerCase();
    const filter = String(req.query.filter || "main");
    const all = Object.values(pages());
    let list = all.map((p) => ({ slug: p.slug, title: p.title, subtitle: p.subtitle, status: p.status, updatedAt: p.updatedAt, updatedBy: p.updatedBy, size: p.html.length }));
    if (filter === "main") list = list.filter((p) => !p.slug.includes("?"));
    if (filter === "sub") list = list.filter((p) => p.slug.includes("?"));
    if (filter === "draft") list = list.filter((p) => p.status !== "published");
    if (filter === "recent") list = list.filter((p) => p.updatedBy !== "import");
    if (q) list = list.filter((p) => (p.slug + " " + p.title + " " + (p.subtitle || "")).toLowerCase().includes(q));
    list.sort((a, b) => (filter === "recent" ? b.updatedAt.localeCompare(a.updatedAt) : a.slug.localeCompare(b.slug)));
    res.json({ total: all.length, count: list.length, list: list.slice(0, 500) });
  });

  r.get("/page", any, (req, res) => {
    const p = pages()[String(req.query.slug || "")];
    if (!p) return res.status(404).json({ error: "Page not found" });
    res.json(p);
  });

  function validSlug(s) {
    return /^[A-Za-z0-9][\w\-.]*(\?[\w\-.=&%]+)?$/.test(s) && !/^(admin|api|static|assets|search|sitemap\.xml|robots\.txt|enquiry)$/i.test(s.split("?")[0]);
  }

  r.post("/page", any, (req, res) => {
    const b = req.body || {};
    const slug = String(b.slug || "").trim().replace(/^\//, "");
    if (!validSlug(slug)) return res.status(400).json({ error: "Invalid URL slug. Use letters, numbers, - and _ only." });
    if (pages()[slug]) return res.status(409).json({ error: "A page with this URL already exists." });
    const p = { slug, title: strip(b.title, 200) || slug, subtitle: strip(b.subtitle, 200), html: sanitize(b.html || "<p></p>"), status: b.status === "draft" ? "draft" : "published", updatedAt: new Date().toISOString(), updatedBy: req.user.username };
    pages()[slug] = p;
    store.save("pages");
    log(req.user, "created page", slug);
    res.status(201).json(p);
  });

  r.put("/page", any, (req, res) => {
    const slug = String(req.query.slug || "");
    const all = pages();
    const p = all[slug];
    if (!p) return res.status(404).json({ error: "Page not found" });
    const b = req.body || {};
    let newSlug = b.slug != null ? String(b.slug).trim().replace(/^\//, "") : slug;
    if (newSlug !== slug) {
      if (!validSlug(newSlug)) return res.status(400).json({ error: "Invalid URL slug." });
      if (all[newSlug]) return res.status(409).json({ error: "Another page already uses this URL." });
    }
    const updated = {
      ...p,
      slug: newSlug,
      title: b.title != null ? strip(b.title, 200) : p.title,
      subtitle: b.subtitle != null ? strip(b.subtitle, 200) : p.subtitle,
      html: b.html != null ? sanitize(b.html) : p.html,
      status: b.status ? (b.status === "draft" ? "draft" : "published") : p.status,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.username,
    };
    if (newSlug !== slug) delete all[slug];
    all[newSlug] = updated;
    store.save("pages");
    log(req.user, "edited page", newSlug);
    res.json(updated);
  });

  r.delete("/page", admin, (req, res) => {
    const slug = String(req.query.slug || "");
    if (!pages()[slug]) return res.status(404).json({ error: "Page not found" });
    delete pages()[slug];
    store.save("pages");
    log(req.user, "deleted page", slug);
    res.json({ ok: true });
  });

  /* ---------- media ---------- */
  const ALLOWED = /\.(jpe?g|png|gif|webp|svg|pdf|docx?|xlsx?|pptx?|mp4|webm|txt|csv|zip)$/i;
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const d = new Date();
        const dir = path.join(UPLOAD_DIR, String(d.getFullYear()), String(d.getMonth() + 1).padStart(2, "0"));
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, path.extname(file.originalname)).replace(/[^\w\-]+/g, "-").replace(/-+/g, "-").slice(0, 60) || "file";
        cb(null, `${base}-${Date.now().toString(36)}${ext}`);
      },
    }),
    limits: { fileSize: 50 * 1024 * 1024, files: 20 },
    fileFilter: (req, file, cb) => (ALLOWED.test(file.originalname) ? cb(null, true) : cb(new Error("File type not allowed"))),
  });

  function walkFiles(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      const st = fs.statSync(p);
      if (st.isDirectory()) walkFiles(p, out);
      else out.push({ url: "/assets/" + path.relative(ASSET_DIR, p).split(path.sep).map(encodeURIComponent).join("/"), name: f, size: st.size, at: st.mtime.toISOString() });
    }
    return out;
  }

  r.get("/media", any, (req, res) => res.json(walkFiles(UPLOAD_DIR).sort((a, b) => b.at.localeCompare(a.at))));

  r.post("/media", any, (req, res) => {
    upload.array("files")(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      const files = (req.files || []).map((f) => ({ url: "/assets/" + path.relative(ASSET_DIR, f.path).split(path.sep).map(encodeURIComponent).join("/"), name: f.filename, size: f.size }));
      log(req.user, "uploaded", files.map((f) => f.name).join(", "));
      res.status(201).json(files);
    });
  });

  r.delete("/media", any, (req, res) => {
    const url = String(req.query.url || "");
    if (!url.startsWith("/assets/uploads/")) return res.status(400).json({ error: "Only uploaded files can be deleted" });
    const abs = path.join(ASSET_DIR, decodeURIComponent(url.slice("/assets/".length)));
    if (!abs.startsWith(UPLOAD_DIR + path.sep) || !fs.existsSync(abs)) return res.status(404).json({ error: "Not found" });
    fs.unlinkSync(abs);
    log(req.user, "deleted file", url);
    res.json({ ok: true });
  });

  /* ---------- messages ---------- */
  r.get("/messages", any, (req, res) => res.json(messages().list));
  r.patch("/messages/:id", any, (req, res) => {
    const m = messages().list.find((x) => x.id === req.params.id);
    if (!m) return res.status(404).json({ error: "Not found" });
    m.read = !!(req.body || {}).read;
    store.save("messages", { backup: false });
    res.json(m);
  });
  r.delete("/messages/:id", any, (req, res) => {
    const l = messages().list;
    const i = l.findIndex((x) => x.id === req.params.id);
    if (i < 0) return res.status(404).json({ error: "Not found" });
    l.splice(i, 1);
    store.save("messages", { backup: false });
    log(req.user, "deleted message", req.params.id);
    res.json({ ok: true });
  });

  /* ---------- users ---------- */
  r.get("/users", admin, (req, res) => res.json(auth.users().list.map((u) => ({ ...auth.publicUser(u), lastLogin: u.lastLogin, createdAt: u.createdAt }))));
  r.post("/users", admin, async (req, res) => {
    const { username, name, role, password } = req.body || {};
    if (!/^[a-z0-9_.-]{3,30}$/i.test(username || "")) return res.status(400).json({ error: "Username: 3-30 letters, numbers, . _ -" });
    if (auth.findUser(username)) return res.status(409).json({ error: "Username already exists" });
    const err = auth.weak(password);
    if (err) return res.status(400).json({ error: err });
    auth.users().list.push({ username, name: strip(name, 80) || username, role: role === "admin" ? "admin" : "editor", hash: await auth.bcrypt.hash(password, 10), mustChange: true, createdAt: new Date().toISOString() });
    store.save("users");
    log(req.user, "created user", username);
    res.status(201).json({ ok: true });
  });
  r.put("/users/:username", admin, async (req, res) => {
    const u = auth.findUser(req.params.username);
    if (!u) return res.status(404).json({ error: "Not found" });
    const { name, role, password } = req.body || {};
    if (name != null) u.name = strip(name, 80);
    if (role) {
      const admins = auth.users().list.filter((x) => x.role === "admin");
      if (u.role === "admin" && role !== "admin" && admins.length === 1) return res.status(400).json({ error: "At least one administrator is required" });
      u.role = role === "admin" ? "admin" : "editor";
    }
    if (password) {
      const err = auth.weak(password);
      if (err) return res.status(400).json({ error: err });
      u.hash = await auth.bcrypt.hash(password, 10);
      u.mustChange = true;
      auth.revokeUser(u.username);
    }
    store.save("users");
    log(req.user, "updated user", u.username);
    res.json({ ok: true });
  });
  r.delete("/users/:username", admin, (req, res) => {
    const list = auth.users().list;
    const i = list.findIndex((x) => x.username === req.params.username);
    if (i < 0) return res.status(404).json({ error: "Not found" });
    if (list[i].username === req.user.username) return res.status(400).json({ error: "You cannot delete yourself" });
    if (list[i].role === "admin" && list.filter((x) => x.role === "admin").length === 1) return res.status(400).json({ error: "At least one administrator is required" });
    auth.revokeUser(list[i].username);
    list.splice(i, 1);
    store.save("users");
    log(req.user, "deleted user", req.params.username);
    res.json({ ok: true });
  });

  /* ---------- dashboard / activity / backups ---------- */
  r.get("/stats", any, (req, res) => {
    const st = stats();
    const s = site();
    const all = Object.values(pages());
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
      days.push({ d, n: st.daily[d] || 0 });
    }
    const top = Object.entries(st.pages).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => ({ page: k, n }));
    res.json({
      visitors: st.total,
      days,
      top,
      pages: all.length,
      mainPages: all.filter((p) => !p.slug.includes("?")).length,
      notices: (s.results || []).length + (s.notifications || []).length + (s.timetables || []).length,
      events: (s.events || []).length,
      unread: messages().list.filter((m) => !m.read).length,
      messages: messages().list.length,
      activity: activity().list.slice(0, 12),
    });
  });
  r.get("/activity", any, (req, res) => res.json(activity().list));

  r.get("/backups", admin, (req, res) => res.json(store.listBackups()));
  r.post("/backups/restore", admin, (req, res) => {
    try {
      const name = store.restoreBackup(String((req.body || {}).file || ""));
      if (name === "site") onNavChange();
      log(req.user, "restored backup", req.body.file);
      res.json({ ok: true });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  r.get("/export", admin, (req, res) => {
    res.setHeader("Content-Disposition", `attachment; filename="aietm-content-${new Date().toISOString().slice(0, 10)}.json"`);
    res.json({ exportedAt: new Date().toISOString(), site: site(), pages: pages() });
  });
  r.post("/import", admin, express.json({ limit: "50mb" }), (req, res) => {
    const b = req.body || {};
    if (!b.site || typeof b.site !== "object" || !b.pages || typeof b.pages !== "object") return res.status(400).json({ error: "Invalid export file" });
    for (const p of Object.values(b.pages)) p.html = sanitize(p.html);
    store.replace("site", b.site);
    store.replace("pages", b.pages);
    onNavChange();
    log(req.user, "imported content", Object.keys(b.pages).length + " pages");
    res.json({ ok: true });
  });

  return r;
};
