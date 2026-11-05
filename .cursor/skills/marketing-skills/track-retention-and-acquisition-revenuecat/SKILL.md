---
name: track-retention-and-acquisition-revenuecat
description: >-
  Pulls 90-day user retention and acquisition metrics from RevenueCat for a
  named limb and writes marketing snapshots. Use when the user asks about
  retention, acquisition, churn, new customers, trials, or subscriber trends
  from RevenueCat, or says "track retention", "track acquisition", or names a
  limb for RC growth metrics. For MRR/revenue health, see
  revenue-health-revenuecat. For conversion rates, see
  conversion-rate-revenuecat.
metadata:
  version: 1.0.0
---

# Track retention & acquisition (RevenueCat)

Report **how retention and acquisition have trended over the last 90 days** for
one limb, using RevenueCat MCP. Persist results to that limb's marketing
conversation files when the user expects repo updates.

For **MRR, revenue, trials-as-monetization**, use
**`revenue-health-revenuecat`**
(`.cursor/skills/revenue-skills/revenue-health-revenuecat/SKILL.md`).

## Scope

- One named limb per run. Resolve from trunk **`apps.json`** by `appName` or
  `limbPath`.
- Only apps with a RevenueCat integration (RevenueCat link in `apps.json`
  `links[]`, or a configured per-app RevenueCat MCP server).
- Default window: **last 90 days**, ending today (**AEST**). Label dates with
  `AEST` in output.

## 1. Resolve limb and RevenueCat access

1. Read **`apps.json`**; match the user's limb → `limbPath`, `appName`.
2. **MCP server** — use the per-app RevenueCat MCP when configured. Naming
   pattern: `user-revenuecat-<slug>` where slug is the app name lowercased with
   spaces/hyphens removed (e.g. My Guinea Pig Bowl →
   `user-revenuecat-myguineapigbowl`, My Dog Bowl → `user-revenuecat-mydogbowl`).
3. **Project ID** — call `list-projects` on that MCP and match `name` to
   `appName`. Use the returned `id` (format `proj…`). Fallback: parse the slug
   from the RevenueCat link in `apps.json` (`…/projects/<slug>/…`) and prefix
   `proj`.
4. If no MCP or no project: stop. Report "RevenueCat not connected" — do not
   invent numbers.

## 2. Date range and resolution

Compute inclusive ISO dates for the last 90 days (AEST calendar days):

| Parameter | Value |
| --- | --- |
| `start_date` | today − 89 days |
| `end_date` | today |
| `resolution` | `1` (week) — good default for 90-day trends |

Use `get-chart-options-schema` if you need to confirm resolution IDs.

## 3. Pull retention metrics

Call `get-chart-data` on the resolved MCP. **Do not use `aggregate` on cohort
charts** — RevenueCat returns `parameter_error` for unsupported charts.

### Required charts

| Chart | Purpose |
| --- | --- |
| `churn` | Weekly churn rate, actives at period start, churned actives |
| `actives` | Active paid subscriptions over time (end-of-period count) |

### Optional (when useful)

| Chart | Purpose | Notes |
| --- | --- | --- |
| `subscription_retention` | Cohort renewal table | Cohort format; no `aggregate`. Values may be relative (%) or absolute (#). Flag incomplete periods. |
| `trial_conversion_rate` | Trial → paid ratio | Funnel quality signal |

### Retention analysis

From the pulled data, report:

- **Churn rate** — period average and whether it is stable, rising, or falling.
- **Active base** — start vs end of window (from `actives` weekly points).
- **Churn volume** — average churned actives per week.
- **Trend read** — one short narrative (e.g. "base drifting down while churn
  rate holds ~1.8%").

## 4. Pull acquisition metrics

### Required charts

| Chart | Purpose |
| --- | --- |
| `customers_new` | Customers first seen in each period (top-of-funnel) |
| `trials_new` | Trials started per period |
| `actives_new` | New paid subscriptions (trial conversions, direct, resubscriptions) |

You may pass `aggregate: ["average", "total"]` on these charts for summary
stats; also pull full `values` for weekly trend.

### Acquisition analysis

From the pulled data, report:

- **New customers** — total and weekly average; note best/worst weeks.
- **New trials** — total and weekly average.
- **New paid subs** — total and mix (trial conversions vs direct vs
  resubscriptions from `actives_new` measures).
- **Funnel hint** — trials ÷ new customers (approximate trial-start rate).
- **Trend read** — one short narrative on whether acquisition is accelerating,
  flat, or slowing.

## 5. Persist to limb marketing files

When the user expects work to stick in the repo (default for "run" / "track"
requests), write two Markdown files under
`<limbPath>/the-conversation/marketing/`:

| File | Content |
| --- | --- |
| `userRetention.md` | 90-day retention snapshot |
| `userAcquisition.md` | 90-day acquisition snapshot |

Paths are also listed in **`apps.json`** → `conversation.marketing[]`.

### File template — `userRetention.md`

```markdown
# User retention — [App Name]

_Pass date: YYYY-MM-DD (AEST) · Source: RevenueCat · Window: last 90 days_

## Summary

[2–4 sentences: churn rate, active-base trend, overall retention health]

## Key metrics (90 days)

| Metric | Value |
| --- | --- |
| Avg weekly churn rate | [X]% |
| Avg actives (period start) | [N] |
| Avg churned actives / week | [N] |
| Active subs (start → end) | [N] → [N] |

## Weekly active subscriptions

| Week ending | Actives |
| --- | --- |
| … | … |

## Notes

- Data as-of: YYYY-MM-DD (AEST)
- [Any incomplete periods, assumptions, or cohort-chart caveats]
```

### File template — `userAcquisition.md`

```markdown
# User acquisition — [App Name]

_Pass date: YYYY-MM-DD (AEST) · Source: RevenueCat · Window: last 90 days_

## Summary

[2–4 sentences: new-customer trend, trial volume, paid-sub growth]

## Key metrics (90 days)

| Metric | Total | Avg / week |
| --- | --- | --- |
| New customers | [N] | [N] |
| New trials | [N] | [N] |
| New paid subscriptions | [N] | [N] |
| Trial conversions | [N] | [N] |
| Direct subscriptions | [N] | [N] |

## Weekly new customers

| Week ending | New customers |
| --- | --- |
| … | … |

## Notes

- Data as-of: YYYY-MM-DD (AEST)
- [Funnel observations, incomplete current week, etc.]
```

Rules:

1. **Do not invent numbers** — only metrics returned by RevenueCat MCP.
2. Convert Unix `cohort` timestamps in `values` to human week-ending dates
   (AEST).
3. Mark the latest period `incomplete: true` when present.
4. Escape nothing special in Markdown; keep tables simple.

## 6. Chat output

Return a concise summary with both sections:

```
Retention & acquisition — [App] (last 90 days, AEST)

Retention
- Churn rate: …
- Active subs: … → …
- Read: …

Acquisition
- New customers: … total (~…/week)
- New trials: …
- New paid subs: …
- Read: …

Files updated: userRetention.md, userAcquisition.md (if written)
```

## MCP tool reference

| Tool | When |
| --- | --- |
| `list-projects` | Resolve `project_id` |
| `get-chart-options-schema` | Confirm resolutions/filters before segmented pulls |
| `get-chart-data` | All chart pulls |

### Chart quick reference

- **Retention lane:** `churn`, `actives`, optionally `subscription_retention`
- **Acquisition lane:** `customers_new`, `trials_new`, `actives_new`

Read each tool's JSON schema under the MCP descriptors folder before calling.

## Boundaries

- **In scope:** RC retention + acquisition for one limb, 90-day window.
- **Out of scope:** ASC/App Store download estimates (see `aso-asc-metrics`),
  full ASO pass (see `aso-workflow`), revenue/MRR snapshot (see
  `revenue-health-revenuecat`).
