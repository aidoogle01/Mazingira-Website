# EnquiryForm

The single enquiry form. It sits in the `dust` band at the bottom of trip pages and on its own page, and it names the person who will reply.

- Fields: trip (pre-selected from the page, plus "help me choose"), name, email, travel month (not exact dates), travellers, budget band with "Not sure yet", and a message. No postal address, no phone requirement.
- Send to `site.json` `contact.email` (and `email_uk_sales` for UK enquiries) and log the source page.
- Always offer WhatsApp beside the submit button. Put **ProcessSteps** directly below the form so people know what happens next.
