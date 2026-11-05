---
name: find-competition
description: >-
  Discovers similar competitors for a pre-limb sprout by reading ../the-sprouts/<slug>/brief.md,
  searching App Store / web for comparable apps and products, and persisting a structured
  competitor list to ../the-sprouts/<slug>/marketing/competitors.md. Use when the user asks to find
  competitors, discover rivals, map the competitive landscape, or run competition research
  on a sprout. For deep per-competitor ASO/pricing/review analysis, use sprout-competition-analysis next.
disable-model-invocation: true
---

# Find competition (sprout)

Discover **who else solves this problem** for a pre-limb sprout. This skill is the **discovery** pass — it produces a competitor shortlist in Markdown. It does **not** replace **`sprout-competition-analysis`**, which does a deep dive on named rivals and writes **`competition-analysis/competition.html`**.

## Inputs

- Sprout **slug** or **`../the-sprouts/<slug>/`**
- Optional: max competitors (default **8–12**), platform focus (iOS / Android / web / all)

## Workflow

1. **Validate sprout**
   - Confirm **`../the-sprouts/<slug>/`** exists.
   - Read **`../the-sprouts/<slug>/brief.md`**. If missing, stop and ask the user for the brief or to run **`new-sprout`** first.

2. **Extract search signals from the brief**
   - App name / working title
   - Problem statement and target user
   - Core features and differentiators
   - Any competitors already named in the brief (treat as seeds, not the full list)
   - Category keywords (e.g. "pet medicine tracker", "family weekend planner", "church finder")

3. **Search for competitors**
   - Use **web search** and App Store / Play Store discovery for the derived keywords.
   - Look for:
     - Direct substitutes (same job-to-be-done)
     - Adjacent apps (partial overlap)
     - Web-only or SaaS tools if the brief isn't mobile-only
   - Prefer **official store listings** and **official websites** over blog roundups.
   - Confirm each candidate is the **right app** (avoid similarly named unrelated products).

4. **Score and trim the list**
   - Keep **8–12** strongest matches unless the user asked for fewer/more.
   - Rank by relevance: direct > adjacent > tangential.
   - Drop dead listings, unrelated namesakes, and generic category pages with no single product.

5. **Write `marketing/competitors.md`**
   - Create **`../the-sprouts/<slug>/marketing/`** if it does not exist.
   - Write or replace **`../the-sprouts/<slug>/marketing/competitors.md`** (overwrite on re-run; preserve any user-added notes only if the user asked to merge).
   - Use the output template below.

6. **Summarize in chat**
   - List top 3–5 competitors with one-line overlap notes.
   - Name the file path written.
   - Suggest **`sprout-competition-analysis`** if the user wants ASO, pricing, and review themes for specific rivals.

## Output file template

Write **`../the-sprouts/<slug>/marketing/competitors.md`** using this structure:

```markdown
# Competitors — <App / sprout title>

_Data as-of: YYYY-MM-DD (AEST)_

## Positioning snapshot

<2–3 sentences: what this sprout is trying to do, distilled from brief.md>

## Search terms used

- <keyword or phrase>
- <keyword or phrase>

## Competitors

| # | Name | Platform | Overlap | Differentiation vs us | Links |
|---|------|----------|---------|----------------------|-------|
| 1 | <name> | iOS / Android / Web | Direct / Adjacent | <1 short sentence> | [App Store](url), [Website](url) |
| 2 | ... | ... | ... | ... | ... |

## Market read

<3–5 bullets: category maturity, pricing norms, gaps the brief could exploit, risks>

## Named in brief (cross-check)

- <competitor from brief> — <found / not found / superseded by #N>

## Next steps

- [ ] Pick 2–3 rivals for deep analysis → **`sprout-competition-analysis`**
- [ ] Refine brief differentiators after reviewing overlap column
```

### Per-row rules

- **Platform:** `iOS`, `Android`, `Web`, or combinations (e.g. `iOS + Web`).
- **Overlap:** `Direct` (same core job), `Adjacent` (partial), or `Tangential` (same audience, different job).
- **Links:** App Store and/or Play Store URLs when available; official website; omit rather than guess.
- **Differentiation vs us:** honest gap from the brief's angle — not marketing fluff.

## Quality bar

- Every competitor row must be **verifiable** (real product, real link).
- Do not invent App Store IDs, download counts, or pricing.
- Separate **facts** (what they do) from **interpretation** (market read).
- If the category is crowded, say so; if sparse, say that too.
- Dates in the file use **AEST** and are labeled `AEST`.

## Boundaries

| This skill (`find-competition`) | Deep skill (`sprout-competition-analysis`) |
|--------------------------------|--------------------------------------------|
| Discover + shortlist rivals | Analyze named competitors in depth |
| Writes **`marketing/competitors.md`** | Writes **`competition-analysis/competition.html`** |
| Table + market read | ASO, pricing, review themes, dashboard HTML |
| Run first on new sprouts | Run after you pick targets from the shortlist |

Do **not** update **`apps.json`**, **`manifest.yaml`**, or **`competition.html`** unless the user explicitly asks.
