---
name: cut-limb-or-sprout
description: >-
  Retire a limb or pre-limb sprout by deleting its folder and removing every trunk
  reference, keeping the monorepo clean. Use when the user asks to cut, shed, retire,
  remove, kill, sunset, or delete a limb, sprout, or app — or says "cut-limb-or-sprout",
  "shed-limb", or "cut sprout <name>". The inverse of sprout-to-limb for limbs; the
  inverse of new-sprout for sprouts.
disable-model-invocation: true
---

# Cut limb or sprout

Use this skill to **retire** a portfolio item: delete its folder and strip every trunk reference so nothing dangles. Run from The Trunk (`the-trunk`).

A cut is **destructive and irreversible**. Confirm the target with the user before deleting anything.

## Inputs

Collect or infer:

- **Target** — app name (`apps.json` `appName`), sprout slug (`../the-sprouts/<slug>/`), or limb dir (`../limb-<slug>/`).
- **Kind** — limb or sprout (infer from `limbPath` vs `description: ../the-sprouts/<slug>/brief.md` and `lifecycle: new`).
- **Optional resolution** — a short note on *why* it was cut (e.g. "no traction", "merged into X"). Ask the user; if they decline, record `N/A`.

## Decide: limb or sprout

| Signal | Kind |
|--------|------|
| `apps.json` row has `limbPath: ../limb-*` | **Limb** |
| `apps.json` row has `description: ../the-sprouts/<slug>/brief.md` and no `limbPath` (or `lifecycle: new`) | **Sprout** |
| User gave `../limb-*` or `../the-sprouts/<slug>/` directly | Match path prefix |

If ambiguous, ask before proceeding.

---

## Cut a limb

A live limb is wired into the trunk in these places:

| Location | What to remove |
|----------|----------------|
| `../limb-<slug>/` | The entire limb repo (code + `the-conversation/`). |
| `apps.json` | The app object whose `limbPath` is `limbs/limb-<slug>`. |
| `.cursor/skills/sprout-skills/sprout-to-limb/scaffold-the-conversation.mjs` | The limb dir name in the `LIMB_DIRS` array. |
| `../the-sprouts/<slug>/` | Only if a leftover sprout exists for this limb. |

### Limb workflow

1. **Resolve the limb.** Find the `apps.json` entry by `appName` or `limbPath`; confirm `limbs/limb-<slug>/` exists.
2. **Ask for the resolution.** Optional one-line why; default `N/A`.
3. **Confirm with the user.** State what will be deleted and that it cannot be undone. Wait for yes.
4. **Capture last live commit.** `git rev-parse --short HEAD` before deleting.
5. **Delete** `limbs/limb-<slug>/`.
6. **Remove** the `apps.json` entry (valid JSON, no trailing commas).
7. **Update** `LIMB_DIRS` in `scaffold-the-conversation.mjs`.
8. **Clean sprout leftovers** if `sprouts/<slug>/` exists — delete folder and remove row from `sprouts/README.md`.
9. **Append** one row to **`deadLimbs.md`** (create with header below if missing; never overwrite existing rows).
10. **Verify** no dangling references to `limb-<slug>` or the app name (except this skill, `deadLimbs.md`, git history).

### `deadLimbs.md` format

```markdown
# Dead Limbs

Limbs that have been cut (retired and deleted). One row per cut, newest at the bottom.

The **Last live commit** is the commit immediately before the cut — the code still exists there. To revisit it:
`git checkout <commit> -- limbs/<slug>` (or browse with `git show <commit>:limbs/<slug>/...`).

| Date | App name | Slug | Last live commit | Resolution |
|------|----------|------|------------------|------------|
| YYYY-MM-DD | App name | limb-<slug> | <short hash> | <resolution or N/A> |
```

Dates in **AEST**, labeled `AEST`.

---

## Cut a sprout

A pre-limb sprout is wired into the trunk in these places:

| Location | What to remove |
|----------|----------------|
| `sprouts/<slug>/` | The entire sprout folder (`brief.md`, `manifest.yaml`, optional lanes). |
| `apps.json` | The app object whose `description` is `sprouts/<slug>/brief.md`. |
| `sprouts/README.md` | The table row for this slug / app name. |

Sprouts do **not** appear in `LIMB_DIRS` unless already promoted — if promoted, use **Cut a limb** instead.

### Sprout workflow

1. **Resolve the sprout.** Find `apps.json` entry or `sprouts/<slug>/manifest.yaml`; confirm `sprouts/<slug>/` exists and is pre-limb (`lifecycle: new`, no active `limbPath`).
2. **Ask for the resolution.** Optional one-line why; default `N/A`.
3. **Confirm with the user.** State what will be deleted. Wait for yes.
4. **Capture last live commit.** `git rev-parse --short HEAD` before deleting.
5. **Delete** `sprouts/<slug>/`.
6. **Remove** the `apps.json` entry.
7. **Remove** the row from `sprouts/README.md`.
8. **Append** one row to **`deadSprouts.md`** (create with header below if missing; never overwrite existing rows).
9. **Verify** no dangling references to the slug or app name (except this skill, `deadSprouts.md`, git history).

### `deadSprouts.md` format

```markdown
# Dead Sprouts

Pre-limb ideas that have been cut (retired and deleted). One row per cut, newest at the bottom.

The **Last live commit** is the commit immediately before the cut — the folder still exists there. To revisit it:
`git checkout <commit> -- sprouts/<slug>` (or browse with `git show <commit>:sprouts/<slug>/...`).

| Date | App name | Slug | Last live commit | Resolution |
|------|----------|------|------------------|------------|
| YYYY-MM-DD | App name | <slug> | <short hash> | <resolution or N/A> |
```

Dates in **AEST**, labeled `AEST`.

---

## Output expectations

- Report what was cut (app name + slug + kind: limb or sprout) and the resolution logged.
- List every file/folder deleted.
- List every trunk file edited (`apps.json`, scaffold script, graveyard file, `sprouts/README.md`).
- Confirm the dangling-reference search came back clean.
