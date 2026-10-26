# Workflow notes: turning this audit into a reusable skill

What happened while auditing mazingirasafari.com, and what the "regenerate a client website" workflow should do because of it.

## The audit stage as a pipeline

```
0. Preflight     → can we reach the site, its builder's servers and its assets? Which platform is it?
1. Discover      → sitemap.xml + robots.txt + crawl of the menu links + old URLs from search results
2. Capture       → render every URL in a real browser: text, headings, links, images, forms, scripts,
                   full-page desktop and mobile screenshots
3. Deep capture  → interactive content (tabs, accordions, carousels, multi-step forms), design details, performance
4. Extract       → structured JSON: products/trips, business, team, FAQs, reviews, blog, page index
5. Analyse       → site map, content, brand, conversion, technical, issues (ranked by severity)
6. Decide        → keep / improve / drop list + questions for the client   ← human review gate
7. (later) Build → generate the new site from content/*.json + design decisions
```

Stages 0–5 can run automatically. Stage 6 is the **review gate**: a person (you, then the client) signs off before any build.

## Lessons from this run

| # | What happened | What the skill should do |
|---|---|---|
| 1 | The first URL attempts failed. The web fetch tool returned "domain not found" even though the site was live; the container's proxy refused the host. | **Preflight first**: `curl` the domain from the environment the agent actually runs in, and stop with a clear message if it fails. Don't assume a fetch tool sees the same internet as the client's browser. |
| 2 | The cloud environment's network allowlist had to include the client's domain **and** the website builder's servers. | Keep a **per-platform allowlist** in the skill. For Wix that's `static.wixstatic.com`, `static.parastorage.com`, `*.wix.com`, `*.wixapps.net`. List Squarespace, WordPress, Webflow and Shopify equivalents too. Request them all up front. |
| 3 | Every page showed "Widget Didn't Load". It turned out to be the Wix Chat host, blocked by *our* allowlist, not a fault on the site. | After the crawl, **read the proxy's blocked-host log** and mark any page element that depends on a blocked host as "not verified", never as a client issue. |
| 4 | Wix pages never reach "network idle", so every page hit a 60s timeout but the content had loaded. | Wait for `load` plus a fixed settle time and a scroll, not `networkidle`. Record the HTTP status separately. |
| 5 | Plain HTML fetches of Wix sites return almost no content. | Always render pages with Playwright. Detect the platform from response headers (`x-wix-request-id`, `generatedBy="WIX"`). |
| 6 | Itineraries were hidden in tabs, and clicking them was unreliable (Day 2 was often missed). | Have specific handlers for tabs, accordions and carousels. After clicking, **wait until the expected heading appears**, retry, and report how complete the capture is per item. Flag incomplete items for a manual check. |
| 7 | Wix keeps a separate mobile layout, which showed a different price. | **Capture and compare desktop and mobile text.** Any difference between them is a finding. |
| 8 | Many of the best findings came from comparing the same fact in different places: prices, emails, P.O. Box, trip lengths. | Build a **consistency checker**: extract emails, phones, prices, addresses, durations and locations from every page and flag conflicts automatically. This was the most valuable analysis step. |
| 9 | The sitemap lists URLs that 404, and old-platform URLs live on in search results. | Check every sitemap URL's status. Search `site:domain` for URLs not in the sitemap, and check each one. That becomes the **redirect map**. |
| 10 | Uncompressed body sizes (about 50 MB) looked alarming. Compressed transfer was about 4 MB. | Report the compressed transfer size from `PerformanceResourceTiming.transferSize`. Label measurements as taken from the server, not real-user data. |
| 11 | Third-party content (TripAdvisor and SafariBookings reviews, lodge sites) holds a lot of the trust signals. | Also capture the client's **review profiles** (rating, count, recent reviews), with permission. |
| 12 | A trust issue (published bank details under a different company name) only came to light by connecting the T&Cs page with an outside review. | Include a **sensitive information scan** (bank details, personal phone numbers, internal documents) and list the results in the questions for the client, rather than publishing them widely. |
| 14 | Clicking through itinerary tabs in a browser stayed unreliable after three attempts. Then we found that **Wix publishes every page's full content as JSON** on the client's own domain (`/sites/<pageJsonFileName>.json.z`; the file names are listed in each page's HTML). That gave every itinerary day, plus team bios hidden in pop-ups, with no clicking at all. | **Check for builder data first, before scraping the rendered page.** Wix: page JSON. WordPress: the REST API (`/wp-json/wp/v2/pages`). Squarespace: `?format=json`. Shopify: `/products.json`. Use the rendered capture only for layout, images and screenshots. `tools/wix_page_text.py` is the Wix version. |
| 15 | Building the content model surfaced more errors than the audit did: day headings that don't match their tabs, places an itinerary visits but the trip doesn't list, a duplicated Day 7 title. | Keep consistency checks in the **builder** (`flag()`), and write them to a `needs-client.md` checklist. Every check found real issues here. |
| 13 | About 57 pages took about 10 minutes with 4 parallel browser tabs. | Fine at this scale. Cap concurrency and throttle requests so the client's site isn't overloaded, and respect `robots.txt` crawl delays. |

## Reusable outputs from this run
- `scripts/crawl.js`: sitemap → render → JSON + screenshots (works for any site)
- `scripts/itin2.js`: tab capture (Wix-specific selectors; generalise next)
- `scripts/design-mobile-perf.js`: design details, mobile screenshots and performance
- `scripts/weigh.js`: page weight breakdown
- The `content/*.json` structure is the first version of a **client content schema** (trips, business, team, FAQs, reviews, blog, pages) that the build stage can consume.

## To build next (for the skill)
0. Platform data extractors (lesson 14). Wix is done (`tools/wix_page_text.py`, `tools/build_content.py`).
1. The preflight script and per-platform allowlists (lessons 1–5)
2. The consistency checker (lesson 8)
3. A desktop vs mobile comparison (lesson 7)
4. Generalised handlers for interactive content (lesson 6)
5. Markdown templates for documents 01–08, so every client audit has the same shape
