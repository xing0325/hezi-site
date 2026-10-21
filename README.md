# Hezi website

Public static deployment of the Hezi / nothabean website.

Published at https://xing0325.github.io/hezi-site/

Only public site assets are included. The original Sites deployment is retained.

## Final photo wall — 2026-10-21

Published the user's `hezi-photo-wall-2026-10-21.json` as `hezi/wall-default.json` without changing coordinates, dimensions, crop settings, or copy (3100 × 800; 7 photos and 2 text items). The homepage now loads this default when no release-specific applied layout exists. Existing browser drafts remain stored under their previous keys. Added FCC photo assets and preserved the 18-photo editing catalog; source attribution is in `hezi/photos/fcc-sources.json`. Fixed validation of `/hezi-site/hezi/photos/` image paths. The iPod concept remains local-only.

Validated all exported geometry and crop values against the supplied JSON, checked image references and JavaScript syntax, and confirmed the homepage renders nine custom wall items without console errors.

## Lando-style mobile adaptation — 2026-10-21

Uses the source site's 991px mobile/tablet breakpoint and vertical, staggered editorial photo flow. `hezi-mobile.css` adapts the approved horizontal layout for narrow screens without editing its JSON: reading order follows horizontal image/text centers; photos retain their chosen crops. Mobile quotes have readable sizing and natural height. The declaration uses a once-only entrance instead of desktop scroll pinning. Portraits, safe-area spacing, interview copy and footer proportions are adapted for small screens. The existing Lando hero interaction, portrait entrance and card fan animation remain. Hero touch controls have explicit Chinese lock/unlock hints.

The portrait video fits available viewport height, has 44px playback controls and a native horizontal episode list. Seek and episode gestures are excluded from Lenis interception. Seven photos have 480px/960px WebP sources selected by `srcset`; mobile wall images lazy-load. Desktop wall coordinates and crop data remain exactly equal to the exported final layout.
