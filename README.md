# The Trunk

PM **index** and shared skills for The Tree. Ideas live in sibling repo **`the-sprouts`**, apps in sibling **`limb-*`** repos, sites in **`the-saplings`**. This trunk does not contain project source.

## Repo layout

```text
the-garden/
  the-trunk/             ← this repo: apps.json, dashboard, .cursor/skills/
  the-sprouts/           ← all pre-limb ideas
  limb-people-keeper/    ← one git repo per limb (code + the-conversation/)
  the-saplings/          ← static sites (Netlify)
```

| Layer | Role |
|------|------|
| **Trunk** | **`apps.json`** indexes paths; **`tldr`** and **`metrics`** are derived fields—not duplicate PM docs. |
| **Sprouts** | Sibling **`../the-sprouts/<slug>/`** — brief (+ optional requirements) for ideas **without** a limb yet. |
| **Limbs** | Sibling **`../limb-*/`** — shipping code; **`the-conversation/`** is canonical PM (Build / Marketing / Revenue). |
| **Leaf** | On a limb (e.g. **`.cursor/leaves/`**): local agent context—not copied to trunk. |

Netlify brochure sites (e.g. upilio.io) stay in **separate repos** and are **not** indexed here.

---

## **`apps.json`**

| Field | Role |
|-------|------|
| **`description`** | Pre-limb: **`../the-sprouts/<slug>/brief.md`**. Limb: **`../limb-…/the-conversation/brief.md`**. |
| **`limbPath`** | Limb root when promoted (e.g. **`../limb-people-keeper`**). |
| **`tldr`** | Dashboard focus summary, Markdown (workflow-generated). |
| **`conversation`** | **`build`**, **`marketing`**, **`revenue`** link lists → Markdown under **`the-conversation/`**. |
| **`metrics`** | Optional **`mauMonthly`** / **`revenueMonthly`** for dashboard sparklines. |

---

## **`../the-sprouts/<slug>/`**

Pre-limb only. See that repo’s README.

---

## **`../limb-*/the-conversation/`**

Scaffold:

```bash
node .cursor/skills/sprout-skills/sprout-to-limb/scaffold-the-conversation.mjs ../limb-people-keeper
```

| Path | Role |
|------|------|
| **brief.md** | Product brief (promoted from sprout or written at limb birth). |
| **build/** | openIssues, knownIssues, status, userStories, sentryHealth |
| **marketing/** | asoHealth, asoIssues, userAcquisition, userRetention |
| **revenue/** | revenueHealth |

---

## Scripts

```bash
node .cursor/skills/sprout-skills/sprout-to-limb/scaffold-the-conversation.mjs ../limb-people-keeper
node dashboard/server.mjs   # http://localhost:4173
```

