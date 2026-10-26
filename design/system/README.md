Mazingira Safari is a Tanzanian-owned safari operator in Arusha, founded in 2007. *Mazingira* is Swahili for "environment". The site's job is to earn the trust of a careful, mostly UK-based traveller spending $2,000–$9,000 a head, and turn that trust into an enquiry. It doesn't take bookings online. Everything here serves that: real photographs, plain prices, Tanzanian voices, and one obvious way to get in touch.

## Voice and content

- **Write as Mazingira: "we" are the Arusha team, "you" are the traveller.** Name people where possible: "Jacob will meet you at Kilimanjaro Airport", not "a representative will greet you".
- **British English** (most guests are from the UK): *colour, organise, travellers, programme*. Ages, durations and distances use numerals: "6 years and over", "a 2-hour drive", "4,600m".
- **Sentence case** for headings, buttons and navigation: "Plan your trip", "Enquire about this trip". The old site's ALL CAPS headings are gone; the `eyebrow` style is the only uppercase text.
- **Be specific.** Use the trip's real lodges, drive times and months: "Day 4 · Kubu Kubu Tented Lodge · Breakfast, lunch and dinner". Avoid "breathtaking", "unforgettable", "once-in-a-lifetime" and "embark"; the old copy leaned on them in every paragraph.
- **Prices** are shown as `$5,699` with "per person" beneath in `small`, and always say what they're based on: "based on 6 people sharing". Never show a price that differs from the trip page.
- **Days** are written "Day 3" or "Days 8–11" (en dash). Months as "Jun–Sep".
- **Swahili** words are welcome when they're explained: "*Karibu* (welcome) to Arusha".
- **No emoji**, no exclamation marks in headings.

## Colour

Earthy and calm: the logo's sage, the old site's warm sand, and a deep forest green that does the work.

- Page background is `surface`. Cards, forms and the itinerary sit on `surface-raised`.
- Running text and headings are `ink`; secondary lines (meal plans, captions, "per person") are `ink-muted`.
- **`forest` is the action colour**: the primary button, links, prices, the active itinerary day. Use it with `on-forest` for text on a forest fill.
- **`sage` is the brand colour, not a text colour.** Use it for the logo, timeline dots and rules, and decorative blocks. Text on a sage fill uses `on-sage`.
- Use **one** `sand` band per page, for the moment of invitation (the enquiry block or "Plan your trip"). Use `sage-soft` for quieter bands and hover or selected fills.
- `taupe` is a quiet secondary (outline buttons, footer). `line` is for hairlines only.
- `whatsapp` and `on-whatsapp` are only for the WhatsApp button.
- The focus ring is a 2px solid `focus` outline with a 2px offset, on every interactive element.
- Both themes are defined. Every text pair above passes WCAG AA (4.5:1) in light and dark.

## Typography

Two families, carried over from the old site (which loaded twelve):

- **Cormorant Garamond** (`display`) for headings: `display-xl` (home hero only), `display-l` (page titles), `heading` (sections), `title` (cards, itinerary days, names). Weight 600. Headings use `text-wrap: balance`.
- **Quicksand** (`sans`) for everything else: `lead`, `body`, `small`, `eyebrow`, `price`, `button`. Body text is weight **500**; Quicksand at 400 is too thin for long reading.
- Keep running text to 65–70 characters per line (`max-width: 38rem` for `body`).
- Prices use `price` with `font-variant-numeric: tabular-nums`.
- Both families load from Google Fonts: `Cormorant Garamond` 500 and 600, and `Quicksand` 400 to 700.

## Layout and spacing

- Content width is 1200px at most, with a gutter of `space-4` on mobile and `space-6` above 720px.
- Sections are separated by `space-12` (mobile) or `space-16` (desktop) of padding, not by rules.
- Lay out cards in a grid with `space-6` gaps: 3 columns at 1024px and up, 2 at 640px, 1 below.
- Corners: `radius-lg` for trip cards and photos, `radius-md` for buttons, `radius-sm` for fields and badges, `radius-pill` only for WhatsApp and review badges.
- The only shadow is `shadow-card`: a trip card on hover, and the floating WhatsApp button. Everything else separates with `line` or a surface change.
- Mobile first. On phones, the WhatsApp button floats bottom-right on every page except the enquiry form.

## Photography

- **Use only Mazingira's own photographs** (the *Photos* asset group, and images on the old site whose file IDs begin `1ac0ef_`). Several old-site images, including the leopard-video hero, the hippos and the Maasai-on-the-beach photo, are **Wix stock** (`11062b_`). Don't reuse those.
- Prefer real moments from their own trips (the branded vehicle, camp dinners, guides) over generic wildlife portraits. The vehicle photo is the single strongest proof that this is a real local operator.
- Photos are full-bleed or `radius-lg`, never framed with borders. No filters, no colour overlays except a bottom-up `ink` gradient where text sits on a photo (at least 4.5:1 under the text).
- Every image needs alt text describing what's in it: "Mazingira Land Cruiser on a dirt track in Tarangire".
- Lodge photos belong to the lodges. Link to them; don't copy them.

## Iconography

The old site had no icon system, only social-media PNGs. This system uses **text labels instead of icons**: "WhatsApp us", "Call +255 784 278 205", "Instagram". If icons are added later, use a single outline set at 1.5px stroke in `ink`, and never draw third-party logos (WhatsApp, TripAdvisor) by hand; use their official badge files.

## Components

All components are plain HTML and CSS: class names prefixed `mz-`, styles in `components/bundle.css`, values from tokens only. Each component's README lists the content it needs. Map component content to the content model in the `mazingira-website` repo (`content/trips/*.json` and so on).

| Component | Use it for |
|---|---|
| Button | Enquire (primary), secondary actions (outline), WhatsApp |
| TripCard | Trip listings on Home and Safaris |
| FactStrip | The facts at the top of a trip page |
| ItineraryDay | Day-by-day timeline (all days visible, never tabs) |
| PriceTiers | Price by group size on a trip page |
| ReviewScore | TripAdvisor and SafariBookings ratings next to calls to action |
| EnquiryForm | The one enquiry form, pre-filled with the trip |
| ParkFacts | Wildlife and travel-time panel on park pages |

## Logo

Use `mazingira-logo.png` (Logos group): the sage wordmark with the acacia tree, and the strapline "Eco-friendly safari adventures". Place it on `surface` or `surface-raised` only, at least 120px wide, with clear space equal to the height of the "M" on all sides. Don't recolour or redraw it. A vector (SVG) version is still to come from Mazingira; replace the PNG when it arrives.
