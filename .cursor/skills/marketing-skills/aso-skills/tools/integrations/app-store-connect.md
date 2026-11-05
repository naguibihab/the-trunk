# App Store Connect — First-Party Data

Use **App Store Connect** (ASC) for exact downloads, revenue, subscriptions, trials, and listing metadata. Skills do not depend on a third-party sync service.

**Portal:** [appstoreconnect.apple.com](https://appstoreconnect.apple.com)

## Listing metadata (title, subtitle, keywords)

Not all fields appear on the public App Store page.

| Field | Where in ASC | Public page? |
|-------|----------------|--------------|
| App name | App Information → localizations | Yes |
| Subtitle | App Information → localizations | Yes (in page JSON) |
| Keywords | Version → localization (100 chars) | No — ASC only |
| Description, What's New, promotional text | Version → localization | Description yes; keywords no |

**Agent workflow:** Ask the user to paste subtitle/keywords from ASC, or fetch subtitle from the live App Store URL (`liveListing.md` App ID). Parse embedded JSON on the product page for subtitle; keyword field always needs ASC.

## Performance metrics (Sales and Trends)

For `aso-asc-metrics`:

1. **ASC web UI** — Apps → Analytics / Sales and Trends (downloads, proceeds, territories).
2. **App Store Connect API** — Official REST API with issuer ID, key ID, and `.p8` private key ([Apple docs](https://developer.apple.com/documentation/appstoreconnectapi)).
3. **User export** — CSV export from Sales and Trends; user uploads or pastes summary.

If the user has ASC API credentials in env or MCP, use those. Otherwise guide them to paste numbers or export for the period they care about.

## Public listing data (no ASC login)

| Source | Use for |
|--------|---------|
| iTunes Lookup API | `https://itunes.apple.com/lookup?id={APP_ID}&country=us` — title, description, rating, version |
| App Store product page | Subtitle (serialized JSON), screenshots, reviews visible on page |
| `liveListing.md` in limb | App ID, URLs, baseline metadata |

## Related skills

- `aso-asc-metrics` — downloads, revenue, subscriptions from ASC
- `aso-audit`, `aso-app-marketing-context` — listing metadata
- `aso-review-management` — reviews (ASC API or public page)
