/* Serve /assets/* and other files that live on the original college site.
 *
 * Order:
 *   1. a file uploaded through the admin panel (data/assets/...)
 *   2. a known-missing file → friendly page (or an image placeholder), because
 *      the college site itself returns 404 for it
 *   3. everything else → 302 to the original site, so the browser downloads it
 *      directly (the app server has no outbound internet access).
 *
 * data/missing-assets.json is produced by scripts/check-links.js.
 */
const fs = require("fs");
const path = require("path");
const { ORIGIN } = require("./html");

const MIME = {
  ".pdf": "application/pdf", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mp3": "audio/mpeg",
};

const isImage = (rel) => /\.(jpe?g|png|gif|webp|bmp|svg|ico)$/i.test(rel);

/** Encode each path segment but keep slashes. */
function encodePath(rel) {
  return String(rel)
    .split("/")
    .filter((s, i) => s !== "" || i > 0)
    .map((s) => (s === ".." || s === "." ? "" : encodeURIComponent(s)))
    .join("/");
}

const MANIFEST = path.join(__dirname, "..", "..", "data", "missing-assets.json");
function loadMissing() {
  try {
    const j = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
    return new Set((j.files || []).map((f) => f.toLowerCase()));
  } catch {
    return new Set();
  }
}
let missing = loadMissing();
let mtime = 0;
try { mtime = fs.statSync(MANIFEST).mtimeMs; } catch {}

/** Reload the manifest when scripts/check-links.js rewrites it. */
function reloadMissing() {
  try {
    const t = fs.statSync(MANIFEST).mtimeMs;
    if (t !== mtime) { mtime = t; missing = loadMissing(); }
  } catch {
    /* keep the previous set */
  }
}

function imagePlaceholder(res) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
  <rect width="640" height="420" fill="#eef3ff"/>
  <g fill="none" stroke="#9db3d6" stroke-width="3">
    <rect x="196" y="128" width="248" height="164" rx="10"/>
    <circle cx="252" cy="176" r="16"/>
    <path d="M204 268l64-64 48 44 36-28 84 48"/>
  </g>
  <text x="320" y="336" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="17" fill="#4a5a74">Image not available on the college website</text>
</svg>`;
  res.status(200);
  res.set("Content-Type", "image/svg+xml");
  res.set("Cache-Control", "public, max-age=3600");
  res.end(svg);
}

function sendMissing(req, res, rel) {
  if (isImage(rel)) return imagePlaceholder(res);
  res.status(404);
  res.render("asset-missing", {
    title: "Document not available",
    rel,
    original: ORIGIN + "/" + encodePath(rel),
    fileName: path.basename(rel),
  });
}

/**
 * @param {string} rel  path relative to the original site root, e.g. "pdf/a.pdf"
 * @param {string|null} localDir  directory holding admin uploads
 */
function serve(req, res, rel, localDir, originPrefix) {
  const clean = String(rel || "").replace(/^\/+/, "");
  if (!clean || clean.includes("\0")) return res.status(400).end();

  // 1. admin uploads / local overrides
  if (localDir) {
    const abs = path.join(localDir, clean);
    if (abs.startsWith(localDir + path.sep)) {
      try {
        if (fs.statSync(abs).isFile()) return res.sendFile(abs, { maxAge: "1d" });
      } catch {
        /* not uploaded */
      }
    }
  }

  reloadMissing();

  // 2. known to be missing on the original site
  if (missing.has(clean.toLowerCase()) || missing.has(decodeURIComponent(clean).toLowerCase())) {
    return sendMissing(req, res, decodeURIComponent(clean));
  }

  // 3. let the browser fetch it from the original site
  const qs = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
  const prefix = originPrefix === undefined ? "" : originPrefix;
  return res.redirect(302, ORIGIN + "/" + prefix + encodePath(clean) + qs);
}

/** Is this path known to be missing on the original site? */
function isKnownMissing(rel) {
  reloadMissing();
  const clean = String(rel || "").replace(/^\/+/, "").toLowerCase();
  return missing.has(clean);
}

module.exports = { serve, reloadMissing, isKnownMissing, isImage, encodePath, MIME };
