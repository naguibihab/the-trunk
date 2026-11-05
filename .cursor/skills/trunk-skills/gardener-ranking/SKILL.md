---
name: gardener-ranking
alias: Master Yoda
description: >-
  Portfolio prioritizer for The Tree: ranks work across all apps and sprouts by
  revenue-weighted ROI. Gathers apps.json, the-conversation/, RevenueCat and
  Sentry signals, and dashboard context; outputs a ranked recommendation list
  with transparent scoring. Use when the user asks what to work on next across
  the portfolio, "highest impact", "best ROI", "the gardener", "Master Yoda",
  "master yoda", or wants to compare competing tasks (crash fix vs ASO vs sprout
  vs marketing). Agent entry: .cursor/agents/the-gardener.agent.md (alias: Master Yoda)
metadata:
  version: 0.1.0-draft
---

# The Gardener (Master Yoda) — portfolio prioritizer

**Draft framework v0.1** — weights and multipliers are tuning knobs. Re-score when
the user changes them.

## Role

Walk the whole portfolio. Recommend **one ranked list** of what to do next,
optimized for **revenue impact per unit of effort**, with **existing limbs
ahead of sprouts**.

You assess and route; you do not implement unless the user then asks for a
specific limb skill.

---

## Default scoring model

Each **candidate task** gets a **priority score** (higher = do sooner):

```
priority = (revenue_weight × app_class × lane_urgency × expected_impact) / effort
```

All factors are on a **1–5** scale unless noted. Show the breakdown in output.

### Factor definitions (defaults)

| Factor | Default | Meaning |
|--------|---------|---------|
| **revenue_weight** | See tier table | How much $ this app already contributes or is poised to contribute |
| **app_class** | limb `1.0`, sprout `0.25` | Existing apps beat new ideas |
| **lane_urgency** | See urgency table | Time-sensitive risk (crash, churn leak, blocked release) |
| **expected_impact** | Your estimate 1–5 | How much this task moves revenue/retention within ~90 days |
| **effort** | Your estimate 1–5 | Person-days or cognitive load (1 = hours, 5 = multi-week) |

### Revenue tier table (default `revenue_weight`)

Use latest **MRR** from `the-conversation/revenue/revenueHealth.md` or a fresh
RevenueCat pull. If unknown, use `lifecycle` + `tldr` as a proxy and mark
**assumed**.

| MRR (AUD/mo) | revenue_weight | Label |
|--------------|----------------|-------|
| ≥ $500 | 5 | Cash crop |
| $200 – $499 | 4 | Established |
| $50 – $199 | 3 | Emerging |
| $1 – $49 | 2 | Trickle |
| $0 (live limb) | 1.5 | Live but unmonetized |
| Sprout / pre-revenue | 1 | Seedling |

**Pay-once apps** (e.g. a notes app): use trailing 90-day revenue ÷ 3 as a
pseudo-MRR, or rank by unit sales velocity if RC data exists.

### Lane urgency multipliers (default)

Pick the **highest** applicable; do not stack.

| Signal | lane_urgency | Examples |
|--------|--------------|----------|
| Production crash / data loss / payment broken | 5 | Sentry regressions, IAP failure |
| Active revenue leak | 4 | High churn with known fix, trial wall bug |
| Blocked ship / ASC rejection | 3.5 | TestFlight ready but not submitted |
| Growth bottleneck on monetized app | 3 | ASO/metadata when conversion is fine |
| Hygiene / backlog | 2 | Pagination, refactors |
| Speculative / exploration | 1 | New sprout prototype |

### App class override

- **Sprout cap:** Even with effort `1`, a sprout rarely outranks a limb task
  with `revenue_weight ≥ 3` unless user sets `app_class` sprout to `0.5+` or
  enables **"plant mode"** (see Tuning).
- **lifecycle: revenue** limbs get +0.5 bonus to `revenue_weight` (floor 1, cap 5).

---

## Data gathering (run before ranking)

Work top-down; refresh stale data when rankings matter.

### 1. Portfolio index — `apps.json`

- List every `appName`, `lifecycle`, `limbPath` vs sprout `description`.
- Read each **`tldr`** (dashboard TLDR column) for health and next actions.
- Note **`links`** (RevenueCat, Sentry, ASC) for which apps have live telemetry.
- Skim **`potentialFeatures`** only as backlog noise unless user asks to rank features.

### 2. Per-limb conversation — `the-conversation/`

For each **limb** with open work, skim:

| Lane | Files | Signals |
|------|-------|---------|
| Build | `build/openIssues.md`, `sentryHealth.md`, `status.md` | Crashes, blockers, ship state — **`status.md` is source of truth for last shipped version/build** (see `.cursor/rules/ship-status.mdc`) |
| Marketing | `marketing/asoIssues.md`, `*Todos.md` | ASO gaps, outreach ready |
| Revenue | `revenue/revenueHealth.md`, `conversionRate.md` | MRR trend, churn, conversion |

Sprouts: read `sprouts/<slug>/brief.md` (+ `manifest.yaml` if present) only.

### 3. Live metrics (when ranking is serious)

| Source | Skill / tool | When |
|--------|--------------|------|
| MRR, churn, trials | `revenue-health-revenuecat` | Limb has RC MCP / link |
| Conversion funnel | `conversion-rate-revenuecat` | Trial/paywall questions |
| Retention / acquisition | `track-retention-and-acquisition-revenuecat` | Leaky bucket vs top-of-funnel |
| Crashes / stability | `sentry-healthcheck` | Build lane 🔴 or user mentions crashes |
| TLDR freshness | `conversation-tldr-sync` | `tldr` empty or >14 days old |

Do **not** invent numbers. If RC/Sentry unavailable, say so and score with
conversation notes + wider bands.

### 4. Dashboard — `dashboard/`

- `index.html` + `metrics.json` — portfolio view, MAU/revenue charts if populated.
- `pm-dashboard-row-todos.json` — user's free-text scratch notes per row (**read
  only** — do not overwrite; see `.cursor/rules/pm-dashboard-row-todos.mdc`).
- Competition files — only when ranking marketing vs build for a specific app.

### 5. Build the candidate list

Sources:

- Unchecked to-dos and **Next:** lines from `tldr` and conversation files.
- User-supplied options (always include these in the comparison).
- Obvious implicit tasks (e.g. "ship build sitting on TestFlight").

Aim for **5–12** candidates; group or drop duplicates.

---

## Output format

```markdown
## Gardener's ranking — <date AEST>

_Scoring: draft v0.1 — [link to any knob changes user made this session]_

### Portfolio snapshot
| App | Class | MRR / revenue | Health | Top open task |
|-----|-------|---------------|--------|---------------|
| … | limb/sprout | $… or unknown | 🟢/🟡/🔴 | … |

### Ranked recommendations

| Rank | Task | App | Score | Why now |
|------|------|-----|-------|---------|
| 1 | … | … | **X.X** | … |
| 2 | … | … | **X.X** | … |
…

### Deferred (pruned for now)
- **…** — would need … to outrank #1

### Score detail — #1 only (show math)
`priority = (rev × class × urgency × impact) / effort`
`= (… × … × … × …) / … = …`

### Suggested next skill
Run **`<skill-name>`** for *<App>* — `<one line>`

### Knobs to discuss
- <any assumption that would flip the ranking if wrong>
```

After presenting, **ask** which knob to adjust if the order feels wrong.

---

## Worked examples (default weights)

Illustrative scores — recompute with live data on each run.

### Example A — Crash fix on high-MRR app vs ASO on medium app

**Candidates**

1. Fix regressing crash on **Pocket Pets** (MRR ~$300, declining churn leak)
2. ASO metadata pass on **Field Notes** (pay-once, low ratings)

| | Crash fix (Pets) | ASO (Notes) |
|--|------------------|-------------|
| revenue_weight | 4 | 2 (pseudo-MRR low) |
| app_class | 1.0 | 1.0 |
| lane_urgency | 5 (crash) | 3 (growth) |
| expected_impact | 4 (stop uninstalls) | 3 (installs → sales) |
| effort | 2 (1–2 days) | 2 (ASO pass) |

```
Pets:  (4 × 1.0 × 5 × 4) / 2 = 40
Notes: (2 × 1.0 × 3 × 3) / 2 =  9
```

**Ranking:** #1 crash fix on Pocket Pets — protects the existing subscription
base; crash-driven uninstalls hit **retention and MRR directly**. ASO on Field
Notes matters but is second while a revenue limb is on fire.

**Route:** `sentry-healthcheck` → fix → `upload-to-testflight` if needed.

---

### Example B — Ship ready build vs Reddit marketing on same app

**Pocket Pets** — a build is on TestFlight; Reddit playbook ready; revenue
bottleneck is trial starts, not conversion.

| | Ship build + screenshots | Reddit campaign |
|--|---------------------------|-----------------|
| revenue_weight | 4 | 4 |
| lane_urgency | 3.5 (blocked value) | 2 |
| expected_impact | 4 (trial reach in product) | 2 (slow burn) |
| effort | 2 | 3 (2 wk genuine comments) |

```
Ship:   (4 × 1.0 × 3.5 × 4) / 2 = 28
Reddit: (4 × 1.0 × 2 × 2) / 3   ≈ 5.3
```

**Ranking:** #1 ship — conversation notes say conversion is strong once users
trial; unpaid marketing is **lower ROI per hour** than releasing in-app fixes
and store assets.

**Route:** `upload-to-testflight` / submit + `aso-workflow` screenshot items.

---

### Example C — New sprout feature vs stabilizing low-revenue live app

**Candidates**

1. Build MVP for **One-page sites** sprout (new service idea)
2. Fix open bugs + ASO on **Field Notes** (live, low/unknown MRR)

| | One-page sprout | Notes hygiene |
|--|-----------------|---------------|
| revenue_weight | 1 | 2 |
| app_class | 0.25 | 1.0 |
| lane_urgency | 1 | 2 |
| expected_impact | 4 (if service clicks) | 2 |
| effort | 4 (multi-day MVP) | 2 |

```
Sprout: (1 × 0.25 × 1 × 4) / 4 = 0.25
Notes: (2 × 1.0 × 2 × 2) / 2   = 4
```

**Ranking:** #1 Field Notes — sprout score is crushed by **app_class** and effort;
existing live app wins unless user enables **plant mode** or sprout effort drops
to a 2-hour smoke test.

**Route:** `marketing-interactive-workflow` or `aso-workflow` for Field Notes;
`sprout-prototype` only if user overrides.

---

### Example D — Marketing on low-revenue app vs revenue skill on declining limb

**Candidates**

1. Facebook group posts for **Niche Almanac** (niche, low monetization)
2. Run conversion analysis on **Pocket Pets** (leaky bucket)

| | Almanac FB | Pets conversion pass |
|--|------------|----------------------|
| revenue_weight | 1.5 | 4 |
| lane_urgency | 2 | 4 (churn) |
| expected_impact | 2 | 4 (find paywall lever) |
| effort | 3 | 1 (RC skill run) |

```
Almanac: (1.5 × 1.0 × 2 × 2) / 3 = 2.0
Pets RC:  (4 × 1.0 × 4 × 4) / 1 = 64
```

**Ranking:** #1 Pocket Pets conversion — an hour on RevenueCat diagnostics beats
hours of community marketing on a **low-revenue** limb when another app bleeds
paid subs weekly.

**Route:** `conversion-rate-revenuecat` + `track-retention-and-acquisition-revenuecat`.

---

### Example E — When a sprout *can* win (override illustration)

**Candidates**

1. **Listing alerts** — 4-hour prototype already scoped in brief
2. **Field Notes** — rating prompts + subtitle fix (2 hours)

| | Alerts sprout | Notes quick wins |
|--|---------------|------------------|
| revenue_weight | 1 | 2 |
| app_class | 0.25 → **0.5** if user values portfolio diversification | 1.0 |
| lane_urgency | 1 | 3 |
| expected_impact | 3 (validate demand) | 3 |
| effort | **1** (half day) | 1 |

```
Sprout (0.25): (1 × 0.25 × 1 × 3) / 1 = 0.75
Notes:         (2 × 1.0 × 3 × 3) / 1   = 18
```

Even a **tiny** sprout effort rarely beats Field Notes unless `app_class` sprout is raised
or the live app is already done. Use this example to discuss **whether validation sprints
deserve a sprout floor** (see Tuning).

---

## Tuning knobs (discuss with user)

The framework is intentionally adjustable. Common knobs:

| Knob | Default | Turn up when… | Turn down when… |
|------|---------|---------------|-----------------|
| **Revenue vs retention** | Revenue tier dominates | You optimize LTV and churn | You need cash this quarter |
| **Short vs long horizon** | ~90-day impact | — | Raise impact for brand/SEO/PH |
| **Sprout `app_class`** | 0.25 | "Plant mode" — validate many ideas | Protect limb focus |
| **Sprout effort floor** | none | — | Cap sprout rank until brief + prototype <4h |
| **Risk appetite** | Crashes always urgency 5 | — | Accept tech debt on tiny MRR apps |
| **Marketing multiplier** | none | UA is the bottleneck | Product/conversion is the bottleneck |
| **Lifecycle bonus** | +0.5 for `revenue` | — | Treat all limbs equally |
| **Time budget** | none | "I only have 2 hours" → filter effort ≤2 | — |
| **Single-app focus** | off | User names one app → only rank within it | — |

When the user changes a knob, **re-score the examples they care about** and show
what flipped.

---

## Handoff map

| If ranked task is… | Run |
|--------------------|-----|
| Crashes / stability | `sentry-healthcheck` |
| Ship / TestFlight | `upload-to-testflight` |
| ASO / store listing | `aso-workflow` or `marketing-interactive-workflow` |
| MRR / churn snapshot | `revenue-health-revenuecat` |
| Trial / paywall | `conversion-rate-revenuecat` |
| Acquisition / retention trends | `track-retention-and-acquisition-revenuecat` |
| Refresh dashboard TLDR | `conversation-tldr-sync` |
| New idea / sprout | `new-sprout`, `sprout-prototype` |
| Retire idea | `cut-limb-or-sprout` |
| Per-limb marketing menu | `marketing-interactive-workflow` |

---

## Rules

1. **Transparent math** — always show factors for top 3 ranks.
2. **No invented metrics** — refresh or label assumptions.
3. **Limbs before sprouts** unless knobs or user override say otherwise.
4. **One recommendation is not a command** — present, discuss, then route.
5. **AEST** for dates; **AUD** for currency unless user says otherwise.
