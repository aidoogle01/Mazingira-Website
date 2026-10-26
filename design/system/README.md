Mazingira Safari is a Tanzanian-owned safari company in Arusha, founded in 2007. *Mazingira* is Swahili for "environment". The website has one job: earn the trust of a careful, mostly UK-based traveller spending $2,000–$9,000 a head, and turn it into an enquiry that a named person answers quickly. Mazingira doesn't take bookings online.

The research behind this system (`reports/Safari website benchmarks and AI design.md` in the website repo) found that the best safari companies sell **people, prices and proof**, not mood. They show named guides and planners, publish prices, and point to proof anyone can check. This system is built around those three things, and around one recognisable signature: **the route map**.

## Voice and content

- **Write as Mazingira: "we" are the Arusha team, "you" are the traveller.** Name people: "Johari will reply", "Goodluck will guide you", not "a representative".
- **British English** (most guests are from the UK): *colour, organise, travellers*. Numerals for ages, durations and distances: "6 years and over", "a 2-hour drive", "3,850m".
- **Sentence case** everywhere: headings, buttons, labels. There is no all-caps text in this system.
- **Write facts as sentences or labelled lists, never as strings joined by dots.** Write "Nine days, best June to September", not "9 DAYS · JUN–SEP". On trip days, use a small "Stay / Meals" list.
- **Be specific; it is also what sells.** Name the lodge, the drive time, the month, the guide. Don't use "breathtaking", "unforgettable", "once-in-a-lifetime", "embark", "immerse yourself" or "dream safari"; the old copy used them in nearly every paragraph.
- **Prices:** "From $5,699 per person", with its basis ("6 sharing"), and the same figure everywhere, always taken from the trip's data. Next to it, say that the trip is a starting point that can be changed.
- **Days:** "Day 3", "Days 7–8" (en dash). Months in words in running text ("June to September").
- **Swahili** is welcome when explained: "*Karibu* (welcome) to Arusha".
- **Claims need proof.** Don't call trips "eco-friendly" in body copy until the impact page and a certification (Travelife is the realistic one) exist. The logo's strapline stays because it is the logo.
- **Hero line (draft to agree with Jacob):** "Tanzania, guided by Tanzanians." It is true, specific, and something no international agent can say.
- No emoji, no exclamation marks in headings, no arrows in links.

## Colour

Taken from Mazingira's own world: the logo's sage, the olive of its spare-wheel covers, and the dry-grass khaki of the tracks and the guides' uniforms.

- The page background is `surface`; cards, forms and panels sit on `surface-raised`.
- Running text and headings are `ink`. Labels, meal plans, captions and "per person" are `ink-muted`.
- **`forest` is the action colour**: primary buttons, links, prices, and the route line on the map. It is darkened from the olive of the branded spare-wheel covers. Use `on-forest` for text on a forest fill.
- **`sage` is the brand colour, never text.** Use it for the logo, the best months in the MonthStrip, step rules and decorative blocks. Text on a sage fill uses `on-sage`.
- **`dust`** is the dry-grass khaki. Use one band per page, for the invitation: the enquiry block.
- Use `sage-soft` for quiet bands and empty month cells. `line` is for hairlines and the map's skipped places.
- `whatsapp` and `on-whatsapp` are only for the WhatsApp button.
- Focus ring: 2px solid `focus`, 2px offset, on every interactive element.
- Light and dark themes are both defined. Every text pair passes WCAG AA (at least 4.5:1) in both.

## Typography

- **Cormorant Garamond** (`display`), weight 600, for headings, day numbers and guide names: `display-xl` (Home hero only), `display-l` (page and trip titles), `heading` (sections), `title` (card and day titles). Carried over from the old site. Headings use `text-wrap: balance`.
- **Alegreya Sans** (`sans`), weight 400 (500 for labels and buttons), for everything else: `lead`, `body`, `small`, `label`, `price`, `button`. It replaces the old site's Quicksand, a rounded geometric face that read as informal next to Cormorant. Alegreya Sans is a humanist sans with calligraphic roots, so it sits naturally with the serif. *This is a deliberate change to test with Mazingira; Quicksand is the fallback if they prefer continuity.*
- Running text at most 38rem wide (about 65–70 characters).
- Prices use lining, tabular numerals.
- Both families load from Google Fonts.

## Shape, layout and motion

- **Corners are small**: `radius-md` (4px) is the largest, used on buttons, panels and the form. Photos are square-cornered. `radius-pill` is only for the WhatsApp button. The old soft, rounded card look is gone.
- **Separate with hairlines and space, not boxes.** Trip lists, facts, itinerary days and park facts sit between `line` rules. Only the enquiry form and the payment panel are filled or outlined.
- **Home presents trips editorially** with **TripRow** (big photo, big title, a few specific sentences, alternating sides). The card grid (**TripCard**) is only for the full Safaris index.
- Content width is at most 1200px, with gutters of `space-4` on mobile and `space-6` above 720px. Sections are spaced `space-12` (mobile) to `space-16` (desktop).
- **One shadow** (`shadow-float`), on the floating WhatsApp button.
- **One motion moment:** the RouteMap draws its route once, leg by leg, when it scrolls into view. Nothing else fades, slides or lifts on hover; hover underlines. Respect `prefers-reduced-motion`.

## Cinematic layer (website)

Benchmarked against the leading safari sites (`research/browser-pass/findings.md`), the website is cinematic in structure and restrained in detail:

- **Full-bleed photographic heroes**: the team on their Land Cruisers on Home, the trip's own best photo on trip pages. Still photographs, not video: the video-led competitors moved 9–46 MB per page. Darken with a bottom-up gradient so white text reads at 4.5:1 or more.
- **A larger display scale on heroes**: up to about 112px on desktop for the Home headline, about 72px for page titles.
- **Rhythm from colour and image**, not boxes: full-width photo bands, a **deep** forest band (`#22261A`, text `#F1F0E6`, 14.6:1) for the route map and footer, `dust` and photo split panels for people, and `surface` only for reading.
- **The route map is the centrepiece of every trip page**, large on the deep band, drawn in `dust`.
- The site is light-only: the photography and the deep bands carry the contrast.

## The signature: route maps

Every trip page has a **RouteMap**: a quiet drawing of northern Tanzania from real coordinates, with the trip's route in `forest` and the places it skips as faint dots, with Zanzibar shown as a dotted flight off the edge. Safari buyers think in routes, so it is useful as well as distinctive, and it is drawn from Mazingira's own itineraries rather than from a template. Use it on trip pages beside the itinerary, small on TripRows, and on park pages (with the park as the only stop). Don't decorate it.

## Photography

- **Lead with Mazingira's people and vehicles.** The team photo (the whole team on top of their branded Land Cruisers) is the Home hero. Jacob beside the branded spare-wheel cover belongs on the About and founder pages. These photos are the strongest proof on the site that this is a real Tanzanian company.
- **Use only Mazingira's own photographs** (the *Photos* and *Team* asset groups, and old-site images whose IDs start `1ac0ef_`). Several old-site images are **Wix stock** (`11062b_`), including the old leopard-video hero, the hippos and the Maasai-on-the-beach photo; don't reuse them. **Never use AI-generated images** of wildlife, places or people.
- Photos are full-bleed or square-cornered, never framed, filtered or tinted. Where text sits on a photo, add a bottom-up `ink` gradient strong enough for 4.5:1 under the text.
- Every image has alt text describing what is in it: "Goodluck Nathan on the roof of a Mazingira Land Cruiser".
- Lodge photos belong to the lodges: link to them, don't copy them.

## Iconography

None. The system uses words: "WhatsApp Johari", "Call +255 784 278 205", "Instagram". If icons are ever needed, use one outline set at 1.5px in `ink`, and never redraw third-party logos (WhatsApp, Tripadvisor); use their official badges.

## Components

Plain HTML and CSS with `mz-` class names (`components/bundle.css`), plus two small helpers in `components/bundle.js` (`Mazingira.routeMap`, `Mazingira.monthStrip`). Each component's README lists the content it needs from the website repo's content model (`content/trips/*.json` and so on).

| Component | Use it for |
|---|---|
| Button | Enquire (primary), secondary (outline), WhatsApp (named person) |
| TripRow | Trips on Home, editorially |
| TripCard | The full Safaris index grid |
| FactStrip | Length, best time, start and places, at the top of a trip page |
| RouteMap | The signature: every trip's route, drawn |
| MonthStrip | Best months at a glance |
| ItineraryDay | The day-by-day plan, every day visible |
| PriceTiers | Price per person by group size |
| ReviewScore | Independent ratings with counts, near every call to action |
| GuideProfile | Guides, the founder and planners: the people behind the trips |
| PaymentSafety | "How to pay us safely" |
| EnquiryForm | The one enquiry form, pre-filled, with WhatsApp |
| ProcessSteps | What happens after you enquire |
| ParkFacts | Wildlife and travel times on park pages |

## Logo

`mazingira-logo.png` (Logos group): the sage wordmark with the acacia, and the strapline "Eco-friendly safari adventures". Use it on `surface` or `surface-raised`, at least 120px wide, with clear space equal to the height of the "M" on every side. Don't recolour or redraw it. A vector (SVG) version is still to come from Mazingira.
