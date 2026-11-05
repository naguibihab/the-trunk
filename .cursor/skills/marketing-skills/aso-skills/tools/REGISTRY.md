# Tool Registry

Tools and data sources ASO skills can use. Skills work with **public App Store data**, **App Store Connect**, and **user-provided metadata** — no third-party ASO API required.

## Data sources

| Source | Best for | Access |
|--------|----------|--------|
| **App Store Connect** | Exact downloads, revenue, subtitle, keywords, What's New | Web UI, ASC API, user paste/export |
| **iTunes Lookup API** | Title, description, rating, version, bundle ID | `https://itunes.apple.com/lookup?id={APP_ID}&country=us` |
| **App Store product page** | Subtitle (page JSON), screenshots, visible reviews | Fetch URL from `liveListing.md` |
| **User / limb files** | `liveListing.md`, `app-marketing-context.md`, ASC copy-paste | Repo + conversation |

Integration guide: [app-store-connect.md](integrations/app-store-connect.md)

## Skill → data mapping

| Skill | Primary data |
|-------|----------------|
| `aso-workflow` | Chains core 6; uses sources below |
| `aso-app-marketing-context` | Lookup API, product page, ASC paste, brief |
| `aso-audit` | Product page, lookup API, ASC metadata, heuristic scoring |
| `aso-keyword-research` | Search suggestions, competitor titles, user seeds; note volume/difficulty when unknown |
| `aso-metadata-optimization` | Current ASC fields + keyword research output |
| `aso-screenshot-optimization` | Product page screenshots, competitor pages |
| `aso-app-icon-optimization` | Product page icon, repo assets |
| `aso-asc-metrics` | ASC Sales and Trends / API / user export |
| `aso-review-management` | ASC reviews or public review snippets |
| `aso-rating-prompt-strategy` | App rating from lookup API + in-app prompt patterns |

## When data is missing

1. Read `limb/the-conversation/liveListing.md` for App ID and URL.
2. Pull public fields from iTunes lookup + App Store page JSON.
3. Ask the user for ASC-only fields (keyword field, unreleased metadata).
4. Score heuristically and flag gaps in `asoHealth.md` / `asoIssues.md`.
