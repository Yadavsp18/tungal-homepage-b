# Tungal Schools & Colleges: homepage, Option B ("Sandstone & River")

A standalone static homepage (HTML, CSS, vanilla JS, with GSAP and ScrollTrigger self-hosted). It is photo-led and uses only authentic Tungal photographs. It is kept separate from the live Wix site.

```
index.html                    markup, meta, Open Graph, JSON-LD (campus addresses and phones from the Contact page)
assets/css/main.css           tokens (Sandstone & River palette), components, sections, breakpoints
assets/js/main.js             hero carousel, results counters, pathway ladder, campus filter, lightbox, form, header
assets/js/site-data.js        programme lists per campus and hostel rules (drive the enquiry form)
assets/photos/                15 Tungal photos, WebP, each with an -800 variant for phones
assets/brand/                 crest and wordmark recoloured for Option B, og-image.jpg
forms/admission-enquiry.php   enquiry handler (set $to before going live)
```

## Palette

| Token | HEX | Use |
|---|---|---|
| River Teal | #0E3B3F | Grounds, navigation, footer |
| Teal 900 | #0A2C2F | Deepest sections |
| Laterite | #B4472A | Primary buttons, emphasis, results strip |
| Clay 700 | #94361E | Clay text on sandstone grounds (AA) |
| Saffron | #F0A830 | Highlights and active states on dark grounds |
| Chalk | #FBF7F1 | Page ground |
| Sandstone | #EFE4D3 | Alternate sections |
| Ink | #1C1A18 | Body text |

Type: Bricolage Grotesque for headlines and Plus Jakarta Sans for text, both self-hosted.

## Photo inventory

All photos are authentic Tungal photography from tungalschools.com, captured on 19 Nov 2026.

| File | Section | Source page |
|---|---|---|
| hero-lab | Hero 1, PU Science card | Hulyal campus gallery |
| life-classroom | Hero 2, School card, gallery | Hulyal campus gallery |
| hero-campus | Hero 3 | Homepage slideshow (Jamkhandi PU building) |
| campus-jamkhandi | About, Jamkhandi card | Jamkhandi campus gallery ("jkd PU building") |
| campus-hulyal | Hulyal card | Hulyal campus gallery |
| campus-bagalkot | Bagalkot card | Bagalkot campus gallery |
| campus-vijayapura | Vijayapura card | Vijayapura campus gallery |
| directors | Directors' Talk | About page, Leadership section |
| life-science | Competitive prep card, gallery | Vijayapura campus gallery |
| life-library | UG card, gallery | Hulyal campus gallery |
| life-sports | Gallery (kabaddi) | Gallery page, Sports |
| life-culture | Gallery (dance) | Gallery page, Events |
| life-dining | Gallery (infrastructure) | Hulyal campus gallery |
| life-corridor | Gallery (engagement) | Homepage / Hulyal gallery |
| life-sports-run | Not used on the page (low resolution) | Vijayapura campus gallery |

The photos were captured from the browser at about 1180–1480 px wide. For the sharpest hero, replace them with the original files: the Wix originals are 6240 × 4160.

## Content sources

- **Results:** 2025 posters on the Results page. They show 4 IIT selections (named), 367 engineering selections, and 43 MBBS, 34 BAMS and 9 BDS medical selections, all for Tungal Science P.U. Colleges, Jamkhandi/Hulyal.
- **Wall of Fame alumna:** homepage poster for Chinna Vishwanath Boosreddi (2015 P.U.C batch, 14th rank in the IFS examination).
- **Principles:** About page, "History Lane" highlights, quoted as written.
- **Phones, addresses and office hours:** Contact page.
- **Campus programmes and director bios:** the client brief.

## Please confirm before launch

1. **The directors' photo.** It is the only image in the About page's Leadership section, and I've captioned it as Mrs. Laxmi Tungal and Mr. Ashok Tungal.
2. **The founding year vs "25 years".** The About page says the institution was established in 2003, which makes 2026 its 23rd year. The page uses "25 years" as briefed and doesn't print a founding year.
3. **Jamkhandi school range.** The Contact page lists "TUNGAL Primary and High SCHOOL (Montessori – std 10, state board)" at Jamkhandi. The brief says Montessori to Standard V, and the page follows the brief.
4. **Hulyal phone.** No Hulyal phone number is listed on the Contact page.
5. **Consent for student names.** The page shows students' names on results cards, taken from the school's own posters. Confirm the school is happy to show them here.

## QA (19 November 2026)

All results come from `qa_b.py` (Playwright and Chromium) against a local server. Raw output is in `qa/results.json`.

**All nine widths (1440, 1366, 1280, 1024, 768, 430, 390, 375, 360 px).** No horizontal overflow, no console errors, no failed requests, all 27 images loaded, every anchor target exists, and there is one `h1`. At 768 px and below, no touch target is under 44 px.

**Interactions.** All of these passed:
- **Hero:** dot click, arrow keys, pause, 7-second autoplay, swipe, and captions that follow the active slide.
- **Campus filter:** Hostel dims Jamkhandi only; B.Sc · BCA leaves only Jamkhandi; All resets; and the status message is announced to screen readers.
- **Programme chips:** they scroll to and focus the matching campus card.
- **Pathway ladder:** the previous/next buttons scroll the ladder and disable at either end.
- **Lightbox:** opens on the right photo, arrow keys move between photos, focus is trapped, and Esc closes it and returns focus.
- **Counters:** they finish on the verified values.
- **Form:** the same checks as Option A.
- **Navigation:** mobile menu focus trap and Esc, header hide/show, back-to-top, and the sticky mobile CTA.

**Accessibility.** axe-core (WCAG 2.1 A/AA and best practice) found 0 violations at 1440 px and at 390 px.

**Reduced motion.** Autoplay is off and all content is visible without scrolling.

**Performance, simulated mobile** (1.6 Mbps, 150 ms RTT, 4× CPU, 390 px, no compression): LCP 1.61 s, CLS 0, 17 requests, 600 KB on initial load.

**Not tested:** Safari, Firefox, real devices, Lighthouse, a live form backend.
