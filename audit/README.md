# Mazingira Safari: website audit

**Site:** https://www.mazingirasafari.com
**Captured:** 26 Oct 2026
**Scope:** all 57 URLs in the sitemap, rendered in a real browser, plus the old URLs that search engines still list
**Status:** review only, nothing has been built yet

## In one paragraph

Mazingira is an Arusha-based safari operator. Its Wix site has **real assets worth keeping**: strong original wildlife photography, about 45 well-written destination and activity pages, 9 detailed itineraries with tiered pricing, a TATO membership, a TripAdvisor presence and clear booking terms. The site lets those assets down. **Enquiries can go to the wrong email domain.** Prices for the same trip differ in up to three places. One advertised trip links to a dead Canva page. The Blog link opens the FAQs, and the Testimonials page is empty. Old WordPress URLs return 404 with no redirects. On top of that, there are copy-paste errors, typos and a design that mixes 12 fonts. A rebuild should **keep the content and photos, and rebuild the structure, conversion paths and design.**

## Top 10 findings

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | 🔴 Critical | Contact page lists `info@mazingira.com` and `uk.sales@mazingira.com`, the **wrong domain** (the site uses `mazingirasafari.com`). Customers who copy these addresses send enquiries somewhere else. | `/contact` |
| 2 | 🔴 Critical | **Prices conflict** for the same trip: Serengeti Escape is $3,950 on the home card, $4,090 on the packages listing and $4,099 on its own page. Savannah to Shore is $5,495 vs $5,699. Honeymoon is $8,600 vs $8,650. Serengeti Under the Stars is **$2,800 on mobile** vs $2,199 on desktop. | home, `/safari-packages`, package pages |
| 3 | 🔴 Critical | **Bank details are published** on the T&Cs page under the account name "LOCAL SAFARI GUIDE PROMOTION LTD", which isn't the trading name. A SafariBookings reviewer reported that the website's bank details didn't match the ones emailed to them. This is a fraud and trust risk; confirm with the client. | `/terms-conditions` |
| 4 | 🟠 High | "Wild Wonders" (10 days, $7,500, the most expensive trip after the honeymoon) links to `mazingirasafariuk.my.canva.site/maintenance`. **No detail page exists.** | `/safari-packages` |
| 5 | 🟠 High | The **Blog menu item opens the FAQ page**: `/blog` renders the FAQs. 4 of the 8 blog posts aren't linked from anywhere. | nav, `/blog` |
| 6 | 🟠 High | The **Testimonials page is empty**: no reviews render. The only on-site reviews are 3 on the homepage, with no source. | `/testimonials` |
| 7 | 🟠 High | Old WordPress URLs (`/about-mazingira/our-guides/`, `/about-mazingira/the-mazingira-difference/`) still appear in search results but **return 404 with no redirect**, so their search ranking and backlinks are lost. | old site |
| 8 | 🟠 High | **Copy-paste errors in tour facts.** Wildlife Photography says "12 Days" while its text says 8 days, and it lists Zanzibar, which the itinerary doesn't visit. Winged Wonders and Serengeti Escape also list Zanzibar in their locations. The "Romantic Sunset Picnic" description is the night-drive text. | package pages, `/activities` |
| 9 | 🟡 Medium | **Contact details are inconsistent**: P.O. Box 12544 vs 12345, two phone numbers, a malformed `tel:` link in the header, and a © 2023 footer. | footer, `/contact`, `/accessibility-statement` |
| 10 | 🟡 Medium | **Enquiry paths are scattered**: 3 different forms (a 2-step safari form, a Kilimanjaro form with a full postal address, and a contact form). The Kilimanjaro form's URL is misspelled (`/klimanajro-enquiry`). There's no WhatsApp option, even though the main number is a Tanzanian mobile. | forms |

All findings, with evidence, are in [`06-issues.md`](06-issues.md).

## Documents

| File | What it is |
|---|---|
| [`01-sitemap.md`](01-sitemap.md) | Every page, the navigation tree, orphan pages and dead URLs |
| [`02-content-inventory.md`](02-content-inventory.md) | What content exists and how good it is. Data is in [`content/`](content/) |
| [`03-brand-design.md`](03-brand-design.md) | Logo, colours, fonts, imagery, layout patterns |
| [`04-conversion.md`](04-conversion.md) | Calls to action, forms, chat and how visitors get to an enquiry |
| [`05-technical.md`](05-technical.md) | Platform, performance, SEO, third-party tools |
| [`06-issues.md`](06-issues.md) | Every issue found, by severity |
| [`07-keep-improve-drop.md`](07-keep-improve-drop.md) | **The decision list we go through together before building** |
| [`08-questions-for-client.md`](08-questions-for-client.md) | Things only Mazingira can answer |
| [`workflow-notes.md`](workflow-notes.md) | What this audit taught us for the reusable "regenerate a client website" skill |
| `content/*.json` | Structured content: tours (with itineraries, prices, inclusions), business details, team, FAQs, testimonials, blog, page index |
| `screenshots/` | Full-page desktop screenshots (1440px wide) of all 57 URLs, plus iPhone 13 screenshots of 7 key pages |
| `raw/` | Raw text, links, images and form fields for every page, as captured |
| `scripts/` | The Playwright scripts used to capture all of the above |
