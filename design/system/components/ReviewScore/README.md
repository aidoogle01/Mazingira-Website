# ReviewScore

Independent ratings, set near every call to action: under the Home hero, beside a trip's price and above the enquiry form. Each links to the profile.

- Provide, from `content/reviews.json` `aggregate[]`: `rating`, `count`, `source`, `url`. Show the count; a bare "5.0" is trusted less than "5.0 from 81 reviews".
- Only show figures taken from the source. The Tripadvisor figures are placeholders until checked (`content/_review/placeholders.md`).
- No stars or owl logos drawn by hand.
