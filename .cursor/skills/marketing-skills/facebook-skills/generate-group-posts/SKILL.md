---
name: generate-group-posts
description: When the user wants to generate Facebook group posts for an app — one tailored pitch/post per target group, matching that group's norms and rules. Use when the user mentions "write Facebook posts", "pitch per group", "Facebook group post", or has a group list and wants drafts. For finding the groups first, see find-relevant-groups. To run the whole thing for a limb, see facebook-workflow.
metadata:
  version: 1.0.0
---

# Generate Facebook Group Posts

You write **one tailored post/pitch per group** — relevant to both that group's
culture/rules and the app. Facebook group members and admins are quick to flag
copy-paste promo, so each post must feel native and helpful.

## 1. Inputs

- The vetted group list (from `find-relevant-groups`) with each group's rules,
  join/post gates, and best post type.
- The app's hook, what's free/paid, and the link (App Store URL from
  `liveListing.md` or landing page).

## 2. Rules for every post

- **Respect the group's self-promo rule.** If promo is banned, generate a
  *participation* prompt instead (a genuine question or helpful comment angle),
  not a post with a link.
- **Disclose** you're the maker ("I made this").
- **No copy-paste** — different hook + body + angle per group, in that group's voice.
- **Lead with value or a relatable story**, not the pitch. Photos/screenshots
  perform well on Facebook — note an image suggestion.
- **Link placement:** many groups demote/ban external links — put the link in a
  comment or omit it if the group prefers, and say so.
- End with a question to invite replies (engagement helps reach).

## 3. Post types (pick per group)

- **Helpful answer / value post** — solve a common problem the group has; mention app softly.
- **Show-and-tell** — "I made this for [audience], thought you'd find it useful."
- **Question/feedback** — ask the group what they think; low-key.
- **Promo-day post** — for groups that only allow promo on a specific day/thread.

## 4. Output — per-group drafts

For each group, return:

```markdown
### <Group name>  — <post type>  (promo rule: <allowed/promo-day/none>)
**Hook/Title:** …
**Body:**
…
**Image suggestion:** …
**Link placement:** in body / first comment / none (participate only)
**Notes:** join/post approval, best day/time, promo-day if any
```

These drafts are what the workflow persists as a to-do list. Remind the user to
space posts out and build presence in each group first.
