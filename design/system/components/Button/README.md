# Button

The action that moves a traveller towards an enquiry. **Primary** (`mz-btn`, `forest`) appears once per view, for the main action: "Enquire about this trip", "Send enquiry". **Outline** (`mz-btn mz-btn--outline`) is for secondary actions. **WhatsApp** (`mz-btn mz-btn--whatsapp`) opens a WhatsApp chat with the number in `site.json` `contact.whatsapp`; add `mz-btn--float` to pin it bottom-right on mobile.

- Provide: the label (sentence case, verb first) and an `href`. Use `<a>` for navigation and `<button>` inside forms.
- Minimum height is 44px for touch. `mz-btn--block` makes a button full-width inside a card or form.
- Always write the word "WhatsApp" in the label. Don't draw the WhatsApp logo.
- Don't use two primary buttons side by side.
