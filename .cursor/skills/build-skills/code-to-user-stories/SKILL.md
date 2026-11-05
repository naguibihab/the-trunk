---
name: code-to-user-stories
description: >-
  Derives behavior-accurate user stories from a named app's source code (routing,
  screens, auth, state, permissions, flags, persistence). Groups by epic/journey,
  includes Mermaid flow/sequence diagrams, and surfaces gaps (unread settings,
  hidden routes, flag-gated dead code, permissions not enforced). Use only when
  the user names a specific app and asks for a user-story map, visual roadmap,
  or "how does this app actually work" from code.
---

# User stories from code

Trunk skill under **build-skills**. Produces a **user-story analysis for one app** the user explicitly names. Default delivery is **chat** (Markdown with Mermaid). Do not write files unless the user asks for a specific destination.

## Required input

The user must name **which app** before you start. Accept:

- **`limbPath`** or limb folder (e.g. `limb-people-keeper`, `../limb-people-keeper`)
- **`appName`** from **`apps.json`** (e.g. `People Keeper`)
- A sprout slug only if it maps to a promoted limb via **`apps.json`** **`limbPath`**

If the request is vague ("all apps", "the dashboard apps"), **stop and ask which app**.

Resolve the limb root in the monorepo via **`apps.json`** **`limbPath`**. If there is no **`limbPath`** for that idea (pre-limb only), stop and say this skill needs a promoted limb with code in **`limbs/`**, or ask whether to use **`brief.md`** in chat-only mode from the user's sprout context.

## What to read (code path)

In the resolved limb, read in order:

1. **App shell + routing** — entry, tabs, modals, hidden routes.
2. **Identity / auth** — sign-in/out, session storage, route guards.
3. **State + persistence** — stores, repos, hydration gates.
4. **Per-screen behavior** — handlers, validation, empty/error states.
5. **Permissions + feature flags** — who can do what; flag defaults.
6. **Persistence consumers** — every setting written vs actually read in UI.

If mock and production stacks coexist, document both and when each runs.

## What to deliver

Structure the response as Markdown:

1. **Title + one-liner** — product summary; date; source (`code @ <short SHA>` from `git -C <limb> rev-parse --short HEAD`).
2. **High-level story map** — Mermaid `flowchart LR` (split if more than ~8 lanes).
3. **Stories by epic** — **As a [persona], I can …**; cite route/file only when it helps; mark **(auth-gated)**, **(owner only)**, **(flag: …)**.
4. **Key flows** — Mermaid `sequenceDiagram` for sign-in and other non-obvious flows (one diagram per flow).
5. **Gaps & anomalies** — table: persisted-but-unread, route without entry, flag-gated dead code, permission not enforced, placeholder screen; cite files.
6. **Mental model** (optional, ≤3 short paragraphs) — only if it clarifies architecture.
7. **File map** (optional) — primary source files for shell, auth, state, key screens.

## Diagram conventions

- Mermaid in fenced blocks; label edges with user actions.
- Prefer scannable diagrams over one giant graph.

## Quality bar

- Every story is **falsifiable** against source.
- Prefer concrete UI nouns from the app.
- Gap claims need evidence (writer without reader, route without entry, etc.).
- Do not invent flows not in code.

## Anti-patterns

- Running without a named app.
- Inventing sharing/sync/permissions without reading flags and guards.
- Claiming settings affect UI when only the settings slice updates.
- Bulk-processing every limb unless the user explicitly lists them one by one.
