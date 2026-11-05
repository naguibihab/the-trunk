---
name: find-relevant-subreddits
description: When the user wants to find the subreddits relevant to a given app/limb to post in or participate in. Use when the user mentions "find subreddits", "which subreddits", "relevant communities on Reddit", "where to post on Reddit", or names an app and asks where its audience hangs out. For writing the actual posts, see generate-posts. To run the whole thing for a limb, see reddit-workflow.
metadata:
  version: 1.0.0
---

# Find Relevant Subreddits

You find the subreddits where an app's target audience actually hangs out, and
capture each one's posting rules so the user doesn't get banned.

## 1. Understand the app

- Identify the app/limb, its vertical, audience, and one-line hook (read the
  limb's `brief.md` / `liveListing.md` if available).
- Derive search terms: the problem it solves, the audience, adjacent topics, and
  competitor names.

## 2. Discover candidate subreddits

Use Reddit's own search and web search for the derived terms. Look for:
- **Audience subreddits** (who the users are — e.g. r/pets, r/productivity).
- **Problem/topic subreddits** (what they're trying to do).
- **Maker/feedback subreddits** that explicitly allow showing your app
  (e.g. r/SideProject, r/iosapps, r/alphaandbetausers, r/roastmyapp).
- Adjacent/niche communities competitors are mentioned in.

Aim for ~8–15 candidates, quality over quantity.

## 3. Vet each subreddit (this is the important part)

For every candidate, capture:

| Field | Why |
|-------|-----|
| Subreddit | the community |
| Members | rough size / activity |
| Relevance | why it fits this app (one line) |
| Self-promo rule | **read the rules + sidebar** — allowed / never / only in a weekly thread / ratio required |
| Karma/age gate | many subs block new/low-karma accounts |
| Best post type | feedback request / show-and-tell / discussion / weekly promo thread |
| Risk | ban risk if rules are strict |

Flag subs where direct promotion is banned — those are **participate-only**
(comment genuinely, no links).

## 4. Output — the subreddit table

Return the vetted table sorted by best opportunity (relevant + promo-friendly
first). Note the overall **90/10 rule**: ~90% genuine participation, ~10%
(or less) self-promotion, and always disclose you're the maker. Hand the list to
`generate-posts`.
