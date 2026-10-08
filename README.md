# AIETM – Avanthi Institute of Engineering & Technology (redesign + CMS)

This is a redesigned version of **https://avanthienggcollege.ac.in/** with a built-in **admin panel**.
The content and the URLs are the same as the original site. Only the UI/UX is new.

- **All 907 pages of the original site** (departments, committees, events, R24 syllabus, exam cell, placements…) are served at **the same paths**, e.g. `/about`, `/cse`, `/iqac_committee?section=committee_members&year=2024-25`.
- The **full menu** (24 sections, 265 links) is included. A navy bar shows the main sections with fly-out sub-menus, and the searchable **“All Menus”** overlay lists every link.
- **Images, PDFs and videos** (`/assets/...`) are served from the original domain, unless a file has been uploaded locally through the admin panel.
- Old static-site URLs such as `/about.html` redirect to the new paths.

## Run

```bash
npm install
npm start            # http://localhost:8080
# npm run dev        # auto-restart on changes
```

Environment variables (all optional):

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8080` | HTTP port |
| `ADMIN_PASSWORD` | – | Initial password for the `admin` user (otherwise `Avanthi@2026`, which must be changed on first login) |
| `DATA_DIR` | `./data` | Where content, users, uploads and backups are stored |

## Admin panel – `/admin`

The default login is **`admin` / `Avanthi@2026`**. The panel asks you to change this password the first time you sign in.

| Section | What you can do |
|---|---|
| Dashboard | Visitor chart for the last 14 days, most viewed pages, recent activity, quick actions |
| Notice board | Add, edit, delete and reorder (drag & drop) **Exam Results, Notifications and Time Tables**, with PDF upload |
| Events & gallery | Latest events cards and the cultural programs carousel |
| Homepage | Hero slider, headline texts, popup slides, floating videos, quick links, award photos, mission, objectives, features, courses and info links |
| Pages | Search and filter all 907 pages, edit them in a rich-text editor (Jodit, with HTML source mode and a media library), create, delete, set drafts and change URLs |
| Menus | Tree editor for the main menu (reorder, nest, choose which items appear in the header bar) and for the top-bar links |
| Media library | Upload images, PDFs, Office files and videos, copy their links, delete them |
| Enquiries | Messages from the contact page and footer forms: read/unread, reply by email, export to CSV |
| Site settings | Name, logos, Apply/brochure links, contact details, map, footer institutions, SEO |
| Users | Administrator and editor accounts (admin only) |
| Backups | Automatic snapshots with one-click restore, plus full JSON export and import (admin only) |
| Activity log | Who changed what, and when |

Security features: bcrypt password hashes, HTTP-only session cookie, login throttling, Origin checks on write requests, HTML sanitising of everything saved through the editor, and a strict CSP (no inline scripts).

## Project layout

```
server/server.js         Express app: public routes, CMS page lookup, /assets fallback, sitemap
server/routes/admin.js   Admin REST API
server/lib/              store (JSON + backups), auth, html cleaning/sanitising, nav helpers
views/                   EJS templates (header/footer partials, home, page, contact, search, 404, admin)
public/css, public/js    Public site styles + behaviour
public/admin             Admin panel (vanilla JS single-page app)
data/site.json           Menus, homepage sections, notices, settings
data/pages.json          All page contents
scripts/import-crawl.js  Re-imports content from a raw crawl in _crawl/ (not committed)
```

Runtime files (`data/users.json`, `messages.json`, `stats.json`, `activity.json`, `backups/`, `assets/uploads`) are created automatically and are ignored by git.
