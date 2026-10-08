/* Tiny JSON document store: in-memory, atomic writes, rotating backups. */
const fs = require("fs");
const path = require("path");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "..", "data");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const MAX_BACKUPS = 30;

fs.mkdirSync(BACKUP_DIR, { recursive: true });

const cache = {};
const timers = {};

function file(name) {
  return path.join(DATA_DIR, name + ".json");
}

function load(name, fallback) {
  if (cache[name]) return cache[name];
  try {
    cache[name] = JSON.parse(fs.readFileSync(file(name), "utf8"));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
    cache[name] = typeof fallback === "function" ? fallback() : fallback;
    writeNow(name);
  }
  return cache[name];
}

function writeNow(name) {
  const tmp = file(name) + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(cache[name], null, name === "pages" ? 0 : 1));
  fs.renameSync(tmp, file(name));
}

/** Persist (debounced) and keep a timestamped backup of the previous version. */
function save(name, { backup = true } = {}) {
  if (backup && fs.existsSync(file(name))) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const last = timers["bk_" + name] || 0;
    // at most one backup per document per minute
    if (Date.now() - last > 60_000) {
      fs.copyFileSync(file(name), path.join(BACKUP_DIR, `${name}-${stamp}.json`));
      timers["bk_" + name] = Date.now();
      prune(name);
    }
  }
  clearTimeout(timers[name]);
  timers[name] = setTimeout(() => writeNow(name), 50);
}

function flush() {
  for (const k of Object.keys(timers)) {
    if (k.startsWith("bk_")) continue;
    clearTimeout(timers[k]);
    if (cache[k]) writeNow(k);
  }
}

function prune(name) {
  const list = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith(name + "-"))
    .sort();
  while (list.length > MAX_BACKUPS) fs.unlinkSync(path.join(BACKUP_DIR, list.shift()));
}

function listBackups() {
  return fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse()
    .map((f) => ({ file: f, size: fs.statSync(path.join(BACKUP_DIR, f)).size }));
}

function restoreBackup(fileName) {
  if (!/^[\w.-]+\.json$/.test(fileName)) throw new Error("Invalid backup name");
  const name = fileName.replace(/-\d{4}-.*$/, "");
  if (!["site", "pages"].includes(name)) throw new Error("Unsupported backup");
  const data = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, fileName), "utf8"));
  save(name); // back up current before restoring
  cache[name] = data;
  writeNow(name);
  return name;
}

function replace(name, data) {
  save(name);
  cache[name] = data;
  writeNow(name);
}

process.on("exit", flush);
process.on("SIGINT", () => { flush(); process.exit(0); });
process.on("SIGTERM", () => { flush(); process.exit(0); });

module.exports = { load, save, flush, listBackups, restoreBackup, replace, DATA_DIR };
