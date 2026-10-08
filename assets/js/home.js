/* Homepage rendering & interactions */
(function () {
  const { icon, esc, attrs } = UI;
  const $ = (s) => document.querySelector(s);

  /* ---------- Popup (once per session, like the original site) ---------- */
  if (!sessionStorage.getItem("aiet-popup")) {
    const m = document.createElement("div");
    m.className = "modal";
    m.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-label="Announcement">
      <button class="icon-btn modal-close" aria-label="Close">${icon("x")}</button>
      <img src="${DATA.popup}" alt="Announcement">
    </div>`;
    document.body.appendChild(m);
    requestAnimationFrame(() => m.classList.add("show"));
    const close = () => {
      m.classList.remove("show");
      sessionStorage.setItem("aiet-popup", "1");
      setTimeout(() => m.remove(), 300);
    };
    m.addEventListener("click", (e) => {
      if (e.target === m || e.target.closest(".modal-close")) close();
    });
    document.addEventListener("keydown", (e) => e.key === "Escape" && close(), { once: true });
  }

  /* ---------- Hero slider ---------- */
  const slides = $("#heroSlides");
  slides.innerHTML = DATA.hero
    .map((src, i) => `<div class="hero-slide${i === 0 ? " active" : ""}" style="background-image:url('${src}')"></div>`)
    .join("");
  const dots = $("#heroDots");
  dots.innerHTML = DATA.hero.map((_, i) => `<button aria-label="Slide ${i + 1}" class="${i === 0 ? "active" : ""}"></button>`).join("");
  let cur = 0;
  const go = (n) => {
    const s = slides.children, d = dots.children;
    s[cur].classList.remove("active"); d[cur].classList.remove("active");
    cur = (n + s.length) % s.length;
    s[cur].classList.add("active"); d[cur].classList.add("active");
  };
  let timer = setInterval(() => go(cur + 1), 5500);
  [...dots.children].forEach((b, i) => b.addEventListener("click", () => { clearInterval(timer); go(i); timer = setInterval(() => go(cur + 1), 5500); }));

  /* ---------- Quick links ---------- */
  $("#quickLinks").innerHTML = DATA.quick
    .map((q) => `<a class="quick-card${q.hot ? " hot" : ""}" href="${q.href}"${attrs(q.href)}>
        <span class="quick-ico">${icon(q.icon)}</span>
        <span>${q.label}${q.hot ? '<em class="new-badge">NEW</em>' : ""}</span>
        ${icon("arrow", "go")}
      </a>`)
    .join("");

  /* ---------- Ticker ---------- */
  const tick = DATA.notifications.slice(0, 6).map(([, t, h]) => `<a href="${h}"${attrs(h)}>${esc(t)}</a>`).join('<span class="dot">•</span>');
  $("#tickerTrack").innerHTML = tick + '<span class="dot">•</span>' + tick;

  /* ---------- Award ---------- */
  $("#awardText").textContent = DATA.award.text;
  const ag = $("#awardGallery");
  ag.innerHTML = DATA.award.images.map((s, i) => `<img src="${s}" alt="NAAC A+ appreciation award photo ${i + 1}" loading="lazy" class="${i === 0 ? "active" : ""}">`).join("");
  let ai = 0;
  setInterval(() => {
    ag.children[ai].classList.remove("active");
    ai = (ai + 1) % ag.children.length;
    ag.children[ai].classList.add("active");
  }, 3500);

  /* ---------- Notice board (tabs + search) ---------- */
  const lists = {
    results: DATA.results.map(([y, t, h]) => ({ y, t, h })),
    notifications: DATA.notifications.map(([y, t, h]) => ({ y, t, h })),
    timetables: DATA.timetables.map(([t, h]) => ({ y: "", t, h })),
  };
  let tab = "results";
  const board = $("#boardList");
  const q = $("#boardSearch");
  const counts = $("#boardCount");
  const render = () => {
    const term = q.value.trim().toLowerCase();
    const items = lists[tab].filter((it) => !term || (it.t + " " + it.y).toLowerCase().includes(term));
    counts.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;
    board.innerHTML = items.length
      ? items
          .map((it) => {
            const pdf = /\.pdf$/i.test(it.h);
            return `<li><a href="${it.h}"${attrs(it.h)}>
              <span class="b-ico">${icon(pdf ? "file" : "arrow")}</span>
              <span class="b-body">${it.y ? `<span class="b-year">${esc(it.y)}</span>` : ""}<span class="b-title">${esc(it.t)}</span></span>
              ${pdf ? '<span class="tag">PDF</span>' : ""}
            </a></li>`;
          })
          .join("")
      : `<li class="empty">No matches for “${esc(term)}”.</li>`;
    board.scrollTop = 0;
  };
  document.querySelectorAll(".board-tabs button").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll(".board-tabs button").forEach((x) => { x.classList.remove("active"); x.setAttribute("aria-selected", "false"); });
      b.classList.add("active"); b.setAttribute("aria-selected", "true");
      tab = b.dataset.tab;
      render();
    })
  );
  document.querySelectorAll(".board-tabs [data-count]").forEach((s) => (s.textContent = lists[s.dataset.count].length));
  q.addEventListener("input", render);
  render();

  /* ---------- Vision / mission / features ---------- */
  $("#vision").textContent = DATA.vision;
  $("#mission").innerHTML = DATA.mission.map((m) => `<li>${esc(m)}</li>`).join("");
  $("#objectives").innerHTML = DATA.objectives.map((m) => `<li>${esc(m)}</li>`).join("");
  $("#features").innerHTML = DATA.features.map((f) => `<li>${icon("check")}<span>${esc(f)}</span></li>`).join("");

  /* ---------- Courses ---------- */
  $("#coursesGrid").innerHTML = DATA.courses
    .flatMap((g) => g.rows.map(([p, b]) => ({ g: g.group, p, b })))
    .map((c) => `<article class="course-card reveal">
        <span class="course-group">${esc(c.g)}</span>
        <h3>${esc(c.p)}</h3>
        <div class="chips">${c.b.replace(/ & /g, ", ").split(/,\s*/).filter(Boolean).map((x) => `<span>${esc(x.replace(/\.$/, ""))}</span>`).join("")}</div>
      </article>`)
    .join("");

  /* ---------- Cultural carousel ---------- */
  const track = $("#culturalTrack");
  track.innerHTML = DATA.cultural
    .map(([img, t]) => `<figure class="cult-card"><img src="${img}" alt="${esc(t)}" loading="lazy"><figcaption>${esc(t)}</figcaption></figure>`)
    .join("");
  const step = () => track.querySelector(".cult-card").getBoundingClientRect().width + 20;
  $("#cultPrev").addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  $("#cultNext").addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));

  /* ---------- Latest events ---------- */
  const evWrap = $("#eventsGrid");
  const INITIAL = 8;
  evWrap.innerHTML = DATA.events
    .map(([img, t, h], i) => `<a class="event-card reveal${i >= INITIAL ? " is-hidden" : ""}" href="${h}"${attrs(h)}>
        <div class="event-img"><img src="${img}" alt="" loading="lazy"></div>
        <div class="event-body"><h3>${esc(t)}</h3><span class="more">View event ${icon("arrow")}</span></div>
      </a>`)
    .join("");
  const moreBtn = $("#eventsMore");
  moreBtn.textContent = `Show all ${DATA.events.length} events`;
  moreBtn.addEventListener("click", () => {
    evWrap.querySelectorAll(".is-hidden").forEach((e) => e.classList.remove("is-hidden"));
    moreBtn.remove();
    observeReveal();
  });

  /* ---------- College info ---------- */
  $("#infoList").innerHTML = DATA.info
    .map(([l, h]) => `<a class="info-link" href="${h}"${attrs(h)}><span>${esc(l)}</span>${icon("arrow")}</a>`)
    .join("");

  observeReveal();
})();
