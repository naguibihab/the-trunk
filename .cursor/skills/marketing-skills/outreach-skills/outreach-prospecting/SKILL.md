---
name: outreach-prospecting
description: When the user wants to build a targeted list of blogs, influencers, or "best apps" writers to pitch for an app — segmented by vertical (e.g. pet vs productivity) — and find their contact emails. Use when the user mentions "outreach list", "find blogs", "influencer outreach", "who should I pitch", "blog contacts", "Hunter.io", or "press list". For writing the pitch itself, see outreach-pitch. To run the whole thing for a limb, see outreach-workflow.
metadata:
  version: 1.0.0
---

# Outreach — Prospecting

You build a small, high-quality list of outreach targets (blogs, influencers,
newsletter/"best apps" writers) for an app and find their contact emails. Keep
it **lean and credit-frugal** — hand-pick quality over scraping volume.

## 1. Establish the vertical & angle

- Identify the app/limb and its vertical. From the plan: **pet-focused** for the
  bowl apps, **productivity-focused** for People Keeper.
- Note the one-line hook and the link to send people to (App Store URL from
  `liveListing.md`, or landing page).

## 2. Build the target list (aim for 10–20 quality targets)

For the vertical, find:
- **Blogs / review sites** that cover this niche or do "best X apps" roundups.
- **Influencers / creators** (YouTube, TikTok, Instagram, newsletters) in the niche.
- **Journalists** who've written about similar apps recently.

Search tactics: "best [niche] apps 2026", "[niche] app review", roundup posts you
already rank near, competitor mentions, and niche subreddits/newsletters. Prefer
targets with a real audience *and* a history of covering apps like this.

## 3. Find & verify contacts (Hunter.io — free plan, 50 credits/mo)

Hunter's free plan gives **50 unified credits/month** (Find = 1, Verify = 0.5,
Domain Search = 1). So spend credits only on your hand-picked list:

1. **Domain Search** the blog's domain → get on-domain emails + roles (1 credit).
2. **Email Finder** for a specific writer's name at that domain when needed (1 credit).
3. **Verify** before adding to the list (0.5 credit) to protect deliverability.

Default to the **Hunter web UI / Chrome extension** (simplest, no setup). Only use
the Hunter API if the user has an API key configured and wants automation.

Budget guide: ~10–20 targets find+verify ≈ 15–30 credits — within the free tier.

## 4. Output — the prospect table

Produce a table (this is what the workflow persists):

| # | Target | Type | Contact name | Email | Verified | Why a fit | Status |
|---|--------|------|--------------|-------|----------|-----------|--------|
| 1 | … | blog/influencer/journo | … | … | yes/no | one line | not contacted |

Flag any targets where you couldn't find/verify an email (note "no email — use
contact form / DM" instead). Hand the list to `outreach-pitch`.
