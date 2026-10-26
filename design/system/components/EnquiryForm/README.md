# EnquiryForm

The single enquiry form, replacing the old site's three. It sits in the `sand` band at the bottom of trip pages and on its own page.

- Fields: trip (pre-selected from the page the visitor came from, with a "help me choose" option), name, email, when, travellers, budget band and a free-text message. Nothing else is required; no postal address.
- Send submissions to `site.json` `contact.email`, plus `email_uk_sales` for UK enquiries.
- Always offer WhatsApp beside the submit button.
- Labels sit above the fields and every field has a `<label>`. Error messages say what to fix: "Enter an email address so we can reply".
