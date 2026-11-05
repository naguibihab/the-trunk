# The Trunk

![The Tree dashboard](docs/pm-dashboard.jpg)

## What it is

The PM index and shared skills for The Tree. This repo is the trunk: `apps.json`, the dashboard, and `.cursor/skills/`. App source does not live here.

Ideas sit in the sibling repo `the-sprouts`. Shipping apps sit in sibling `limb-*` repos. Sites sit in `the-saplings`.

Each app is one row: sprout, growing, or fruitful. The TLDR is the focus. Build, marketing, and revenue are the notes for that row.

```bash
node dashboard/server.mjs
```

Open http://localhost:4173. The picture above is that board with the sample rows. Trail Log and Soup Club use invented figures.

## Who's it for

Someone with more than one app, who wants one board for what each one needs next, and agent skills that already know this garden.

Take the skills into your own trunk. Leave your apps, sprout briefs, live metrics, and scratch notes (`dashboard/pm-dashboard-row-todos.json`) out of a public copy. See [contribute.md](contribute.md).

## Skills structure

Each skill is a folder with a `SKILL.md` under `.cursor/skills/`.

```text
.cursor/skills
├── trunk-skills                         
│   ├── gardener-ranking                
│   └── conversation-tldr-sync          
├── sprout-skills                        
│   ├── new-sprout
│   ├── sprout-prototype
│   ├── find-competition
│   ├── sprout-competition-analysis
│   ├── sprout-to-limb
│   └── cut-limb-or-sprout
├── build-skills                         
│   ├── code-to-user-stories
│   ├── upload-to-testflight
│   ├── sentry-healthcheck
│   └── guide-otp
├── marketing-skills                     
│   ├── marketing-interactive-workflow  
│   ├── calculate-market-size
│   ├── track-retention-and-acquisition-revenuecat
│   ├── aso-workflow                    
│   ├── reddit-workflow                 
│   ├── facebook-workflow               
│   ├── tiktok-workflow                 
│   ├── outreach-workflow               
│   └── product-hunt-workflow           
└── revenue-skills                      
    ├── revenue-health-revenuecat
    └── conversion-rate-revenuecat
```

Build skills are the set you copy into a limb when that app needs them. A limb keeps its own skills in that repo.
