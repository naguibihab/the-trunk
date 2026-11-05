---
name: sprout-prototype
description: >-
  Create a static HTML prototype for a sprout by generating pages under
  ../the-sprouts/<slug>/prototype/. Use when the user asks to prototype a new idea,
  mock screens quickly, or create clickable HTML concepts for a pre-limb sprout.
disable-model-invocation: true
---

# Sprout prototype

Use this skill to turn a sprout into a lightweight static HTML prototype.

## Inputs

- Sprout slug or **`../the-sprouts/<slug>/`** with **`brief.md`**
- Optional constraints: target user flow, page count, style direction

## Workflow

1. Validate sprout workspace:
   - Confirm **`../the-sprouts/<slug>/`** exists.
   - Confirm **`../the-sprouts/<slug>/brief.md`** exists (or ask the user for it).

2. Create prototype folder:
   - Create **`../the-sprouts/<slug>/prototype/`**.
   - Do not delete or overwrite existing files unless the user asks.

3. Plan prototype pages:
   - Extract key user flow from the brief.
   - Define a minimal page set (usually 3–6 pages).
   - Include at least:
     - `index.html` (landing / concept overview)
     - one core feature page
     - one action/result page (success, summary, or dashboard)

4. Generate static HTML pages:
   - Semantic static HTML only.
   - CSS inline or one shared `styles.css`.
   - JS optional and minimal; no framework setup.
   - Relative links between pages.
   - Placeholder copy where product details are unknown.

5. Quality check:
   - Internal links resolve.
   - Titles and headings match the idea.
   - Keep the prototype lightweight and editable.

6. Register prototype in **`apps.json`**:
   - Find the sprout row where **`description`** is `../the-sprouts/<slug>/brief.md`.
   - If **`links`** exists, append (do not duplicate) `{ "label": "Prototype", "url": "../the-sprouts/<slug>/prototype/index.html" }`.
   - If **`links`** is missing, add `"links": [{ "label": "Brief", "url": "../the-sprouts/<slug>/brief.md" }, { "label": "Prototype", "url": "../the-sprouts/<slug>/prototype/index.html" }]` — same Brief pattern as **`new-sprout`**.
   - Match existing **`links`** object shape in **`apps.json`** (label + url strings).

## Output expectations

- List created files under **`../the-sprouts/<slug>/prototype/`**.
- Describe the user flow represented.
- Call out assumptions and missing inputs for the next version.
- Confirm the **Prototype** quick link was added to **`apps.json`**.
