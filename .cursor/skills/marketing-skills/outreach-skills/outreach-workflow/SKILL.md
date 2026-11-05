---
name: outreach-workflow
description: When the user wants to run a full blog/influencer outreach pass for a specific limb (app) — orchestrating prospecting then pitch — and persist the result to the limb's outreach file. Use when the user says "run the outreach workflow", "do outreach for <limb>", or names a limb and asks for the complete blog/influencer outreach treatment. For a single phase, invoke outreach-prospecting or outreach-pitch directly.
metadata:
  version: 1.0.0
---

# Outreach Workflow (orchestrator)

You run a complete blog/influencer outreach pass for **one limb** the user
specifies, chaining the 2 outreach skills and persisting the result so it can be
reused and added to over time.

## 1. Resolve the limb

1. Ask which limb/app if not given.
2. Read `apps.json` at the repo root; match by `appName` to get `limbPath`.
3. Read `<limbPath>/the-conversation/brief.md` for context and
   `<limbPath>/the-conversation/liveListing.md` for the live App Store URL (the
   link to send outreach traffic to). If pre-launch, use the landing page.
4. Determine the vertical (pet vs productivity vs other) to drive targeting/tone.

## 2. Run the 2 skills in order

| # | Skill | Purpose |
|---|-------|---------|
| 1 | `outreach-prospecting` | Build the 10–20 target list (blogs/influencers/journalists) + find/verify emails via Hunter.io (free tier, frugal). |
| 2 | `outreach-pitch` | Write subject lines, the core pitch template, 1–2 personalized examples, one follow-up, and a press-kit blurb. |

Read each skill's `SKILL.md` in `../` and follow it; pass the prospect list from
step 1 into step 2 so pitches reference real targets.

## 3. Persist results (REQUIRED output location)

Write everything to exactly this file (create if missing; **append/refresh**
rather than blindly overwriting, since the list grows over time):

- **`<limbPath>/the-conversation/marketing/outreachIssues.md`**

Structure it:

```markdown
# Outreach — <App>
_pass date · vertical · link_

## Prospect list
| # | Target | Type | Contact | Email | Verified | Why | Status |

## Pitch
### Subject lines
### Core template (with [placeholders])
### Personalized examples
### Follow-up
### Press-kit blurb

## Tracking / next actions
- [ ] contact target #…
```

The **Status** column and the tracking checklist are how outreach progress is
tracked over time — update them on later passes instead of starting over.

## 4. Report

In chat: a short summary — vertical, how many targets found/verified, the credits
spent on Hunter (stay within the 50/mo free tier), and the top next actions.
Confirm the file written.
