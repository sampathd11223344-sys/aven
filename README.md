# Aven – Avanthi Institute of Engineering & Technology (redesign)

An alternative UI/UX for https://avanthienggcollege.ac.in/. All content and links are the same as the original site. Only the design is new.

## Pages
- `index.html`: home page with hero slider, latest-notices ticker, quick links, NAAC A+ award, a notice board with tabs and search (Exam Results / Academic Notifications / Time Tables), vision & mission, salient features, courses, cultural programs, latest events and college info
- `about.html`: About Avanthi Group, campus, vision/mission, leadership
- `principal.html`: Principal's message and qualifications
- `courses.html`: courses, yearly sanctioned intake, seat allotment, AICTE orders
- `gallery.html`: searchable gallery of events
- `contact.html`: contact details, office hours and a map

## Editing content
All notices, results, time tables, events, menu links and quick links are stored in **`assets/js/data.js`**. Edit that one file to update the site.
The header, mega menu and footer are shared by every page through `assets/js/layout.js`.

Sub-pages and PDFs that were not rebuilt here link straight to the original site, so every link still works.

## Run locally
```
python3 -m http.server 8080
```
