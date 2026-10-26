# 03: Brand and design

Screenshots: `screenshots/desktop/*.jpg` (1440px wide, all pages) and `screenshots/mobile/*.jpg` (iPhone 13, 7 key pages).

## Logo
- A wordmark, **MAZINGIRA**, in sage green, with an acacia tree replacing the letter "I". The strapline underneath reads "ECO-FRIENDLY SAFARI ADVENTURES".
- It works on light backgrounds. We need the **original vector files (SVG or AI)** from the client. The site only has a raster version.

## Colour (measured from the live page)

| Role | Colour | Hex | Where |
|---|---|---|---|
| Brand / section background | Sage | `#B4BBAC`, `#BDCBAE`, `#B1BDA5` | Packages band, testimonials band, logo |
| Warm accent background | Sand | `#FEE6C4` | Section backgrounds |
| Buttons | Taupe | `#7B736F` | "Learn More" and the hero buttons |
| Text | Black / slate | `#000000`, `#373B4D` | Body copy |
| Base | White | `#FFFFFF` | Page background |

**Verdict:** the palette is earthy and suits an eco-safari brand, so it's **worth keeping and formalising**. Three slightly different sages are used where one should be. Contrast is weak in places: white text on the sage band, and pale sage text on white ("Phoenix S" and "Contact us" headings).

## Typography

**12 font families load on the homepage:** Quicksand, Cormorant Garamond (semibold and light), Futura LT (light and book), Playfair Display, Raleway, Roboto Thin, EB Garamond, Georgia and Trirong. Headings switch between Playfair (hero), Quicksand (section titles) and Cormorant (card titles) on the same page.

**Verdict: drop.** A rebuild should use **one serif for headings** (Cormorant or Playfair matches the current feel) and **one sans-serif for body text** (Quicksand or similar).

## Imagery
- **Hero:** a full-width video of a leopard. It's strong.
- **Gallery:** a 15-photo grid of original wildlife images. Very strong.
- **Testimonial avatars:** black-and-white stock-style circles, which feel generic.
- **Tour cards:** a good, varied photo for each trip.

## Layout patterns (reusable as components)

| Pattern | Used on | Keep? |
|---|---|---|
| Video hero with 2 calls to action | Home | ✅ Keep, but show a clearer offer |
| Trip card (photo, title, "X DAYS FROM $Y pp", short text, READ MORE) | Home, packages | ✅ Keep, but make prices consistent and link the whole card |
| Trip "fact strip" (best time / duration / locations / start) | All packages | ✅ Keep |
| Day-tab itinerary with meal plan + lodge + destination | All packages | ✅ Keep the data; ⚠️ show all days at once (accordion or timeline) instead of hidden tabs |
| Park page template (intro → carousel → "Important facts" → wildlife list → travel times) | 7 parks | ✅ Keep |
| "Important facts" panel | Parks | ✅ Keep |
| Price-by-group-size table | Packages | ✅ Keep, as a proper table |
| Photo gallery grid | Home | ✅ Keep |
| Testimonial band (3 cards) | Home | ⚠️ Replace with live TripAdvisor/SafariBookings reviews and ratings |
| Newsletter band | Home (×2), footer | ❌ Show it once, not three times |

## Overall look and feel
On desktop it's clean but dated: a typical Wix template, with thin borders around cards, small body text (14–16px) and inconsistent spacing. On mobile, the layout stacks acceptably with no horizontal scrolling. But Wix's separate mobile layout has **drifted from desktop**: it shows a different price.
