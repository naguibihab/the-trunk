# ASO & App Marketing Skills

AI agent skills for App Store Optimization (ASO) and mobile app marketing. Built for indie developers, app marketers, and growth teams who want **Cursor**, **Claude Code**, or any [Agent Skills](https://agentskills.io)-compatible AI assistant to help with keyword research, metadata optimization, competitor analysis, market intelligence, and app growth.

## Why This Exists

Most ASO knowledge lives in blog posts, courses, and expensive consultants. We packaged it into skills that any AI agent can use — so you get expert-level ASO guidance directly in your IDE.

Each skill contains battle-tested frameworks, scoring rubrics, and output templates. The agent reads the skill, pulls data from the **public App Store**, **App Store Connect**, and your **limb conversation files**, and gives you actionable recommendations — not generic advice.

## Quick Start

**Cursor** — Settings (Cmd+Shift+J) → Rules → Add Rule → Remote Rule (Github) → paste `https://github.com/eronred/aso-skills`

**Claude Code** — `npx skills add eronred/aso-skills`

**Manual** — `git clone https://github.com/eronred/aso-skills.git && cp -r aso-skills/skills/* .cursor/skills/`

Then ask your agent:

```
"Run an ASO audit for my app (id: 1617391485)"
"Find the best keywords for a meditation app"
"Optimize my App Store title and subtitle"
"How many downloads do I need to reach top 10 in Health & Fitness?"
"What apps are rising in the charts right now?"
"Give me a market briefing for the Games category"
"How are my downloads and revenue trending this month?"
"Help me plan a Christmas In-App Event"
"What seasonal keywords should I add in December?"
"Optimize my Google Play listing"
"My app rating dropped — how do I recover it?"
"Set up a weekly competitor monitoring routine for apps X, Y, Z"
"Help me pitch TechCrunch for my app launch"
"Build an Apple Search Ads campaign structure for my fitness app"
"My app has a crash affecting 2% of sessions — help me triage it"
```

Or invoke directly: `/aso-workflow`, `/aso-audit`, `/aso-keyword-research`, `/aso-metadata-optimization`, `/aso-screenshot-optimization`, `/aso-app-icon-optimization`, `/aso-asc-metrics`, `/aso-review-management`, `/aso-rating-prompt-strategy`

## Skills

For the **Indie-PM** monorepo in this workspace, ASO skills live under **`.cursor/skills/marketing-skills/aso-skills/`** (this tree). Other trunk skills: **`new-idea-skills/`** (sprouts), **`code-to-user-stories`** (build-skills), **`revenue-health-revenuecat`** (revenue-skills), copy-on-demand build-skills (TestFlight, Sentry). The PM dashboard is **`dashboard/index.html`** driven by **`apps.json`**.

This is a trimmed set focused on what a small indie portfolio actually needs.
The 6 **core** skills form an end-to-end optimization pass; `aso-workflow`
chains them for a single limb. The rest are kept as standalone tools.

### Orchestrator

| Skill | What it does |
|-------|-------------|
| [`aso-workflow`](aso-workflow) | Runs the 6 core skills in sequence for a limb you name, then writes results into that limb's `the-conversation/marketing/` files |

### Core 6 (the workflow chain)

| Skill | What it does |
|-------|-------------|
| [`aso-app-marketing-context`](aso-app-marketing-context) | Creates a context doc (app, audience, competitors, goals) that all other skills reference — step 1 |
| [`aso-audit`](aso-audit) | Scores your listing across 10 factors (0-100), flags problems, gives a prioritized fix list |
| [`aso-keyword-research`](aso-keyword-research) | Finds keywords by volume × difficulty × relevance, groups them into primary/secondary/long-tail |
| [`aso-metadata-optimization`](aso-metadata-optimization) | Writes title, subtitle, keyword field, description — with 3 variants and character counts |
| [`aso-screenshot-optimization`](aso-screenshot-optimization) | 10-slot screenshot strategy with design briefs, text overlay copy, and competitor audit |
| [`aso-app-icon-optimization`](aso-app-icon-optimization) | Icon design principles, A/B testing, category differentiation, and icon briefs |

### Standalone (ongoing)

| Skill | What it does |
|-------|-------------|
| [`aso-asc-metrics`](aso-asc-metrics) | Analyze App Store Connect data (downloads, revenue, subscriptions, countries) |
| [`aso-review-management`](aso-review-management) | Sentiment analysis, response templates (HEAR framework), rating improvement tactics |
| [`aso-rating-prompt-strategy`](aso-rating-prompt-strategy) | SKStoreReviewRequest / Play In-App Review timing, pre-prompt survey, version-gating, and rating recovery |

## How It Works

```
You: "Run an ASO audit for Headspace"

Agent:
  1. Reads aso-audit/SKILL.md (framework, scoring rubric, output template)
  2. Fetches public listing data (iTunes lookup, App Store page, liveListing.md)
  3. Scores each factor (title: 8/10, subtitle: 6/10, keywords: 4/10...)
  4. Returns: ASO Score Card + Quick Wins + High-Impact Changes + Strategic Recs
```

Skills reference each other — `aso-audit` might suggest running `aso-keyword-research` for deeper analysis, which then feeds into `aso-metadata-optimization` for implementation.

## Installation

### Cursor

| Method | Command |
|--------|---------|
| GitHub Import | Settings → Rules → Add Rule → Remote Rule → `https://github.com/eronred/aso-skills` |
| Project-level | `cp -r aso-skills/skills/* .cursor/skills/` |
| Global | `cp -r aso-skills/skills/* ~/.cursor/skills/` |

### Claude Code

| Method | Command |
|--------|---------|
| CLI | `npx skills add eronred/aso-skills` |
| Specific skills | `npx skills add eronred/aso-skills --skill aso-audit aso-keyword-research` |
| Manual | `cp -r aso-skills/skills/* .claude/skills/` |

### Any Agent

```bash
git submodule add https://github.com/eronred/aso-skills.git .agents/aso-skills
```

Works with any tool that supports the [Agent Skills](https://agentskills.io) standard (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`).

## Data sources

Skills use public App Store data, App Store Connect (web, API, or user paste), and limb files (`liveListing.md`, `app-marketing-context.md`). See [tools/REGISTRY.md](tools/REGISTRY.md) and [tools/integrations/app-store-connect.md](tools/integrations/app-store-connect.md).

## Contributing

PRs welcome — fix an inaccuracy, improve a framework, or add a new skill. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
