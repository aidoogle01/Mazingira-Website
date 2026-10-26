# RouteMap

**The site's signature.** A drawn map of northern Tanzania from real coordinates, with the trip's route in `forest` and the places it skips as faint dots. It is the one place the site moves: the route draws itself once, leg by leg, when it scrolls into view (off when the visitor prefers reduced motion).

- Call `Mazingira.routeMap(container, stops, {title})` from `components/bundle.js`. `stops` is the ordered list of place keys from `Mazingira.PLACES` (arusha, kilimanjaro, tarangire, lake-manyara, karatu, ngorongoro, ndutu, serengeti, north-serengeti, lake-natron, zanzibar). Prefix a flight with `fly:` (`'fly:zanzibar'`), which is drawn dotted.
- Derive the stops from the trip's `itinerary[]` titles and accommodation. Write them into the trip file rather than guessing at build time.
- Put a one-sentence text description under the map. The SVG has a `<title>`, but the sentence is what screen-reader and skim readers use.
- Don't add roads, park boundaries, icons or animals. The quiet map is the point.
