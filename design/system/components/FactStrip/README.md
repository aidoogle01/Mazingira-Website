# FactStrip

The four facts at the top of a trip page, directly under the title: duration, best time, start point and places visited. It replaces the old site's "fact strip", which listed places the itinerary didn't visit.

- Provide: `duration_days`, `best_time.text`, `start` and `locations` from the trip file. The locations must match the itinerary; the content validator checks this.
- Markup is a `<dl>` with one `<div>` per fact. It wraps to 2 or 1 columns on narrow screens.
