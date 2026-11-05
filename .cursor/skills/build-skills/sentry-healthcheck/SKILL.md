---
name: sentry-healthcheck
description: >-
  Reviews app stability via Sentry for one named app: new/regressed issues,
  recurring fingerprints, error trends, and a concise quality narrative. When
  persisting to the repo, updates that limb's the-conversation/build/sentryHealth.md.
  Copy this skill into a limb's .cursor/skills/ when needed. Use when the user
  asks for Sentry, crashes, stability, error trends, production issues, or app
  quality for a specific app—not for subscription/revenue (see
  revenue-health-revenuecat).
---

# Sentry health check

Evaluate **quality and stability** with Sentry for **one app the user names**. For **subscriptions and revenue**, use **`revenue-health-revenuecat`** (trunk `.cursor/skills/revenue-skills/revenue-health-revenuecat/SKILL.md`).

## Required input

The user must identify **which app** (e.g. `People Keeper`, `limb-people-keeper`, or `people-keeper`). If they do not, **stop and ask**—do not guess or run across every limb.

Resolve the limb from trunk **`apps.json`**:

- Match **`appName`** or **`limbPath`** (`../limb-<slug>`).
- Limb source code and PM notes live under that **`limbPath`** (sibling repo).

## Sentry workflow

For the named app:

- Summarize new or regressed issues.
- Identify top recurring fingerprints.
- State whether quality is improving, stable, or degrading.

If Sentry is not connected for that project, say so explicitly. Free-tier retention is a **recent** signal only.

## Persisting (when the user wants repo updates)

Write or refresh **`the-conversation/build/sentryHealth.md`** inside the resolved limb. Use Markdown only—headings, bullets, **`Data as-of: YYYY-MM-DD`**, factual metrics from Sentry MCP or pasted exports.

Rules:

1. **Do not invent numbers.**
2. **Do not** edit other limbs or unrelated PM files unless the user asks.
3. Optionally add a one-line stability note to trunk **`apps.json`** **`tldr`** for that app only when the snapshot materially changes and the user wants the dashboard summary updated.

## Output

Return in chat:

- Per-app Sentry summary and one-line quality health.
- Missing integrations if any.
- Prioritized next actions tied to Sentry signals.
- Whether **`sentryHealth.md`** was updated, when you wrote to disk.
