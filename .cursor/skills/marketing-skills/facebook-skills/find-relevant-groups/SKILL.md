---
name: find-relevant-groups
description: When the user wants to find the Facebook groups relevant to a given app/limb to post or participate in. Use when the user mentions "find Facebook groups", "which Facebook groups", "FB groups for my app", "where to post on Facebook", or names an app and asks where its audience is on Facebook. For writing the actual posts, see generate-group-posts. To run the whole thing for a limb, see facebook-workflow.
metadata:
  version: 1.0.0
---

# Find Relevant Facebook Groups

You find the Facebook groups where an app's target audience gathers, and capture
each group's posting rules so the user doesn't get removed or banned.

## 1. Understand the app

- Identify the app/limb, its vertical, audience, and one-line hook (read the
  limb's `brief.md` / `liveListing.md` if available).
- Derive search terms: the audience, the problem it solves, adjacent topics, and
  competitor/brand names.

## 2. Discover candidate groups

Use Facebook search and web search for the derived terms. Look for:
- **Audience groups** (who the users are — e.g. guinea pig owners, dog parents,
  productivity/PKM enthusiasts).
- **Problem/interest groups** (what they're trying to do).
- **Maker/indie/app groups** that allow showing your app (e.g. indie hackers,
  app feedback, "show your app" communities).
- Local/community groups when the app has a local angle (e.g. church/community).

Aim for ~8–15 candidates, quality over quantity. Prefer **active** groups
(recent posts, real engagement) over big-but-dead ones.

## 3. Vet each group (the important part)

For every candidate, capture:

| Field | Why |
|-------|-----|
| Group | name + public/private |
| Members | rough size / activity level |
| Relevance | why it fits this app (one line) |
| Self-promo rule | **read the rules/About + pinned posts** — allowed / never / promo day only / admin approval |
| Join gate | membership questions, admin approval, post approval |
| Best post type | helpful answer / show-and-tell / question / promo-day post |
| Risk | removal/ban risk if rules are strict |

Flag groups where promotion is banned — those are **participate-only** (comment
and help genuinely, no links/pitches).

## 4. Output — the group table

Return the vetted table sorted by best opportunity (relevant + promo-friendly
first). Note the norm: **give value first**, build presence in the group before
posting about your app, and always disclose you're the maker. Hand the list to
`generate-group-posts`.
