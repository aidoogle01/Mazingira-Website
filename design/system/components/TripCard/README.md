# TripCard

A trip in a listing (Home, Safaris, related trips). The whole card is one link to the trip page.

- Provide, from `content/trips/<id>.json`: an image (`images[0]`, our own photo), the eyebrow (`duration_days` + `best_time.text`, plus the style when it isn't a standard safari), `title`, `summary` (one or two sentences), `price.from`, and the trip URL.
- The price shown **must** be `price.from` from the trip's own file. Never type a price into a card by hand; that is how the old site ended up with three prices for one trip.
- Lay cards out in a grid: 3 columns at 1024px+, 2 at 640px+, 1 below, `space-6` gaps.
- Don't add badges such as "Best seller" or star ratings to cards.
