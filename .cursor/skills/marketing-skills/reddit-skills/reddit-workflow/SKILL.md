---
name: reddit-workflow
description: When the user wants to run the full Reddit pass for a specific limb (app) — finding relevant subreddits then generating a tailored post for each — and persist the result as a Reddit to-do list. Use when the user says "run the Reddit workflow", "do Reddit for <limb>", or names a limb and asks for the complete Reddit treatment. For a single phase, invoke find-relevant-subreddits or generate-posts directly.
metadata:
  version: 1.0.0
---

# Reddit Workflow (orchestrator)

You run a complete Reddit pass for **one limb** the user specifies, chaining the
2 Reddit skills and persisting the result as an actionable to-do list.

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
| 1 | `find-relevant-subreddits` | Find ~8–15 relevant subreddits and capture each one's rules, karma gate, and best post type. |
| 2 | `generate-posts` | Write one tailored post (or participation prompt) per subreddit. |

Read each skill's `SKILL.md` in `../` and follow it; pass the subreddit list from
step 1 into step 2.

## 3. Persist results (REQUIRED output location)

Write everything to exactly this file (create if missing; **append/refresh**,
since this is an ongoing list):

- **`<limbPath>/the-conversation/marketing/redditTodos.md`**

Structure it as a checklist so progress is trackable:

```markdown
# Reddit To-Dos — <App>
_pass date · vertical · link_

## Target subreddits
| Subreddit | Members | Promo rule | Karma/age gate | Best post type | Status |

## Posts
### r/<subreddit> — <post type>
- [ ] Post this
**Title:** …
**Body:** …
**Link placement:** …
**Notes:** …

## Reminders
- 90/10 rule · disclose you're the maker · space posts out · read each sub's rules before posting
```

The checkboxes + **Status** column track what's been posted. Update them on later
passes instead of overwriting.

## 4. Report

In chat: a short summary — vertical, how many subreddits found (and how many are
promo-friendly vs participate-only), how many post drafts generated, and the top
next actions. Confirm the file written.
