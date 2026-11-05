---
name: new-sprout
description: >-
  Creates a pre-limb sprout folder under ../the-sprouts/<slug>/ with brief.md and
  adds a dashboard row to apps.json. Use when the user asks to capture a new
  idea, start a sprout, or spin up a new pre-limb concept before a limb exists.
disable-model-invocation: true
---

# New sprout

Create a minimal sprout under **`../the-sprouts/<slug>/`** (sibling repo) and register it on the PM dashboard in **`apps.json`**.

**Create:** `brief.md`, one **`apps.json`** row.

**Do not create** unless the user explicitly asks: `manifest.yaml`, `sprouts/README.md` updates, competition HTML, or other lanes.

## Inputs

- Idea title (or name for the sprout)
- Raw notes / description for the brief

## Workflow

1. Derive **`<slug>`** from the title: lowercase, hyphen-separated, alphanumeric only.
2. If **`../the-sprouts/<slug>/`** already exists, stop unless the user asked to overwrite or extend it.
3. Create **`../the-sprouts/<slug>/`** if needed.
4. Write **`../the-sprouts/<slug>/brief.md`** with whatever sections fit the notes (e.g. **Summary**, **Problem**, **Proposed solution**, **Notes**). Keep it short unless the user gave a long spec.
5. Append a row to **`apps.json`** → **`apps`** array (skip if an entry with the same **`description`** already exists):
   - **`appName`**: human-readable title (from the idea title)
   - **`lifecycle`**: `"new"`
   - **`description`**: `../the-sprouts/<slug>/brief.md`
   - **`links`**: `[{ "label": "Brief", "url": "../the-sprouts/<slug>/brief.md" }]` — Quick Links column on the PM dashboard
   - **`potentialFeatures`**: `[]`
   - **`metrics`**: `{ "mauMonthly": [], "revenueMonthly": [] }`

## Output

- Confirm **`../the-sprouts/<slug>/brief.md`** path, the **`apps.json`** row, and the **Brief** quick link.
- Summarize what you captured.
- Note anything the user may want next (**`find-competition`**, prototype) without doing those steps automatically. To abandon the sprout, use **`cut-limb-or-sprout`**.
