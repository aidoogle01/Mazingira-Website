# Button

The action that moves a traveller towards an enquiry. **Primary** (`mz-btn`, `forest`) appears once per view, for the main action: "Enquire about this trip", "Send enquiry". **Outline** (`mz-btn mz-btn--outline`) is for secondary actions. **WhatsApp** (`mz-btn mz-btn--whatsapp`) opens a chat with `site.json` `contact.whatsapp`. Name the person when you can ("WhatsApp Johari"). Add `mz-btn--float` to pin it bottom-right on mobile; it is the only element with a shadow.

- Provide: the label (sentence case, verb first) and an `href`. Use `<a>` for navigation and `<button>` in forms.
- Minimum height is 48px for touch. Hover underlines the label; nothing lifts or glows.
- No arrows or icons in labels. Always write the word "WhatsApp"; don't draw its logo.
