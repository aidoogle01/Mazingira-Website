# ReviewScore

The rating badges that sit beside calls to action: under the home hero, next to the price on trip pages, and above the enquiry form.

- Provide, from `content/reviews.json` `aggregate[]`: `rating`, `count`, `source` and `url`. Each badge links to the review profile.
- Only show a rating that came from the source. The TripAdvisor figures are still placeholders, so check `content/_review/placeholders.md` before launch.
- Write the source name in text. Don't redraw the TripAdvisor owl; use TripAdvisor's official badge if a graphic is needed.
