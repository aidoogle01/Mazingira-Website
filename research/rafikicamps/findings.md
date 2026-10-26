# How rafikicamps.com is built

**RAFIKI Orangi River Camp** is a single 12-suite luxury tented camp in the Central Serengeti, selling all-inclusive stays from $985 per person per night. It is a camp, not a tour operator, so its trips are packages of nights at one place, not routes. Keep that in mind when borrowing from it.

Browser pass on 26 October 2026 from this cloud container (Playwright Chromium, en-GB). Pages were loaded one at a time and no forms were submitted. Pages loaded: home, `/packages/5-night`, `/book`, `/reviews`, `/rates` and `/packages`. Some JS bundles were also read with curl. Raw data is in `data.json` and the script is `capture.js`.

**Observed** means seen in headers, the DOM, the network log or bundle source. **Inferred** marks a judgement drawn from that evidence.

Screenshots: `home-`, `trip-` and `book-` × `desktop` / `mobile`. Full pages are 720px wide on desktop and 390px on mobile. The `-fold` files are the first screen.

The full-page shots show the newsletter modal. It fires during the scroll pass; see Conversion.

---

## 1. Platform and tech stack

| Layer | What it is | Evidence |
|---|---|---|
| Hosting / CDN | **Vercel** | `server: Vercel`, `x-vercel-cache: HIT`, `x-vercel-id: iad1::…`; A record `216.198.79.1` (a Vercel anycast IP). |
| DNS / mail | DNS hosted at **Wix** (`ns0/ns1.wixdns.net`); mail on **Google Workspace** (`aspmx.l.google.com`) | DNS-over-HTTPS lookup. *Inferred:* the domain was bought through Wix, or the site used to be on Wix. |
| Build | **Vite** single-page app | Empty `<div id="root">`, `type="module"` entry at `/assets/index-[hash].js`, about 60 code-split route and image chunks. No `<meta name="generator">`. |
| Framework | **React 18** + client-side router | `react-dom` in the bundle, `useNavigate`, and a route table (`/packages/:slug`, `/blog/:slug`, …). Source comments mention `Index.tsx` and `Accommodation.tsx`, so it is TypeScript. |
| CSS | **Tailwind CSS** | `--tw-*` custom properties in the 12KB CSS. Utility classes in the DOM: `fixed bottom-6 right-6 z-50`, `brightness-[0.45]`, `bg-foreground/60`. |
| UI kit | **shadcn/ui pattern** (Radix primitives, `sonner` toasts, `lucide` icons, `foreground` / `background` tokens) | Bundle strings: radix ×42, sonner ×115, lucide ×21. The toast viewport `<ol class="fixed top-0 z-[100] …">` is shadcn's. *Inferred:* Vite + React + Tailwind + shadcn + Supabase is the default stack of AI app builders such as Lovable, but the bundle has no Lovable marker. |
| Motion | **Framer Motion** | Chunk `proxy-[hash].js` contains `whileInView` and `framer`. There are `use-in-view` and `animations` chunks. Sections fade in on scroll. |
| i18n | **i18next** + browser language detector | The nav switches "UK" / "EN". The en-GB build says "Enquire" and the en build says "Inquire". |
| Backend | **Supabase** (Postgres + auth + realtime) | `qcegrhmcaprifvrcjrek.supabase.co`. The public bundle includes a staff back office at `/orangicalendar` (bookings, invoices, vouchers, audit log, realtime `bookings` channel). *Inferred:* the camp's own reservations calendar is part of the same app, behind Supabase auth. It was not visited. |
| Enquiry form | **Formspree** | `const g="https://formspree.io/f/…"`, posting JSON with `_subject` and `_replyto`. |
| Package "book these dates" | **`mailto:`** link pre-filled with dates and guests | PackageDetail chunk: "Your email client should have opened with your booking details…". |
| Booking engine | **ResRequest ResNova** widget on `/book` (live availability, dates, nights, Search) | `resnova.resrequest.com/widget/js/app.js` (630KB) and `/api/`. **Stripe** (`js.stripe.com`) is loaded by the widget; *inferred* to take a deposit. |
| Chat | **WhatsApp** floating button, `wa.me/447805037801` (a UK mobile) | 56px fixed green circle, bottom-right, on every page. No live-chat widget. |
| Analytics | **GA4** via gtag (`G-DPQPMTRB54`), plus a Vercel Analytics script URL in the bundle (not seen loading) | `googletagmanager.com/gtag/js`, `google-analytics.com/g/collect` (page_view, scroll). No Google Tag Manager container and no Meta pixel. |
| Cookie consent | **None** | No banner on any page. GA4 fires `page_view` on first load before any consent. *Inferred:* this is a UK GDPR/PECR exposure for a UK-facing site. |
| Maps / video | No map embeds. Two self-hosted MP4s (`/videos/Camp_Banner_Hero_web.mp4`, `RAFIKI_Banner_1080_web.mp4`), autoplay, muted and looping, with poster JPEGs | DOM. |
| Images | **No image CDN.** Vite-hashed JPEGs served from `rafikicamps.com/assets/` | No `srcset`, no `<picture>`, no WebP or AVIF. Mobile downloads the same files as desktop. CSP allows a Cloudflare R2 bucket (`pub-…r2.dev`), probably for blog or admin uploads (*inferred*). |
| Fonts | Intended: **EB Garamond** + **Inter** (Google Fonts) | See the bug below. |
| SEO | Good basics | Full `<noscript>` fallback with prices and packages. JSON-LD `LodgingBusiness`, `WebSite` and `TouristTrip` (`Offer` + `InStock`). Per-page titles. `robots.txt` explicitly welcomes GPTBot, Claude-Web and PerplexityBot. |
| Security headers | Strong | Strict CSP, HSTS with preload, `X-Frame-Options: DENY`, COOP, Permissions-Policy. HTML `max-age=0, must-revalidate`; assets `max-age=31536000, immutable`. |

**Bug (observed): the site's own fonts never load.** The Google Fonts `<link>` uses the `media="print" onload="this.media='all'"` trick. The site's CSP has no `'unsafe-inline'` in `script-src`, so Chrome blocks the inline `onload` handler. The console reports "Executing inline event handler violates the following Content Security Policy directive…". The stylesheet stays `media=print` and `document.fonts` is empty on the homepage. No request goes to `fonts.gstatic.com`.

Visitors therefore see the fallbacks, **Georgia** and **system-ui** (SF on iPhone, Segoe UI on Windows), not EB Garamond and Inter. Only `/book` gets Inter, because the ResNova widget loads it.

The screenshots render with this container's fallback fonts, so they don't show the intended faces either. The lesson for Mazingira: test a CSP against the real font-loading code.

### Third-party domains

The homepage loads just three third-party domains:

- `www.googletagmanager.com`: the gtag script, 180KB
- `www.google-analytics.com`: collect beacons
- `fonts.googleapis.com`: the CSS, which is fetched but never applied

`/book` adds three more:

- `resnova.resrequest.com`: widget and API
- `js.stripe.com`
- `fonts.gstatic.com`

The CSP also whitelists `*.supabase.co`, `formspree.io`, `api.qrserver.com` (*inferred* to make QR codes on vouchers) and the R2 bucket. None of those load on public pages.

## 2. Structure

**Sitemap:** 31 URLs. Home, `/experience`, `/accommodation`, `/rates`, `/how-to-get-here`, `/outreach`, `/faq`, `/packages` (5 packages), `/blog` (16 posts), `/book` and `/reviews`. The router also has `/drinks`, `/experiences/:slug` and `/google-review`, which redirects to Google.

**Main nav (desktop):** The Experience · The Camp · Packages · Outreach · UK/EN switch · **Enquire**, the one filled button. On mobile, a hamburger replaces everything, including Enquire.

**Page types:**

- Home: a long scroll that stitches every section together.
- Package detail (`/packages/:slug`) contains:
  - a hero with the "From" price
  - a short intro and a highlights list
  - a 3-photo gallery
  - "Example itinerary", one block per day with alternating photos
  - included and not-included lists
  - a seasonal-rate calendar with a guest counter that works out an estimated total
  - an enquiry CTA
- Rates: a full rate card.
- Blog: SEO guides such as "Serengeti safari cost guide", "How many nights", "Best time to visit", "Central vs Northern Serengeti", plus monthly journal posts.
- Book: the ResNova widget, and email, enquiry and WhatsApp fallbacks.
- Reviews: a carousel and a list.
- Outreach: the clean-water charity.

**Pricing (observed): fully published and very detailed.**

- Three seasons with exact date ranges:
  - Green, $985
  - High, $1,100
  - Peak, $1,340
- Each season has a per-person-per-night price and a single supplement (+$0, +$473 or +$593).
- A family suite has its own room rates.
- The government fees are itemised: "Park $83 + Concession $71 + TDL $1.50 pp/pd".
- Payment terms: USD only; a 20% deposit; the balance 60 days out; cancellation 100% / 50% / deposit-only by window.
- Each package shows its price in all three seasons: "$4,925 Green · $5,500 High · $6,700 Peak".
- There is a separate travel-trade section ("Trade enquiry" mailto).

**Inconsistencies (observed), the same class of defect the Mazingira audit found:**

- The child policy has three versions:
  - `/rates`: "Children 4–15: 50%, under 4 free"
  - `/packages`: "Children 5–15: 50%, under 5 free"
  - the package page: "Ages 4–12 · 50% rate, Under 3 · Free"
- The rates page is headed "Rates & Inclusions · 2027", but the package page says "2026 seasonal rates".
- The package-page calendar opened on April and May 2026, months already past on the capture date.

## 3. Design

**Typefaces, intended (from the CSS):**

- **EB Garamond** 400 for all headings: h1 72px at −2.88px tracking, h2 48px, h3 30px. Every heading is tightly tracked with negative letter-spacing.
- **Inter** 300–600 for body and UI.
- Labels are Inter 12px, uppercase, +2.4px tracking, at 50% opacity.

As rendered, the faces are Georgia and system-ui; see the bug above.

**Colours (computed, by area):**

| Role | Value |
|---|---|
| Page | off-white `#FCFCFA` |
| Ink and dark bands | near-black green `#181C17` |
| Muted text | `#70786D` |
| Accent | sage `#495F51`, used sparingly |
| Outreach band | blue `#2E5C8A` |

Stars and highlights fall back to Tailwind defaults:

- `amber-400` `#FBBF24` for the stars
- `emerald-400` `#34D399` for the season dots
- `amber-500` for the season dots

Otherwise the palette is almost monochrome: off-white and near-black, with photos supplying the colour.

**Layout and patterns:**

- Full-bleed hero with a darkened photo or video (`brightness-[0.45]`), centred serif headline, tracked-caps kicker and one ghost-white button.
- "The duality": two tall photo cards ("By day / By night"), each an auto-advancing slideshow with dash indicators.
- A stats row ("25 years of guiding", "250+ communities", "5 star hospitality", "1st camp now open").
- A coloured outreach band.
- A 4-up social-media tile row.
- A one-quote review carousel.
- A 2×2 "Before you book" card grid numbered 01–04.
- A brochure download.
- A dark full-width enquiry form.
- A dark footer with a newsletter form.

Corners are square apart from pill buttons, and there are almost no shadows. Hairline rules separate the form fields.

**Photography:** mostly the camp's own. Tents, the dining tent and the verandas appear repeatedly, and a drone shot of the river. The package hero is the **camp's branded Land Cruisers with "RAFIKI Luxury Safari + Camps" spare-wheel covers**, the same proof device Mazingira's design system plans for its own vehicles. The wildlife is generic: a buffalo, zebras, a hippo, impala and a cheetah.

There are three problems:

- The homepage hero video opens on a woman seen from behind at a fence.
- At least one image carries a photographer's watermark.
- Some wildlife shots look like stock. That is *inferred*: their style differs, but no stock ID was found.

**Motion:**

- Framer Motion fade and slide-up on most sections as they scroll in.
- Auto-advancing photo carousels.
- An auto-rotating review carousel.
- An autoplay video hero.
- A "scroll" line indicator.

**Mobile (iPhone 13):**

- The nav is fixed and transparent over the hero (`bg-transparent transition-all`). *Inferred:* it turns solid once you scroll.
- The logo is very large, about 40% of the screen width.
- **There is no sticky CTA bar.** The only persistent action is the WhatsApp button, which overlaps body text on the package page (see `trip-mobile-fold.jpg`).
- "Enquire" is hidden inside the hamburger.
- The hero's "Begin your journey" scrolls to the homepage form.
- Package pages stack the calendar below the rate legend. Pages are long: 10,800px for home and 11,000px for the package page.

## 4. Conversion path

**CTA wording:**

- Nav: "Enquire"
- Hero: "Begin your journey"
- Package pages: "Enquire now", "Enquire about these dates", "View all packages"
- Rates: "Check availability"
- Book page: "Search" (ResNova), and a fallback block, "Prefer a personal touch? Email us / Send an enquiry / WhatsApp"

The labels are all-caps and tracked.

**Three parallel paths, none of them connected:**

1. **Homepage form** (Formspree), headed "Every great adventure begins with a conversation". Fields:
   - Full name\* and email\*
   - phone
   - group size\*, with options 1–2 / 3–4 / 5–8 / 9+
   - arrival date and number of nights
   - reason for travel: Honeymoon, Family holiday, Anniversary / Celebration and others
   - "Tell us about your dream safari"

   Beneath it: "We reply personally, within 24 hours." The form is not pre-filled from the package you came from.
2. **Package calendar:** pick a check-in date and the number of adults, children and infants to see an estimated total, then "Enquire about these dates", which opens a **mailto** with the details. That is fragile on phones without a mail app and on webmail-only users.
3. **`/book`:** the ResNova live-availability widget, which can take a real booking.

**Interruptions:** a newsletter modal, "The RAFIKI Journal: Stay close to the wild". It fires on exit intent (cursor leaves the top of the page) or at 55% scroll depth, once per session, and dims the page. Code: `sessionStorage "rafiki_news_shown"`. There is a second newsletter form in the footer.

**Trust signals:**

- Five-star quotes signed with a first name only ("Cody", "Missy M.", "Julie"), some with a small Google "G".
- The longest quotes name the guides (Lawrence, Riziki and Timon). That is the most persuasive content on the site, and it is buried on `/reviews`.
- **No review counts or aggregate scores anywhere.** `/google-review` simply forwards to Google. A TripAdvisor URL appears only in the JSON-LD.
- Unverified stats: "5 star hospitality", which names no grading body, "250+ communities", "1M+ litres".
- Prices and terms are published in full, which is itself a strong trust signal.
- Rates include "Flying Doctors evacuation cover".
- There are no licence numbers (TALA, TATO), no named reservations person and no payment-safety guidance.

## 5. Performance

Cold cache, a fresh browser context per page, from a cloud datacentre with no throttling. Real 4G will be slower. Transfer and resource counts come from the Performance API about 2 seconds after `load`. "Requests" counts every network request, including GA beacons and video range requests.

| Page | Device | LCP | LCP element | FCP | TTFB | Transfer (compressed) | Resources / requests |
|---|---|---|---|---|---|---|---|
| Home | Desktop 1440×900 | **2.38s** | H1 text | 2.38s | 431ms | 3,772KB | 52 / 61 |
| Home | iPhone 13 | **2.05s** | H1 text | 2.05s | 284ms | 3,610KB | 52 / 65 |
| Package (5-night) | Desktop | 1.82s | hero JPEG | 1.65s | 107ms | 2,277KB | 42 / 45 |
| Package (5-night) | iPhone 13 | 1.66s | hero JPEG | 1.60s | 103ms | 1,903KB | 40 / 45 |
| Book | Desktop | 1.67s | hero JPEG | 1.44s | 110ms | 1,361KB | 29 / 30 |
| Book | iPhone 13 | 2.00s | hero JPEG | 1.78s | 459ms | 1,361KB | 29 / 30 |

CLS was 0 everywhere.

**After scrolling the whole homepage**, images total **about 17.4MB on desktop and 17.9MB on iPhone**. Most of it is one file, `hippo-veranda-….jpg`, at **9.66MB**, used as a social tile about 300px wide, plus `fullsize-render-….jpg` at 2.8MB. There is no responsive sizing, so the phone pulls the same bytes.

JS: the main bundle is 286KB compressed (973KB raw), plus about 300KB of route chunks and gtag (180KB). ResNova adds 630KB on `/book`.

The homepage's first paint waits on client-side React and the Framer Motion fade-in (*inferred*: FCP equals LCP at about 2s despite a fast TTFB).

## 6. Verdict for Mazingira

RAFIKI is a well-engineered, competently art-directed site for a single lodge. It is strong on **prices** and weak on **people** and **proof**, which inverts Mazingira's strategy (`design/system/README.md`: "people, prices and proof").

**Worth borrowing:**

1. **The completeness of the rate card.** Seasons with exact dates, single supplements, the child policy, government fees itemised to the dollar, and deposit, balance and cancellation terms on one page. Mazingira's PriceTiers and trip pages should reach the same level, with group-size tiers instead of seasons, and from **one data source**. RAFIKI's three conflicting child policies show what happens without one.
2. **Each package showing its price in all three seasons**, plus a calendar that turns dates and guests into an estimated total. A simpler version fits Mazingira: price per person by group size and month, pre-filling the EnquiryForm.
3. **Included / not included** as two plain lists on every trip.
4. **The branded-vehicle photo as a trip hero.** RAFIKI uses its Land Cruisers with branded spare-wheel covers exactly as Mazingira's system plans to. That confirms the instinct; Mazingira's version has its team on the roof, which is stronger.
5. **The `noscript` fallback, JSON-LD (`TouristTrip` + `Offer`) and SEO guide posts** ("cost guide", "how many nights", "best time"). They are cheap and they work.
6. **The reply promise next to the form** ("We reply personally, within 24 hours"). Mazingira should name the person and beat the time, as the report recommends ("Johari will reply…").
7. **A travel-trade line and a downloadable brochure** for agents and for sharing with fellow travellers.

**Not worth borrowing:**

1. **The "AI slop" tells.** Checked against the report's list (`reports/…AI design.md`, "AI slop now includes the 'tasteful' earthy fallback"), RAFIKI shows nearly all of the second-generation tells:
   - Tracked-out all-caps eyebrow labels on every section, about 30 on the homepage alone.
   - Middle-dot meta strings ("Central Serengeti · Orangi River", "per person · 5 nights · Green Season").
   - Arrows appended to links ("See full rates →", "Read more reviews →").
   - **01 / 02 / 03 / 04** markers on cards that are not a sequence.
   - A near-black and off-white "broadsheet" palette with a thin serif.
   - Framer Motion fade-and-slide-up on every section, with auto-rotating carousels.
   - Copy tells Mazingira's voice rules ban: "Begin your journey", "Tell us about your dream safari", "Two worlds. One extraordinary stay.", "Your sanctuary, refined", "Create memories that last generations".

   It also has a first-generation tell: Inter for body text. Its stack, shadcn tokens with Tailwind default amber and emerald, also reads as template defaults. Mazingira's system already rules all of this out: sentence case, no eyebrows, no dot strings, no arrows, and one motion moment.
2. **No people.** Guides appear only inside guest quotes, and the contact is "our concierge team". Mazingira's GuideProfile and named-planner pattern is the differentiator here.
3. **Proof without counts.** First-name quotes and "5 star hospitality" with no source carry no weight. Use ReviewScore with platform, score and count, plus licence numbers.
4. **Three disconnected enquiry routes**, one of them a `mailto:`. Mazingira should keep **one** EnquiryForm, pre-filled from the trip, plus WhatsApp to a named person.
5. **The interruptions.** An exit-intent and scroll-triggered newsletter modal, and a hamburger-only "Enquire" on mobile. Mazingira should have a persistent mobile enquire/WhatsApp bar instead of a floating button that covers text.
6. **The engineering slips.** A CSP that silently kills the brand fonts. A 9.66MB image with no responsive sizes. Analytics with no consent banner. A client-rendered SPA where a static site would do. Mazingira's plain HTML/CSS components, with `srcset` and AVIF/WebP, and a font load the CSP allows (self-host the fonts or use a plain `<link>`), avoid all four.
7. **The online booking engine (ResNova + Stripe).** It is right for a lodge selling room-nights. Mazingira sells guided itineraries and doesn't take bookings online, so it is irrelevant.

**Bottom line:** borrow RAFIKI's **price transparency and package-page anatomy**. Ignore its look, which is the category's generic luxury template, and its trust layer, which is thin. It is a useful negative example of how quickly a competent build drifts into the "tasteful AI default".
