---
name: conversation-tldr-sync
description: >-
  Reads a limb's the-conversation/ folder (brief, build, marketing, revenue),
  writes a Markdown focus summary into trunk apps.json for that app (creating the
  field if missing), and reports the app's health, open to-dos, and a
  recommended next action. Use when the user asks to "update the TLDR", "sync
  TLDRs", "refresh the dashboard TLDR", asks how an app is doing / what to do
  next, or wants the apps.json / PM dashboard TLDR column populated from a limb's
  conversation notes. Can run for one named app or sweep every limb.
---

# Conversation TLDR sync

Read an app's `the-conversation/` notes, then do two things:

1. **Write** a current **Markdown focus summary** into trunk **`apps.json`** so
   the PM dashboard TLDR column shows it (that column renders Markdown).
2. **Report back** to the user the app's **health**, **open to-dos**, and a
   **recommended next action** — derived from the same notes.

## The field (always write this to apps.json)

There is **one** field: **`tldr`** (a string holding **Markdown**). On
**every run**, overwrite it. Create it if the app object doesn't have it. **Do
not add any other fields** (no `focusHealth`, `focusTodos`, etc.) — everything
goes inside `tldr`.

Pack the whole focus summary into that single Markdown string, in this order:
**status/health**, **top to-dos**, **next action**, and a **generated date**.

- **Do NOT describe what the app is/does** — the reader already knows the app.
  Don't waste space on positioning like "Pay-once personal CRM". Lead straight
  with the health/status.
- It's a JSON string, so write Markdown with escaped newlines (`\n`). Use
  headings/bold/lists, e.g. `**🔴 At risk**`, a `**Health**` bullet list, a
  `**Top to-dos**` numbered list, and a `**Next:**` line.
- **End with a generated date** as the last line, wrapped in `<small>` so the
  dashboard shows it in small, muted font:
  `<small>Generated YYYY-MM-DD</small>` (use today's date).

The dashboard TLDR column reads **`tldr`** (legacy fallback `focusTldr`) and
renders it as Markdown:

```js
const raw = app?.tldr ?? app?.focusTldr; // dashboard/index.html tldrSummaryCell (marked.parse)
```

`tldr` is canonical — write to `tldr`, not `focusTldr`.

## Scope

- **One named app**: resolve the limb from `apps.json` by matching `appName` or
  `limbPath` (`limbs/limb-<slug>`), then update only that app's `tldr`.
- **Sweep all limbs**: when the user asks for every limb, iterate over each
  `apps.json` entry that has a `limbPath` (skip sprout-only entries without a
  limb folder unless asked).

If the user didn't say which app and didn't ask for a full sweep, **ask** before
running.

## Workflow

For each target app:

1. **Locate the limb.** Read `limbPath` from `apps.json`. Its notes live in
   `<limbPath>/the-conversation/`.
2. **Read the conversation.** Pull what exists; folders vary per limb:
   - `brief.md` — what the app is, positioning.
   - `build/` — `status.md`, `openIssues.md`, `knownIssues.md`, `userStories.md`,
     `sentryHealth.md`.
   - `marketing/` — `asoHealth.md`, `asoIssues.md`, acquisition/retention,
     launch to-dos.
   - `revenue/` — `revenueHealth.md`.
   - Any other top-level files (e.g. `liveListing.md`, `readme.md`).
   Skip empty files and `.gitkeep` placeholders.
3. **Assess health.** From the notes, judge each lane and the app overall as
   **🟢 healthy / 🟡 watch / 🔴 at risk** with a one-line reason:
   - **Build** — open/known issues, failing E2E, Sentry trend, release status.
   - **Marketing** — ASO score/issues, ratings, acquisition/retention signals.
   - **Revenue** — MRR/trials/churn if present.
   Use only what the files say; mark a lane **unknown** if its notes are empty.
4. **Collect open to-dos.** Pull unchecked items (`- [ ]`) and explicit "next
   step"/blocker callouts across the conversation files. Keep the highest-impact
   few per lane; note where each came from.
5. **Recommend the next action.** Pick the single most important thing to do
   next (usually the top blocker or the highest-leverage to-do), and say why in
   one line.
6. **Compose the `tldr` Markdown.** Pack health + top to-dos + next action
   into one Markdown string (order: status/health, top to-dos, next action).
   **Skip any description of what the app does.** Use only what the notes say.
   Example shape (newlines escaped as `\n` in the JSON string):

   ```markdown
   **🔴 At risk**

   **Health**
   - Build: at-risk — <reason>
   - Marketing: watch — <reason>
   - Revenue: unknown — <reason>

   **Top to-dos**
   1. <highest-impact item>
   2. <next item>

   **Next:** <single most important thing> — <one-line why>

   <small>Generated YYYY-MM-DD</small>
   ```
7. **Write `tldr`** for that app in `apps.json` — **every run**, overwrite
   the previous value, create the key if absent. Touch only `tldr`;
   preserve all other fields and key order. Do not add other `focus*` fields.
8. Keep `apps.json` valid JSON (2-space indent, trailing newline).

## Rules

1. **Do not invent facts or numbers** — only summarize what the conversation
   files actually say. If the folder is empty/placeholder, set a short honest
   summary (e.g. `**Early stage** — no PM notes yet.`) or leave `tldr` as
   `""` and say so.
2. **Only edit `apps.json`** — never modify the limb's conversation files.
3. When sweeping, update each app's `tldr` independently; don't blank one
   app because another lacks notes.
4. **Never describe what the app does** in `tldr` — lead with status.
5. **Never edit `dashboard/pm-dashboard-row-todos.json`** — row values are the
   user's free text; only update `apps.json` `tldr`. See
   `.cursor/rules/pm-dashboard-row-todos.mdc`.

## Output

For each app, report in chat using this template:

```markdown
## <App name>

**tldr (Markdown) written to apps.json** _(created | updated)_

**Health:** <🟢|🟡|🔴> overall
- Build: <🟢|🟡|🔴|unknown> — <reason>
- Marketing: <🟢|🟡|🔴|unknown> — <reason>
- Revenue: <🟢|🟡|🔴|unknown> — <reason>

**Open to-dos:**
- [ ] <highest-impact item> _(source file)_
- [ ] <next item> _(source file)_

**Recommended next action:** <single most important thing> — <one-line why>
```

Then:

- Note which apps were skipped (no limb / empty notes) and why.
- Confirm the dashboard TLDR column reads `tldr` (so the change is visible).

Keep health/to-dos grounded in the files — do not invent issues, numbers, or
to-dos that the conversation notes don't contain.
