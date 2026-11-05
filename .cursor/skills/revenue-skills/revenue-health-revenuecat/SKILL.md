---
name: revenue-health-revenuecat
description: >-
  Reviews subscription and revenue health via RevenueCat for a named limb:
  MRR, revenue, active subs, trials, churn, and month-over-month trends over
  a 6-month lookback—and persists a snapshot to
  the-conversation/revenue/revenueHealth.md. Use when the user asks for RevenueCat, subscriptions, MRR, revenue, trials, churn,
  monetization health, or business metrics from RC—not for Sentry or crash
  triage (see sentry-healthcheck), conversion funnel rates (see
  conversion-rate-revenuecat), or acquisition/retention trends (see
  track-retention-and-acquisition-revenuecat).
metadata:
  version: 1.0.0
---

# Revenue health (RevenueCat)

Evaluate **subscription and revenue health** for one limb with RevenueCat MCP.
Persist results to **`revenueHealth.md`** when the user expects repo updates.

For **errors and stability**, use **`sentry-healthcheck`**
(`.cursor/skills/build-skills/sentry-healthcheck/SKILL.md`).

For **90-day retention and acquisition trends**, use
**`track-retention-and-acquisition-revenuecat`**
(`.cursor/skills/marketing-skills/track-retention-and-acquisition-revenuecat/SKILL.md`).

For **trial and paywall conversion rates**, use
**`conversion-rate-revenuecat`**
(`.cursor/skills/revenue-skills/conversion-rate-revenuecat/SKILL.md`).

## Scope

- One named limb per run. Resolve from trunk **`apps.json`** by `appName` or
  `limbPath`.
- Only apps with RevenueCat connected (RevenueCat link in `apps.json`
  `links[]`, or a configured per-app RevenueCat MCP server).
- Label dates and pass dates in **AEST**. Use **AUD** currency unless the user
  asks otherwise.

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

Default window: **last 6 calendar months**, ending today (**AEST**).

| Parameter | Value |
| --- | --- |
| `start_date` | first day of the month that is 5 months before the current month (6 months inclusive) |
| `end_date` | today |
| `resolution` | `2` (month) on trend charts |

Example: pass date 2026-05-30 → `2025-12-01` … `2026-05-30` (Dec–May).

Only change the window if the user asks for a different range.

## 3. Pull metrics

Read each MCP tool schema before calling.

### Headline snapshot (required)

Call **`get-overview-metrics`** with `currency: AUD`. Captures current
MRR, revenue (last 28 days), active subscriptions, active trials, new
customers (last 28 days), active users (last 28 days).

### Trend and MoM (required)

| Tool / chart | Purpose |
| --- | --- |
| `get-revenue-metric` | Total revenue per calendar month across the 6-month window (one call per month, plus optional full-window total) |
| `get-chart-data` → `mrr` | Monthly MRR trend (resolution `2` = month) |
| `get-chart-data` → `revenue` | Monthly revenue + transaction counts |
| `get-chart-data` → `mrr_movement` | New MRR vs churned MRR per month |
| `get-chart-data` → `churn` | Monthly churn rate (resolution `2`) |

Use the **6-month** `start_date` / `end_date` on all trend charts unless the
user specifies another window. Pass `currency: AUD` where supported.

### Analysis

From pulled data, report:

- **Headline health** — MRR, revenue (28d), active subs, active trials.
- **Monthly revenue** — each month in the 6-month window with % change vs prior month.
- **MRR trend** — direction over the full 6 months; net MRR movement (new − churned) for the window.
- **Churn** — monthly churn rate across the window and whether it is stable or rising.
- **One-line read** — e.g. "MRR drifting down over 6 months; churn outpacing new MRR."

Label incomplete current-month periods when RevenueCat flags them.

## 4. Persist to `revenueHealth.md`

When the user expects work to stick in the repo (default for "run" requests),
write:

`<limbPath>/the-conversation/revenue/revenueHealth.md`

Path is also listed in **`apps.json`** → `conversation.revenue[]`.

### File template

```markdown
# Revenue health — [App Name]

_Pass date: YYYY-MM-DD (AEST) · Source: RevenueCat · Currency: AUD · Window: last 6 months_

## Summary

[2–4 sentences: MRR/revenue trend over 6 months, subscriber base, overall revenue health]

## Headline (last 28 days / current)

| Metric | Value |
| --- | --- |
| MRR | $[N] |
| Revenue (28d) | $[N] |
| Active subscriptions | [N] |
| Active trials | [N] |
| New customers (28d) | [N] |
| Active users (28d) | [N] |

## Monthly revenue (6-month lookback)

| Month | Revenue | vs prior |
| --- | --- | --- |
| … | … | … |

## MRR trend (monthly, 6-month lookback)

| Month | MRR | Net MRR movement |
| --- | --- | --- |
| … | … | … |

## Churn (monthly avg, 6-month window)

| Metric | Value |
| --- | --- |
| Avg monthly churn rate | [X]% |
| Avg churned actives / month | [N] |

## Notes

- Data as-of: YYYY-MM-DD (AEST)
- [Incomplete periods, currency notes, assumptions]
```

Rules:

1. **Do not invent numbers** — only metrics from RevenueCat MCP.
2. Convert Unix `cohort` timestamps to month labels (AEST).
3. Mark incomplete periods.
4. If RevenueCat is not connected, write a single honest stub (no fabricated metrics).

## 5. Chat output

```
Revenue health — [App] (6-month lookback, AEST)

Headline
- MRR: …
- Revenue (28d): …
- Active subs: … · Active trials: …

MoM
- [Most recent month] revenue: … ([+/-X%] vs prior)
- 6-month revenue total: …

Read
- …

File updated: revenueHealth.md (if written)
```

## Boundaries

- **In scope:** RC revenue/MRR/subscription health for one limb.
- **Out of scope:** 90-day acquisition/retention deep-dive (see
  `track-retention-and-acquisition-revenuecat`), ASC downloads (see
  `aso-asc-metrics`), Sentry stability (see `sentry-healthcheck`).
