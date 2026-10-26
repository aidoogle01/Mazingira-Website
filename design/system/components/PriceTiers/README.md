# PriceTiers

Price per person by group size, on the trip page next to the enquiry button.

- Provide: `price.tiers[]` (group size and USD per person) and `price.note` as the caption. With no tiers, show `price.from` and `price.basis` as text instead.
- Prices are USD with thousands separators and no decimals: "$5,699".
- Follow it with what's included and excluded (`includes`, `excludes`) as two plain lists.
