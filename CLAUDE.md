# CLAUDE.md (mehtapratik-site)

Code and deploy mechanics for the live site at mehtapratik.com. This file is committed so it travels with the repo and is read by the Code tab and terminal Claude Code. For voice, copy, metrics, structure, and project context, defer to the parent `../CLAUDE.md` and the masters beside it (`Copy-Master.md`, `METRICS-master.md`, `Pratik-Mehta-About-Me.md`). When site mechanics change, update this file.

## What this is

Hand-authored static HTML/CSS/JS, no build step. Cloudflare Pages auto-deploys on push to `PratikM96/mehtapratik-site`; domain mehtapratik.com.

## Deploy

Pratik commits and pushes via GitHub Desktop; Cloudflare rebuilds automatically. Claude edits files in-folder; Pratik does the commit and push. Never publish straight to live without an in-folder pass first.

## Pages

Top-level pages live at the repo root: `index.html`, `about.html`, `work.html`, `blog.html`, `brand.html`, `contact.html`, `privacy.html`, `resume.html`, `reel.html`, `404.html`. Case studies are in `work/`, blog posts in `blog/`. For the current set, list the folder or read `work.html` / `blog.html`; do not trust a hardcoded list. `reel.html` exists but is unlinked from the nav until the reel ships; do not re-add the Reel nav link until Pratik confirms.

## Nav and footer are single-source (site.js)

`assets/site.js` injects nav and footer. Pages opt in with an empty `<nav id="site-nav"></nav>` and a `<footer data-foot="..."></footer>` mount. To change a site-wide link, edit `buildNav` / `buildFooter` in `site.js`, never the pages.

Footer types: `cta` (general pages, Let's work together), `work` (all case studies; auto-fills a random next project into `.js-next-project`), `blog` (posts; random next post, excluding the current page), `bare` (contact / 404 / privacy, credit row only). The only bespoke page is `resume.html` (custom light layout, no nav, no mounts). All 12 case studies in `work/`, including the former concept pages `cloud9-the-ninth`, `level`, and `wisp`, use the standard template with `data-foot="work"`.

## Shared assets and caching

`assets/site.css` and `assets/site.js` are not content-hashed, so they must never be cached immutable; `_headers` revalidates them every load, and you should hard-refresh after a deploy to see changes. Fonts are self-hosted under `assets/fonts/` (same-origin, because the CDN sends no CORS headers); keep CORS-mode assets same-origin.

## Media lives on the CDN, not in the repo

Images and video are served from `cdn.mehtapratik.com` (Cloudflare R2) and are not committed here; pages reference absolute CDN URLs. New web media goes to R2. The offline mirror is `../cdn-mirror/`, outside this repo; never commit media into the repo.

- Content images use `srcset` with `-480` / `-960` / `-1600` webp variants plus matching `sizes`; new images need the same treatment.
- Hero textures: every page except `resume.html` runs an inline `hero-cover-preload` snippet in `<head>` that picks a random image from a hardcoded list at `cdn.mehtapratik.com/textures/` and skips on mobile. Keep that list in sync with the CDN folder.
- OG share cards live at `cdn.mehtapratik.com/og/`, one per page; `og:image` and `twitter:image` point there.

## New page checklist

1. Copy the `<head>` and nav from a sibling page exactly: GA4 tag (`G-G5ZSN5RXX0`), viewport, unique `<title>` and `<meta name="description">`, OG tags (`og:image` is a CDN URL), `twitter:card`, and the stylesheet link (`../assets/site.css` in `work/` and `blog/`, `assets/site.css` at root). Root pages also carry the favicon and manifest block and the canonical link.
2. Add the entry to its index (`work.html` or `blog.html`) so it is linked, not orphaned.
3. Bump the relevant `lastmod` in `sitemap.xml` (hand-maintained, no build step). Head-only or asset-only edits do not need a bump.

## Routing and headers

`_redirects` and `_headers` are Cloudflare Pages config at the repo root. The `/concepts/*` bare paths 302 to the matching `/work/...` case studies. `_headers` long-caches static media, revalidates CSS / JS / HTML every load, and sets basic security headers.

## Absolute rules

- Never use em-dashes, in any file, including copy, code comments, and metadata.
- Never fabricate metrics, titles, or credentials. Source numbers from `../METRICS-master.md`; when figures conflict, the live site wins.
- Verify before prescribing: read the actual files, do not answer from memory of how the site should look or be built.
