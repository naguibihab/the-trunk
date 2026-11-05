---
name: conversion-rate-revenuecat
description: >-
  Pulls subscription conversion rates from RevenueCat for a named limb over
  the last 6 months—trial conversion rate and new-customer-to-paying rate—and
  persists a snapshot to the-conversation/revenue/conversionRate.md on every
  run (create or overwrite). Use when
  the user asks about conversion rate, trial conversion, paywall conversion,
  funnel conversion, or RC monetization funnel—not for MRR/revenue headline
  (see revenue-health-revenuecat), acquisition volume (see
  track-retention-and-acquisition-revenuecat), or Sentry stability.
metadata:
  version: 1.0.0
---

# Conversion rate (RevenueCat)

Report **how conversion has trended over the last 6 months** for one limb,
using RevenueCat MCP. **Every run must create or overwrite**
`<limbPath>/the-conversation/revenue/conversionRate.md` for that limb.

For **MRR, revenue, churn headline**, use **`revenue-health-revenuecat`**
(`.cursor/skills/revenue-skills/revenue-health-revenuecat/SKILL.md`).

For **new-customer volume and acquisition trends**, use
**`track-retention-and-acquisition-revenuecat`**
(`.cursor/skills/marketing-skills/track-retention-and-acquisition-revenuecat/SKILL.md`).

## Scope

- One named limb per run. Resolve from trunk **`apps.json`** by `appName` or
  `limbPath`.
- Only apps with RevenueCat connected (RevenueCat link in `apps.json`
  `links[]`, or a configured per-app RevenueCat MCP server).
- Default window: **last 6 calendar months**, ending today (**AEST**).
- Default conversion timeframe for **Conversion to Paying**: **7 days** (RC
  default). Also pull **30 days** for comparison.

## 1. Resolve limb and RevenueCat access

1. Read **`apps.json`**; match the user's limb → `limbPath`, `appName`.
2. **MCP server** — per-app RevenueCat MCP. Naming pattern:
   `user-revenuecat-<slug>` (e.g. My Guinea Pig Bowl →
   `user-revenuecat-myguineapigbowl`).
3. **Project ID** — call `list-projects` and match `name` to `appName`. Use
   returned `id` (`proj…`). Fallback: slug from RevenueCat link in `apps.json`
   with `proj` prefix.
4. If no MCP or no project: stop. Report "RevenueCat not connected" — do not
   invent numbers.

## 2. Date range

| Parameter | Value |
| --- | --- |
| `start_date` | first day of the month 5 months before the current month (6 months inclusive) |
| `end_date` | today |
| `resolution` | `2` (month) |

Example: pass date 2026-05-30 → `2025-12-01` … `2026-05-30`.

## 3. Pull conversion metrics

Read each MCP tool schema before calling. Use **`get-chart-data`**.

### Required charts

| Chart | What it measures | Notes |
| --- | --- | --- |
| `trial_conversion_rate` | Trials started in period → % converted to paid | Cohorted by **trial start date** |
| `conversion_to_paying` | New customers first seen → % who pay | Cohorted by **first seen date**; pass `selectors` JSON |

### Conversion to Paying selectors

Call twice with different `selectors`:

```json
{"conversion_timeframe": "7_days"}
```

```json
{"conversion_timeframe": "30_days"}
```

Other RC timeframes if useful: `3_days`, `14_days`, `unbounded` (via
`get-chart-options-schema` on `conversion_to_paying`).

**Do not use `aggregate`** unless the chart supports it — check schema first.

### Measures to extract

**Trial conversion rate** (per month):
- Trial Starts
- Conversions
- Expirations
- Pending (if any)
- **Conversion Rate** (%)

**Conversion to paying** (per month, per timeframe):
- New Customers
- Paying Customers (within timeframe)
- **Conversion Rate** (within timeframe, %)

### Analysis

From pulled data, report:

- **Trial → paid rate** — monthly trend and 6-month average; rising, flat, or falling.
- **New customer → paying rate** — at 7-day and 30-day windows; compare months.
- **Funnel read** — e.g. "trial conversion strong (~64%) but only ~8% of new users pay within 7 days — paywall/trial reach is the bottleneck."
- **Incomplete periods** — flag current month when RevenueCat marks `incomplete: true`.

Label each rate with its **cohort definition** (trial start vs first seen) so
numbers are not mixed.

## 4. Persist to `conversionRate.md` (required every run)

**Always** write or overwrite this file for the resolved limb — create the
`revenue/` folder if missing:

`<limbPath>/the-conversation/revenue/conversionRate.md`

This is mandatory whether the user says "run", asks a conversion question, or
only wants a chat summary. The file is the canonical snapshot; chat output
summarizes what you wrote.

If listed in **`apps.json`** → `conversation.revenue[]`, use that path (should
match the path above). If the limb has no **Conversion Rate** entry yet, add
one after writing the file:

```json
{
  "label": "Conversion Rate",
  "path": "<limbPath>/the-conversation/revenue/conversionRate.md"
}
```

Touch only that app's `conversation.revenue[]` entry; preserve JSON structure.

### File template

```markdown
# Conversion rate — [App Name]

_Pass date: YYYY-MM-DD (AEST) · Source: RevenueCat · Window: last 6 months_

## Summary

[2–4 sentences: trial conversion trend, new-customer-to-paying trend, overall funnel health]

## Trial conversion rate (monthly)

Trials started in period → converted to paid.

| Month | Trial starts | Conversions | Expirations | Conversion rate |
| --- | --- | --- | --- | --- |
| … | … | … | … | … |

6-month avg conversion rate: [X]%

## New customer → paying (7-day window)

First seen in period → paid within 7 days.

| Month | New customers | Paying (7d) | Conversion rate (7d) |
| --- | --- | --- | --- |
| … | … | … | … |

6-month avg (7d): [X]%

## New customer → paying (30-day window)

| Month | New customers | Paying (30d) | Conversion rate (30d) |
| --- | --- | --- | --- |
| … | … | … | … |

6-month avg (30d): [X]%

## Notes

- Data as-of: YYYY-MM-DD (AEST)
- Trial conversion is cohorted by trial start; conversion to paying is cohorted by first seen — do not compare raw percentages as one funnel step.
- [Incomplete periods, pending trials, assumptions]
```

Rules:

1. **Do not invent numbers** — only metrics from RevenueCat MCP.
2. Convert Unix `cohort` timestamps to month labels (AEST).
3. Mark incomplete months.
4. **Always overwrite** the full file on each run (do not append).
5. If RevenueCat is not connected, still write the file with an honest stub
   (e.g. `RevenueCat: not configured for this app.`) — no fabricated metrics.

## 5. Chat output

```
Conversion rate — [App] (6-month lookback, AEST)

Trial → paid
- 6-month avg: …%
- Trend: …

New customer → paying
- 7-day avg: …%
- 30-day avg: …%
- Trend: …

Read
- …

File updated: <limbPath>/the-conversation/revenue/conversionRate.md
```

## MCP tool reference

| Tool | When |
| --- | --- |
| `list-projects` | Resolve `project_id` |
| `get-chart-options-schema` | Confirm `conversion_timeframe` selectors |
| `get-chart-data` | `trial_conversion_rate`, `conversion_to_paying` |

## Boundaries

- **In scope:** RC conversion rates, 6-month window, one limb.
- **Out of scope:** MRR/revenue totals (`revenue-health-revenuecat`), acquisition volume (`track-retention-and-acquisition-revenuecat`), paywall UI changes (product work).
