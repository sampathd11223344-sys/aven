/* Public site behaviour */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- sticky header ---------- */
  const hdr = $("#siteHeader");
  const toTop = $("#toTop");
  const onScroll = () => {
    hdr && hdr.classList.toggle("scrolled", scrollY > 40);
    toTop && toTop.classList.toggle("show", scrollY > 600);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop && toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- main navbar dropdowns (click / keyboard / touch) ---------- */
  const navList = $("#navList");
  if (navList) {
    const closeAll = (except) => $$(".nav-item.open, .has-sub.open", navList).forEach((li) => { if (!except || !li.contains(except)) { li.classList.remove("open"); const b = li.querySelector(":scope > button"); b && b.setAttribute("aria-expanded", "false"); } });
    $$(".nav-item.has-dd > .nav-link", navList).forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const li = btn.parentElement;
        const open = !li.classList.contains("open");
        closeAll();
        li.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
      })
    );
    $$(".dd-sub-toggle", navList).forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); b.parentElement.classList.toggle("open"); }));
    document.addEventListener("click", (e) => { if (!navList.contains(e.target)) closeAll(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

    // priority+ : hide items that do not fit (they are always available in "All Menus")
    const fit = () => {
      const items = $$(".nav-item", navList);
      items.forEach((i) => i.classList.remove("is-overflow"));
      const max = navList.clientWidth;
      let used = 0;
      items.forEach((i) => { used += i.offsetWidth; if (used > max) i.classList.add("is-overflow"); });
    };
    addEventListener("resize", fit);
    document.fonts && document.fonts.ready.then(fit);
    fit();
  }

  /* ---------- full menu overlay ---------- */
  const overlay = $("#menuOverlay");
  if (overlay) {
    const filter = $("#menuFilter");
    let lastFocus = null;
    const open = () => {
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
      setTimeout(() => filter && innerWidth > 640 && filter.focus(), 50);
    };
    const close = () => {
      overlay.hidden = true;
      document.body.style.overflow = "";
      lastFocus && lastFocus.focus && lastFocus.focus();
    };
    $$("[data-open-menu]").forEach((b) => b.addEventListener("click", open));
    $$("[data-close-menu]").forEach((b) => b.addEventListener("click", close));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !overlay.hidden) close(); });

    // collapsible sections on small screens
    $$(".menu-sec").forEach((sec) => {
      const t = $(".menu-sec-toggle", sec);
      if (t) { sec.classList.add("collapsible"); t.addEventListener("click", () => sec.classList.toggle("expanded")); }
    });

    // live filter
    const secs = $$(".menu-sec", overlay);
    filter && filter.addEventListener("input", () => {
      const q = filter.value.trim().toLowerCase();
      let any = false;
      secs.forEach((sec) => {
        const secMatch = !q || sec.dataset.label.includes(q);
        let secHas = secMatch;
        $$("li", sec).forEach((li) => {
          const self = li.dataset.label.includes(q);
          const childMatch = $$("li", li).some((c) => c.dataset.label.includes(q));
          const parentMatch = (() => { let p = li.parentElement.closest("li"); while (p) { if (p.dataset.label.includes(q)) return true; p = p.parentElement.closest("li"); } return false; })();
          const show = !q || secMatch || self || childMatch || parentMatch;
          li.hidden = !show;
          if (show && q) secHas = true;
        });
        sec.hidden = !secHas;
        if (q) sec.classList.add("expanded");
        if (secHas) any = true;
      });
      $(".menu-empty", overlay).hidden = any;
    });
  }

  /* ---------- hero slider ---------- */
  const hero = $("[data-hero]");
  if (hero) {
    const slides = $$(".hero-slide", hero);
    const dots = $$(".hero-dots button", hero);
    let cur = 0, timer;
    const go = (n) => {
      if (!slides.length) return;
      slides[cur].classList.remove("active"); dots[cur] && dots[cur].classList.remove("active");
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add("active"); dots[cur] && dots[cur].classList.add("active");
    };
    const start = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5500); };
    dots.forEach((d, i) => d.addEventListener("click", () => { go(i); start(); }));
    if (slides.length > 1) start();
  }

  /* ---------- simple fader ---------- */
  $$("[data-fader]").forEach((g) => {
    const imgs = $$("img", g);
    let i = 0;
    if (imgs.length > 1) setInterval(() => { imgs[i].classList.remove("active"); i = (i + 1) % imgs.length; imgs[i].classList.add("active"); }, 3500);
  });

  /* ---------- notice board ---------- */
  const board = $("[data-board]");
  if (board) {
    const tabs = $$(".board-tabs button", board);
    const lists = $$(".board-list", board);
    const input = $(".board-search input", board);
    const count = $("[data-count]", board);
    const empty = $(".board-empty", board);
    let active = "results";
    const render = () => {
      const q = input.value.trim().toLowerCase();
      let n = 0;
      lists.forEach((l) => {
        const on = l.dataset.list === active;
        l.hidden = !on;
        if (!on) return;
        $$("li", l).forEach((li) => { const show = !q || li.textContent.toLowerCase().includes(q); li.hidden = !show; if (show) n++; });
        l.scrollTop = 0;
      });
      count.textContent = `${n} item${n === 1 ? "" : "s"}`;
      empty.hidden = n > 0;
    };
    tabs.forEach((t) => t.addEventListener("click", () => {
      tabs.forEach((x) => { x.classList.toggle("active", x === t); x.setAttribute("aria-selected", String(x === t)); });
      active = t.dataset.tab;
      render();
    }));
    input.addEventListener("input", render);
    render();
  }

  /* ---------- cultural carousel ---------- */
  const track = $("#cultTrack");
  if (track) {
    $$("[data-cult]").forEach((b) => b.addEventListener("click", () => {
      const card = $(".cult-card", track);
      if (card) track.scrollBy({ left: (card.getBoundingClientRect().width + 20) * Number(b.dataset.cult), behavior: "smooth" });
    }));
  }

  /* ---------- events: show more ---------- */
  const more = $("#eventsMore");
  more && more.addEventListener("click", () => { $$(".event-card.is-hidden").forEach((e) => e.classList.remove("is-hidden")); more.parentElement.remove(); reveal(); });

  /* ---------- popup (once per session) ---------- */
  const popup = $("#popup");
  if (popup && !sessionStorage.getItem("aiet-popup")) {
    setTimeout(() => { popup.hidden = false; requestAnimationFrame(() => popup.classList.add("show")); }, 600);
    const slides = $$(".popup-slide", popup);
    let i = 0, t;
    const go = (n) => { slides[i].classList.remove("active"); i = (n + slides.length) % slides.length; slides[i].classList.add("active"); };
    if (slides.length > 1) t = setInterval(() => go(i + 1), 4000);
    const prev = $(".popup-nav.prev", popup), next = $(".popup-nav.next", popup);
    prev && prev.addEventListener("click", () => { clearInterval(t); go(i - 1); });
    next && next.addEventListener("click", () => { clearInterval(t); go(i + 1); });
    const close = () => { popup.classList.remove("show"); sessionStorage.setItem("aiet-popup", "1"); clearInterval(t); setTimeout(() => (popup.hidden = true), 300); };
    popup.addEventListener("click", (e) => { if (e.target === popup || e.target.closest(".modal-close")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !popup.hidden) close(); });
  }

  /* ---------- floating promo video ---------- */
  const fv = $("#floatVideo");
  if (fv && !sessionStorage.getItem("aiet-video-closed")) {
    const list = JSON.parse(fv.dataset.videos || "[]");
    const v = $("video", fv);
    let i = 0;
    const load = () => { v.src = list[i]; v.play().catch(() => {}); };
    fv.hidden = false;
    setTimeout(load, 1500);
    fv.addEventListener("click", (e) => {
      const b = e.target.closest("[data-fv]");
      if (!b) return;
      const a = b.dataset.fv;
      if (a === "play") { if (v.paused) v.play(); else v.pause(); }
      if (a === "mute") { v.muted = !v.muted; b.setAttribute("aria-label", v.muted ? "Unmute" : "Mute"); b.style.background = v.muted ? "" : "var(--accent)"; }
      if (a === "next") { i = (i + 1) % list.length; load(); }
      if (a === "prev") { i = (i - 1 + list.length) % list.length; load(); }
      if (a === "close") { v.pause(); fv.remove(); sessionStorage.setItem("aiet-video-closed", "1"); }
    });
  }

  /* ---------- legacy content helpers ---------- */
  const content = $(".content");
  if (content) {
    // wide tables scroll horizontally
    $$("table", content).forEach((t) => {
      if (t.parentElement.classList.contains("table-wrap-auto")) return;
      const w = document.createElement("div");
      w.className = "table-wrap-auto";
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
    // tabs: original pages used bootstrap tab panes – build buttons for each group
    $$(".tab-content", content).forEach((tc) => {
      const panes = $$(":scope > .tab-pane", tc);
      if (panes.length < 2) return;
      const bar = document.createElement("div");
      bar.className = "tab-buttons";
      // reuse the labels of the original bootstrap nav (ul.nav-tabs a[href="#id"]) and hide it
      const labels = {};
      let nav = null;
      for (let el = tc.previousElementSibling; el && !nav; el = el.previousElementSibling) if (el.matches(".nav-tabs, .nav")) nav = el;
      if (!nav && tc.parentElement) nav = tc.parentElement.querySelector(":scope > .nav-tabs, :scope > * > .nav-tabs");
      if (nav) {
        $$('a[href^="#"]', nav).forEach((a) => { const id = a.getAttribute("href").slice(1); if (id) labels[id] = a.textContent.trim(); });
        if (panes.some((p) => labels[p.id])) nav.style.display = "none";
      }
      panes.forEach((p, i) => {
        const h = p.querySelector("h1,h2,h3,h4,h5,th,td");
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = labels[p.id] || (h && h.textContent.trim() ? h.textContent.trim().slice(0, 48) : "Tab " + (i + 1));
        b.addEventListener("click", () => { panes.forEach((x) => x.classList.toggle("active", x === p)); $$("button", bar).forEach((x) => x.classList.toggle("active", x === b)); });
        bar.appendChild(b);
      });
      if (!panes.some((p) => p.classList.contains("active"))) panes[0].classList.add("active");
      $$("button", bar)[panes.findIndex((p) => p.classList.contains("active"))].classList.add("active");
      tc.parentNode.insertBefore(bar, tc);
    });
    // lightbox for content images
    const lb = $("#lightbox");
    const imgs = $$("img", content).filter((im) => !im.closest("a"));
    let li = 0;
    const show = (n) => { li = (n + imgs.length) % imgs.length; $("img", lb).src = imgs[li].currentSrc || imgs[li].src; lb.hidden = false; };
    imgs.forEach((im, n) => im.addEventListener("click", () => show(n)));
    if (lb) {
      $(".lb-close", lb).addEventListener("click", () => (lb.hidden = true));
      $(".lb-prev", lb).addEventListener("click", () => show(li - 1));
      $(".lb-next", lb).addEventListener("click", () => show(li + 1));
      lb.addEventListener("click", (e) => { if (e.target === lb) lb.hidden = true; });
      document.addEventListener("keydown", (e) => {
        if (lb.hidden) return;
        if (e.key === "Escape") lb.hidden = true;
        if (e.key === "ArrowLeft") show(li - 1);
        if (e.key === "ArrowRight") show(li + 1);
      });
    }
    // broken images: hide gracefully
    $$("img", content).forEach((im) => im.addEventListener("error", () => { im.style.display = "none"; }));
  }

  /* ---------- AJAX forms (enquiry / quick contact) ---------- */
  $$("form[data-ajax]").forEach((f) => f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const st = $(".form-status", f);
    const btn = $("button[type=submit]", f);
    btn.disabled = true;
    st.className = "form-status";
    st.textContent = "Sending…";
    try {
      const r = await fetch(f.action, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(f)) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Could not send. Please try again.");
      f.reset();
      st.className = "form-status ok";
      st.textContent = "Thank you! Your message has been sent.";
    } catch (err) {
      st.className = "form-status err";
      st.textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  }));

  /* ---------- reveal on scroll ---------- */
  function reveal() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.1 });
    $$(".reveal:not(.in)").forEach((el) => io.observe(el));
  }
  reveal();
})();
