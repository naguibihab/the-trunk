---
name: facebook-workflow
description: When the user wants to run the full Facebook pass for a specific limb (app) — finding relevant Facebook groups then generating a tailored pitch for each — and persist the result as a Facebook to-do list. Use when the user says "run the Facebook workflow", "do Facebook for <limb>", or names a limb and asks for the complete Facebook treatment. For a single phase, invoke find-relevant-groups or generate-group-posts directly.
metadata:
  version: 1.0.0
---

# Facebook Workflow (orchestrator)

You run a complete Facebook pass for **one limb** the user specifies, chaining
the 2 Facebook skills and persisting the result as an actionable to-do list.

## 1. Resolve the limb

1. Ask which limb/app if not given.
2. Read `apps.json` at the repo root; match by `appName` to get `limbPath`.
3. Read `<limbPath>/the-conversation/brief.md` for context and
   `<limbPath>/the-conversation/liveListing.md` for the live App Store URL (the
   link to share). If pre-launch, use the landing page.
4. Determine the vertical (pet vs productivity vs other) to drive targeting/tone.

## 2. Run the 2 skills in order

| # | Skill | Purpose |
|---|-------|---------|
| 1 | `find-relevant-groups` | Find ~8–15 relevant Facebook groups and capture each one's rules, join/post gates, and best post type. |
| 2 | `generate-group-posts` | Write one tailored pitch (or participation prompt) per group. |

Read each skill's `SKILL.md` in `../` and follow it; pass the group list from
step 1 into step 2.

## 3. Persist results (REQUIRED output location)

Write everything to exactly this file (create if missing; **append/refresh**,
since this is an ongoing list):

- **`<limbPath>/the-conversation/marketing/facebookTodos.md`**

Structure it as a checklist so progress is trackable:

```markdown
# Facebook To-Dos — <App>
_pass date · vertical · link_

## Target groups
| Group | Members | Promo rule | Join/post gate | Best post type | Status |

## Posts
### <Group name> — <post type>
- [ ] Post this
**Hook:** …
**Body:** …
**Image suggestion:** …
**Link placement:** …
**Notes:** …

## Reminders
- give value first · disclose you're the maker · space posts out · read each group's rules before posting
```

The checkboxes + **Status** column track what's been posted. Update them on later
passes instead of overwriting.

## 4. Report

In chat: a short summary — vertical, how many groups found (and how many are
promo-friendly vs participate-only), how many post drafts generated, and the top
next actions. Confirm the file written.
