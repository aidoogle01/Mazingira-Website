# Design

The Mazingira Safari design system is published at https://claude.ai/artifact/6mPgEUH76CiMBM55zJxxSo (private: share it from the page's Share menu).

`system/` is a copy of its source files, kept here so the site build doesn't depend on the published page:

- `system/README.md`: the brand book (voice, colour, type, layout, photography, components). **Read this first.**
- `system/tokens.json`: colours (light and dark), type styles, spacing, radii, shadow
- `system/components/bundle.css`: the `mz-` component styles; `system/components/bundle.js`: the `Mazingira.routeMap` and `Mazingira.monthStrip` helpers; `system/components/<Name>/` holds each component's README and HTML preview (14 components)
- `system/assets/files/`: the logo, Mazingira's own photos and the team photos (originals in the published system's asset store)

Version 2 (26 Oct 2026) applies the research report's design findings: no all-caps labels or dot-joined strings, 4px corners at most, one shadow, a dry-grass `dust` band and olive `forest` taken from Mazingira's own photos, Alegreya Sans for body text, people-first photography, and the route map as the signature.

Previews reference images as `/_blob/<id>` (the published system's asset store); the same files are in `system/assets/files/`.
If the published system is edited, copy the changed files back here.
