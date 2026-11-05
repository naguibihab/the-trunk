---
name: tiktok-workflow
description: When the user wants to run the full TikTok pass for a specific limb (app) — hooks, scripts, captions, and a filming/posting to-do list — using viral-tiktok-content. Use when the user says "run the TikTok workflow", "do TikTok for <limb>", or names a limb and asks for the complete TikTok treatment.
metadata:
  version: 1.0.0
---

# TikTok Workflow (orchestrator)

You run a complete TikTok content pass for **one limb** the user specifies,
following `../viral-tiktok-content/SKILL.md`, and persist the result as an
actionable to-do list.

## 1. Resolve the limb

1. Ask which limb/app if not given.
2. Read `apps.json` at the repo root; match by `appName` to get `limbPath`.
3. Read `<limbPath>/the-conversation/brief.md` for context and
   `<limbPath>/the-conversation/liveListing.md` for the live App Store URL. If
   missing, check `app-marketing-context.md`, `marketSize.md`, or App Store
   search; note the gap.
4. Determine the vertical (pet vs productivity vs other) to drive hooks and tone.

## 2. Run viral-tiktok-content

Read `../viral-tiktok-content/SKILL.md` and load references on demand:

| Step | Reference | Purpose |
|------|-----------|---------|
| Length tier | `references/retention-math.md` | Pick 21–34s default; 60s+ for deep demos |
| Hooks | `references/tiktok-hooks.md` | 6–10 TikTok-shaped hooks across archetypes |
| Scripts | `references/script-structure.md`, `assets/tiktok-script-template.md` | 3–5 film-ready scripts |
| Sound | `references/sounds.md` | Trending vs original audio notes |
| Anti-patterns | `references/anti-patterns.md` | Final pass before persisting |

**Content mix for apps (default):**

- ~50% broad educational (category tips, not the app)
- ~30% adjacent (dog nutrition myths, portion mistakes, etc.)
- ~20% product-demo (food lookup, weight log, meal planner — emotional hook first)

**Goals:** saves and shares > likes. Build for "send this to a dog-owner friend"
or "save for my next vet visit."

## 3. Persist results (REQUIRED output location)

Write everything to exactly this file (create if missing; **append/refresh** on
later passes — do not wipe completed checkboxes):

- **`<limbPath>/the-conversation/marketing/tiktokTodos.md`**

Structure it as a checklist:

```markdown
# TikTok To-Dos — <App>
_pass date · vertical · link_

## Profile setup
- [ ] …

## Content pillars
1. …

## Hook bank (pick & film)
| # | Archetype | Hook line | Best for | Status |

## Scripts to film
### Script 1 — <title> (<length>)
- [ ] Film
- [ ] Edit
- [ ] Post
…

## Posting rhythm
…

## Reminders
…
```

## 4. Report

In chat: vertical, hook count, script count, recommended first 3 posts, and top
next actions. Confirm the file written.
