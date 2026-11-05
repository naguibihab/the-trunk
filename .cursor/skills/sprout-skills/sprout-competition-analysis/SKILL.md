---
name: sprout-competition-analysis
description: >-
  Trunk PM competitor snapshot for a sprout: official site and store listings, App Store “last updated” date,
  lightweight ASO read via the ASO skills bundle, pricing and review themes—then persist into
  `apps[].competition.path` (e.g. sprouts/<slug>/competition-analysis/competition.html) and refresh `apps[].competition.tldr`
  when conclusions change so dashboard summaries stay truthful. Not the same skill as **`aso-competitor-analysis`**
  (general ASO competitive strategy under `marketing-skills/aso-skills/aso-competitor-analysis`). Trigger: competitor check,
  rival apps, competitor intelligence tied to trunk **`apps.json`** / PM dashboard.
disable-model-invocation: true
---

# Sprout competition analysis (trunk PM)

Use this skill when the user gives one competitor (or a short list) and wants a fast, structured readout **and** optionally writes results into **`apps.json`** **`competition`** HTML under **`sprouts/<slug>/competition-analysis/`**.

If no competitor list exists yet, run **`find-competition`** first — it reads **`brief.md`** and writes **`marketing/competitors.md`**. Pick targets from that shortlist before running this deep-dive skill.

## Required outputs per competitor

1. Official website link
2. App link(s):
   - iOS App Store (required when available)
   - Google Play (optional but include when found)
3. iOS "last updated" date from the App Store listing
4. ASO assessment using sibling ASO skills (e.g. `aso-audit`, `aso-metadata-optimization`, `aso-keyword-research` when needed)
5. Pricing and business model snapshot
6. Review sentiment snapshot: what users like and what users hate

## Workflow

Follow these steps in order for each competitor:

1. **Identify the exact app**
   - Confirm exact brand/app name and avoid similarly named apps.
   - Prefer official sources first (official site, official store listing).

2. **Collect links**
   - Capture official website URL.
   - Capture iOS App Store URL.
   - Capture Google Play URL when available.

3. **Check freshness**
   - Record "last updated" date from the iOS App Store listing.
   - If unavailable, state that explicitly and use the best available substitute.

4. **Run ASO evaluation**
   - Read and apply these skills as needed (under `.cursor/skills/marketing-skills/aso-skills/`):
     - `aso-audit` for overall ASO health and listing quality.
     - `aso-metadata-optimization` for title/subtitle/keyword quality checks.
     - `aso-keyword-research` only if keyword opportunity/gap is part of the request.
   - Keep ASO output lightweight unless the user asks for a deep audit.

5. **Pricing and business model**
   - Capture visible pricing signals from App Store/Play listing and official site.
   - Note free vs paid, subscription vs one-time purchase, ad-supported vs ad-free, trial availability, and any visible plan tiers.
   - If pricing differs by platform or market, note that explicitly.
   - If pricing is not visible, mark as unknown instead of guessing.

6. **Review analysis**
   - Review recent ratings/reviews from App Store (and Play Store if useful).
   - Extract top positive themes (what users like).
   - Extract top negative themes (what users hate).
   - Prioritize repeated patterns over one-off comments.

## Persisting to per-app HTML (required when you edit files)

When analysis should stick in the repo—not only chat—write into **`apps[].competition.path`** (e.g. `sprouts/people-keeper/competition-analysis/competition.html`). Also update **`apps[].competition.tldr`** with a dashboard-ready one-line “so what” when you ship the write-up so **`dashboard/index.html`** summaries stay truthful.

Treat that HTML file as **your shipped app vs named competitors**. Do not replace the shell (doctype, head, **`nav.pm-nav`**, **`h1`**, **`p.sub`**) unless it is incorrect.

Implementation rules:

1. Read **`apps[].competition.path`** from **`apps.json`**. Legacy string-only **`competition`** values may still appear—treat as `{ path: "<string>", tldr: "" }`. If there is no resolvable **`path`**, skip file persistence for that row.
2. **Append history or replace snapshot:** Prefer **replacing filler** inside the primary content panel (`Snapshot` / first `.panel`) with factual competitor work: add **`Data as-of: YYYY-MM-DD`** visible near the snapshot. Optionally **append** one additional dated **`section`** (`<section class="panel competitor-run">`) per run if the template already stacks history—otherwise one clear **`div.competitor-grid`** carrying all competitors from this pass is OK.
3. **Markup:** For each competitor, use **`.competitor-grid`** and **`.competitor-card`** as in **PM dashboard HTML template** below (reuse the same markup so dashboards and app pages stay consistent).
4. **Facts only:** Links, dates, pricing, themes must come from research in this workflow—do not invent listings or URLs.
5. **Escape HTML** inside free text (`&`, `<`, `>`).
6. If the scope is portfolio-wide competitor checks, repeat for **each matching `apps.json` row** whose competition HTML you refreshed (list changed paths in the reply).

Legacy **`dashboard/competition-<slug>.html`**-style dumps are optional; prefer **`apps[].competition.path`** under **`sprouts/<slug>/`** unless the user explicitly asks for a standalone dashboard-only page.

## Output format

Use this structure:

```markdown
## <Competitor Name>

- Website: <url>
- iOS App Store: <url>
- Google Play: <url or "Not found">
- Last iOS update: <date or "Unknown">

### ASO snapshot
- <2-4 concise bullets on listing quality, positioning, keywords, creatives>

### Pricing & business model
- <2-4 concise bullets on pricing, plans, monetization model, transparency>

### Review themes
- Users like: <2-4 concise bullets>
- Users hate: <2-4 concise bullets>
```

## PM dashboard HTML template

When writing findings into **`apps[].competition`** (preferred) **or** a legacy **`dashboard/competition-<app>.html`** page, render each competitor in its own card/box.

Use this structure:

```html
<div class="competitor-grid">
  <section class="competitor-card">
    <h2><Competitor Name></h2>
    <ul>
      <li>Website: <a href="<url>"><domain></a></li>
      <li>iOS: <a href="<url>"><listing name></a></li>
      <li>Android: <a href="<url>">Google Play listing</a></li>
      <li>Last iOS update: <date or Unknown></li>
    </ul>
    <h3>ASO snapshot</h3>
    <ul>
      <li>...</li>
    </ul>
    <h3>Pricing &amp; business model</h3>
    <ul>
      <li>...</li>
    </ul>
    <h3>Review themes</h3>
    <ul>
      <li>Users like ...</li>
      <li>Users hate ...</li>
    </ul>
  </section>
</div>
```

Use/keep these CSS classes in the page stylesheet:

- `.competitor-grid`: responsive grid layout for cards.
- `.competitor-card`: bordered panel background, padding, and rounded corners.

## Quality bar

- Use direct links, not search-result redirect URLs.
- Do not guess dates; mark unknown when unverifiable.
- Separate facts from interpretation.
- Keep the readout concise and decision-oriented.
- When you persisted to disk, name the **`competition`** HTML paths you touched (relative to the trunk repo root).
