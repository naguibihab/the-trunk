---
name: calculate-market-size
description: >-
  Estimates TAM, SAM, and SOM for a named limb or sprout using bottom-up pet-owner
  demographics, top-down category sanity checks, and the app's own metrics when
  available. Writes marketSize.md into the-conversation/marketing/. Use when the
  user asks to calculate market size, TAM/SAM/SOM, addressable market, or revenue
  ceiling for an app, limb, or sprout. For ASO keyword volume, see
  aso-keyword-research. For revenue trends, see revenue-health-revenuecat.
metadata:
  version: 1.0.0
---

# Calculate market size

Estimate **TAM → SAM → SOM** for one **limb** or **sprout**, then persist a
Markdown report to that product's marketing conversation folder.

## 1. Resolve the product

| Input | Resolution |
|-------|------------|
| Limb name / `limbPath` | Read trunk **`apps.json`**; match `appName` or `limbPath` |
| Sprout name | Match `apps.json` `description` → `sprouts/<slug>/brief.md`, or user path |

Capture:
- Display name
- Output root: `<product>/the-conversation/marketing/`
- `lifecycle` (revenue / live / active / new) from `apps.json` when present
- App Store ID, pricing, category from `liveListing.md`, `asoHealth.md`, or brief

Create `marketing/` (and `the-conversation/` if missing) for sprouts.

## 2. Gather context (read before estimating)

Read what exists; skip empty files:

| File | Use |
|------|-----|
| `the-conversation/brief.md` | What the app does, audience, geography, monetization |
| `the-conversation/marketing/asoHealth.md` | Positioning, pricing, category, ratings |
| `the-conversation/marketing/asoIssues.md` | Niche keywords, competitor names |
| `the-conversation/revenue/revenueHealth.md` | MRR, subs, churn (limbs with RevenueCat) |
| `the-conversation/marketing/userAcquisition.md` | New customers, trial volume |
| `dashboard/competition-*.md` | Competitor landscape when relevant |
| `apps.json` `metrics` / `links` | RevenueCat, ASC links |

**Do not invent subscriber counts or revenue** — only use numbers from these files
or fresh tool pulls (RevenueCat MCP, Appeeky `get_app`, web research with cited
sources).

## 3. Estimation method

Use **bottom-up first**, then a **top-down sanity check**. Label every figure
**estimated** unless sourced. Show the math.

### Step A — Define the buyer

From the brief, name the **paying user** (e.g. "guinea pig owner with smartphone,
English-speaking, iOS-primary"). One sentence.

### Step B — TAM (Total Addressable Market)

**Households or owners** who plausibly need the product globally (or in stated
primary markets).

Sources to try (cite URL + year):
- National pet surveys (APPA US, UK Pet Food Manufacturers, RSPCA/Australia)
- Breed/species-specific reports
- VetCompass / academic papers for population counts

Formula template:
```
TAM households = Σ (country households × % owning target species)
TAM revenue/year = TAM households × assumed ARPU × assumed paid penetration (≤100%)
```

State assumptions for ARPU (from live pricing in `asoHealth.md` or brief) and
**theoretical** 100% penetration for TAM revenue (illustrative ceiling only).

### Step C — SAM (Serviceable Addressable Market)

Subset you can **realistically reach** with current product:

| Filter | Typical range (justify per app) |
|--------|----------------------------------|
| Primary markets (language, store presence) | e.g. US + UK + AU + CA |
| Smartphone owners | ~85–95% in developed markets |
| Platform (iOS-only vs cross-platform) | iOS ~40–55% of pet-app spend |
| Willing to use a dedicated app | ~25–40% of engaged owners |
| Matches monetization (subscription vs pay-once) | note price sensitivity |

```
SAM households = TAM households × market filter × platform filter × app-adoption filter
```

### Step D — SOM (Serviceable Obtainable Market)

What **this app can capture in 1–3 years** as an indie / small team.

Anchors:
- **Current share:** active subs or paying users ÷ SAM households (if revenue data exists)
- **Competitor proxy:** App Store review count, category rank, named competitors from ASO pass
- **Indie niche rule of thumb:** 0.5–5% of SAM for paid subs without heavy UA spend; up to 10% with strong ASO + community + brand (state which band and why)

Scenarios: **Conservative / Base / Optimistic** with subscriber counts and ARR.

```
SOM ARR = SOM subscribers × effective ARPU (from RevenueCat or list price)
```

### Step E — Top-down sanity check

One paragraph comparing bottom-up SOM ARR to a **category slice** of published
pet-app or productivity-app market reports. Analyst figures vary wildly — use only
to sanity-check order of magnitude (thousands vs millions vs billions). Cite
source; do not treat as ground truth.

### Step F — Implications

3–5 bullets: what the size means for prioritization (worth scaling marketing?,
price test?, geographic expansion?, PH/outreach ROI).

## 4. Output file (REQUIRED)

Write **only** to:

**`<product>/the-conversation/marketing/marketSize.md`**

Overwrite on each run. Use this structure:

```markdown
# Market size — <App name>

_Pass date: YYYY-MM-DD (AEST) · Method: calculate-market-size · Sources listed below._

## Summary

<2–3 sentences: TAM households, SAM households, SOM ARR range, current penetration if known>

## Buyer definition

<one sentence>

## TAM

| Metric | Estimate | Notes |
|--------|----------|-------|
| Households (global or stated markets) | … | … |
| Illustrative revenue ceiling | … | 100% penetration at list ARPU — not a forecast |

### Sources
- …

## SAM

| Filter | Value | Rationale |
|--------|-------|-----------|
| … | … | … |

| Metric | Estimate |
|--------|----------|
| SAM households | … |
| SAM iOS households (if iOS-only) | … |

## SOM (1–3 year)

| Scenario | Paying subs | ARR | Assumptions |
|----------|-------------|-----|-------------|
| Conservative | … | … | … |
| Base | … | … | … |
| Optimistic | … | … | … |

### Current position
<subs, MRR, share of SAM — from revenue files or "pre-revenue">

## Top-down sanity check

<one short paragraph with cited report range>

## Implications

1. …
2. …

## Data gaps

- …

## Sources

- [Title](url) — what you used it for
```

## 5. Rules

1. **AEST** for pass date (`YYYY-MM-DD (AEST)`).
2. **Show math** — no naked numbers.
3. **Separate facts from assumptions** — table or bold labels.
4. **Pre-revenue apps:** SOM is scenario-only; use brief + competitor proxies.
5. **Do not edit** `apps.json` unless the user asks for a TLDR sync.
6. If ownership data is thin, say so in **Data gaps** and widen scenario ranges.

## 6. Chat report

After writing the file, tell the user:
- Path written
- TAM / SAM / SOM headline numbers
- Biggest assumption to validate
- Suggested follow-up (`aso-keyword-research`, outreach, pricing test)
