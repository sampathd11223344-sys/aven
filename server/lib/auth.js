/* Authentication: bcrypt passwords, opaque session tokens in HttpOnly cookies, login throttling, roles. */
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const store = require("./store");

const COOKIE = "aiet_sid";
const SESSION_TTL = 1000 * 60 * 60 * 8; // 8h
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "Avanthi@2026";

const sessions = new Map(); // token -> { username, expires }
const attempts = new Map(); // ip -> { n, until }

function users() {
  return store.load("users", () => ({
    list: [
      {
        username: "admin",
        name: "Administrator",
        role: "admin",
        hash: bcrypt.hashSync(DEFAULT_PASSWORD, 10),
        mustChange: !process.env.ADMIN_PASSWORD,
        createdAt: new Date().toISOString(),
      },
    ],
  }));
}

function findUser(username) {
  return users().list.find((u) => u.username.toLowerCase() === String(username || "").toLowerCase());
}

function publicUser(u) {
  return u && { username: u.username, name: u.name, role: u.role, mustChange: !!u.mustChange };
}

function parseCookies(req) {
  const out = {};
  (req.headers.cookie || "").split(";").forEach((c) => {
    const i = c.indexOf("=");
    if (i > 0) out[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1).trim());
  });
  return out;
}

function throttled(ip) {
  const a = attempts.get(ip);
  return a && a.until > Date.now();
}
function fail(ip) {
  const a = attempts.get(ip) || { n: 0, until: 0 };
  a.n++;
  if (a.n >= 5) {
    a.until = Date.now() + 1000 * 60 * Math.min(15, 2 ** (a.n - 5)); // 1,2,4,8,15 min
  }
  attempts.set(ip, a);
}

async function login(req, res) {
  const ip = req.ip;
  if (throttled(ip)) return res.status(429).json({ error: "Too many attempts. Please wait a few minutes and try again." });
  const { username, password } = req.body || {};
  const u = findUser(username);
  const ok = u && (await bcrypt.compare(String(password || ""), u.hash));
  if (!ok) {
    fail(ip);
    return res.status(401).json({ error: "Invalid username or password." });
  }
  attempts.delete(ip);
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { username: u.username, expires: Date.now() + SESSION_TTL });
  u.lastLogin = new Date().toISOString();
  store.save("users", { backup: false });
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${SESSION_TTL / 1000}${req.secure ? "; Secure" : ""}`
  );
  res.json({ user: publicUser(u) });
}

function logout(req, res) {
  const t = parseCookies(req)[COOKIE];
  if (t) sessions.delete(t);
  res.setHeader("Set-Cookie", `${COOKIE}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0`);
  res.json({ ok: true });
}

function current(req) {
  const t = parseCookies(req)[COOKIE];
  const s = t && sessions.get(t);
  if (!s) return null;
  if (s.expires < Date.now()) {
    sessions.delete(t);
    return null;
  }
  s.expires = Date.now() + SESSION_TTL; // sliding
  return findUser(s.username) || null;
}

/** Require login. Also blocks cross-site writes (CSRF) by checking Origin on mutating requests. */
function requireAuth(role) {
  return (req, res, next) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      const origin = req.headers.origin;
      if (origin) {
        const host = req.headers["x-forwarded-host"] || req.headers.host;
        try {
          if (new URL(origin).host !== host) return res.status(403).json({ error: "Cross-site request blocked" });
        } catch {
          return res.status(403).json({ error: "Bad origin" });
        }
      }
    }
    const u = current(req);
    if (!u) return res.status(401).json({ error: "Not signed in" });
    if (role === "admin" && u.role !== "admin") return res.status(403).json({ error: "Administrator role required" });
    req.user = u;
    next();
  };
}

async function changePassword(req, res) {
  const { current: cur, next: nxt } = req.body || {};
  const u = req.user;
  if (!(await bcrypt.compare(String(cur || ""), u.hash))) return res.status(400).json({ error: "Current password is incorrect." });
  const err = weak(nxt);
  if (err) return res.status(400).json({ error: err });
  u.hash = await bcrypt.hash(nxt, 10);
  u.mustChange = false;
  store.save("users");
  res.json({ ok: true });
}

function weak(p) {
  p = String(p || "");
  if (p.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return "Password must contain letters and numbers.";
  return null;
}

function revokeUser(username) {
  for (const [t, s] of sessions) if (s.username === username) sessions.delete(t);
}

module.exports = { login, logout, current, requireAuth, changePassword, users, findUser, publicUser, weak, revokeUser, bcrypt };
