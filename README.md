# mehtapratik.com

Pratik Mehta's personal portfolio, built on the **One System** brand. Brand, social, content, UI/UX, motion, and performance presented as one connected practice.

## Stack

- **Astro 7** (TypeScript)
- **Cloudflare Workers** for page serving, via `@astrojs/cloudflare`
- **Cloudflare R2** for media and fonts only, served from `cdn.mehtapratik.com`. Page source lives in this repo; that line stays clean.

## Getting started

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build (validates content collections)
npm run preview  # preview the build
npm run check    # astro check (types + content)
```

## Project structure

```
src/
  content/
    work/          # case studies (one .md per project; typed by content.config.ts)
    journal/       # journal posts (empty until launch)
  content.config.ts# zod schemas + the build guardrail
  pages/           # routes: home, /work, /work/[slug], /about, /resume, /brand, /journal, /contact
  components/      # shared pieces (WorkIndex, Scoreboard, ProofBox, OutputGrid, ...)
  layouts/Base.astro# site chrome: rail, footer, theme toggle, fonts
  styles/
    tokens.css     # design tokens (mirrors the brand kit) + Berkeley Mono @font-face
    global.css     # reset, shared primitives, site chrome
public/
  placeholders/    # themed dark/light placeholder images, used until real media lands on R2
```

## Adding a case study

Drop a markdown file in `src/content/work/`. The frontmatter is typed and validated by `src/content.config.ts`; the build fails if an entry is missing required fields (every entry needs at least one proof figure). The same template renders both client and concept work. Client proof is a verified metric; concept proof is scope only, never performance results.

## Design system

Tokens live in `src/styles/tokens.css` and mirror the brand kit (warm neutral ramp, single signal-orange accent reserved for real results, Clash Display / Clash Grotesk / Berkeley Mono). Dark and light themes are both first-class via a no-flash `data-theme` script.

## Deploy

Builds and deploys go to the **staging** Worker / `*.workers.dev` URL only. The live domain (`mehtapratik.com`) is still served by the previous site; the cutover from old to new is a **manual step** taken in the Cloudflare dashboard once the new site is proven. It is never part of a build task.

## Operating contract

`CLAUDE.md` is the source of truth for stack, deploy safety, content rules, voice, and design tokens. Read it before any work. Source-of-truth docs (System Master, Resume Master, Brand Visual Reference, IA Master) govern positioning, facts, and structure.
