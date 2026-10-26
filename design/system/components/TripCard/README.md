# TripCard

A trip on the full Safaris index, where people compare. Not a boxed card: a square-cornered photo with the title, one honest line and the price beneath. On Home use **TripRow** instead.

- Provide, from `content/trips/<id>.json`: `images[0]` (our own photo), `title`, a one-line summary that names the places and nights, `price.from`, and the trip URL.
- The price **must** come from the trip file's `price.from`. Never type a price by hand.
- Grid: 3 columns at 1024px+, 2 at 640px+, 1 below, `space-8` gaps. Hover underlines the title; nothing lifts.
- No badges ("Best seller"), no star ratings, no labels above the title.
