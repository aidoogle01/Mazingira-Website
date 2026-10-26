# 02: Content inventory

There are about **27,000 words** across 57 URLs. The full text of each page is in `raw/pages/<slug>.json` (`text` field). Structured extracts are in `content/`.

## Summary

| Content | Count | Quality | Structured file |
|---|---|---|---|
| Tour packages | 9 detail pages + 1 listing-only | **Strong.** Each has duration, best time to travel, locations, starting point, a summary, a day-by-day itinerary with meal plan and lodge per day, price tiers by group size, and inclusions/exclusions. Weaknesses: copy-paste errors and conflicting prices (see 06). | `content/tours.json` |
| Destinations | 7 parks + Tanzania overview + Big 5 | **Good.** 500–700 words each, a consistent template (intro → highlights → "Important facts" → wildlife → travel times), photo carousels. Some typos. | `raw/pages/*` |
| Activities | 6 pages + hub | **Good.** 200–450 words each. | `raw/pages/*` |
| Kilimanjaro | Hub, routes, packing guide, 1 package | **Good.** Clear route comparison. Only one package (Machame). | `raw/pages/*` |
| Planning guides | Travel guide, visa, what to pack, about Tanzania | **Useful.** Some content is dated (COVID-19 entry note). | `raw/pages/*` |
| Accommodation | 9 lodges showcased (claims "over 60") | **Okay.** Links out to the lodges' own sites. | `raw/pages/accommodation.json` |
| FAQs | 11 Q&As | **Good.** Ready for FAQ structured data (search markup). | `content/faqs.json` |
| About / team | Story, why choose us, 13 team members + 1 more named elsewhere | **Okay.** Team photos are clickable, but per-person bios weren't captured. | `content/team.json` |
| Testimonials | 3 on the homepage, none on `/testimonials` | **Weak.** No source, date or trip. | `content/testimonials.json` |
| Blog | 8 posts, Apr–Sep 2024 | **Weak.** Generic, apparently AI-written (one still has "Title:" and "Introduction:" labels in its body), 4–13 views each, nothing since Sep 2024. | `content/blog.json` |
| Booking & legal | Booking process (8 steps), payment T&Cs, cancellation, accessibility statement | **Useful.** Needs a review, especially the published bank details. | `content/business.json` |

## Tours at a glance

| Trip | Days | From (USD pp) | Basis | Best time | Itinerary captured |
|---|---|---|---|---|---|
| Serengeti Escape: A Romantic Adventure | 5 | $4,099 (also shown as $3,950 / $4,090) | 2 sharing | Jun–Sep | 1 of 5 days ⚠️ |
| Luxury Savannah to Shore | 9 | $5,699 (home: $5,495) | 6 sharing | Jun–Sep | 7 of 9 |
| Serengeti Under the Stars (camping) | 7 | $2,199 (mobile home: $2,800) | 6 adults | Jun–Sep | 5 of 7 |
| Family Wilderness Adventure | 7 | $3,300 | 6 sharing | Jun–Aug | 5 of 6 tabs |
| Romantic Honeymoon Safari + Zanzibar | 12 | $8,650 (listing: $8,600) | 2 sharing | Jun–Sep | 8 of 9 |
| Winged Wonders (birding) | 7 | $2,800 | 6 sharing | Nov–Apr | 6 of 7 |
| Great Migration River Crossing | 7 | $3,799 | 6 sharing | Jul–early Oct | 7 of 7 ✅ |
| Wildlife Photography Safari | 8 (page says 12) | $3,150 | 6 sharing | Year-round | 0 ⚠️ |
| Kilimanjaro: Machame Route | 7 | $2,450 | n/a | Jan–Mar, Jun–Oct | 6 of 7 |
| Wild Wonders (Serengeti, Tarangire, Ruaha) | 10 | $7,500 | n/a | n/a | **No page** |

⚠️ Wix shows itinerary days in tabs, and some tabs didn't switch reliably in the headless browser. Day 2 is missing from most captures. Missing days still exist on the live site, so a rebuild must capture them in full: re-run `scripts/itin2.js` or copy them by hand. The client may also have the itineraries in documents already.

**Common package structure:** every package uses the same inclusions template (English-speaking guide, private 4x4 with pop-up roof, park fees with VAT, airport transfers, drinking water, Flying Doctors cover) and the same exclusions template (international flights, insurance, visas, tips, personal items). In a rebuild, this becomes **shared data**, not text repeated on every page.

## Lodges named (from accommodation page and itineraries)

Gran Meliá Arusha · Lake Duluti Lodge · Mount Meru Hotel · Mama Wilsen House · Ngaresero Mountain Lodge · Escarpment Luxury Lodge Manyara · Kilimamoja Lodge (Manyara) · Ngorongoro Lodge Meliá Collection · Ngorongoro Serena · Farm of Dreams (Karatu) · Nanyukie Lodge (Lemala) · Kubu Kubu Tented Lodge · Anantya Serengeti · Nyota Luxury Camps · Four Seasons Serengeti · Meliá Serengeti · Mara Under Canvas · Lions Paw · Maramboi Tented Lodge · Tarangire Sopa · Lake Masek Tented Lodge · Meliá Zanzibar · Essque Zalu Zanzibar

## Photography

About 30 original-looking images per page: wildlife close-ups, a branded Mazingira vehicle, tented camps, Maasai guides on a Zanzibar beach. The quality is **high and authentic**, the strongest asset on the site. Wix serves them from `static.wixstatic.com`, and each image URL is in `raw/pages/*.json → images[]`. **Before reusing any image, confirm which photos Mazingira owns and which belong to lodges or stock libraries.**
