# ItineraryDay

One entry in the day-by-day timeline on a trip page. **Every day is visible at once.** The old site hid days behind tabs, which hid most of the content from visitors and search engines.

- Provide, per entry in `itinerary[]`: the day label ("Day 3", or "Days 7–8" for a `days` range, en dash), `title`, `description` (Markdown), `accommodation`, and `meal_plan`. Kilimanjaro days also show `altitude`.
- Wrap entries in `<ol class="mz-itin">`. The sage line and dots are drawn by CSS.
- Leave out a meta item rather than showing an empty one.
- Don't collapse days into an accordion on desktop. On mobile, an "Expand all" control is acceptable for itineraries over 10 days.
