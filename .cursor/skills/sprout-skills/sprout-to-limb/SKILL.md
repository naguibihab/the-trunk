---
name: sprout-to-limb
description: Promote a pre-limb portfolio idea into an active Limb repo. Use when the user asks to turn an idea into an app, promote a `../the-sprouts/<slug>/` idea, wire an empty `limb-*` repo, or make a pre-limb idea active.
disable-model-invocation: true
---

# Sprout To Limb

Use this skill to promote an existing pre-limb **`../the-sprouts/<slug>/`** idea into an active **`limb-*`** repo. Start from the trunk repo and an empty Limb repo under **`the-garden/`**.

## Inputs

Collect or infer:

- Portfolio slug or app name.
- Empty Limb repo path, usually **`../limb-<slug>`** unless the user provides another name.
- Desired lifecycle, default **`active`**.

## Workflow

1. Resolve the idea:
   - Read **`apps.json`** and **`../the-sprouts/<slug>/manifest.yaml`**.
   - Confirm **`../the-sprouts/<slug>/`** exists and currently represents a pre-limb idea: **`lifecycle: new`** and **`code_root: null`**.
   - Read **`../the-sprouts/<slug>/brief.md`** and any files under **`requirements/`** for source context.

2. Validate the Limb repo:
   - Confirm the target is under the same **`the-garden/`** parent as trunk and its folder name starts with **`limb-`**.
   - Confirm the repo is empty or only contains git metadata. Stop and ask before writing into a non-empty repo.
   - If the directory does not exist and the user asked you to create it, create a new git repo there first.

3. Seed the Limb repo from the idea:
   - Create **`README.md`** with the app name, a short summary from **`brief.md`**, and a pointer back to **`../the-sprouts/<slug>/`**.
   - Create **`the-conversation/`** with three lane folders — **`build/`**, **`marketing/`**, **`revenue/`** — and a top-level **`liveListing.md`**. Use the same shape as the co-located **`scaffold-the-conversation.mjs`** (run it, or mirror its output).
   - Put working product detail and user stories under **`the-conversation/build/`**, derived from **`brief.md`** and **`requirements/`**.
   - Add limb-local **`.cursor/skills/`** only as needed for that app (do not bulk-copy trunk skills — each limb keeps its own set).

4. Wire Trunk to the Limb:
   - Update **`../the-sprouts/<slug>/manifest.yaml`**:

     ```yaml
     slug: <slug>
     apps_json_app_name: "<App name>"
     lifecycle: active
     code_root: "../limb-<repo-name>"
     conversation_path: "the-conversation/"
     ```

   - Update the matching **`apps.json`** row **`lifecycle`** from **`new`** to **`active`**. Keep **`description`** and PM artifact paths under **`../the-sprouts/<slug>/`**.
   - Update **`sprouts/README.md`** so the app table limb column points to **`../limb-<repo-name>`** instead of **`(pre-limb)`**.

5. Scaffold conversation on the Limb:
   - Run **`node .cursor/skills/sprout-skills/sprout-to-limb/scaffold-the-conversation.mjs ../limb-<repo-name>`** from trunk (or from the limb root with no extra arg). Do not use **`--force`** unless the user asked to overwrite existing conversation files.

6. Verify:
   - Confirm the Limb repo now has **`README.md`** and **`the-conversation/`**.
   - Confirm **`manifest.yaml`** resolves **`code_root`** to the Limb repo.
   - Confirm **`apps.json`** and **`sprouts/README.md`** agree on app name, slug, lifecycle, and limb path.

## Output expectations

- Report the promoted slug, Limb path, and lifecycle.
- List the Trunk files updated.
- List the Limb files created.
- Call out any setup intentionally left blank, such as app framework, package manager, backend, or deployment.

To retire a promoted limb or abandon a sprout, use **`cut-limb-or-sprout`** (inverse of this skill for limbs; inverse of **`new-sprout`** for sprouts).
