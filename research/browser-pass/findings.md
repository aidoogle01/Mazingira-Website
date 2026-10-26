# Browser pass: what 18 safari websites actually show

Captured 26 October 2026 with Playwright (headless Chromium 1.63) from a full-network cloud environment. For each site: the homepage, one trip, camp or itinerary page (Tanzania where one exists), and the enquiry or contact page, each at desktop (1440×900) and mobile (iPhone 13 emulation). Screenshots and the raw extraction sit in `research/browser-pass/<site>/`:

- `<page>-<desktop|mobile>-fold.jpg` is the first screen as loaded, before the cookie banner was dismissed.
- `<page>-<desktop|mobile>.jpg` is the full page after dismissing cookies and scrolling, capped at 6,000 px (desktop) or 9,000 px (mobile).
- `data.json` holds every value quoted below.

Scripts: `capture.js` (capture), `frame-forms.js` (forms inside iframes), `digest.py` (readable summary), `sites.tsv` (URLs used).

## How to read this

- **Observed** means it is visible in the screenshots or read from the page's DOM. Anything else is labelled *(inference)* or *(not checked)*.
- **Blocked.** Nomad Tanzania and Audley served a Cloudflare "Just a moment…" challenge. Angama served Cloudflare's "Sorry, you have been blocked". No workaround was attempted, so these three are **not observed**.
- **The visitor looks American.** The container's IP geolocates to the US. Expert Africa showed US$ and a 1-800 number, Yellow Zebra showed a "Browsing from the USA?" modal, and phone numbers and currencies may differ for a UK visitor.
- **No form was submitted.** Multi-step forms were read from the DOM (hidden steps included) or from the first visible step. Nothing was clicked except cookie "Accept" buttons.
- **Performance is rough.** It comes from one cold load per page from a US data centre, unthrottled.
  - LCP comes from `PerformanceObserver`. Desktop runs came first, so desktop LCP often includes cold DNS, TLS and CDN-cache costs that the mobile run then avoided. Compare sites with each other; don't treat the numbers as field data.
  - "Transfer" is the Performance API's `transferSize` total before scrolling. It undercounts cross-origin files that lack `Timing-Allow-Origin`.
- **Colours** are the largest painted background areas and the most frequent text colours, from computed styles. **Typefaces** come from `document.fonts` (loaded faces) and the computed `font-family` of h1, h2, p, nav and buttons.
- **Photography mix** is judged from the screenshots and image alt text, not counted.
- **AI-slop tells** are checked against the Anthropic frontend-design list quoted in the report.

---

## Luxury camp brands

### Singita (`singita/`)
- **Nav:** Our Collection · Plan your trip (terracotta button) · Search · Menu. **H1:** "Place of Miracles" (home), "Sasakwa Lodge", "Contact".
- **Hero:** autoplaying, muted, looping Vimeo video on home; stills on the lodge and contact pages.
- **CTA:** "Plan your trip" in the header on every page. A desktop bottom bar offers Regions / Lodges / Dates / Guests / "Check availability"; the lodge-page version reads "Lodge menu | Check availability". Pop-up cards promote the magazine and an "Exclusive Offer".
- **Enquiry (contact page):** single step, 13 visible fields: title, first name, last name, email, confirm email, country, phone, "I am a" (travel agent / guest / journalist / donor / supplier / other), preferred contact method, message, travelled before, newsletter, consent; plus reCAPTCHA. Below it are department accordions and 21 named staff email addresses. Where "Plan your trip" leads was not captured.
- **Live contact:** none. No chat or WhatsApp; phone numbers on the contact page only.
- **Price on lodge page:** **none** on the Sasakwa page. The report's rack rates live on separate `/information/` pages *(not re-checked)*.
- **Reviews/trust:** no review widget or badges on home or the lodge page.
- **Type:** Morion (serif; h1 100px/400) + Europa (sans; nav and buttons).
- **Colours:** warm off-white #F4F1EC / #F1EDE6 dominant, terracotta #CB9275 accent, charcoal #1F1F1F, text #484848.
- **Photos:** lodge interiors, food, landscape, wildlife; people are rare (an artist, a gardener, small activity tiles).
- **Mobile:** fixed header with "Plan your trip". The bottom bar reads "Place of Miracles | Plan your trip" on home and "Lodge menu | Check availability" on the lodge page. No overflow.
- **Performance:** home LCP 2.8 s desktop (TTFB 2.1 s) / 0.6 s mobile, 1.5 MB; lodge page 0.4 s.
- **Slop tells:** **warm cream + high-contrast serif + terracotta accent, exactly.** A few "›" and "→" link arrows. No eyebrows and no card kit.

### Wilderness (`wilderness/`)
- **Nav:** MENU · logo · search · ENQUIRE NOW (orange). Inside the menu: Destinations, Camps, Regions, Experiences, Journeys, Exclusive Offers, Journal, plus a country list. **H1:** "WILDERNESS" (tracked capitals under a "Welcome to" eyebrow); "Usawa Serengeti"; "Contact".
- **Hero:** Cloudflare Stream video on home; still on the camp page.
- **CTA:** "ENQUIRE NOW" in the header on every page (mobile: "ENQUIRE"). The camp's rate table carries "TALK TO YOUR TRAVEL DESIGNER FOR MORE INFORMATION".
- **Enquiry (`?_enquiry=1`):** full-screen multi-step overlay. Step 1 asks "Do you know where you would like to travel?" with YES / ANYWHERE IN AFRICA, and says "This will take 1 minute to complete" (`enquiry-desktop-fold.jpg`). The 4-field form on every page is the newsletter.
- **Live contact:** HubSpot script; a WhatsApp number on the contact page (hidden on desktop); no visible chat widget.
- **Price (Usawa Serengeti, Tanzania):** a season-by-season table "per person per night" from USD 998 to USD 1,617, covering June 2026 to February 2028.
- **Trust:** near the bottom, award logos (Condé Nast, Travel + Leisure, World Travel Awards, Town & Country, Men's Journal) and "Read more reviews on Trustpilot" (134 reviews).
- **Type:** Athelas (serif) + Atyp Display (sans), with tracked uppercase small labels (letter-spacing 0.4em) almost everywhere.
- **Colours:** charcoal #221F20, khaki #B6A28F, deep teal #123438, off-white #EEEBE5, orange CTA.
- **Photos:** mostly wildlife and landscape, plus tents, food and guides ("Wilderness Guides planning game drive").
- **Mobile:** fixed header with ENQUIRE. No overflow. The desktop page scrolls inside a container, so the desktop full-page shot stops at 900 px.
- **Performance:** home LCP 5.7 s / 3.2 s, 3.7 MB, 248 requests.
- **Slop tells:** tracked-out uppercase eyebrows on about 100 elements.

### andBeyond (`andbeyond/`)
- **Nav:** logo · search · Menu (hamburger only). **H1:** the DOM h1 is an SEO string ("Luxury African Safaris, South America & South Asia Tours | andBeyond…"). The visible headline is "I dream of / Travel that leaves our world a better place".
- **Hero:** autoplaying Cloudinary video.
- **CTA:** "START WITH WHERE", once, in the hero.
- **Enquiry:** a separate subdomain, `enquire.andbeyond.com/plan-trip`, multi-step. Step 1 is "Describe yourself": Curious Traveller / Member of the Travel Trade. LCP 10.2 s desktop.
- **Live contact:** LiveChat widget ("We're Online! How may I help you today?") bottom-right on every page, mobile included.
- **Price:** none. The Ngorongoro Crater Lodge page says the lodge is "temporarily closed for a significant refurbishment".
- **Trust:** mid-page awards wreath ("You took us places", citing Condé Nast Readers' Choice).
- **Type:** Questa Grande (serif) + Museo Sans.
- **Colours:** white, charcoal #424241, warm grey #F5F3F2, red-orange #E94734.
- **Photos:** wildlife, landscape, and a rendering of a new lodge.
- **Mobile:** chat bubble only; no sticky CTA. No overflow.
- **Performance:** home LCP 3.2 s / 1.3 s, 1.9 MB.
- **Slop tells:** a "Why travel with &Beyond" row of four icon cards; 66 elements with scroll-animation attributes.

### Asilia (`asilia/`)
- **Nav:** CAMPS & LODGES · DESTINATIONS · EXPERIENCES · ITINERARIES · OFFERS · ABOUT US · TRADE · START HERE (coral pill). **H1:** "Genuine Safaris Genuine Difference", with "Genuine Safaris" in a script face over a serif (the page has several h1s, one per slide).
- **Hero:** vertical slideshow that includes an autoplay video slide.
- **CTA:** "START HERE" three times per page (header, hero, mobile tab bar), plus "ENQUIRE", which opens a slide-out 6-field form (first name, last name, email, phone, comments, newsletter) on every page.
- **Enquiry (`/enquire/`):** multi-step with a progress bar, about 8 steps:
  1. Where: Kenya / Tanzania / Rwanda / Uganda / Zanzibar / Open to ideas
  2. Budget band, starting "Less than $5000"
  3. Exact dates or a month
  4. Trip length
  5. Who is travelling
  6. Adults and children, with child ages
  7. "What do you want to see and do"
  8. First name, last name, email, country, phone

  About 17 user fields, plus 7 hidden UTM and enquiry-ID fields.
- **Live contact:** LiveChat + HubSpot.
- **Price (10-day Kenya & Tanzania itinerary):** "per person sharing, based on high season pricing: Original cost US$19,341 | All Asilia rate US$17,654 | YOU SAVE US$1,687".
- **Trust:** award badges near the footer (Travel + Leisure 2024, Lux Life, Tripadvisor Travellers' Choice 2023, World Luxury Hotel 2023); Tripadvisor logos mid-page; "B Corp certified" as a footer link under Impact.
- **Type:** PP Fragment (serif) + Sunday April (script) + Helvetica Neue.
- **Colours:** cream #F5F2ED, sand #D5CEBC, deep teal #012F36, coral CTA #D6533C, navy text #152532.
- **Photos:** the most people-forward of the luxury group: guests with guides at sundowners, a walking guide with binoculars, guest and guide by a river. Also wildlife and landscape.
- **Mobile:** fixed bottom tab bar (Home | START HERE | Itineraries). No overflow.
- **Performance:** home LCP 2.9 s / 1.4 s, but **25.8 MB** transferred before scrolling (hero video); itinerary 0.9 s, 2.5 MB.
- **Slop tells:** cream + serif + coral; a script/italic word in the headline.

### Nomad Tanzania (`nomad/`)
**Blocked** by a Cloudflare challenge (`home-desktop.jpg` shows it). Nothing observed. The report's Nomad claims (homepage line, guide pages, camp hierarchy) remain search-snippet evidence.

### Great Plains Conservation (`greatplains/`)
- **Nav:** MENU · logo · search, with no CTA in the header. **H1:** "Your invitation to join Great Plains Conservation for your personalised safari in Africa." (home); "Mara Plains Camp Welcomes You"; "Begin Your Journey".
- **Hero:** autoplay background video on home and camp pages.
- **CTA:** no repeated button. "Begin Your Journey" sits in the menu and footer. A WhatsApp icon floats bottom-right on every page.
- **Enquiry (`/begin-your-safari/`, Jotform iframe):** single page, about 12 fields, 5 required: first name, last name, email, country, phone, arrival date, departure date, camps of interest, number of travellers, notes, where you heard about us, "verify that you are human". The copy says "We will match you with an expert Safari Operator in your area", so enquiries are routed to agents. Reservations email and office hours (Mon–Fri 8–5, GMT+2) are given.
- **Price (Mara Plains, Kenya):** "RATES From $1,745 per person sharing per night". There are no Tanzania camps.
- **Trust:** no review widget or badges seen.
- **Type:** Garamond (system serif) + Plus Jakarta Sans; Poppins loaded too.
- **Colours:** cream #F0EDE8, dark brown #2E2828, taupe #C7BAA8, gold #AE841F.
- **Photos:** tent interiors, dining, guests at a tent, elephants.
- **Mobile:** fixed header only. No overflow.
- **Performance:** home LCP 4.5 s / 5.9 s, 9.7 MB; camp page **46 MB** (video), the heaviest page in the set.
- **Slop tells:** cream + serif + gold (adjacent to the cream/serif/terracotta default); a few tracked capitals.

### Natural Selection (`naturalselection/`)
- **Nav:** CAMPS & LODGES · SPECIAL OFFERS · ENQUIRE (sage button) · MENU. **H1:** the DOM h1 is a small tracked label, "NATURAL SELECTION AFRICAN SAFARIS". The visible headline is "WELCOME TO OUR *wild* WORLD" under the eyebrow "SAFARIS OF CHARACTER".
- **Hero:** still photo on home; photo with a play-button video lightbox on the camp page.
- **CTA:** "ENQUIRE" in the header, plus "CHECK AVAILABILITY", and "Enquire Now" / "Plan Your Safari" in the footer.
- **Enquiry:** two steps. Step 1: first name, last name, email, phone, country (all required). Step 2: countries, arrival date, departure date, adults, children, budget per person, notes, "I'm a travel agent", and agent-sharing consent. About 13 user fields.
- **Live contact:** Intercom, HubSpot and WhatsApp appear in the HTML, but nothing floats except the reCAPTCHA badge.
- **Price:** the homepage camp cards show per-night ranges (Mokolwane Plains US$2,710–3,995; Expeditions Camp US$875–1,275). The camp page has a fact strip: LOCATION / NO. OF ROOMS / PRICE RANGE US$2,095–3,895 per night / DATES OPEN / CHECK AVAILABILITY.
- **Trust:** a Financial Times logo near the bottom; no review widget.
- **Type:** Cormorant Garamond (uppercase headings at 68–84 px) + ivyepic (13 px tracked uppercase labels).
- **Colours:** white and light grey #EFEFEF, stone #F2F1EB, mint/sage accent #8DBFAF, bronze text #AC7F48.
- **Photos:** wildlife and landscape, camp exteriors and interiors, guests in a mokoro.
- **Mobile:** no sticky CTA. No overflow.
- **Performance:** slow TTFB (3.5–4.7 s); home LCP 6.8 s / 5.9 s; camp page 8.6 s.
- **Slop tells:** tracked uppercase eyebrows (122 on the camp page); one italic word in the headline.

### Angama (`angama/`)
**Blocked** ("Attention Required! | Cloudflare — Sorry, you have been blocked"). Nothing observed.

## Tour operators

### Audley Travel (`audley/`)
**Blocked** by a Cloudflare challenge. Nothing observed. The "9 days from £5,220pp" figure and Audley's nav remain unverified.

### Expert Africa (`expertafrica/`)
- **Nav:** a top strip "TALK TO AN EXPERT 1-800-242-2434 LINES OPEN NOW" (fixed on desktop), then SEARCH · CONTACT US (orange) · AFRICA · SAFARI COLLECTIONS · WILDLIFE · ABOUT US · INSPIRE ME · BLOG. **H1:** "Tailor-made African safaris from the experts" (home); "Bat-eared Fox Fly-in Safari".
- **Hero:** still photo. Home has a stats band: "25 years in travel", "11 charities supported", "40 editions of 8 guidebooks written".
- **CTA:** "ENQUIRE NOW" ten times on the trip page; "Make an enquiry"; "Talk to an Expert". On mobile trip pages, a sticky bar reads "SUMMARY | MAKE AN ENQUIRY".
- **Enquiry (`/enquiry`, "Book your tailor made trip"):** CALL US / EMAIL US tabs, then "Call using the phone number", "CALL VIA YOUR BROWSER", "Get an immediate call-back" (phone field + REQUEST A CALL-BACK) and "Can't call right now? Email us instead". The email form has email, how can we help, country, who, what, when, where, a budget slider (USD 2,000–20,000+ per person) and other comments. A hidden second step asks for title, name and phone.
- **Live contact:** phone first, call-back, and a browser call. No chat widget.
- **Price:** in the trip hero, "FROM US$2,740-US$3,200, BASED ON TWO TRAVELLERS", plus separate flight prices and related trips at "US$3,690 - US$5,400 per person".
- **Trust:** footer only: "Our travellers' opinions" with 486 AITO, 248 Facebook and 263 Google reviews; AITO Quality Charter; British Travel Awards 2024 silver and 2025 nominee.
- **Type:** Untitled Serif + Buenos Aires (15 px/700 tracked uppercase labels).
- **Colours:** white, near-black #1A1A1A, warm grey #E5E3DF, orange CTA, plum-grey text #817391.
- **Photos:** wildlife species tiles, landscape, vehicles.
- **Mobile:** fixed top bar with Menu and phone icon. No overflow.
- **Performance:** home LCP 1.7 s / 1.2 s, 1.4 MB, the fastest of the operators.
- **Slop tells:** tracked uppercase labels throughout; middle-dot meta strings ("5 days • 2 locations • 1 country").

### Rhino Africa (`rhinoafrica/`)
- **Nav:** Menu · Search · logo · START PLANNING (green pill), then DESTINATIONS · JOURNEYS · EXPERIENCES · INSPIRATION · IMPACT · STORIES. **H1:** "THE AUTHORITY ON LUXURY AFRICAN TRAVEL"; trip "Tanzania Revealed: Sun, Savannah and Spice". The trip sub-line says "11 days in Tanzania" while the page body says "10 Nights in total".
- **Hero:** slideshow on home; still on the trip page.
- **CTA:** "START PLANNING" five times on home, plus "START PLANNING NOW", "SPEAK WITH AN EXPERT" and "BOOK WITH US".
- **Enquiry (`/contact-us`):** full-screen wizard with a progress bar of about 10 segments. "Your dream African safari starts here." Q1: "Do you know where you want to travel to?" — Yes, I do! / I have an idea, need advice / No – Help me decide! A "NEED HELP?" phone link sits in the corner.
- **Live contact:** phone (+27 21 469 2600); WhatsApp and Calendly mentioned in the HTML; a round floating button.
- **Price:** "Ideal duration: 10 days From $8,622 per person" and "10 Nights in total $8,622 per person", consistent within this page. Home cards: "Starting from $19,243 Per Person Sharing". The $8,626 vs $8,580 inconsistency the report cites was not re-checked on the destination page.
- **Trust:** "More than 5,000 Trustpilot reviews and a 5.0 rating", "Ratings powered by TripAdvisor", a WTA "Africa's Most Awarded Safari Company" shield, and charity partner logos.
- **Payment safety:** a fixed red bar on every page, desktop and mobile: **"Security Reminder: Travel scams are on the rise. Please verify any unexpected Rhino Africa booking messages with your Travel Expert."**
- **Type:** Montserrat only.
- **Colours:** charcoal #272727, light grey #F1F3F5, dark red #990000, green CTA.
- **Photos:** mostly wildlife and landscape; few people.
- **Mobile:** fixed nav plus the fixed scam bar. No overflow.
- **Performance:** home LCP 2.0 s / 1.3 s, 0.9 MB.
- **Slop tells:** none of the listed ones; a mixed-radius card UI.

### Yellow Zebra Safaris (`yellowzebra/`)
- **Nav:** top strip Blog & Insights · About Us · Find Us · phone · My Collection (wishlist). Main nav: Destinations · When to Go · Trip Ideas · Safari Styles · Inspiration · Your First Safari · Make an Enquiry (yellow pill). **The phone number changed on every page** (1-888-377-5658, 1-844-409-1747, 1-844-204-0927), which suggests call tracking *(inference)*. **H1:** "Luxury, Tailor-Made African Safari Holidays by Yellow Zebra"; "Tanzania's Famous Northern Circuit"; "Let's Get Planning Your Bespoke Safari!".
- **Overlay:** a "Browsing from the USA?" modal sat over the fold shots. It was left alone because it is not a cookie banner.
- **Hero:** autoplay muted video in a carousel.
- **CTA:** "Make an Enquiry" three times on home and four on the trip page; "Talk to an Expert".
- **Enquiry (`/contact-us/`):** standalone multi-step form: "Progress. This will take 90 seconds to complete."
  1. Do you know where you want to travel to? (Yes / I have an idea, but I'd like some advice / No idea – help me decide)
  2. Countries
  3. Safari style
  4. When (year and month, or exact dates)
  5. Who is travelling, and how many adults and children
  6. Price per person
  7. Name and contact details

  A fixed footer strip reads: "Every Yellow Zebra safari is designed by genuine experts. All of our specialists are either ex-professional safari guides and camp managers or people who have lived and worked in Africa."
- **Live contact:** HubSpot; WhatsApp mentioned on home; phone.
- **Price:** on the UK site, "9 Nights Low season £5,461 High season £6,919 Guide price (pp)"; related trips "Tanzania • 12 nights From £6,020 – £8,663 pp". A named specialist appears on the trip page.
- **Trust:** on home, a "Recognised by the Industry" band (Condé Nast Traveller, WTA 2025 winner) and "Financially Protected Journeys" (ATOL); in the footer, Trustpilot "Excellent, Based on 1,787 reviews" and the ATOL logo.
- **Type:** Rector (serif display) + Figtree.
- **Colours:** white, cream #F8F2EC, near-black #191815, yellow #FECB00.
- **Photos:** wildlife and landscape, lodges, walking-safari guests.
- **Mobile:** fixed top bar with the Make an Enquiry pill and a phone icon. No overflow.
- **Performance:** home LCP 2.8 s / 1.5 s, 1.4 MB; trip TTFB 2.6 s.
- **Slop tells:** rounded card kit (12–16 px radius on 25–33 elements).

### Go2Africa (`go2africa/`)
- **Nav:** top strip English | USD, phone, search, Wishlist, Blog, FAQs, Contact Us, Start Here (ochre pill). Main nav: Safari 101 · Destinations · Tours & Safaris · Month · Positive Impact · About Us. **H1:** the DOM h1 is "Africa's Trusted Tailor-Made Safari Specialists"; the visible hero line is "Your Greatest Adventure Is Waiting." in italic serif.
- **Hero:** autoplay video, with a "B Corp-certified Nawiri Group" badge inside it, above the fold.
- **CTA:** "Start Here" (header, hero, and a mobile bottom tab bar: Home | Start Here | Explore), "Contact Us" twice, "Enquire Now", "Ready-To-Book Safaris".
- **Enquiry (`/enquire-now`):** separate full-page wizard with no site nav. "Where Would You Like To Travel?" offers 20 country chips plus "Open to ideas", above a "Your Progress" bar and 5-star Feefo quotes.
- **Live contact:** LiveChat + HubSpot; phone.
- **Price:** trip hero "Tanzania Classic Northern Circuit $9,380 - $14,720 Per Person Sharing", with tabs Overview | Itinerary | Rates | Enquire Now, and "Customise This Sample Itinerary". Home cards: "From $12,980 to $21,530 pps".
- **Trust:** a Feefo review carousel on home and trip pages; animated stat counters (Feefo reviews, awards).
- **Type:** Merriweather + Lato.
- **Colours:** white, charcoal #454442, light #F8F9FA, ochre #C88C3D.
- **Photos:** many supplier lodge images (one labelled "rendered image"), wildlife, some guests.
- **Mobile:** sticky top bar plus the bottom tab bar. No overflow.
- **Performance:** home LCP 3.6 s / 1.7 s, 1.1 MB.
- **Slop tells:** a generic headline; pipe-joined day meta ("Day 1: Arrive in Tanzania | 1 Nights").

### Steppes Travel (`steppes/`)
- **Nav:** top strip Contact us · Our Team · Postcards Home · Blog · Impact · My Steppes · phone. Main nav: Destinations · Holiday Types · When to Go · About us · Contact us. **H1:** "See the World Better." (every heading ends in a yellow full stop); "Northern Tanzania including The Great Migration."
- **Hero:** Vimeo background video with a search box, "Where would you like to explore?".
- **CTA:** "Contact us" (home); "CONTACT US", "SPEAK TO OUR EXPERTS" and "Call Me Now" on the trip page. A ResponseIQ "Free Callback Service — Enter your phone number" card and a round phone button float on trip, contact and mobile pages.
- **Enquiry (`/contact/`):** one long form with 7 visible fields: title, first name, last name, phone, email, how many travelling, travel preferences. Conditional fields add destination, departure point, when, and how you heard about us, whose options include **"AI chat recommendation"**. There are checkboxes for "online meeting" and a brochure. The trip page also has a 14-field multi-step modal.
- **Price:** "DURATION 8 Days PRICES START FROM £5,895pp (ex. flights)", a month strip (JAN–DEC), and "departing from the UK are ATOL protected".
- **Trust:** a B Corp badge in the trip hero (above the fold); "Rated Excellent on Trustpilot"; footer logos for AITO, ATTA, ATOL and ABTOT 5488.
- **Type:** Caslon + Brandon Grotesque.
- **Colours:** white, navy #0A2F55, near-black #1D1E1F, cream #F6F2E0, yellow #F7B90F.
- **Photos:** the home page is people-rich (portraits, monks, a farmer); the trip page shows wildlife and vehicles.
- **Mobile:** fixed top bar with a phone icon, plus the callback card. No overflow.
- **Performance:** home TTFB 2.5 s, LCP 5.5 s / 5.0 s; trip 1.5 s.
- **Slop tells:** one coloured glyph in every headline (the yellow full stop).

## Local Tanzanian operators

### Altezza Travel (`altezza/`)
- **Nav:** top strip "★★★★★ Ranked #1 on TripAdvisor" · currency · 20+ country sites. Main nav: KILIMANJARO · SAFARI · DAY TRIPS · BLOG · ABOUT US · CONTACTS · Plan my trip (green). **No h1 on the homepage**; the visible hero line is "Safari in Tanzania / Climb Kilimanjaro".
- **Hero:** fade slideshow with an inline planner card: "Where do we start? Safari | Kilimanjaro — When would you like to go? — Design my safari — Free itinerary and quote. No commitment."
- **CTA:** "Plan my trip" (header; mobile fixed top bar), "Design my safari", "Send an Inquiry", "Book a Free Call", "Chat on WhatsApp", "Contact in Telegram", "Voice Call", "Chat Online".
- **Enquiry (`/contacts`):** "Your Tanzania journey starts here — Within 3 hours, a personal travel manager will prepare a journey designed around you." Three channel cards:
  - Send a Request: "day-by-day itinerary with clear pricing"
  - Chat on WhatsApp: "Replies within 10 minutes"
  - Book a free 30-min call: "Slots today & tomorrow"

  Then "Talk to Our Team", with named staff and +255 numbers. The request form is a modal and was not opened.
- **Price (trip):** "Price starts from $2,227", and "View prices for other seasons" opens a full table by hotel tier (Explorer 3*, Signature 4*, Premium 5*), season and group size (e.g. low season April–May 2026: 1 person $4,757, 2 persons $2,843 each). A sticky tab bar runs Overview | Packing List | Price | Itinerary | Inclusions | Visa and Documents. The itinerary is offered as a "Get PDF" download.
- **Trust:** "Ranked #1 on TripAdvisor", "5.0 (2571 Reviews)" in the header (above the fold) and footer; "5.0 · 2571 Review about Altezza" at the top of the trip page. A homepage band shows Travelife Certified, B Corp Certified, KPAP Member and ATTA. WTA "Tanzania's Leading Tour Operator 2024 • 2025 • 2026".
- **Type:** Mazzard + CoreSansCR (no serif).
- **Colours:** off-white #FCFCFC, navy #0D2F4A, green CTA #71AA47, pale green #ECF2E2, tan #A49175.
- **Photos:** guides and staff ("Employees of Altezza Travel at work", a mountain guide), climbers, vehicles, wildlife.
- **Mobile:** fixed top bar with Plan my trip; floating round chat button. No overflow.
- **Performance:** home LCP 1.2 s / 0.7 s, 2.7 MB; trip 1.6 s.
- **Slop tells:** rounded card kit (10–20 px); dot- and pipe-joined meta.

### Ahsante Tours (`ahsante/`)
The homepage returned a 503 on the first probe and loaded normally a few minutes later.
- **Nav:** Home · About · Kilimanjaro · Safaris · Cycling · Zanzibar · Contact · New Tours · Plan your trip (maroon pill). Promo strip: "BLACK FRIDAY · 10% off all Kilimanjaro climbs & safaris · Ends 1 Dec 2026". **H1:** "Conquer Kilimanjaro with Expert Guides" (Kilimanjaro first); trip "8 Days Ultimate Tanzania Safari", although the URL and title say "8 Days Wildlife Safari".
- **Hero:** still photo with three buttons (Kilimanjaro Tours, Kilimanjaro Joining Group, Book a Free Consultation).
- **CTA:** "Book Now" 17 times on home (one per tour card); on the trip page "Book Your Safari Now", "Start Your Inquiry" and "WhatsApp Us".
- **Enquiry (`/contact/`):** a "Contact Form" heading with **blank space under it in our browser**, so no form rendered here. This may be a blocked or slow embed and is not verified as a site fault. Address, email, phone and hours (Mon–Fri 9–5, Sat 9–1) are listed.
- **Live contact:** Tawk.to and WhatsApp in the HTML; a "WhatsApp Us" button on the trip page.
- **Price:** a bar under the trip hero, "Price from $3,190 (£ 2,467)"; home cards "Price from $2,897 (£ 2,337)".
- **Trust:** TANAPA Award 2022 and Tripadvisor icons in the trip hero; a Trustindex Google and Tripadvisor review widget ("206 reviews").
- **Type:** Poppins 800–900 headings; Work Sans, Archivo and Lato also loaded.
- **Colours:** white and #F1F1F1, black, sage-green buttons #66A179, maroon #7A3C2F.
- **Photos:** Kilimanjaro climbers and wildlife. **Several file names are Unsplash stock** (`jorge-tung…unsplash`, `moses-londo…unsplash`, `artturi-jalli…unsplash`).
- **Mobile:** no sticky CTA. No overflow.
- **Performance:** slow TTFB (3.5–5.8 s); home LCP 5.7 s / 6.6 s; light pages (0.3–0.5 MB).
- **Slop tells:** none of the listed ones; a heavy-weight Poppins look.

### Nature Responsible Safari (`natureresponsible/`)
- **Nav:** olive top strip with phone (a WhatsApp link) and email; then SAFARIS · DESTINATIONS · COMMUNITY PROJECTS · ABOUT US · FAQ'S · VERSION FRANÇAISE. No CTA button in the header. **H1:** "Tanzania Safari Experts Made Easy With Us!". On the trip page the DOM h1 is "Thank you for giving us a chance to be part of your safari experience in Tanzania", with the visible title "Our Bestseller ( 6 Days Tanzania Safari )".
- **Hero:** the company's own still photo (safari vehicle with a lioness). The trip hero image area rendered grey in our capture.
- **CTA:** "Help Me Plan My Safari" / "HELP ME PLAN MY TRIP", once per page.
- **Enquiry (`/help-me-plan-my-trip/`, native Jotform "Tour Reservation Form"):** single step, 16 visible fields: full name, last name, email, country, phone (twice), arrival date, return date, number of days, package tier (e.g. "Top Luxury"), budget per person (e.g. "$1000 – $2000"), travelling as, group size, anything else, special interests.
- **Live contact:** Tawk.to "Chat" bubble on desktop and mobile; WhatsApp number.
- **Price:** **none on the trip page.**
- **Trust:** TATO membership explained ("WHAT IS TATO?"); Tripadvisor Travellers' Choice 2023 badge; Google reviews widget script.
- **Type:** Aclonica (display), Lato, EB Garamond, Libre Franklin and Karla (five families); Inter on the form page via Jotform.
- **Colours:** white, blue-grey #F7F9FB, olive #4E493D, sage #9CA776, lime text #86C232.
- **Photos:** the company's own vehicle and wildlife shots.
- **Mobile:** Chat bubble only. No overflow.
- **Performance:** home LCP 1.6 s / 2.5 s, 1.6 MB.
- **Slop tells:** none of the listed ones. The issues here are inconsistency (five typefaces, mixed colours), not genericness.

### Roy Safaris (`roy/`)
`roysafaris.com` redirects to `roysafaris.co.tz`.
- **Nav:** HOME · SAFARI & ZANZIBAR · WHERE TO GO · WHY ROY SAFARIS · GUIDES & FAQS · THE SERENGETI STORY · GALLERY · CONTACT · card-payment logos · PERSONALISE MY SAFARI (coral). **H1:** "Tanzania Safari Tours, Designed Around You", then "Based in Arusha, Roy Safaris has been planning personalised Tanzania safaris since 1989…".
- **Hero:** autoplay muted YouTube embed. It showed "Video unavailable" in our browser because YouTube was rate-limiting this IP; that is not a site fault.
- **CTA:** "PERSONALISE MY SAFARI" (header; mobile fixed top bar) opens a hidden single-step modal of about 20 fields: name, phone, email, country, address, adults, children, arrival and departure dates, fixed or flexible dates, arrival and departure points, traveller type, message. Also "GET IN TOUCH", and "BOOK NOW" on the trip page.
- **Enquiry (`/contact-us/`):** 7 fields (first name, last name, country code, phone, email, subject, message), WhatsApp +255 745 182 923 and an office phone. **The page copy ends "the first step to an amazing Feline Fields safari!"**, naming a different company's camp, apparently pasted in by mistake.
- **Live contact:** floating WhatsApp button; fixed "Travel Update – Sept 2026" pills.
- **Price:** **none on the trip page.**
- **Trust:** Tripadvisor widget, "2,043 reviews", with the latest review dated 24 October 2026 (home); Elfsight Instagram feed.
- **Type:** Cormorant Garamond + Barlow; Playwrite (script) loaded.
- **Colours:** cream #FCFAF6 / #FBF4E9, charcoal #353535, coral #F08A6B.
- **Photos:** wildlife, landscape, Instagram tiles.
- **Mobile:** fixed top CTA bar. No overflow.
- **Performance:** home LCP 3.3 s / 2.4 s, 2.6 MB.
- **Slop tells:** cream + serif + coral, the same default as Singita.

---

## Cross-site summary (15 sites observed, 3 blocked)

| Site | Hero | Primary CTA (wording) | Enquiry format | Visible fields | Live channels | Trip-page price | Reviews placement |
|---|---|---|---|---|---|---|---|
| Singita | video | Plan your trip | single page | 13 | phone only | none on lodge page | none |
| Wilderness | video | Enquire now | multi-step overlay, "1 minute" | n/a (step 1 seen) | HubSpot, WhatsApp no. | per-night season table | Trustpilot + awards, bottom |
| andBeyond | video | Start with where | multi-step subdomain | n/a (step 1) | LiveChat | none (lodge closed) | awards mid-page |
| Asilia | slideshow + video | Start here | 8-step wizard | ~17 | LiveChat | pp sharing + saving | awards footer |
| Great Plains | video | Begin your journey (menu) | single page (Jotform) | ~12 | WhatsApp float | from $/pp/night | none |
| Natural Selection | still | Enquire | 2-step | ~13 | none visible | per-night range | none |
| Expert Africa | still | Enquire now / Contact us | call-first, 2-step email | 8 + hidden | phone, call-back, browser call | from range, 2 sharing | AITO/Google/FB footer |
| Rhino Africa | slideshow | Start planning | ~10-step wizard | n/a (step 1) | phone | from $ pp | Trustpilot body |
| Yellow Zebra | video | Make an enquiry | multi-step, "90 seconds" | ~12+ | phone (tracked), HubSpot | low/high season guide price | Trustpilot footer, awards body |
| Go2Africa | video | Start here | wizard, progress bar | n/a (step 1) | LiveChat, phone | range pp sharing | Feefo carousel body, B Corp hero |
| Steppes | video | Contact us | single long form | 7 + conditional | call-back widget, online meeting | from £ pp ex flights | Trustpilot body, B Corp hero |
| Altezza | slideshow | Plan my trip | 3 channels (form / WhatsApp / call) | modal (not opened) | WhatsApp, Telegram, voice, call booking | from $ + full tier/season/group table | Tripadvisor #1 header |
| Ahsante | still | Book now / Plan your trip | form not rendered | – | WhatsApp, Tawk | from $ and £ | widget body |
| Nature Responsible | still | Help me plan my trip | single page (Jotform) | 16 | Tawk chat, WhatsApp | none | badge body |
| Roy | video (YouTube) | Personalise my safari | single-page modal | ~20 | WhatsApp float | none | Tripadvisor widget body |

Screenshots for each row: `<site>/{home,trip,contact}-{desktop,mobile}[-fold].jpg`.

### Rough performance (one cold load each; see caveats above)

| Site | Home LCP desktop / mobile (s) | Home transfer (MB) | Trip LCP desktop / mobile (s) | Trip transfer (MB) |
|---|---|---|---|---|
| Singita | 2.8 / 0.6 | 1.5 | 0.4 / 0.4 | 1.8 |
| Wilderness | 5.7 / 3.2 | 3.7 | 3.0 / 2.2 | 4.3 |
| andBeyond | 3.2 / 1.3 | 1.9 | 3.7 / 3.3 | 0.8 |
| Asilia | 2.9 / 1.4 | **25.8** | 0.9 / 1.1 | 2.5 |
| Great Plains | 4.5 / 5.9 | 9.7 | 5.0 / 4.7 | **46.0** |
| Natural Selection | 6.8 / 5.9 | 1.9 | 8.6 / 8.4 | 2.6 |
| Expert Africa | 1.7 / 1.2 | 1.4 | 1.2 / 1.5 | 2.1 |
| Rhino Africa | 2.0 / 1.3 | 0.9 | 1.2 / 0.6 | 1.2 |
| Yellow Zebra | 2.8 / 1.5 | 1.4 | 4.1 / 1.5 | 1.9 |
| Go2Africa | 3.6 / 1.7 | 1.1 | 0.9 / 1.1 | 1.7 |
| Steppes | 5.5 / 5.0 | 2.8 | 1.5 / 1.3 | 3.1 |
| Altezza | 1.2 / 0.7 | 2.7 | 1.6 / 1.4 | 2.4 |
| Ahsante | 5.7 / 6.6 | 0.5 | 6.3 / 1.0 | 0.4 |
| Nature Responsible | 1.6 / 2.5 | 1.6 | 2.1 / 4.7 | 1.2 |
| Roy | 3.3 / 2.4 | 2.6 | 3.8 / 2.2 | 2.3 |

No page on any site overflowed horizontally at 390 px.

### Patterns

1. **Video heroes are the norm, and they are expensive.** 9 of 15 homepages open on autoplay video. The cost shows: Asilia's homepage moved 25.8 MB before any scrolling, and a Great Plains camp page 46 MB. The two fastest operator sites, Expert Africa and Altezza, open on a still or a slideshow.
2. **The enquiry has become a guided, multi-step flow that asks "where?" first and lets you say "I don't know".** Wilderness, Rhino Africa and Yellow Zebra open with "Do you know where you want to travel?" and offer an "help me decide" or "anywhere in Africa" answer; Asilia and Go2Africa open with destination chips that include "Open to ideas". Most show a progress bar, and two state a time ("1 minute", "90 seconds"). Contact details usually come last. Total fields run to 12–20, spread across screens. The single-page exceptions are Singita, Great Plains, Steppes and two local operators (Nature Responsible, Roy).
3. **CTA wording is "start" and "plan", not "enquire", at the top end.** "Plan your trip" (Singita, Altezza), "Start here" (Asilia, Go2Africa), "Start planning" (Rhino), "Start with where" (andBeyond), "Begin your journey" (Great Plains). "Enquire" survives at Wilderness, Natural Selection and Expert Africa, and "Make an enquiry" at Yellow Zebra. The header button is the one CTA every site repeats. Mobile keeps it reachable with a fixed top bar (Wilderness, Yellow Zebra, Altezza, Roy) or a bottom tab bar (Asilia, Go2Africa).
4. **Operators offer a human channel next to the form, and the local leader puts times on it.** The channels on offer include call-back (Expert Africa, Steppes), a call through the browser (Expert Africa), an online meeting (Steppes) and a booked 30-minute call (Altezza). Live chat runs at andBeyond, Asilia and Go2Africa; WhatsApp at Great Plains, Altezza, Roy and Nature Responsible. **Altezza gives explicit times: "Within 3 hours, a personal travel manager will prepare a journey", "Replies within 10 minutes" on WhatsApp, "Slots today & tomorrow".**
5. **Prices are shown by most, but not by all the luxury leaders.** Wilderness, Great Plains, Natural Selection and Asilia show nightly or per-person prices on the pages checked; Singita's lodge page and andBeyond's do not. Every operator observed shows a from-price or range. The formats are "from X to Y per person sharing" (Go2Africa, Expert Africa, Rhino), low/high season (Yellow Zebra) and full tier × season × group-size tables (Altezza). **Two of four local operators (Nature Responsible, Roy) show no price on their trip page.**
6. **Trust proof sits low on the page for most sites; the local leader puts it in the header.**
   - Altezza: Tripadvisor rank and count above the fold.
   - Go2Africa and Steppes: B Corp in the hero.
   - Expert Africa: reviews in the footer only.
   - Yellow Zebra: Trustpilot in the footer.
   - Wilderness: awards and Trustpilot near the bottom.
   - Singita, Great Plains and Natural Selection: no review widget at all.
7. **Rhino Africa runs a permanent anti-scam banner** ("verify any unexpected booking messages with your Travel Expert"). It is the only observed precedent for the "How to pay us safely" item in the report's P0 list. No other site addresses payment fraud on the pages checked.
8. **Typography is almost always serif display + sans text**, in 11 of 15 sites. Only Rhino, Altezza, Ahsante and (mixed) Nature Responsible are sans-only. **No site uses Inter.** Cormorant Garamond, Mazingira's heading face, is also used by Natural Selection and Roy.
9. **Palettes cluster on cream or off-white with one warm accent.** Singita (cream + Morion serif + terracotta #CB9275) and Roy (cream + Cormorant + coral #F08A6B) match the Anthropic "warm cream + serif + terracotta" tell exactly. Asilia, Great Plains and Yellow Zebra sit next to it. The default reads as generated partly because it is what the category's leaders actually use.
10. **Photography leads with wildlife, landscape and rooms; named people are rarer than the report implied.** On the pages checked, people are prominent at Asilia (guests with guides), Altezza (staff and guides), Steppes (portraits on home) and Wilderness (guides planning a drive), and Yellow Zebra names a specialist. Nomad, the report's main example of guide profiles, could not be checked. Ahsante uses Unsplash stock photos.

### AI-slop tells (Anthropic list) by site

| Tell | Sites showing it |
|---|---|
| Warm cream + high-contrast serif + terracotta/coral accent | Singita, Roy (exact); Asilia, Great Plains, Yellow Zebra (adjacent) |
| Tracked-out uppercase eyebrow labels | Wilderness, Natural Selection, Expert Africa (heavy); Great Plains (light) |
| Meta strings joined with middle dots or pipes | Expert Africa, Go2Africa, Altezza, Asilia (price line) |
| One italic, script or coloured element in a headline | Natural Selection ("*wild*"), Asilia (script "Genuine Safaris"), Steppes (yellow full stop) |
| Uniform rounded card kit | Yellow Zebra, Altezza, Ahsante |
| Icon-card grid | andBeyond ("Why travel with &Beyond") |
| Scroll-reveal animation attributes in quantity | andBeyond (66), Roy (32) |
| Generic headline | Go2Africa ("Your Greatest Adventure Is Waiting."), Nature Responsible ("…Made Easy With Us!") |
| Purple gradient, Inter, emoji | none |

The most-admired brands show these tells as freely as anyone. On real sites they are signs of a category convention, not of AI.

### Not verified, and why

- Nomad Tanzania, Audley and Angama: Cloudflare bot checks.
- Singita's "Plan your trip" target, Altezza's request modal, and later steps of the andBeyond, Wilderness, Rhino and Go2Africa wizards: they would need clicks beyond accepting cookies.
- Ahsante's contact form: not rendered in this browser.
- Roy's hero video: YouTube rate-limited this IP.
- UK-visitor views (currency, phone numbers): the IP geolocates to the US.
