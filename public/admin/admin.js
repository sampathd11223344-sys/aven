/* AIETM Admin Panel – vanilla JS single page app */
(function () {
  "use strict";
  const app = document.getElementById("app");
  const LOGO = app.dataset.logo;
  const NAME = app.dataset.name;
  const API = "/api/admin";

  /* ======================= utilities ======================= */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const uid = () => Math.random().toString(36).slice(2, 10);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const ago = (iso) => {
    if (!iso) return "";
    const s = (Date.now() - new Date(iso)) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + " min ago";
    if (s < 86400) return Math.floor(s / 3600) + " h ago";
    if (s < 86400 * 30) return Math.floor(s / 86400) + " d ago";
    return new Date(iso).toLocaleDateString("en-IN");
  };
  const size = (b) => (b > 1e6 ? (b / 1e6).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1e3)) + " KB");

  const IC = {
    dash: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    img: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.7-4 3-9 3s-9-1.3-9-3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/>',
    act: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    up: '<path d="m18 15-6-6-6 6"/>', down: '<path d="m6 9 6 6 6-6"/>',
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
    grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>', search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1z"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    reply: '<path d="m9 17-5-5 5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
  };
  const ic = (n, c = "") => `<svg class="ico ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[n] || ""}</svg>`;

  async function api(method, url, body, opts = {}) {
    const init = { method, headers: {}, credentials: "same-origin" };
    if (body instanceof FormData) init.body = body;
    else if (body !== undefined) { init.headers["Content-Type"] = "application/json"; init.body = JSON.stringify(body); }
    const r = await fetch(API + url, init);
    if (r.status === 401 && !opts.noAuthRedirect) { state.user = null; renderLogin(); throw new Error("Session expired – please sign in again."); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`);
    return j;
  }

  function toast(msg, type = "") {
    let box = $(".toasts");
    if (!box) { box = document.createElement("div"); box.className = "toasts"; document.body.appendChild(box); }
    const t = document.createElement("div");
    t.className = "toast " + type;
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }
  const fail = (e) => toast(e.message || String(e), "err");

  function modal({ title, body, wide, actions = [], onMount }) {
    return new Promise((resolve) => {
      const bg = document.createElement("div");
      bg.className = "modal-bg";
      bg.innerHTML = `<div class="modal ${wide ? "wide" : ""}" role="dialog" aria-modal="true"><div class="modal-h"><h3>${esc(title)}</h3><button class="btn icon" data-x aria-label="Close">${ic("x")}</button></div><div class="modal-b">${body}</div>${actions.length ? `<div class="modal-f">${actions.map((a, i) => `<button class="btn ${a.cls || ""}" data-a="${i}">${a.label}</button>`).join("")}</div>` : ""}</div>`;
      document.body.appendChild(bg);
      const close = (v) => { bg.remove(); document.removeEventListener("keydown", key); resolve(v); };
      const key = (e) => { if (e.key === "Escape") close(null); };
      document.addEventListener("keydown", key);
      bg.addEventListener("mousedown", (e) => { if (e.target === bg) close(null); });
      $("[data-x]", bg).onclick = () => close(null);
      $$("[data-a]", bg).forEach((b) => (b.onclick = async () => {
        const a = actions[+b.dataset.a];
        if (a.onClick) { const r = await a.onClick(bg); if (r === false) return; close(r === undefined ? true : r); }
        else close(a.value !== undefined ? a.value : true);
      }));
      onMount && onMount(bg, close);
      const f = $("input,textarea,select", bg);
      f && setTimeout(() => f.focus(), 30);
    });
  }
  const confirmBox = (msg, label = "Delete", cls = "danger") => modal({ title: "Please confirm", body: `<p>${msg}</p>`, actions: [{ label: "Cancel", value: false }, { label, cls: cls === "danger" ? "primary" : cls, value: true }] });

  /* ======================= state & routing ======================= */
  const state = { user: null, site: null, unread: 0, dirty: false };

  const NAV = [
    ["Overview", [["dashboard", "Dashboard", "dash"]]],
    ["Content", [["notices", "Notice board", "bell"], ["events", "Events & gallery", "cal"], ["home", "Homepage", "home"], ["pages", "Pages", "file"], ["menu", "Menus", "menu"], ["media", "Media library", "img"]]],
    ["Engagement", [["messages", "Enquiries", "mail"]]],
    ["System", [["settings", "Site settings", "cog"], ["users", "Users", "users", "admin"], ["backups", "Backups", "db", "admin"], ["activity", "Activity log", "act"]]],
  ];

  function route() {
    const h = location.hash.replace(/^#\/?/, "") || "dashboard";
    const [p, qs] = h.split("?");
    return { parts: p.split("/"), q: new URLSearchParams(qs || "") };
  }
  addEventListener("hashchange", () => {
    if (state.dirty && !confirm("You have unsaved changes. Leave this screen?")) { history.back(); return; }
    state.dirty = false;
    render();
  });
  addEventListener("beforeunload", (e) => { if (state.dirty) { e.preventDefault(); e.returnValue = ""; } });

  async function boot() {
    try {
      const me = await api("GET", "/me", undefined, { noAuthRedirect: true });
      state.user = me.user;
      await loadSite();
      render();
    } catch {
      renderLogin();
    }
  }
  async function loadSite() { state.site = await api("GET", "/site"); }

  /* ======================= login ======================= */
  function renderLogin() {
    app.innerHTML = `<div class="login-wrap"><form class="login-card form" id="loginForm">
      <img src="${esc(LOGO)}" alt="">
      <h1>Admin Panel</h1><p class="sub">${esc(NAME)}</p>
      <div class="field"><label>Username</label><input type="text" name="username" autocomplete="username" required></div>
      <div class="field"><label>Password</label><input type="password" name="password" autocomplete="current-password" required></div>
      <p class="err-msg" id="loginErr"></p>
      <button class="btn primary">Sign in</button>
      <a class="back" href="/">← Back to website</a>
    </form></div>`;
    $("#loginForm").onsubmit = async (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target));
      try {
        const r = await api("POST", "/login", fd, { noAuthRedirect: true });
        state.user = r.user;
        await loadSite();
        render();
      } catch (err) { $("#loginErr").textContent = err.message; }
    };
  }

  /* ======================= shell ======================= */
  function shell(title, html, actions = "") {
    const cur = route().parts[0];
    const isAdmin = state.user.role === "admin";
    app.innerHTML = `<div class="shell">
      <aside class="side">
        <div class="side-brand"><img src="${esc(LOGO)}" alt=""><span>Admin</span></div>
        ${NAV.map(([g, items]) => `<h6>${g}</h6>${items.filter((i) => !i[3] || isAdmin).map(([k, l, i]) => `<a href="#/${k}" class="${cur === k ? "active" : ""}">${ic(i)} ${l}${k === "messages" && state.unread ? `<span class="badge red">${state.unread}</span>` : ""}</a>`).join("")}`).join("")}
        <div class="side-foot">
          <a href="#/account">${ic("key")} My account</a>
          <a href="/" target="_blank">${ic("ext")} View website</a>
          <a href="#" id="logout">${ic("out")} Sign out</a>
        </div>
      </aside>
      <div class="main">
        <div class="topbar">
          <button class="btn icon menu-btn" id="menuBtn" aria-label="Menu">${ic("menu")}</button>
          <h2>${esc(title)}</h2><div class="sp"></div>${actions}
          <span class="user-chip hide-m"><i>${esc(state.user.username[0].toUpperCase())}</i>${esc(state.user.name || state.user.username)} <span class="badge gray">${state.user.role}</span></span>
        </div>
        <div class="view">${state.user.mustChange && cur !== "account" ? `<div class="banner">⚠️ You are using the default password. Please change it now to secure the website.<a class="btn accent sm" href="#/account">Change password</a></div>` : ""}${html}</div>
      </div>
    </div>`;
    $("#logout").onclick = async (e) => { e.preventDefault(); await api("POST", "/logout").catch(() => {}); state.user = null; renderLogin(); };
    $("#menuBtn").onclick = () => document.body.classList.toggle("side-open");
    $$(".side a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("side-open")));
    return $(".view");
  }

  function render() {
    if (!state.user) return renderLogin();
    const r = route();
    const views = { dashboard: vDashboard, notices: vNotices, events: vEvents, home: vHome, pages: vPages, menu: vMenu, media: vMedia, messages: vMessages, settings: vSettings, users: vUsers, backups: vBackups, activity: vActivity, account: vAccount };
    (views[r.parts[0]] || vDashboard)(r);
  }

  /* ======================= field widgets ======================= */
  // field: { key, label, type: text|textarea|url|image|file|select|bool|icon, options, hint, list, required }
  function fieldHtml(f, v) {
    const val = v == null ? "" : v;
    const id = "f_" + f.key;
    if (f.type === "bool") return `<div class="field"><label class="check"><input type="checkbox" name="${f.key}" ${val ? "checked" : ""}> ${esc(f.label)}</label>${f.hint ? `<p class="hint">${esc(f.hint)}</p>` : ""}</div>`;
    let input;
    if (f.type === "textarea") input = `<textarea id="${id}" name="${f.key}" ${f.required ? "required" : ""} rows="${f.rows || 3}">${esc(val)}</textarea>`;
    else if (f.type === "select") input = `<select id="${id}" name="${f.key}">${f.options.map((o) => `<option ${o === val ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    else if (f.type === "url" || f.type === "image" || f.type === "file") {
      input = `<div class="with-btn"><input type="text" id="${id}" name="${f.key}" value="${esc(val)}" ${f.required ? "required" : ""} placeholder="${f.type === "url" ? "/page-slug, /assets/… or https://…" : "/assets/…"}">
        ${f.type === "url" ? `<button type="button" class="btn" data-pick-page="${f.key}" title="Choose a page">${ic("file")}</button>` : ""}
        <button type="button" class="btn" data-pick-media="${f.key}" title="Choose / upload file">${ic("upload")}</button></div>
        ${f.type === "image" ? `<img class="img-prev" data-prev="${f.key}" src="${esc(val)}" alt="" ${val ? "" : "hidden"}>` : ""}`;
    } else input = `<input type="text" id="${id}" name="${f.key}" value="${esc(val)}" ${f.required ? "required" : ""}>`;
    return `<div class="field ${f.full ? "full" : ""}"><label for="${id}">${esc(f.label)}</label>${input}${f.hint ? `<p class="hint">${esc(f.hint)}</p>` : ""}</div>`;
  }
  function wireFields(root) {
    $$("[data-pick-media]", root).forEach((b) => (b.onclick = async () => {
      const url = await mediaPicker();
      if (!url) return;
      const inp = $(`[name="${b.dataset.pickMedia}"]`, root);
      inp.value = url;
      inp.dispatchEvent(new Event("input", { bubbles: true }));
    }));
    $$("[data-pick-page]", root).forEach((b) => (b.onclick = async () => {
      const url = await pagePicker();
      if (!url) return;
      const inp = $(`[name="${b.dataset.pickPage}"]`, root);
      inp.value = url;
      inp.dispatchEvent(new Event("input", { bubbles: true }));
    }));
    $$("[data-prev]", root).forEach((img) => {
      const inp = $(`[name="${img.dataset.prev}"]`, root);
      inp.addEventListener("input", () => { img.src = inp.value; img.hidden = !inp.value; });
    });
  }
  function readFields(root, fields) {
    const o = {};
    for (const f of fields) {
      const el = $(`[name="${f.key}"]`, root);
      if (!el) continue;
      o[f.key] = f.type === "bool" ? el.checked : el.value.trim();
    }
    return o;
  }
  function itemForm(title, fields, item) {
    return modal({
      title,
      body: `<form class="form" onsubmit="return false">${fields.map((f) => fieldHtml(f, item[f.key])).join("")}<p class="err-msg"></p></form>`,
      actions: [{ label: "Cancel", value: null }, {
        label: "Save", cls: "primary", onClick: (bg) => {
          const v = readFields(bg, fields);
          const miss = fields.find((f) => f.required && !v[f.key]);
          if (miss) { $(".err-msg", bg).textContent = `${miss.label} is required.`; return false; }
          return { ...item, ...v };
        },
      }],
      onMount: (bg) => wireFields(bg),
    });
  }

  /* ======================= generic list editor ======================= */
  function listEditor(container, { section, fields, title, addLabel = "Add item", note, preview }) {
    let items = clone(state.site[section] || []);
    let q = "";
    const listFields = fields.filter((f) => f.list);
    const save = async (msg = "Saved") => {
      try {
        const r = await api("PUT", "/site/" + section, items);
        state.site[section] = r.data;
        items = clone(r.data);
        toast(msg, "ok");
        draw();
      } catch (e) { fail(e); }
    };
    const cell = (f, it) => {
      const v = it[f.key];
      if (f.type === "image") return `<td style="width:80px"><img class="thumb" src="${esc(v)}" alt="" loading="lazy"></td>`;
      if (f.type === "bool") return `<td>${v ? `<span class="badge ok">Yes</span>` : `<span class="badge gray">No</span>`}</td>`;
      if (f.type === "url" || f.type === "file") return `<td><a class="t-link" href="${esc(v)}" target="_blank" title="${esc(v)}">${esc(v)}</a></td>`;
      if (f.main) return `<td><div class="t-title">${esc(v)}</div></td>`;
      return `<td>${esc(v)}</td>`;
    };
    function draw() {
      const filtered = items.map((it, i) => [it, i]).filter(([it]) => !q || JSON.stringify(it).toLowerCase().includes(q));
      container.innerHTML = `<div class="card">
        <div class="card-h"><h3>${esc(title)} <span class="badge gray">${items.length}</span></h3><div class="sp"></div>
          <label class="search">${ic("search")}<input type="search" placeholder="Filter…" value="${esc(q)}" data-q></label>
          ${preview ? `<a class="btn" href="${preview}" target="_blank">${ic("eye")} Preview</a>` : ""}
          <button class="btn primary" data-add>${ic("plus")} ${esc(addLabel)}</button></div>
        ${note ? `<div class="card-b muted" style="padding-bottom:0">${note}</div>` : ""}
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th style="width:30px"></th>${listFields.map((f) => `<th>${esc(f.label)}</th>`).join("")}<th></th></tr></thead><tbody>
        ${filtered.map(([it, i]) => `<tr draggable="${q ? "false" : "true"}" data-i="${i}"><td><span class="drag" title="Drag to reorder">${ic("grip")}</span></td>${listFields.map((f) => cell(f, it)).join("")}
          <td class="acts"><button class="btn sm icon" data-up="${i}" title="Move up" ${i === 0 ? "disabled" : ""}>${ic("up")}</button><button class="btn sm icon" data-down="${i}" title="Move down" ${i === items.length - 1 ? "disabled" : ""}>${ic("down")}</button><button class="btn sm" data-edit="${i}">${ic("edit")} Edit</button><button class="btn sm icon danger" data-del="${i}" title="Delete">${ic("trash")}</button></td></tr>`).join("")}
        </tbody></table>${filtered.length ? "" : `<div class="empty">No items${q ? " match your filter" : " yet"}.</div>`}</div></div>`;
      const qi = $("[data-q]", container);
      qi.oninput = () => { q = qi.value.toLowerCase(); const pos = qi.selectionStart; draw(); const n = $("[data-q]", container); n.focus(); n.setSelectionRange(pos, pos); };
      $("[data-add]", container).onclick = async () => {
        const blank = Object.fromEntries(fields.map((f) => [f.key, f.default ?? (f.type === "bool" ? false : "")]));
        const v = await itemForm(addLabel, fields, blank);
        if (!v) return;
        items.unshift({ id: uid(), ...v });
        save("Item added");
      };
      $$("[data-edit]", container).forEach((b) => (b.onclick = async () => {
        const i = +b.dataset.edit;
        const v = await itemForm("Edit item", fields, items[i]);
        if (!v) return;
        items[i] = v;
        save();
      }));
      $$("[data-del]", container).forEach((b) => (b.onclick = async () => {
        const i = +b.dataset.del;
        const label = items[i][fields.find((f) => f.main)?.key || fields[0].key] || "this item";
        if (!(await confirmBox(`Delete “${esc(String(label).slice(0, 120))}”?`))) return;
        items.splice(i, 1);
        save("Deleted");
      }));
      const move = (i, d) => { const [x] = items.splice(i, 1); items.splice(i + d, 0, x); save("Order updated"); };
      $$("[data-up]", container).forEach((b) => (b.onclick = () => move(+b.dataset.up, -1)));
      $$("[data-down]", container).forEach((b) => (b.onclick = () => move(+b.dataset.down, 1)));
      // drag & drop reorder
      let from = null;
      $$("tr[draggable=true]", container).forEach((tr) => {
        tr.addEventListener("dragstart", (e) => { from = +tr.dataset.i; tr.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; });
        tr.addEventListener("dragend", () => tr.classList.remove("dragging"));
        tr.addEventListener("dragover", (e) => { e.preventDefault(); $$(".drop-above", container).forEach((x) => x.classList.remove("drop-above")); tr.classList.add("drop-above"); });
        tr.addEventListener("drop", (e) => {
          e.preventDefault();
          const to = +tr.dataset.i;
          if (from == null || from === to) return;
          const [x] = items.splice(from, 1);
          items.splice(from < to ? to - 1 : to, 0, x);
          save("Order updated");
        });
      });
    }
    draw();
  }

  /* ======================= pickers ======================= */
  async function mediaPicker() {
    let files = await api("GET", "/media").catch(() => []);
    return modal({
      title: "Media library",
      wide: true,
      body: `<div class="dropzone" data-dz>${ic("upload")}<p><b>Drop files here</b> or <label class="btn sm" style="display:inline-flex">browse<input type="file" multiple hidden data-file></label></p><p class="hint">Images, PDF, Office documents, MP4 · max 50 MB each</p></div>
        <div class="field"><label>…or paste a URL</label><div class="with-btn"><input type="text" class="inp" placeholder="https://… or /assets/…" data-url><button class="btn primary" data-use-url>Use URL</button></div></div>
        <div class="media-grid" data-grid style="margin-top:14px"></div>`,
      onMount: (bg, close) => {
        const grid = $("[data-grid]", bg);
        const draw = () => {
          grid.innerHTML = files.length ? files.map((f) => `<div class="media-item pick" data-url="${esc(f.url)}">${thumb(f)}<div class="mbody"><b title="${esc(f.name)}">${esc(f.name)}</b>${size(f.size)}</div></div>`).join("") : `<p class="muted">No uploaded files yet.</p>`;
          $$(".media-item", grid).forEach((m) => (m.onclick = () => close(m.dataset.url)));
        };
        draw();
        $("[data-use-url]", bg).onclick = () => { const v = $("[data-url]", bg).value.trim(); if (v) close(v); };
        uploader($("[data-dz]", bg), $("[data-file]", bg), (up) => { files = up.concat(files); draw(); if (up.length === 1) close(up[0].url); });
      },
    });
  }
  function thumb(f) {
    return /\.(jpe?g|png|gif|webp|svg)$/i.test(f.name) ? `<div class="mthumb"><img src="${esc(f.url)}" alt="" loading="lazy"></div>` : `<div class="mthumb">${esc((f.name.split(".").pop() || "").toUpperCase())}</div>`;
  }
  function uploader(zone, input, done) {
    const send = async (fileList) => {
      if (!fileList.length) return;
      const fd = new FormData();
      [...fileList].forEach((f) => fd.append("files", f));
      zone.classList.add("over");
      try {
        const up = await api("POST", "/media", fd);
        toast(`${up.length} file(s) uploaded`, "ok");
        done(up);
      } catch (e) { fail(e); } finally { zone.classList.remove("over"); }
    };
    input.onchange = () => send(input.files);
    zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("over"));
    zone.addEventListener("drop", (e) => { e.preventDefault(); zone.classList.remove("over"); send(e.dataTransfer.files); });
  }
  async function pagePicker() {
    return modal({
      title: "Link to a page",
      wide: true,
      body: `<label class="search" style="margin-bottom:12px">${ic("search")}<input type="search" placeholder="Search pages by title or URL…" data-pq></label><div data-pl style="max-height:55vh;overflow:auto"></div>`,
      onMount: (bg, close) => {
        const list = $("[data-pl]", bg);
        let t;
        const load = async () => {
          const q = $("[data-pq]", bg).value;
          const r = await api("GET", `/pages?filter=all&q=${encodeURIComponent(q)}`);
          list.innerHTML = `<table class="tbl"><tbody>${r.list.slice(0, 150).map((p) => `<tr style="cursor:pointer" data-s="${esc(p.slug)}"><td><b>${esc(p.title)}</b>${p.subtitle ? ` <span class="muted">· ${esc(p.subtitle)}</span>` : ""}<span class="t-link">/${esc(p.slug)}</span></td></tr>`).join("")}</tbody></table>`;
          $$("tr", list).forEach((tr) => (tr.onclick = () => close("/" + tr.dataset.s)));
        };
        $("[data-pq]", bg).oninput = () => { clearTimeout(t); t = setTimeout(load, 200); };
        load();
      },
    });
  }

  /* ======================= views ======================= */
  async function vDashboard() {
    const v = shell("Dashboard", `<div class="empty">Loading…</div>`);
    try {
      const s = await api("GET", "/stats");
      state.unread = s.unread;
      const max = Math.max(1, ...s.days.map((d) => d.n));
      const v2 = shell("Dashboard", `
        <div class="grid g4">
          <div class="card stat"><small>Total visitors</small><b>${s.visitors.toLocaleString("en-IN")}</b><span class="muted">unique sessions</span></div>
          <div class="card stat"><small>Pages</small><b>${s.mainPages}</b><span class="muted">+ ${s.pages - s.mainPages} committee sub-pages</span> · <a href="#/pages">Manage</a></div>
          <div class="card stat"><small>Notices</small><b>${s.notices}</b><a href="#/notices">Notice board →</a></div>
          <div class="card stat"><small>Enquiries</small><b>${s.messages}</b>${s.unread ? `<span class="badge red">${s.unread} unread</span> ` : ""}<a href="#/messages">Inbox →</a></div>
        </div>
        <div class="grid g32" style="margin-top:18px">
          <div class="card"><div class="card-h"><h3>Visitors – last 14 days</h3></div><div class="card-b"><div class="bars">${s.days.map((d) => `<div title="${d.d}: ${d.n}"><span style="height:${(d.n / max) * 100}%"></span><small>${d.d.slice(8)}</small></div>`).join("")}</div></div></div>
          <div class="card"><div class="card-h"><h3>Quick actions</h3></div><div class="card-b quick-acts">
            <a href="#/notices/results">${ic("plus")} Exam result</a><a href="#/notices/notifications">${ic("plus")} Notification</a>
            <a href="#/events">${ic("plus")} Event</a><a href="#/pages/new">${ic("plus")} New page</a>
            <a href="#/media">${ic("upload")} Upload file</a><a href="#/home">${ic("home")} Homepage</a>
          </div></div>
        </div>
        <div class="grid g2" style="margin-top:18px">
          <div class="card"><div class="card-h"><h3>Most viewed pages</h3></div><div class="card-b"><ul class="list-plain">${s.top.length ? s.top.map((t) => `<li><a href="/${t.page === "/" ? "" : esc(t.page)}" target="_blank">${esc(t.page === "/" ? "Homepage" : t.page)}</a><span class="when">${t.n} views</span></li>`).join("") : `<li class="muted">No visits recorded yet.</li>`}</ul></div></div>
          <div class="card"><div class="card-h"><h3>Recent activity</h3><div class="sp"></div><a href="#/activity" class="btn sm">View all</a></div><div class="card-b"><ul class="list-plain">${s.activity.length ? s.activity.map((a) => `<li><b>${esc(a.user)}</b> ${esc(a.action)} <span class="muted">${esc(a.target)}</span><span class="when">${ago(a.at)}</span></li>`).join("") : `<li class="muted">No changes yet.</li>`}</ul></div></div>
        </div>`, `<a class="btn" href="/" target="_blank">${ic("ext")} Open website</a>`);
    } catch (e) { fail(e); }
  }

  const NOTICE_SECTIONS = {
    results: { title: "Exam Results", fields: [{ key: "year", label: "Year", list: true }, { key: "title", label: "Title", type: "textarea", required: true, list: true, main: true }, { key: "href", label: "Link (result page or PDF)", type: "url", required: true, list: true, default: "https://exams.jntugv.edu.in/results" }] },
    notifications: { title: "Academic Notifications", fields: [{ key: "year", label: "Academic year", list: true, hint: "e.g. 2026 - 2027" }, { key: "title", label: "Title", type: "textarea", required: true, list: true, main: true }, { key: "href", label: "Link / PDF", type: "url", required: true, list: true }] },
    timetables: { title: "Exam TimeTables", fields: [{ key: "title", label: "Title", type: "textarea", required: true, list: true, main: true }, { key: "href", label: "PDF / link", type: "url", required: true, list: true }] },
  };
  function vNotices(r) {
    const sec = NOTICE_SECTIONS[r.parts[1]] ? r.parts[1] : "results";
    const v = shell("Notice board", `<div class="tabs">${Object.entries(NOTICE_SECTIONS).map(([k, s]) => `<a href="#/notices/${k}" class="${k === sec ? "on" : ""}">${s.title} <span class="badge gray">${(state.site[k] || []).length}</span></a>`).join("")}</div><div id="le"></div>`);
    listEditor($("#le", v), { section: sec, ...NOTICE_SECTIONS[sec], addLabel: "Add " + NOTICE_SECTIONS[sec].title.replace(/s$/, "").toLowerCase(), note: "New items are added at the top. Drag rows or use the arrows to reorder. Upload PDFs with the upload button in the link field.", preview: "/#notices" });
  }

  function vEvents(r) {
    const tab = r.parts[1] === "cultural" ? "cultural" : "events";
    const v = shell("Events & gallery", `<div class="tabs"><a href="#/events" class="${tab === "events" ? "on" : ""}">Latest events</a><a href="#/events/cultural" class="${tab === "cultural" ? "on" : ""}">Cultural programs carousel</a></div><div id="le"></div>`);
    if (tab === "events") {
      listEditor($("#le", v), {
        section: "events", title: "Latest events", addLabel: "Add event", preview: "/#eventsGrid",
        note: `Tip: create a page for the event album in <a href="#/pages/new">Pages → New page</a>, then link it here.`,
        fields: [{ key: "image", label: "Cover image", type: "image", required: true, list: true }, { key: "title", label: "Title", required: true, list: true, main: true }, { key: "href", label: "Event page / link", type: "url", required: true, list: true }],
      });
    } else {
      listEditor($("#le", v), { section: "cultural", title: "Cultural programs", addLabel: "Add slide", preview: "/#cultTrack", fields: [{ key: "image", label: "Image", type: "image", required: true, list: true }, { key: "title", label: "Caption", required: true, list: true, main: true }] });
    }
  }

  const HOME_TABS = {
    hero: ["Hero slider", { section: "hero", title: "Hero slides", addLabel: "Add slide", fields: [{ key: "image", label: "Image", type: "image", required: true, list: true }, { key: "caption", label: "Caption (alt text)", list: true }] }],
    texts: ["Headline & texts"],
    popups: ["Popup", { section: "popups", title: "Popup announcement slides", addLabel: "Add popup image", note: "Shown once per visit on the homepage. Enable/disable under “Headline & texts”.", fields: [{ key: "image", label: "Image", type: "image", required: true, list: true }, { key: "link", label: "Click-through link (optional)", type: "url", list: true }] }],
    videos: ["Floating video", { section: "videos", title: "Floating promo videos", addLabel: "Add video", fields: [{ key: "src", label: "MP4 video", type: "file", required: true, list: true }] }],
    quick: ["Quick links", { section: "quick", title: "Quick link buttons", addLabel: "Add quick link", fields: [{ key: "label", label: "Label", required: true, list: true, main: true }, { key: "href", label: "Link", type: "url", required: true, list: true }, { key: "icon", label: "Icon", type: "select", options: ["users", "play", "login", "card", "chat", "file", "phone", "mail", "arrow"], list: true }, { key: "hot", label: "Highlight with NEW badge", type: "bool", list: true }] }],
    award: ["Award photos", { section: "awardImages", title: "Award gallery images", addLabel: "Add image", fields: [{ key: "image", label: "Image", type: "image", required: true, list: true }] }],
    mission: ["Mission", { section: "mission", title: "Mission points", addLabel: "Add point", fields: [{ key: "text", label: "Text", type: "textarea", required: true, list: true, main: true }] }],
    objectives: ["Objectives", { section: "objectives", title: "Objectives", addLabel: "Add objective", fields: [{ key: "text", label: "Text", type: "textarea", required: true, list: true, main: true }] }],
    features: ["Salient features", { section: "features", title: "Salient features", addLabel: "Add feature", fields: [{ key: "text", label: "Feature", required: true, list: true, main: true }] }],
    courses: ["Courses", { section: "courses", title: "Courses offered (homepage cards)", addLabel: "Add course", fields: [{ key: "group", label: "Group", list: true, default: "Regular - B.Tech, M.Tech & P.G." }, { key: "program", label: "Programme", required: true, list: true, main: true }, { key: "branches", label: "Branches (comma separated)", required: true, list: true }] }],
    info: ["College info links", { section: "info", title: "College informations", addLabel: "Add link", fields: [{ key: "label", label: "Label", required: true, list: true, main: true }, { key: "href", label: "Link", type: "url", required: true, list: true }] }],
  };
  function vHome(r) {
    const tab = HOME_TABS[r.parts[1]] ? r.parts[1] : "hero";
    const v = shell("Homepage", `<div class="tabs">${Object.entries(HOME_TABS).map(([k, [l]]) => `<a href="#/home/${k}" class="${k === tab ? "on" : ""}">${l}</a>`).join("")}</div><div id="le"></div>`, `<a class="btn" href="/" target="_blank">${ic("eye")} Preview homepage</a>`);
    if (tab === "texts") return settingsForm($("#le", v), [
      ["Hero", [{ key: "heroTitle", label: "Hero headline", full: true }, { key: "heroText", label: "Hero text", type: "textarea", full: true }]],
      ["Recognition block", [{ key: "awardTitle", label: "Title", full: true }, { key: "awardText", label: "Text", type: "textarea", rows: 4, full: true }]],
      ["Vision", [{ key: "vision", label: "Vision statement", type: "textarea", full: true }]],
      ["Widgets", [{ key: "popupEnabled", label: "Show popup announcement on homepage", type: "bool" }, { key: "videoEnabled", label: "Show floating promo video", type: "bool" }]],
    ]);
    listEditor($("#le", v), { ...HOME_TABS[tab][1], preview: "/" });
  }

  function settingsForm(container, groups) {
    const S = state.site.settings || {};
    const all = groups.flatMap((g) => g[1]);
    container.innerHTML = `<form class="form" id="sf">${groups.map(([t, fs]) => `<fieldset class="fieldset card"><legend>${esc(t)}</legend><div class="form-grid">${fs.map((f) => fieldHtml(f, S[f.key])).join("")}</div></fieldset>`).join("")}
      <div class="form-actions"><span class="unsaved" hidden>Unsaved changes</span><button class="btn primary">${ic("save")} Save changes</button></div></form>`;
    const form = $("#sf", container);
    wireFields(form);
    form.addEventListener("input", () => { state.dirty = true; $(".unsaved", form).hidden = false; });
    form.onsubmit = async (e) => {
      e.preventDefault();
      try {
        const r = await api("PUT", "/site/settings", readFields(form, all));
        state.site.settings = r.data;
        state.dirty = false;
        $(".unsaved", form).hidden = true;
        toast("Settings saved", "ok");
      } catch (err) { fail(err); }
    };
  }

  function vSettings(r) {
    const tab = r.parts[1] || "general";
    const tabs = { general: "General", contact: "Contact", footer: "Footer & institutions", seo: "SEO" };
    const v = shell("Site settings", `<div class="tabs">${Object.entries(tabs).map(([k, l]) => `<a href="#/settings/${k}" class="${k === tab ? "on" : ""}">${l}</a>`).join("")}</div><div id="sv"></div>`);
    const c = $("#sv", v);
    if (tab === "general") settingsForm(c, [
      ["Identity", [{ key: "name", label: "College name", full: true }, { key: "shortName", label: "Short name" }, { key: "tagline", label: "Tagline" }, { key: "logo", label: "Logo", type: "image" }, { key: "naacLogo", label: "NAAC badge image", type: "image" }, { key: "naacLink", label: "NAAC badge link", type: "url" }]],
      ["Header buttons", [{ key: "applyLink", label: "“Apply Now” link", type: "url" }, { key: "brochureLink", label: "Admissions brochure", type: "url" }]],
    ]);
    if (tab === "contact") settingsForm(c, [
      ["Contact details", [{ key: "address", label: "Campus address (footer)", type: "textarea", full: true }, { key: "contactAddress", label: "Address on Contact page", type: "textarea", full: true }, { key: "admissionPhone", label: "Admission phone" }, { key: "otherPhone", label: "Other enquiries phone" }, { key: "email", label: "E-mail" }, { key: "fax", label: "Fax" }, { key: "hours", label: "Office hours" }, { key: "hoursClosed", label: "Closed days" }, { key: "mapEmbed", label: "Google Maps embed URL", type: "url", full: true, hint: "Google Maps → Share → Embed a map → copy the src URL" }]],
    ]);
    if (tab === "seo") settingsForm(c, [["Search engines", [{ key: "seoTitle", label: "Homepage title", full: true }, { key: "seoDescription", label: "Meta description", type: "textarea", full: true }]]]);
    if (tab === "footer") {
      c.innerHTML = `<div id="f1"></div><div style="height:18px"></div><div id="f2"></div>`;
      settingsForm($("#f1", c), [["Footer", [{ key: "footerCredit", label: "Copyright line", full: true }]]]);
      listEditor($("#f2", c), { section: "institutions", title: "Our Institutions (footer)", addLabel: "Add institution", fields: [{ key: "name", label: "Name", required: true, list: true, main: true }, { key: "code", label: "Code", list: true }, { key: "href", label: "Link (optional)", type: "url", list: true }] });
    }
  }

  /* ---------- pages ---------- */
  async function vPages(r) {
    if (r.parts[1] === "edit" || r.parts[1] === "new") return vPageEdit(r);
    const filter = r.q.get("f") || "main";
    const v = shell("Pages", `<div class="toolbar">
        <div class="seg">${[["main", "Main pages"], ["sub", "Committee sub-pages"], ["recent", "Recently edited"], ["draft", "Drafts"], ["all", "All"]].map(([k, l]) => `<button data-f="${k}" class="${k === filter ? "on" : ""}">${l}</button>`).join("")}</div>
        <label class="search">${ic("search")}<input type="search" id="pq" placeholder="Search title or URL…" value="${esc(r.q.get("q") || "")}"></label>
        <span class="sp" style="flex:1"></span><a class="btn primary" href="#/pages/new">${ic("plus")} New page</a></div>
      <div class="card"><div id="pl"><div class="empty">Loading…</div></div></div>`);
    let t;
    const load = async () => {
      const q = $("#pq").value;
      try {
        const res = await api("GET", `/pages?filter=${filter}&q=${encodeURIComponent(q)}`);
        $("#pl").innerHTML = `<div class="card-h"><h3>${res.count} page${res.count === 1 ? "" : "s"}</h3><span class="muted">of ${res.total} total${res.count > 500 ? " · showing first 500" : ""}</span></div>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Title</th><th>URL</th><th>Status</th><th>Updated</th><th></th></tr></thead><tbody>
          ${res.list.map((p) => `<tr><td><a href="#/pages/edit?slug=${encodeURIComponent(p.slug)}" class="t-title" style="color:inherit">${esc(p.title)}</a>${p.subtitle ? `<div class="muted" style="font-size:.8rem">${esc(p.subtitle)}</div>` : ""}</td>
            <td><a class="t-link" href="/${esc(p.slug)}" target="_blank">/${esc(p.slug)}</a></td>
            <td>${p.status === "published" ? `<span class="badge ok">Published</span>` : `<span class="badge warn">Draft</span>`}</td>
            <td class="muted" style="white-space:nowrap">${ago(p.updatedAt)}${p.updatedBy && p.updatedBy !== "import" ? ` · ${esc(p.updatedBy)}` : ""}</td>
            <td class="acts"><a class="btn sm" href="/${esc(p.slug)}" target="_blank" title="View">${ic("eye")}</a><a class="btn sm" href="#/pages/edit?slug=${encodeURIComponent(p.slug)}">${ic("edit")} Edit</a></td></tr>`).join("")}
          </tbody></table>${res.list.length ? "" : `<div class="empty">No pages found.</div>`}</div>`;
      } catch (e) { fail(e); }
    };
    $("#pq").oninput = () => { clearTimeout(t); t = setTimeout(load, 220); };
    $$("[data-f]").forEach((b) => (b.onclick = () => (location.hash = `#/pages?f=${b.dataset.f}&q=${encodeURIComponent($("#pq").value)}`)));
    load();
  }

  async function vPageEdit(r) {
    const isNew = r.parts[1] === "new";
    let p = { slug: "", title: "", subtitle: "", html: "<p></p>", status: "published" };
    if (!isNew) {
      try { p = await api("GET", "/page?slug=" + encodeURIComponent(r.q.get("slug"))); } catch (e) { fail(e); location.hash = "#/pages"; return; }
    }
    const v = shell(isNew ? "New page" : "Edit page", `
      <div class="editor-grid">
        <div class="form">
          <div class="field"><label>Title</label><input type="text" id="pt" value="${esc(p.title)}" placeholder="Page title" style="font-size:1.15rem;font-weight:600"></div>
          <div class="field"><label>Subtitle (optional)</label><input type="text" id="ps" value="${esc(p.subtitle || "")}"></div>
          <div class="field"><label>Content</label><textarea id="ph"></textarea></div>
        </div>
        <div class="editor-side">
          <div class="card card-b form">
            <div class="field"><label>Status</label><select id="pst"><option value="published" ${p.status === "published" ? "selected" : ""}>Published</option><option value="draft" ${p.status !== "published" ? "selected" : ""}>Draft (hidden)</option></select></div>
            <div class="field"><label>URL</label><div class="with-btn"><span class="muted" style="align-self:center">/</span><input type="text" id="pslug" value="${esc(p.slug)}" placeholder="my-page"></div><p class="hint">Same address as on the original site. Changing it breaks existing links.</p></div>
            <button class="btn primary" id="psave" style="justify-content:center">${ic("save")} ${isNew ? "Create page" : "Save changes"}</button>
            <span class="unsaved" hidden id="pdirty">Unsaved changes</span>
            ${isNew ? "" : `<a class="btn" href="/${esc(p.slug)}" target="_blank" style="justify-content:center">${ic("eye")} View page</a>`}
          </div>
          ${isNew ? "" : `<div class="card card-b"><p class="muted" style="font-size:.82rem">Last updated ${ago(p.updatedAt)}${p.updatedBy ? " by " + esc(p.updatedBy) : ""}.</p>${p.source ? `<p class="muted" style="font-size:.78rem;margin-top:6px">Imported from <a href="${esc(p.source)}" target="_blank">original page</a>.</p>` : ""}
            ${state.user.role === "admin" ? `<button class="btn danger sm" id="pdel" style="margin-top:12px">${ic("trash")} Delete page</button>` : ""}</div>`}
          <div class="card card-b"><p class="muted" style="font-size:.82rem"><b>Tips:</b> use <b>Insert media</b> to add images or PDFs from the library, the link button to link to other pages, and <b>Source</b> to edit raw HTML.</p></div>
        </div>
      </div>`, `<a class="btn" href="#/pages">${ic("left")} All pages</a>`);

    $("#ph").value = p.html;
    let editor = null;
    const markDirty = () => { state.dirty = true; $("#pdirty").hidden = false; };
    const startEditor = () => {
      if (!window.Jodit) return setTimeout(startEditor, 100);
      editor = Jodit.make("#ph", {
        height: 640,
        toolbarAdaptive: false,
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        defaultActionOnPaste: "insert_clear_html",
        uploader: { insertImageAsBase64URI: false },
        buttons: ["source", "|", "paragraph", "bold", "italic", "underline", "strikethrough", "|", "ul", "ol", "outdent", "indent", "|", "align", "brush", "|", "link", "insertMedia", "image", "table", "hr", "|", "undo", "redo", "eraser", "fullsize"],
        controls: {
          insertMedia: {
            name: "insertMedia", tooltip: "Insert from media library", text: "Insert media",
            exec: async (ed) => {
              const url = await mediaPicker();
              if (!url) return;
              if (/\.(jpe?g|png|gif|webp|svg)(\?|$)/i.test(url)) ed.s.insertImage(url);
              else ed.s.insertHTML(`<a href="${esc(url)}" target="_blank">${esc(decodeURIComponent(url.split("/").pop()))}</a>`);
            },
          },
        },
      });
      editor.events.on("change", markDirty);
    };
    startEditor();
    ["pt", "ps", "pst", "pslug"].forEach((id) => $("#" + id).addEventListener("input", markDirty));
    const save = async () => {
      const body = { title: $("#pt").value, subtitle: $("#ps").value, html: editor ? editor.value : $("#ph").value, status: $("#pst").value, slug: $("#pslug").value.trim() };
      if (!body.title) return toast("Title is required", "err");
      try {
        const res = isNew ? await api("POST", "/page", body) : await api("PUT", "/page?slug=" + encodeURIComponent(p.slug), body);
        state.dirty = false;
        toast(isNew ? "Page created" : "Page saved", "ok");
        if (isNew || res.slug !== p.slug) location.hash = "#/pages/edit?slug=" + encodeURIComponent(res.slug);
        else { p = res; $("#pdirty").hidden = true; }
      } catch (e) { fail(e); }
    };
    $("#psave").onclick = save;
    document.onkeydown = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "s" && $("#psave")) { e.preventDefault(); save(); } };
    const del = $("#pdel");
    del && (del.onclick = async () => {
      if (!(await confirmBox(`Delete page <b>/${esc(p.slug)}</b>? Links to it will show “Page not found”. (A backup is kept.)`))) return;
      try { await api("DELETE", "/page?slug=" + encodeURIComponent(p.slug)); state.dirty = false; toast("Page deleted", "ok"); location.hash = "#/pages"; } catch (e) { fail(e); }
    });
  }

  /* ---------- menu tree editor ---------- */
  function vMenu(r) {
    const tab = r.parts[1] === "top" ? "top" : "main";
    const v = shell("Menus", `<div class="tabs"><a href="#/menu" class="${tab === "main" ? "on" : ""}">Main menu</a><a href="#/menu/top" class="${tab === "top" ? "on" : ""}">Top bar links</a></div><div id="mv"></div>`);
    if (tab === "top") return listEditor($("#mv", v), { section: "topLinks", title: "Top bar links", addLabel: "Add link", preview: "/", fields: [{ key: "label", label: "Label", required: true, list: true, main: true }, { key: "href", label: "Link", type: "url", required: true, list: true }] });

    let tree = clone(state.site.nav || []);
    const collapsed = new Set();
    const c = $("#mv", v);
    const findCtx = (id, list = tree, parent = null) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) return { list, i, node: list[i], parent };
        const f = findCtx(id, list[i].children || [], list[i]);
        if (f) return f;
      }
      return null;
    };
    const dirty = () => { state.dirty = true; $("#mdirty").hidden = false; };
    const nodeFields = (top) => [{ key: "label", label: "Label", required: true }, { key: "href", label: "Link (use # for a heading that only opens a sub-menu)", type: "url" }].concat(top ? [{ key: "featured", label: "Show in the header bar (all items are always in “All Menus”)", type: "bool" }] : []);
    function nodeHtml(n, depth) {
      const kids = n.children || [];
      return `<li><div class="node ${collapsed.has(n.id) ? "collapsed" : ""}" data-id="${n.id}">
          ${kids.length ? `<button class="tg" data-tg title="Expand/collapse">${ic(collapsed.has(n.id) ? "right" : "down")}</button>` : `<span class="tg"></span>`}
          <span class="lbl">${esc(n.label)}</span>${depth === 0 && n.featured ? `<span class="badge">${ic("star", "").replace('class="ico ', 'style="width:11px;height:11px" class="ico ')} header</span>` : ""}
          ${kids.length ? `<span class="badge gray">${kids.length}</span>` : ""}
          <span class="href">${esc(n.href && n.href !== "#" ? n.href : "")}</span>
          <span class="acts">
            <button class="btn" data-act="up" title="Move up">${ic("up")}</button><button class="btn" data-act="down" title="Move down">${ic("down")}</button>
            <button class="btn" data-act="out" title="Move out one level">${ic("left")}</button><button class="btn" data-act="in" title="Move into previous item">${ic("right")}</button>
            <button class="btn" data-act="add" title="Add sub-item">${ic("plus")}</button><button class="btn" data-act="edit" title="Edit">${ic("edit")}</button><button class="btn danger" data-act="del" title="Delete">${ic("trash")}</button>
          </span></div>
        ${kids.length ? `<ul>${kids.map((k) => nodeHtml(k, depth + 1)).join("")}</ul>` : ""}</li>`;
    }
    const count = (l) => l.reduce((a, n) => a + 1 + count(n.children || []), 0);
    function draw() {
      c.innerHTML = `<div class="card"><div class="card-h"><h3>Main menu <span class="badge gray">${count(tree)} links</span></h3><div class="sp"></div>
        <span class="unsaved" id="mdirty" ${state.dirty ? "" : "hidden"}>Unsaved changes</span>
        <button class="btn" id="mexp">Expand all</button><button class="btn" id="mcol">Collapse all</button>
        <button class="btn" id="madd">${ic("plus")} Add top-level item</button><button class="btn primary" id="msave">${ic("save")} Save menu</button></div>
        <div class="card-b muted" style="padding-bottom:0">Starred items appear in the header bar; every item is listed in the “All Menus” overlay. Use the arrows to reorder or nest items.</div>
        <div class="tree-ed"><ul>${tree.map((n) => nodeHtml(n, 0)).join("")}</ul></div></div>`;
      $("#mexp").onclick = () => { collapsed.clear(); draw(); };
      $("#mcol").onclick = () => { (function w(l) { l.forEach((n) => { if ((n.children || []).length) { collapsed.add(n.id); w(n.children); } }); })(tree); draw(); };
      $("#madd").onclick = async () => { const v = await itemForm("Add menu item", nodeFields(true), { label: "", href: "#", featured: false }); if (!v) return; tree.push({ id: uid(), children: [], ...v }); dirty(); draw(); };
      $("#msave").onclick = async () => {
        try { const r = await api("PUT", "/site/nav", tree); state.site.nav = r.data; tree = clone(r.data); state.dirty = false; toast("Menu saved", "ok"); draw(); } catch (e) { fail(e); }
      };
      $$("[data-tg]", c).forEach((b) => (b.onclick = () => { const id = b.closest(".node").dataset.id; collapsed.has(id) ? collapsed.delete(id) : collapsed.add(id); draw(); }));
      $$("[data-act]", c).forEach((b) => (b.onclick = async () => {
        const ctx = findCtx(b.closest(".node").dataset.id);
        const { list, i, node, parent } = ctx;
        const a = b.dataset.act;
        if (a === "up" && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
        else if (a === "down" && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
        else if (a === "in" && i > 0) { list.splice(i, 1); const prev = list[i - 1]; (prev.children = prev.children || []).push(node); collapsed.delete(prev.id); }
        else if (a === "out" && parent) { list.splice(i, 1); const pc = findCtx(parent.id); pc.list.splice(pc.i + 1, 0, node); }
        else if (a === "add") { const v = await itemForm("Add sub-item under “" + node.label + "”", nodeFields(false), { label: "", href: "" }); if (!v) return; (node.children = node.children || []).push({ id: uid(), children: [], ...v }); collapsed.delete(node.id); }
        else if (a === "edit") { const v = await itemForm("Edit menu item", nodeFields(!parent), node); if (!v) return; Object.assign(node, v); }
        else if (a === "del") { if (!(await confirmBox(`Delete “${esc(node.label)}”${(node.children || []).length ? ` and its ${count(node.children)} sub-items` : ""}?`))) return; list.splice(i, 1); }
        else return;
        dirty(); draw();
      }));
    }
    draw();
  }

  /* ---------- media ---------- */
  async function vMedia() {
    const v = shell("Media library", `<div class="dropzone" id="dz">${ic("upload")}<p><b>Drag & drop files to upload</b> or <label class="btn sm" style="display:inline-flex">choose files<input type="file" multiple hidden id="mf"></label></p><p class="hint">Images, PDF, Word/Excel/PowerPoint, MP4 · max 50 MB each. Files are served from /assets/uploads/…</p></div>
      <div class="toolbar"><label class="search">${ic("search")}<input type="search" id="mq" placeholder="Filter files…"></label></div><div class="media-grid" id="mg"></div>`);
    let files = [];
    const draw = () => {
      const q = $("#mq").value.toLowerCase();
      const list = files.filter((f) => f.name.toLowerCase().includes(q));
      $("#mg").innerHTML = list.length ? list.map((f) => `<div class="media-item">${thumb(f)}<div class="mbody"><b title="${esc(f.name)}">${esc(f.name)}</b>${size(f.size)} · ${ago(f.at)}</div>
        <div class="mact"><button class="btn sm" data-copy="${esc(f.url)}" title="Copy link">${ic("copy")}</button><a class="btn sm" href="${esc(f.url)}" target="_blank" title="Open">${ic("ext")}</a><button class="btn sm danger" data-del="${esc(f.url)}" title="Delete">${ic("trash")}</button></div></div>`).join("") : `<div class="empty" style="grid-column:1/-1">No files yet. Upload PDFs and images here, then use them in notices, events and pages.</div>`;
      $$("[data-copy]").forEach((b) => (b.onclick = () => { navigator.clipboard.writeText(b.dataset.copy).then(() => toast("Link copied: " + b.dataset.copy, "ok")); }));
      $$("[data-del]").forEach((b) => (b.onclick = async () => {
        if (!(await confirmBox("Delete this file? Links pointing to it will break."))) return;
        try { await api("DELETE", "/media?url=" + encodeURIComponent(b.dataset.del)); files = files.filter((f) => f.url !== b.dataset.del); draw(); toast("File deleted", "ok"); } catch (e) { fail(e); }
      }));
    };
    $("#mq").oninput = draw;
    uploader($("#dz"), $("#mf"), (up) => { files = up.map((f) => ({ ...f, at: new Date().toISOString() })).concat(files); draw(); });
    try { files = await api("GET", "/media"); } catch (e) { fail(e); }
    draw();
  }

  /* ---------- messages ---------- */
  async function vMessages() {
    let list = [];
    try { list = await api("GET", "/messages"); } catch (e) { return fail(e); }
    state.unread = list.filter((m) => !m.read).length;
    const v = shell("Enquiries", `<div class="card"><div class="card-h"><h3>Inbox <span class="badge gray">${list.length}</span> ${state.unread ? `<span class="badge red">${state.unread} unread</span>` : ""}</h3><div class="sp"></div><button class="btn" id="csv">${ic("download")} Export CSV</button></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>From</th><th>Subject</th><th>Received</th><th></th></tr></thead><tbody>
      ${list.map((m) => `<tr class="${m.read ? "" : "unread"}"><td>${esc(m.name)}<div class="muted" style="font-size:.78rem">${esc(m.email || m.phone)}</div></td><td>${esc(m.subject)}<div class="muted" style="font-size:.8rem;max-width:460px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(m.message)}</div></td><td class="muted" style="white-space:nowrap">${ago(m.at)}</td>
        <td class="acts"><button class="btn sm" data-open="${m.id}">${ic("eye")} Open</button><button class="btn sm icon danger" data-del="${m.id}">${ic("trash")}</button></td></tr>`).join("")}
      </tbody></table>${list.length ? "" : `<div class="empty">No enquiries yet. Messages from the Contact page and the footer form appear here.</div>`}</div></div>`);
    $$("[data-open]").forEach((b) => (b.onclick = async () => {
      const m = list.find((x) => x.id === b.dataset.open);
      if (!m.read) api("PATCH", "/messages/" + m.id, { read: true }).catch(() => {});
      m.read = true;
      await modal({
        title: m.subject,
        body: `<p><b>${esc(m.name)}</b> · ${m.email ? `<a href="mailto:${esc(m.email)}">${esc(m.email)}</a>` : ""} ${m.phone ? ` · <a href="tel:${esc(m.phone)}">${esc(m.phone)}</a>` : ""}</p><p class="muted" style="margin:4px 0 12px">${new Date(m.at).toLocaleString("en-IN")}${m.page ? " · sent from " + esc(m.page) : ""}</p><div class="msg-body">${esc(m.message)}</div>`,
        actions: [{ label: "Mark unread", onClick: async () => { await api("PATCH", "/messages/" + m.id, { read: false }); m.read = false; } }].concat(m.email ? [{ label: `${ic("reply")} Reply by email`, cls: "primary", onClick: () => { location.href = `mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`; } }] : []),
      });
      vMessages();
    }));
    $$("[data-del]").forEach((b) => (b.onclick = async () => { if (!(await confirmBox("Delete this enquiry?"))) return; try { await api("DELETE", "/messages/" + b.dataset.del); vMessages(); } catch (e) { fail(e); } }));
    $("#csv").onclick = () => {
      const rows = [["Received", "Name", "Email", "Phone", "Subject", "Message", "Page"]].concat(list.map((m) => [m.at, m.name, m.email, m.phone, m.subject, m.message, m.page]));
      const csv = rows.map((r) => r.map((x) => `"${String(x || "").replace(/"/g, '""')}"`).join(",")).join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = "enquiries.csv";
      a.click();
    };
  }

  /* ---------- users ---------- */
  async function vUsers() {
    let users = [];
    try { users = await api("GET", "/users"); } catch (e) { return fail(e); }
    const v = shell("Users", `<div class="card"><div class="card-h"><h3>Users</h3><div class="sp"></div><button class="btn primary" id="uadd">${ic("plus")} Add user</button></div>
      <div class="card-b muted" style="padding-bottom:0"><b>Administrators</b> can do everything. <b>Editors</b> can edit content (notices, events, homepage, pages, menus, media, enquiries) but cannot manage users, delete pages or restore backups.</div>
      <table class="tbl"><thead><tr><th>User</th><th>Role</th><th>Last sign-in</th><th></th></tr></thead><tbody>
      ${users.map((u) => `<tr><td><b>${esc(u.name)}</b><div class="muted">${esc(u.username)}</div></td><td><span class="badge ${u.role === "admin" ? "" : "gray"}">${u.role}</span>${u.mustChange ? ` <span class="badge warn">must change password</span>` : ""}</td><td class="muted">${u.lastLogin ? ago(u.lastLogin) : "never"}</td>
        <td class="acts"><button class="btn sm" data-edit="${esc(u.username)}">${ic("edit")} Edit</button>${u.username !== state.user.username ? `<button class="btn sm icon danger" data-del="${esc(u.username)}">${ic("trash")}</button>` : ""}</td></tr>`).join("")}
      </tbody></table></div>`);
    const roleF = { key: "role", label: "Role", type: "select", options: ["editor", "admin"] };
    $("#uadd").onclick = async () => {
      const val = await itemForm("Add user", [{ key: "username", label: "Username", required: true }, { key: "name", label: "Full name" }, roleF, { key: "password", label: "Temporary password (min 8 chars, letters + numbers)", required: true }], { role: "editor" });
      if (!val) return;
      try { await api("POST", "/users", val); toast("User created", "ok"); vUsers(); } catch (e) { fail(e); }
    };
    $$("[data-edit]").forEach((b) => (b.onclick = async () => {
      const u = users.find((x) => x.username === b.dataset.edit);
      const val = await itemForm("Edit " + u.username, [{ key: "name", label: "Full name" }, roleF, { key: "password", label: "Reset password (leave empty to keep)" }], { name: u.name, role: u.role, password: "" });
      if (!val) return;
      if (!val.password) delete val.password;
      try { await api("PUT", "/users/" + encodeURIComponent(u.username), val); toast("User updated", "ok"); vUsers(); } catch (e) { fail(e); }
    }));
    $$("[data-del]").forEach((b) => (b.onclick = async () => { if (!(await confirmBox(`Delete user <b>${esc(b.dataset.del)}</b>?`))) return; try { await api("DELETE", "/users/" + encodeURIComponent(b.dataset.del)); vUsers(); } catch (e) { fail(e); } }));
  }

  /* ---------- backups ---------- */
  async function vBackups() {
    let list = [];
    try { list = await api("GET", "/backups"); } catch (e) { return fail(e); }
    const v = shell("Backups", `<div class="grid g2">
        <div class="card card-b"><h3 style="margin-bottom:6px">Export all content</h3><p class="muted" style="margin-bottom:12px">Download a JSON file with every page, menu, notice, event and setting.</p><a class="btn primary" href="${API}/export">${ic("download")} Download export</a></div>
        <div class="card card-b"><h3 style="margin-bottom:6px">Import content</h3><p class="muted" style="margin-bottom:12px">Replace all content with a previously exported file. The current content is backed up first.</p><label class="btn">${ic("upload")} Choose export file<input type="file" accept=".json,application/json" hidden id="imp"></label></div>
      </div>
      <div class="card" style="margin-top:18px"><div class="card-h"><h3>Automatic backups</h3><span class="muted">A snapshot is saved before changes (max one per minute, last 30 kept per document)</span></div>
      <table class="tbl"><thead><tr><th>Snapshot</th><th>Size</th><th></th></tr></thead><tbody>
      ${list.map((b) => { const m = b.file.match(/^(\w+)-(\d{4}-\d\d-\d\d)T(\d\d)-(\d\d)-(\d\d)/); return `<tr><td><b>${m ? (m[1] === "site" ? "Site content & menus" : m[1] === "pages" ? "Pages" : m[1]) : esc(b.file)}</b><div class="muted">${m ? new Date(`${m[2]}T${m[3]}:${m[4]}:${m[5]}Z`).toLocaleString("en-IN") : ""}</div></td><td class="muted">${size(b.size)}</td><td class="acts">${/^(site|pages)-/.test(b.file) ? `<button class="btn sm" data-restore="${esc(b.file)}">${ic("undo")} Restore</button>` : ""}</td></tr>`; }).join("")}
      </tbody></table>${list.length ? "" : `<div class="empty">No snapshots yet – they are created automatically when content changes.</div>`}</div>`);
    $$("[data-restore]").forEach((b) => (b.onclick = async () => {
      if (!(await confirmBox("Restore this snapshot? Current content will be backed up first.", "Restore", "primary"))) return;
      try { await api("POST", "/backups/restore", { file: b.dataset.restore }); await loadSite(); toast("Snapshot restored", "ok"); vBackups(); } catch (e) { fail(e); }
    }));
    $("#imp").onchange = async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      if (!(await confirmBox(`Replace ALL website content with <b>${esc(f.name)}</b>?`, "Import", "primary"))) return;
      try { const data = JSON.parse(await f.text()); await api("POST", "/import", data); await loadSite(); toast("Content imported", "ok"); } catch (err) { fail(err); }
    };
  }

  async function vActivity() {
    let list = [];
    try { list = await api("GET", "/activity"); } catch (e) { return fail(e); }
    shell("Activity log", `<div class="card"><table class="tbl"><thead><tr><th>When</th><th>User</th><th>Action</th><th>Target</th></tr></thead><tbody>
      ${list.map((a) => `<tr><td class="muted" style="white-space:nowrap" title="${esc(a.at)}">${new Date(a.at).toLocaleString("en-IN")}</td><td><b>${esc(a.user)}</b></td><td>${esc(a.action)}</td><td class="muted">${esc(a.target)}</td></tr>`).join("")}
      </tbody></table>${list.length ? "" : `<div class="empty">Nothing logged yet.</div>`}</div>`);
  }

  function vAccount() {
    const v = shell("My account", `<div class="card" style="max-width:520px"><div class="card-h"><h3>Change password</h3></div><form class="card-b form" id="pw">
      <div class="field"><label>Current password</label><input type="password" name="current" autocomplete="current-password" required></div>
      <div class="field"><label>New password</label><input type="password" name="next" autocomplete="new-password" required minlength="8"><p class="hint">At least 8 characters with letters and numbers.</p></div>
      <div class="field"><label>Confirm new password</label><input type="password" name="confirm" autocomplete="new-password" required></div>
      <p class="err-msg" id="pwe"></p><div class="form-actions"><button class="btn primary">Update password</button></div></form></div>`);
    $("#pw").onsubmit = async (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(e.target));
      if (d.next !== d.confirm) return ($("#pwe").textContent = "Passwords do not match.");
      try { await api("POST", "/password", { current: d.current, next: d.next }); state.user.mustChange = false; toast("Password updated", "ok"); location.hash = "#/dashboard"; } catch (err) { $("#pwe").textContent = err.message; }
    };
  }

  boot();
})();
