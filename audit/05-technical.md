# 05: Technical

## Platform
- **Wix** (Thunderbolt renderer), behind Cloudflare. The sitemap and robots.txt are Wix's automatic versions.
- Wix page types in use: static pages, Wix Blog (`/post/...`), a dynamic collection (`/packages/...`, used for one trip only) and an unused dynamic collection (`/items/...`, the placeholders).
- **Previously WordPress.** Old `/about-mazingira/...` URLs are still in search results and now 404.
- A **separate mobile layout** (a Wix feature) that has drifted from desktop: different prices.

## Third-party tools found
| Tool | Purpose |
|---|---|
| Facebook Pixel (`connect.facebook.net`) | Ad tracking. Check for a cookie consent banner: **none was seen**, a GDPR/UK risk given the UK sales office. |
| Poptin (`cdn.popt.in`) | Pop-ups and email capture |
| Wix Chat (`engage.wixapps.net`) | Live chat |
| Wix Pro Gallery | Photo gallery |
| Sentry | Wix's own error tracking |
| YouTube | One embed |
| TripAdvisor | Badge and link |
| Google Analytics / Tag Manager | **Not detected** in our capture. Ask the client what analytics they use. |

## Performance (iPhone 13 emulation, from our server)

| Page | Largest paint | Requests | Downloaded (compressed) | Uncompressed JS |
|---|---|---|---|---|
| Home | ~0.6s | 165–210 | ~4.4 MB | ~50 MB |
| Safari packages | ~2.4s | ~180 | ~1.5 MB (some cached) | ~33 MB |
| Package page | ~2.2s | ~200 | ~0.6 MB (some cached) | n/a |

- **Wix's framework accounts for most of the weight**: three JavaScript bundles of 12–15 MB each uncompressed. The site owner can't fix that on Wix. A static rebuild typically brings a page under 1 MB with about 20 requests.
- Our server is not a typical visitor on a mobile network in the UK, US or Europe. Use these figures to compare pages with each other, not as absolute speeds. Run PageSpeed Insights for official numbers.
- No horizontal scrolling on mobile. ✅

## SEO
| Check | Result |
|---|---|
| Page titles | ✅ Present and unique: "Page \| Mazingira Safari". Typos: "Tarangerie National Park", "Balloon Safari's", "Walking Safari's". The honeymoon page title is just "Safari Packages". |
| Meta descriptions | ✅ Present on every page |
| H1 | ⚠️ `/national-parks` H1 is "THE SERENGETI". `/blog` H1 is "FAQ'S". `/kilimanjaro-routes` has 9 H1s, 4 of them empty. Typos: "Accomodation", "Nogorongoro", "Visa's" |
| URL slugs | ⚠️ Misspelled: `/ngorogoro-national-park`, `/klimanajro-enquiry`. Inconsistent: `/packages/honeymoon-package` vs `/*-package` |
| Canonical | ✅ Correct |
| Image alt text | ✅ Mostly present (Wix auto-fills it). 16 images on the homepage have none. |
| Structured data | ❓ Not checked in this pass. A rebuild should add TravelAgency, Trip/TouristTrip, FAQPage and AggregateRating. |
| Sitemap | ⚠️ Includes 3 URLs that 404 (`/items/...`) |
| Redirects from the old site | ❌ None |
| Blog | ⚠️ 8 thin, generic posts with 4–13 views each, nothing since Sep 2024 |
| Languages | English only. Consider German and French; the client should confirm the markets. |

## Accessibility
- The site has an accessibility statement claiming WCAG 2.1 AA. The design doesn't fully meet it: low-contrast pale-sage text, empty H1s, 16 images without alt text on the homepage, and itinerary tabs that may not work with a keyboard.
- Contact details in the statement don't match the rest of the site (P.O. Box 12345).
