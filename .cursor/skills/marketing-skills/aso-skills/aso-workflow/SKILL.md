---
name: aso-workflow
description: When the user wants to run a full end-to-end ASO pass for a specific limb (app) in one go — chaining the 6 core ASO skills (context → audit → keyword research → metadata → screenshots → icon) and writing results into that limb's marketing conversation files. Use when the user says "run the ASO workflow", "do a full ASO pass for <limb>", "optimize <limb>'s App Store listing end to end", or names a limb and asks for the complete ASO treatment. For a single step, invoke that skill directly (e.g. aso-audit, aso-keyword-research).
metadata:
  version: 1.0.0
---

# ASO Workflow (orchestrator)

You are running a complete, sequential ASO pass for **one limb** that the user
specifies. This skill chains the 6 core ASO skills in order, carrying context
forward between steps and persisting results to the limb's marketing files.

## 1. Resolve the limb

1. Ask which limb to run for if not already given (e.g. "My Guinea Pig Bowl").
2. Read `apps.json` at the repo root. Match the user's input to an `apps[]`
   entry by `appName` (case-insensitive, fuzzy is fine).
3. From that entry, capture:
   - `limbPath` (e.g. `limbs/limb-my-guineapig-bowl`)
   - `lifecycle` (e.g. `revenue`, `live`, `active`) — note pre-launch apps have
     no live listing to audit.
   - The marketing conversation paths under
     `limbPath/the-conversation/marketing/` (`asoHealth.md`, `asoIssues.md`).
4. If no match, list the limb `appName`s from `apps.json` and ask the user to pick.
5. Read `limbPath/the-conversation/brief.md` for app context before starting.
6. **Always check `limbPath/the-conversation/liveListing.md`.** If it exists, it
   holds the live App Store URL and **App ID** — use that App ID to run the
   workflow against the real listing (pull live metadata, competitors,
   and ratings from the App Store page and iTunes lookup API). If the file is missing or has no App ID, treat the
   app as **pre-launch** and work from the brief + competitor landscape instead.

## 2. Run the 6 core skills in order

Run each skill below by reading its `SKILL.md` in this folder and following it.
**Pass the output of each step as input to the next** — don't restart context
each time. Pause after each step to show the user the result and confirm before
continuing.

| # | Skill | Purpose in the chain |
|---|-------|----------------------|
| 1 | `aso-app-marketing-context` | Establish/refresh the app's positioning, audience, competitors, goals. Save to `app-marketing-context.md` in the limb. |
| 2 | `aso-audit` | Score the current listing, surface problems and quick wins. |
| 3 | `aso-keyword-research` | Find target keywords (volume × difficulty × relevance) informed by the audit. |
| 4 | `aso-metadata-optimization` | Write title, subtitle, keyword field, description using those keywords. |
| 5 | `aso-screenshot-optimization` | Produce the screenshot strategy + copy that reinforces the metadata. |
| 6 | `aso-app-icon-optimization` | Icon review / A/B direction to lift tap-through. |

Rules between steps:
- Reuse the App ID, country, and platform once gathered — don't re-ask.
- If the limb is pre-launch (no live listing), skip the data-pull parts of
  `aso-audit` and work from the brief and competitors instead.
- Pull public listing data from `liveListing.md` + iTunes lookup + App Store page JSON; ask the user for ASC-only fields (keyword field) once and reuse.

## 3. Persist results to the limb (REQUIRED output locations)

The outputs of this workflow **always** go in exactly these two files (create
them if missing, overwrite/refresh if they exist):

- **`<limb>/the-conversation/marketing/asoHealth.md`** — current score, what's
  strong, the optimized title / subtitle / keyword field / description (with
  character counts), screenshot + icon direction, and the date of this pass.
- **`<limb>/the-conversation/marketing/asoIssues.md`** — the prioritized,
  still-open action items (quick wins first, then high-impact changes).

Do not write the workflow's results anywhere else. `<limb>` is the matched
`limbPath` from `apps.json` (e.g. `limbs/limb-people-keeper`). You may still
keep an `app-marketing-context.md` inside the limb for reuse, but the two files
above are the canonical deliverables.

## 4. Final report

Summarize for the user:
- ASO score before → recommended after
- Top 3 quick wins
- The new metadata block (with character counts)
- Which files you wrote
- Suggested standalone follow-ups (not part of this chain): `aso-asc-metrics`
  for performance data, `aso-review-management`, `aso-rating-prompt-strategy`.

## Scope

This orchestrator chains the **6 core** skills only. The other kept ASO skills
(`aso-asc-metrics`, `aso-review-management`, `aso-rating-prompt-strategy`) are
ongoing/standalone — invoke them directly when needed.
