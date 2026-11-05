---
name: generate-posts
description: When the user wants to generate Reddit posts for an app — one tailored post per target subreddit, matching that subreddit's norms and rules. Use when the user mentions "write Reddit posts", "generate a post for r/...", "Reddit post per subreddit", or has a subreddit list and wants drafts. For finding the subreddits first, see find-relevant-subreddits. To run the whole thing for a limb, see reddit-workflow.
metadata:
  version: 1.0.0
---

# Generate Posts

You write **one tailored post per subreddit** — relevant to both that
subreddit's culture/rules and the app. Reddit hates copy-paste promo, so each
post must feel native to its community.

## 1. Inputs

- The vetted subreddit list (from `find-relevant-subreddits`) with each sub's
  rules, karma gate, and best post type.
- The app's hook, what's free/paid, and the link (App Store URL from
  `liveListing.md` or landing page).

## 2. Rules for every post

- **Respect the subreddit's self-promo rule.** If promo is banned, generate a
  *participation* prompt instead (a genuine question/comment angle), not a post
  with a link.
- **Disclose** you're the maker ("I built this").
- **No copy-paste** — different title + body + angle per sub, in that sub's voice.
- **Title:** specific, curiosity or value, no hype/clickbait, follow any title
  format the sub requires (tags like [Feedback], etc.).
- **Body:** lead with value or story, not the pitch; put the link low or in a
  comment if the sub prefers; end with a genuine question to spark discussion.

## 3. Post types (pick per sub)

- **Show-and-tell / "I built this"** — for maker/feedback subs.
- **Feedback request** — "would love a roast / does this solve a real problem?"
- **Value/discussion** — share a useful insight from building it; mention app softly.
- **Weekly-promo-thread comment** — short blurb for subs that only allow promo there.

## 4. Output — per-subreddit drafts

For each subreddit, return:

```markdown
### r/<subreddit>  — <post type>  (promo rule: <allowed/thread-only/none>)
**Title:** …
**Body:**
…
**Link placement:** in body / first comment / none (participate only)
**Notes:** karma/age gate, best day/time, any required flair
```

These drafts are what the workflow persists as a to-do list. Remind the user to
space posts out (occasional, not all at once) to stay within each sub's norms.
