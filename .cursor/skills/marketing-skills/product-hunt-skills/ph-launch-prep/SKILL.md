---
name: ph-launch-prep
description: When the user wants to prepare a Product Hunt launch — positioning, tagline, description, topics, gallery assets, the maker's first comment, hunter-vs-self-launch decision, timing, and the pre-launch "Upcoming" teaser. Use when the user mentions "Product Hunt", "PH launch", "launch on Product Hunt", "tagline", "first comment", "hunter", or "Upcoming page". For launch-day execution, see ph-launch-day. For after the launch, see ph-post-launch. To run the whole thing, see product-hunt-workflow.
metadata:
  version: 1.0.0
---

# Product Hunt — Launch Prep

You help the user prepare a Product Hunt launch. **Do all of the heavy lifting
(the copywriting especially) and return finished, paste-ready drafts in the
chat.** Do not write results to a file — a PH launch is a one-off event, so the
output lives in the session.

## 1. Gather context

- Identify the app/limb. If it's a limb, read `<limb>/the-conversation/brief.md`
  and `liveListing.md` (App Store URL) for positioning and the live link.
- Confirm: target audience, one-line value prop, what's free vs paid, and the
  landing/App Store URL to send PH traffic to.

## 2. Timing & format decisions

- **Day/time:** launch at **12:01 AM PST**; prefer **Tue–Thu** (avoid weekends
  and major holidays/big-tech launch days).
- **Hunter vs self-launch:** self-launching is fine now and keeps control. Only
  seek a well-known hunter if one is genuinely engaged — don't delay the launch
  chasing one.
- **One launch per product per 6 months** counts — pick the date deliberately.

## 3. Copy (deliver all of these, paste-ready)

| Asset | Spec | Notes |
|-------|------|-------|
| **Name** | the product name | clean, no taglines in the name field |
| **Tagline** | ≤60 chars | benefit-led, plain language, no "the #1…" |
| **Description** | ~260 chars | what it is + who it's for + the hook |
| **Topics** | 3 relevant | pick from PH's topic list |
| **First comment** | from the maker | the most important copy — see below |

**Maker's first comment** (write it in full): short story of *why you built it*,
what it does, what's free, a question to invite discussion, and the link. Warm
and human, not a press release. 4–8 short lines.

## 4. Gallery / media checklist

- [ ] **Thumbnail/logo** — clean, legible small (240×240).
- [ ] **Gallery images** — 3–6, 1270×760; first image is the hook (caption the benefit).
- [ ] **GIF or short video** — a 10–30s product demo lifts engagement.
- [ ] First gallery item should work even with sound off / at a glance.

## 5. Pre-launch (the part people skip)

- [ ] Create the **"Upcoming"/teaser page** ahead of time to collect notify-me signups.
- [ ] Line up your **own network**: email list, friends, existing users — tell
      them the date and that you'll share the link on launch morning. (Ask them
      to engage genuinely — never to just upvote; see ph-launch-day for rules.)
- [ ] Prepare social posts to publish when you go live.

## Output

Return, in the chat: the timing/format decision, all copy (tagline,
description, topics, full first comment), the gallery checklist, and the
pre-launch task list — ready to act on. Then hand off to `ph-launch-day`.
