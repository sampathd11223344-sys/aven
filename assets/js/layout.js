/* Shared header / navigation / footer for every page */
(function () {
  const C = DATA.college;
  const ext = (href) => /^https?:/.test(href);
  const attrs = (href) => (ext(href) ? ' target="_blank" rel="noopener"' : "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const ICONS = {
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    play: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
    login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5M15 12H3"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  };
  const icon = (n, cls = "") =>
    `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg>`;

  window.UI = { icon, esc, attrs, ext };

  const page = location.pathname.split("/").pop() || "index.html";

  /* ---------- Header ---------- */
  const navItems = DATA.nav
    .map((item, i) => {
      if (item.href) {
        const active = item.href === page ? " is-active" : "";
        return `<li><a class="nav-link${active}" href="${item.href}"${attrs(item.href)}>${item.label}</a></li>`;
      }
      const isActive = item.groups.some((g) => g.links.some(([, h]) => h === page)) ? " is-active" : "";
      const cols = item.groups
        .map(
          (g) => `<div class="mega-col"><h6>${g.title}</h6><ul>${g.links
            .map(([l, h]) => `<li><a href="${h}"${attrs(h)}>${esc(l)}${/\.pdf$/i.test(h) ? '<span class="tag">PDF</span>' : ""}</a></li>`)
            .join("")}</ul></div>`
        )
        .join("");
      return `<li class="has-mega">
        <button class="nav-link${isActive}" aria-expanded="false" aria-controls="mega-${i}">${item.label}${icon("chev", "chev")}</button>
        <div class="mega" id="mega-${i}" style="--cols:${item.groups.length}">${cols}</div>
      </li>`;
    })
    .join("");

  const header = `
  <div class="topbar">
    <div class="container topbar-inner">
      <div class="topbar-contact">
        <a href="tel:+919866664636">${icon("phone")} Admissions: ${C.admissionPhone}</a>
        <a href="mailto:${C.email}">${icon("mail")} ${C.email}</a>
      </div>
      <div class="topbar-links">
        <a href="https://webprosindia.com/avanthinrpm" target="_blank" rel="noopener">ECAP Login</a>
        <a href="https://easypay.axisbank.co.in/easyPay/makePayment?mid=NDY4ODY%3D" target="_blank" rel="noopener">Pay Fee</a>
        <a href="${SITE}/admissionforms" target="_blank" rel="noopener">Admission Forms</a>
        <a href="https://forms.gle/J7Sa9tUyxgmvaBfx9" target="_blank" rel="noopener">Grievance</a>
      </div>
    </div>
  </div>
  <header class="site-header" id="siteHeader">
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="${C.name} – Home">
        <span class="brand-mark">A</span>
        <span class="brand-text">
          <strong>Avanthi Institute</strong>
          <small>of Engineering &amp; Technology</small>
        </span>
      </a>
      <span class="naac-pill" title="Accredited by NAAC with A+ grade">NAAC <b>A+</b></span>
      <nav class="main-nav" id="mainNav" aria-label="Main">
        <div class="drawer-head">
          <span class="brand-mark sm">A</span><strong>Menu</strong>
          <button class="icon-btn" id="navClose" aria-label="Close menu">${icon("x")}</button>
        </div>
        <ul class="nav-list">${navItems}</ul>
        <a class="btn btn-accent drawer-cta" href="${SITE}/assets/pdf/AIETM-ADMISSIONS%20BROUCHURE%20-%202025.pdf" target="_blank" rel="noopener">Admissions 2025 Brochure</a>
      </nav>
      <a class="btn btn-accent header-cta" href="${SITE}/admissionforms" target="_blank" rel="noopener">Apply Now</a>
      <button class="icon-btn nav-toggle" id="navOpen" aria-label="Open menu" aria-controls="mainNav">${icon("menu")}</button>
    </div>
  </header>
  <div class="nav-scrim" id="navScrim"></div>`;

  /* ---------- Footer ---------- */
  const footerCol = (title, links) =>
    `<div><h5>${title}</h5><ul>${links.map(([l, h]) => `<li><a href="${h}"${attrs(h)}>${esc(l)}</a></li>`).join("")}</ul></div>`;

  const footer = `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="brand light" href="index.html">
          <span class="brand-mark">A</span>
          <span class="brand-text"><strong>Avanthi Institute</strong><small>of Engineering &amp; Technology</small></span>
        </a>
        <p>${C.address}.</p>
        <ul class="footer-contact">
          <li>${icon("phone")} <span>Admission: <a href="tel:+919866664636">${C.admissionPhone}</a><br>Others: <a href="tel:+9108933226739">${C.otherPhone}</a></span></li>
          <li>${icon("mail")} <a href="mailto:${C.email}">${C.email}</a></li>
          <li>${icon("clock")} <span>Mon – Sat: 09:00 AM – 06:00 PM</span></li>
        </ul>
      </div>
      ${footerCol("Institution", [["About Us", "about.html"], ["Principal", "principal.html"], ["Founder & Leadership", SITE + "/founder"], ["Committees", SITE + "/commeitte"], ["IQAC", SITE + "/iqac"], ["NAAC SSR", SITE + "/assets/pdf/AIETM_NAAC_SSR.pdf"]])}
      ${footerCol("Academics", [["Courses Offered", "courses.html"], ["Examinations", SITE + "/exams"], ["Results", SITE + "/results"], ["Placements", SITE + "/placements"], ["Library", SITE + "/library_facilities"], ["Research Centres", SITE + "/researchcenters"]])}
      ${footerCol("Quick Links", DATA.info.map(([l, h]) => [l.length > 40 ? l.slice(0, 38) + "…" : l, h]).concat([["Photo Gallery", "gallery.html"], ["Contact Us", "contact.html"]]))}
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <span>Copyright ©2022 All Rights Reserved · ${C.name}</span>
        <span>Original site designed &amp; developed by <a href="https://sunraisesolutions.com/" target="_blank" rel="noopener">Sunraise Solutions</a></span>
      </div>
    </div>
  </footer>
  <button class="to-top" id="toTop" aria-label="Back to top">${icon("up")}</button>`;

  document.getElementById("site-header").outerHTML = header;
  document.getElementById("site-footer").outerHTML = footer;

  /* ---------- Behaviour ---------- */
  const nav = document.getElementById("mainNav");
  const scrim = document.getElementById("navScrim");
  const openNav = (o) => {
    document.body.classList.toggle("nav-open", o);
  };
  document.getElementById("navOpen").addEventListener("click", () => openNav(true));
  document.getElementById("navClose").addEventListener("click", () => openNav(false));
  scrim.addEventListener("click", () => openNav(false));

  const closeAll = (except) =>
    nav.querySelectorAll(".has-mega").forEach((li) => {
      if (li !== except) {
        li.classList.remove("open");
        li.querySelector("button").setAttribute("aria-expanded", "false");
      }
    });

  nav.querySelectorAll(".has-mega > button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const li = btn.parentElement;
      const o = !li.classList.contains("open");
      closeAll(li);
      li.classList.toggle("open", o);
      btn.setAttribute("aria-expanded", String(o));
    });
  });
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAll();
      openNav(false);
    }
  });

  const hdr = document.getElementById("siteHeader");
  const toTop = document.getElementById("toTop");
  const onScroll = () => {
    hdr.classList.toggle("scrolled", scrollY > 40);
    toTop.classList.toggle("show", scrollY > 600);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  /* Reveal-on-scroll */
  window.observeReveal = () => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
  };
  document.addEventListener("DOMContentLoaded", () => window.observeReveal());
})();
