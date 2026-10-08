/* HTML cleaning (import) and sanitising (admin saves) */
const cheerio = require("cheerio");
const sanitizeHtml = require("sanitize-html");

const ORIGIN = "https://avanthienggcollege.ac.in";

const KEEP_CLASS =
  /^(row|col-(xs|sm|md|lg|xl)-\d+|col|finance-[\w-]+|committee-[\w-]+|active|table|table-[\w-]+|tab-pane|tab-content|nav-tabs|img-container|text-center|text-right|lead|btn|note|highlight|gallery-grid|doc-list|callout)$/;

const ALLOWED_IFRAME_HOSTS = [
  "www.youtube.com", "youtube.com", "www.youtube-nocookie.com", "player.vimeo.com",
  "www.google.com", "maps.google.com", "docs.google.com", "drive.google.com", "forms.gle",
];

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "div", "span", "section", "article", "aside",
  "a", "img", "figure", "figcaption", "ul", "ol", "li", "dl", "dt", "dd",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
  "strong", "b", "em", "i", "u", "s", "sub", "sup", "small", "mark", "blockquote", "pre", "code",
  "iframe", "video", "audio", "source", "center",
];

const SANITIZE_OPTS = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    "*": ["id", "class", "title", "align", "style"],
    a: ["href", "target", "rel", "name"],
    img: ["src", "alt", "width", "height", "loading"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan", "scope"],
    iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder", "loading"],
    video: ["src", "controls", "autoplay", "muted", "loop", "playsinline", "poster", "width", "height"],
    audio: ["src", "controls"],
    source: ["src", "type"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^(left|right|center|justify)$/],
      color: [/^#[0-9a-f]{3,8}$/i, /^rgb\(/i, /^[a-z]+$/i],
      "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgb\(/i, /^[a-z]+$/i],
      "font-weight": [/^(bold|normal|\d{3})$/],
      "font-style": [/^(italic|normal)$/],
      "text-decoration": [/^[a-z -]+$/],
      width: [/^\d+(px|%)?$/],
      height: [/^\d+(px|%)?$/],
      float: [/^(left|right|none)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  allowProtocolRelative: false,
  allowedIframeHostnames: ALLOWED_IFRAME_HOSTS,
  allowIframeRelativeUrls: true,
  transformTags: {
    a: (tag, attribs) => {
      const href = attribs.href || "";
      if (/^https?:/i.test(href) || /\.(pdf|docx?|xlsx?|pptx?|jpe?g|png)$/i.test(href)) {
        attribs.target = "_blank";
        attribs.rel = "noopener";
      }
      return { tagName: "a", attribs };
    },
    img: (tag, attribs) => ({ tagName: "img", attribs: { ...attribs, loading: "lazy" } }),
  },
};

/** Sanitise HTML coming from the admin editor. */
function sanitize(html) {
  return sanitizeHtml(String(html || ""), SANITIZE_OPTS);
}

/**
 * Clean legacy markup from the original site: strip inline styles/scripts/junk,
 * keep semantic structure + a few layout classes, and rewrite links with `link()`.
 */
function cleanHtml(html, link) {
  const $ = cheerio.load(`<div id="__root">${html}</div>`, null, false);
  const root = $("#__root");

  // remove comments
  root.find("*").addBack().contents().each(function () {
    if (this.type === "comment") $(this).remove();
  });
  root.find("script, style, link, meta, noscript, form, input, button, select, textarea, label, svg, i.fa, i[class^='fa'], i[class*=' fa-'], .preloader, #preloader").remove();

  // deprecated / presentational tags
  root.find("font, marquee, tbody > center").each(function () { $(this).replaceWith($(this).contents()); });
  root.find("center").each(function () { this.tagName = "div"; $(this).attr("class", "text-center"); });

  root.find("*").each(function () {
    const el = $(this);
    const attrs = { ...this.attribs };
    for (const name of Object.keys(attrs)) {
      const v = attrs[name];
      if (name === "class") {
        const keep = v.split(/\s+/).filter((c) => KEEP_CLASS.test(c));
        if (keep.length) el.attr("class", keep.join(" "));
        else el.removeAttr("class");
      } else if (name === "style") {
        const m = /text-align\s*:\s*(center|right|justify)/i.exec(v);
        el.removeAttr("style");
        if (m && !/^(img|table)$/.test(this.tagName)) el.attr("style", "text-align:" + m[1].toLowerCase());
      } else if (name === "href") {
        el.attr("href", link(v));
      } else if (name === "src") {
        el.attr("src", link(v));
      } else if (!["id", "alt", "title", "colspan", "rowspan", "target", "allowfullscreen", "controls", "type", "width", "height"].includes(name)) {
        el.removeAttr(name);
      }
    }
    if (this.tagName === "img") {
      el.removeAttr("width").removeAttr("height");
      el.attr("loading", "lazy");
    }
    if (this.tagName === "a") {
      const href = el.attr("href") || "";
      if (/^https?:/i.test(href) || /\.(pdf|docx?|xlsx?|pptx?)$/i.test(href)) el.attr("target", "_blank").attr("rel", "noopener");
      else el.removeAttr("target");
    }
  });

  // drop empty wrappers that only held removed things
  for (let i = 0; i < 3; i++) {
    root.find("div, span, p, section").each(function () {
      const el = $(this);
      if (!el.text().trim() && !el.find("img, iframe, video, table, hr, br").length && !el.is("[id]")) el.remove();
    });
  }

  let out = root.html() || "";
  out = out.replace(/\n\s*\n+/g, "\n").replace(/[ \t]{2,}/g, " ").trim();
  return sanitize(out);
}

module.exports = { cleanHtml, sanitize, ORIGIN };
