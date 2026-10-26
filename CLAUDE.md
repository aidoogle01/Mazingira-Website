# Mazingira Safari website

The rebuild of mazingirasafari.com for Mazingira Safari, a Tanzanian-owned safari company in Arusha. The site owner makes all changes with Claude; there is no client-facing CMS. Mazingira sends price and itinerary changes to the owner, who asks Claude to apply them.

## Where things are

- `content/`: the single source of truth for every page (trips, parks, experiences, pages, team, FAQs, reviews, site settings, routes, redirects). See `content/README.md`.
- `design/system/`: the design system (brand book `README.md`, `tokens.json`, `mz-` components). Read `design/system/README.md` before changing anything visual.
- `reports/Safari website benchmarks and AI design.md`: the research behind the design and content decisions.
- `audit/`: the audit of the old Wix site and the lessons in `audit/workflow-notes.md`.
- `tools/`: the content builder, route builder and validator.

## The website (`site/`)

Astro 7 static site, built from `content/` and `design/system/` (nothing is copied by hand). Hosted on Vercel with the project root set to `site/`.

- `cd site && npm install && npm run build` builds `site/dist/`; `npx astro dev` runs it locally.
- Photos: `python3 tools/fetch_photos.py` downloads Mazingira's own photos into `site/src/assets/photos/` and classifies them (`photo`, `lodge`, `map-graphic`, `graphic`). Only `photo` is ever shown. Which photo leads each page is art direction in `site/src/lib/art.ts`.
- Styles: `site/src/styles/global.css` implements the design system plus its cinematic layer; tokens come from `design/system/tokens.json` at build time.
- Pages built so far: Home, the Safaris index and every trip (`/safaris/<id>`, `/kilimanjaro/<id>`). Everything else shows the "not built yet" page.
- The enquiry form doesn't send yet; it says so. Connect a form service before launch.

## How to make a content change (prices, itineraries, team, pages)

1. Content in `content/` is **generated** by `tools/build_content.py` from the old site's data, then overlaid with `content/_review/client-answers.json`. A hand edit to a generated file is overwritten on the next build. So:
   - For a change that comes from Mazingira (a new price, a confirmed answer), record it in `content/_review/client-answers.json`: add an `apply` entry, set `"status": "confirmed"`, and add `confirmed_by` with who and when.
   - For a fix to how the old content is cleaned up, change `tools/build_content.py`.
   - Content that is new rather than migrated (a new trip, a new guide) goes in through the same answers file, or the builder gains a section for it. Never edit a generated file silently.
2. Rebuild and check: `python3 tools/build_content.py && python3 tools/build_routes.py && python3 tools/validate_content.py`. Before any launch or price change goes live, also run `python3 tools/validate_content.py --strict`, which fails while placeholders or unconfirmed prices remain.
3. A trip's price lives only in its trip file (`price.from`, `price.tiers`). Never type a price anywhere else; the site renders it from there.
4. Every removed or renamed page needs a redirect. `tools/build_routes.py` fails if an old URL has none.

## Rules that protect the brand

- Follow the voice rules in `design/system/README.md`: British English, sentence case, specific facts, no "breathtaking", "unforgettable", "once-in-a-lifetime" or "embark".
- Use only Mazingira's own photos. No Wix stock (`11062b_` IDs), and never AI-generated images of wildlife, places or people.
- No bank account details anywhere on the site. Payment guidance lives on the "How to pay us safely" page.
- No all-caps labels, no "·"-joined strings, no arrows on links, no new shadows or animations. The route map is the only motion.
- Customer reviews are quoted exactly, never edited.
- Don't invent facts. If a detail isn't in `content/` or confirmed by Mazingira, ask.
