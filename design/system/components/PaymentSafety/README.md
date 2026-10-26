# PaymentSafety

The "How to pay us safely" panel, on its own page and linked from every quote, the booking-process page and the footer. It answers the scam worry that mismatched bank details caused on the old site.

- Provide, from `content/site.json`: `legal_name`, licence number, membership, `booking_terms`, and the phone number for checking bank details.
- Highlighted text (`mz-pay__todo`) marks values still waiting for the client. Remove the highlight when confirmed; the strict validator fails while placeholders remain.
- Never put bank account numbers on the website.
