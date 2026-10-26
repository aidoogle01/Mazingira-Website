# 04: Conversion (how visitors become enquiries)

A safari is a high-value purchase (about $2,200–$8,650 per person) that people plan carefully. The site's job is to **build trust and turn interest into a quality enquiry.** It doesn't take bookings online. Every trip is tailor-made and quoted (Booking Process step 1).

## Ways to make contact

| Channel | Where | Notes |
|---|---|---|
| **Enquire Now** button → `/enquire-now-form` | Home hero, every package, park and activity page | The main path. A multi-step Wix form. Step 1: "Have you been on safari before?" (3 options) and start/end dates → Next. We didn't go past step 1, to avoid submitting a real enquiry. |
| Kilimanjaro form → `/klimanajro-enquiry` | Kilimanjaro hub | Name, email, **full postal address** (street, line 2, city, region, postcode, country) and phone → Next. That's far too much to ask up front, and the URL is misspelled. |
| Contact form → `/contact` | Nav | First name, last name, email, message. **The page shows the wrong email domain** (see 06 #1). |
| Email (`mailto:`) | Header and footer | `info@` and `uk.sales@mazingirasafari.com` (these are correct). |
| Phone (`tel:`) | Header | The link is malformed (`tel:+ 255784278205`, with a space), so it may fail on some phones. |
| Wix Chat | Every page | Mentioned in the booking process. Couldn't be tested from our environment (see workflow-notes). |
| Newsletter sign-up | Home (twice), footer, Maasai page | Collects email only. Poptin pop-up software is also installed. |
| WhatsApp | **Nowhere** | ❌ Missing. Expected for an East African operator whose main number is a mobile. |
| Phone for a named specialist | `/safari-packages` | "Johari Msangi – Travel Specialist +255784278205". A good personal touch, but Johari isn't on the team page. |

## Clicks to enquire
- **Home → enquiry:** 1 click (hero button). ✅
- **Trip page → enquiry:** 1 click ("ENQUIRE NOW" near the top). ✅ However, the form **doesn't know which trip** you came from, so the trip name isn't passed through.
- **Mobile:** the hero buttons are visible straight away. There's no fixed "Enquire" or WhatsApp button as you scroll.

## Trust signals

| Signal | Present? | Where |
|---|---|---|
| TripAdvisor Travellers' Choice badge | ✅ but from **2020** | Header |
| TATO membership | ✅ | Footer logo, About page |
| Reviews | ⚠️ only 3 on the homepage, with no source. `/testimonials` is empty. | |
| Review score (TripAdvisor or SafariBookings 5.0/5 from about 81 reviews) | ❌ not shown | |
| Real team photos and names | ✅ | `/meet-the-team` |
| Years in business ("since 2007") | ❌ not on the site (only on SafariBookings) | |
| Clear prices | ⚠️ present but conflicting | |
| Secure payment and booking terms | ✅ terms present; ⚠️ bank details published openly | |

## What the rebuild should do
1. **One enquiry form** that is short (name, email, dates, group size, trip of interest, budget band, message), **knows the trip** you came from, and offers WhatsApp as an alternative.
2. A fixed **Enquire / WhatsApp** button on mobile.
3. **Live review score and recent reviews** (TripAdvisor and SafariBookings) next to every call to action.
4. Show "Since 2007 · TATO member · X happy travellers" near the top.
5. Remove the bank details from the public page and **send them only in the written quote**. Tell customers to confirm bank details by phone.
