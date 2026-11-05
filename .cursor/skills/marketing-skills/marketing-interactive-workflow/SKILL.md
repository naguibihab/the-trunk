---
name: marketing-interactive-workflow
description: When the user wants an interactive marketing hub for a limb (app) — see when marketing last ran, what marketing issues/to-dos are open, and choose which marketing skill to run next. Use when the user says "run marketing for <limb>", "what's the marketing status", "what marketing should I do next", "marketing workflow", or names a limb and wants a guided pick of marketing skills. This is the entry point that routes to aso-workflow, calculate-market-size, outreach-workflow, reddit-workflow, facebook-workflow, tiktok-workflow, and the Product Hunt skills.
metadata:
  version: 1.0.0
---

# Marketing Interactive Workflow (hub)

You are the interactive entry point for all marketing work on a limb. You don't
do the marketing yourself — you **assess the limb's marketing state and route the
user to the right marketing skill**, then hand off.

## 1. Resolve the limb

1. If the user didn't name a limb, **ask which one** (list `appName`s from
   `apps.json` to choose from).
2. Read `apps.json`; match by `appName` to get `limbPath`.
3. Note `lifecycle` and read `<limbPath>/the-conversation/liveListing.md` (live
   App Store URL / App ID) and `brief.md` for context.

## 2. Inspect the marketing folder

Look in `<limbPath>/the-conversation/marketing/`. Known files and which skill
produced them:

| File | Produced by | Channel |
|------|-------------|---------|
| `asoHealth.md`, `asoIssues.md` | `aso-workflow` | ASO |
| `marketSize.md` | `calculate-market-size` | Market sizing (TAM/SAM/SOM) |
| `outreachIssues.md` | `outreach-workflow` | Blog/influencer outreach |
| `redditTodos.md` | `reddit-workflow` | Reddit |
| `facebookTodos.md` | `facebook-workflow` | Facebook |
| `tiktokTodos.md` | `tiktok-workflow` | TikTok |
| `productHuntTodos.md` | `product-hunt-workflow` | Product Hunt |
| `userAcquisition.md`, `userRetention.md` | (legacy/limb notes) | misc |

## 3. Detect when marketing last ran

For each file present:
- Prefer an explicit date line inside the file (e.g. `_pass date: YYYY-MM-DD_` or
  `_... · pass date · ..._`). 
- If none, fall back to the file's git last-modified date
  (`git log -1 --format=%cs -- <file>`).
- If a file is missing or still a stub (only contains `_Update from limb working
  notes._` / `- …`), mark that channel **never run**.

## 4. Detect & list open issues / to-dos

Scan the files for actionable items:
- **Unchecked checkboxes** — lines matching `- [ ]` (in `*Issues.md` / `*Todos.md`).
- **Issue bullets** under "Quick wins", "High-impact", "Blockers", "next actions".
- Count open vs done (`- [x]`) per file.

Present a compact summary table:

```
Marketing status — <App>  (lifecycle, live link if any)

Channel        Last run      Open items
ASO            2026-05-30    4  (e.g. fix subtitle, keyword field, ratings, price)
Market size    2026-06-20    —  (no open items — read for TAM/SAM/SOM headline)
Outreach       never         —
Reddit         never         —
Facebook       never         —
TikTok         never         —
Product Hunt   never         —
```

Then list the actual open items grouped by channel (short bullets).

## 5. Ask what to run — with suggestions

Offer the available marketing skills and **recommend** based on state:

- Channel **never run** → suggest running its workflow.
- Channel **stale** (e.g. >30–60 days, or app changed) → suggest a refresh.
- Many **open items** → suggest acting on those before generating more.
- Use lifecycle/context:
  - **pre-launch / new sprout** → `calculate-market-size` then ASO + Product Hunt prep
  - **revenue limb, no `marketSize.md`** → suggest market sizing before big UA spend
  - **live with low ratings** → ASO rating items
  - **growth push** → outreach/Reddit/Facebook
- **`marketSize.md` stale** (>12 months, or major pricing/positioning change) →
  refresh `calculate-market-size` before PH launch or outreach pitches.

Present the choice (use the question UI when available):

| Option | Skill | Output |
|--------|-------|--------|
| Market size | `calculate-market-size` | `marketSize.md` |
| ASO pass | `aso-workflow` | `asoHealth.md` + `asoIssues.md` |
| Outreach | `outreach-workflow` | `outreachIssues.md` |
| Reddit | `reddit-workflow` | `redditTodos.md` |
| Facebook | `facebook-workflow` | `facebookTodos.md` |
| TikTok | `tiktok-workflow` | `tiktokTodos.md` |
| Product Hunt | `product-hunt-workflow` | `productHuntTodos.md` |
| Review open items | (no skill — walk the existing lists) | — |

## 6. Hand off

Once the user picks, **read that workflow's `SKILL.md`** (in its folder under
`marketing-skills/`) and run it for this limb. Skill paths:

- `calculate-market-size` → `.cursor/skills/marketing-skills/calculate-market-size/SKILL.md`
- `aso-workflow` → `.cursor/skills/marketing-skills/aso-skills/aso-workflow/SKILL.md`
- Channel workflows → `.cursor/skills/marketing-skills/<channel>-skills/`

After it finishes, offer to return here to pick the next channel. When
`marketSize.md` was just written, surface the **TAM / SAM / SOM headline** in
the hub summary on return.

Do not invent results — only report what the files and `apps.json` actually contain.
