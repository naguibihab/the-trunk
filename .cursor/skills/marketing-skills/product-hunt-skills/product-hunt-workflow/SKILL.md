---
name: product-hunt-workflow
description: When the user wants to run a full Product Hunt launch for a specific limb (app) — orchestrating the 3 PH skills (prep → launch day → post-launch). Use when the user says "run the Product Hunt workflow", "plan a full PH launch for <limb>", or names a limb and asks for the complete Product Hunt treatment. For a single phase, invoke that skill directly (ph-launch-prep, ph-launch-day, ph-post-launch).
metadata:
  version: 1.0.0
---

# Product Hunt Workflow (orchestrator)

You run a complete Product Hunt launch for **one limb** the user specifies, by
chaining the 3 PH skills, and **persist the result to a to-do file** so the
launch plan is trackable across the prep → launch day → post-launch phases.

## 1. Resolve the limb

1. Ask which limb/app if not given.
2. Read `apps.json` at the repo root; match by `appName` to get `limbPath`.
3. Read `<limbPath>/the-conversation/brief.md` for context and
   `<limbPath>/the-conversation/liveListing.md` for the live App Store URL/App ID
   (the link you'll send PH traffic to). If pre-launch, use the landing page
   instead.

## 2. Run the 3 phases in order

These are **time-separated** phases, not one sitting. Make clear which phase the
user is in and only run what's relevant now.

| Phase | Skill | When |
|-------|-------|------|
| 1 | `ph-launch-prep` | Days/weeks before — produce all copy, gallery checklist, timing, pre-launch tasks. |
| 2 | `ph-launch-day` | The launch day — hour-by-hour playbook + reply templates. |
| 3 | `ph-post-launch` | After it closes — repurpose result, convert traffic, thank-yous, learnings. |

Read each skill's `SKILL.md` in `../` and follow it. Carry context forward
(positioning, copy, link) between phases.

## 3. Persist results (REQUIRED output location)

Write everything to exactly this file (create if missing; **append/refresh** the
relevant phase section, since the phases happen on different days):

- **`<limbPath>/the-conversation/marketing/productHuntTodos.md`**

Structure it so each phase has its own section and the actions are checkboxes:

```markdown
# Product Hunt To-Dos — <App>
_pass date · status: planning/launched/done · link_

## Launch plan (prep)
- Date/time · Hunter decision · launch-day offer
### Copy
- Tagline / Description / Topics / Maker's first comment
### Gallery checklist
- [ ] thumbnail [ ] gallery x3–6 [ ] demo GIF/video
### Pre-launch
- [ ] Upcoming page [ ] notify network [ ] social drafts

## Launch day playbook
- [ ] go live 12:01 PST [ ] first comment [ ] notify channels ...
### Reply templates

## Post-launch
- Result (rank / upvotes) · repurpose checklist · thank-yous · learnings
```

Update the matching section each time a phase runs rather than overwriting the
whole file. Also give a short chat summary + immediate next actions per phase.
