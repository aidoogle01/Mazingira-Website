# 06: Issues found

The severity ratings mean:
- 🔴 **Critical:** loses enquiries or money, or creates legal or fraud risk. Fix even before the rebuild launches.
- 🟠 **High:** visibly broken or damaging to trust.
- 🟡 **Medium:** inconsistent or sloppy.
- ⚪ **Low:** polish.

## 🔴 Critical
1. **Wrong email domain on the Contact page.** It shows `info@mazingira.com` and `uk.sales@mazingira.com`; the correct domain is `mazingirasafari.com`. *Quick fix for the client in Wix today.*
2. **The same trip has conflicting prices.**
   - Serengeti Escape: home $3,950 · listing $4,090 · page $4,099
   - Savannah to Shore: home $5,495 · listing/page $5,699
   - Honeymoon: listing $8,600 · page $8,650
   - Serengeti Under the Stars: desktop $2,199 · **mobile homepage $2,800**
3. **Bank details are public, under a different company name.** `/terms-conditions` lists a USD account in the name "LOCAL SAFARI GUIDE PROMOTION LTD". A SafariBookings review says the website's bank details didn't match those emailed to the customer. Whatever the explanation, it looks like a scam pattern to customers. Confirm the correct legal entity and move bank details into quotes only.
4. **No cookie consent banner was seen, but the Facebook Pixel is active.** This is a UK/EU privacy risk given the UK sales presence. *Verify in a normal browser: Wix may show a banner that didn't load in our capture.*

## 🟠 High
5. The **"Wild Wonders" Ruaha trip ($7,500)** links to a Canva maintenance page. There's no detail page.
6. The **`/blog` page renders the FAQ page**, so the Blog menu item is broken.
7. **`/testimonials` is empty.**
8. **Old WordPress URLs 404**, with no redirects.
9. **Trip facts don't match their itineraries.**
   - Wildlife Photography: "DURATION 12 Days" but the text says 8 days and the day tabs cover 8 days. Locations include Zanzibar and the itinerary has no Zanzibar.
   - Winged Wonders: locations include Zanzibar but the itinerary ends at Ngorongoro. It visits Lake Natron, which isn't listed.
   - Serengeti Escape (5 days): locations include Zanzibar.
   - Savannah to Shore (9 days): has a **"Day 12"** tab.
   - Great Migration: two "Day 6" sections.
   - Kilimanjaro: three sections titled "Day 5". "Laver Tower" should be Lava Tower, "Katanga" should be Karanga. The routes page says Machame is chosen by "about 60% of our guests", while the package page says "around 35% of climbers".
   - Family Safari: "Day 4 - 5" and "Day 5" overlap.
10. **The "Romantic Sunset Picnic" card** on `/activities` uses the night game drive description.
11. **The Wix mobile layout has drifted from desktop** (different prices). Mobile is likely to be the majority of traffic.
12. **The `/items/this-is-a-title-0x` placeholder URLs** are in the sitemap and return 404.

## 🟡 Medium
13. **P.O. Box** is 12544 in the footer and on Contact, but 12345 in the Accessibility statement.
14. **The header phone link is malformed** (`tel:+ 255784278205`).
15. **Business names are inconsistent**: Mazingira Safari / Mazingira Safaris / Mazingira Eco Friendly Safari Adventure / "Eco-Friendly Safari Adventures".
16. **The TripAdvisor badge is from 2020**, which looks stale. The footer says © 2023.
17. **Three separate forms.** The Kilimanjaro form asks for a full postal address up front.
18. **4 of 8 blog posts are orphaned.** Posts are generic, and one still contains the AI prompt scaffolding ("Title:", "Introduction:", "Conclusion:").
19. **12 font families** on one page. Three slightly different sage greens.
20. **Johari Msangi** is named as a Travel Specialist but isn't on the team page.
21. **The accommodation page claims "over 60" lodges** but shows 9. Its buttons are labelled "VIEW ACCOMODATION" (misspelled).
22. **Some content is out of date**: a COVID-19 entry note, and a blog title with "in 2024".
23. **`/national-parks` H1 is "THE SERENGETI"**, and `/kilimanjaro-routes` has empty H1s.

## ⚪ Low (typos and polish, fix during content migration)
- "Accomodation" (H1, buttons, every itinerary) · "Nogorongoro" · "ngorogoro" (URL) · "klimanajro" (URL) · "ARUSHEA" · "Tarangerie" (title) · "Lake Mantra" (Big 5 page; should be Manyara) · "Maasi Village" · "Safari's"/"Visa's" (wrong apostrophes) · "Start Planing" · "the safari it's self" (testimonial, so leave as the customer wrote it) · "Kilimajoa" (should be Kilimamoja) · "FWD vehicle" (should be 4WD/4x4)
- Missing space: "Arrival in ArushaYour adventure…" (Winged Wonders)
- Repeated closing line about the Serengeti on the Lake Manyara page
