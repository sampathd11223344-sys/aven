/* Check every unique content link against the live site / external hosts. */
const fs = require("fs");
const ORIGIN = "https://avanthienggcollege.ac.in";
const site = require("../data/site.json");
const pages = require("../data/pages.json");

const collect = (html, set) => { for (const m of String(html).matchAll(/href="([^"]+)"/g)) set.add(m[1].replace(/&amp;/g, "&")); };
const set = new Set();
for (const p of Object.values(pages)) collect(p.html || "", set);
collect(JSON.stringify(site), set);

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

async function check(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const r = await fetch(url, { method, redirect: "follow", headers: { "user-agent": UA, accept: "*/*" }, signal: AbortSignal.timeout(20000) });
      if (method === "HEAD" && (r.status === 405 || r.status === 403 || r.status === 501)) continue;
      return { status: r.status, type: r.headers.get("content-type") || "" };
    } catch (e) {
      if (method === "GET") return { status: 0, error: String(e.message).slice(0, 80) };
    }
  }
  return { status: 0 };
}

(async () => {
  const targets = [];
  for (const h of set) {
    if (h.startsWith("/assets/")) targets.push({ href: h, url: ORIGIN + h, kind: "asset" });
    else if (/^https?:/i.test(h)) targets.push({ href: h, url: h, kind: "external" });
    else if (h.startsWith("#") || h.startsWith("mailto:") || h.startsWith("tel:")) continue;
    else targets.push({ href: h, url: ORIGIN + "/" + h.replace(/^\//, ""), kind: "page" });
  }
  const results = [];
  let i = 0;
  const worker = async () => {
    while (i < targets.length) {
      const t = targets[i++];
      const r = await check(t.url);
      const bad = r.status === 0 || r.status >= 400 || (t.kind === "asset" && !/pdf|image|video|audio|octet|text|msword|sheet|presentation|zip/i.test(r.type) && r.status === 200 && /text\/html/.test(r.type));
      results.push({ ...t, ...r, bad });
    }
  };
  await Promise.all(Array.from({ length: 12 }, worker));
  const bads = results.filter((r) => r.bad);
  fs.writeFileSync("_linkcheck.json", JSON.stringify({ total: results.length, bad: bads.length, failures: bads }, null, 1));
  console.log("checked", results.length, "bad", bads.length);
  const by = {};
  for (const b of bads) { const k = b.kind + " " + b.status; by[k] = (by[k] || 0) + 1; }
  console.log(by);
})();
