# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Training and visual content system for the **Tactical Shift** Arma Reforger Discord community. Monorepo with two independent subprojects, each with its own `package.json` and `node_modules`.

All user-facing content is in **Russian**.

## Subprojects

### `animations/` — Remotion Animation Studio

Renders animated military formation diagrams as GIFs/MP4s. Each composition is a React component rendering SVG graphics with frame-based animation.

**Commands** (run from `animations/`):
```bash
npm start                    # Launch Remotion Studio (interactive preview)
npx remotion render src/index.ts <CompositionId> out/file.gif --codec gif
npx remotion render src/index.ts <CompositionId> out/file.gif --codec gif --scale 0.667  # 400x400
```

**Composition IDs:** `File`, `StaggeredColumn`, `Chevron`, `Line`, `ChevronToLine`, `FileToChevronAR`, `FileToChevronARMirrored`

**Architecture:** `src/index.ts` → `Root.tsx` (registers all compositions) → individual composition files. Each composition is self-contained. Transition animations (e.g. `FileToChevronAR.tsx`) interpolate positions between formations using Remotion's `interpolate()` and `Easing`. Speech bubbles can be added via `SpeechBubble` component.

**Conventions:**
- Allied/friendly units use blue (`#5996DC`), enemy/opposing use red (`#E25A55`)
- `UnitMarker` component renders soldier icons with arrow direction, optional bounce animation, and shadow
- Scrolling effects (trees, road dashes) use a tiling strip pattern: two or more copies offset by `STRIP_HEIGHT`, translated by `(frame * scrollSpeed) % STRIP_HEIGHT`
- Duration must be set so all looping animations (scroll, RFL rotation) complete exact whole cycles to avoid jumps on loop
- Rendered GIFs go to `out/High Quality/` (600x600) and `out/Medium Quality/` (400x400 via `--scale 0.667`)

### `training-portal/` — Next.js Training Portal

Web app where players read training manuals and pass certification tests.

**Commands** (run from `training-portal/`):
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm start        # Serve production build
```

**Architecture:** Next.js 16 App Router with Tailwind CSS 4. No database — all content is hardcoded TypeScript.

- `src/data/manuals.ts` — all manual content as markdown strings in `manualRegistry` keyed by ID (intro, rifleman, grenadier, ftl, landnav, convoy, rto)
- `src/data/tests/*.ts` — one test file per manual (intro.ts, rifleman.ts, etc.) with `questions` array and `PASS_THRESHOLD`
- `src/data/tests/index.ts` — test registry mapping IDs to configs
- `src/data/training.ts` — role progression tiers (Basic → Rifleman → Grenadier → FTL → SL → PL) with required Discord roles and manual lists
- `src/data/mock-presets.ts` — simulated user states for dev testing (dropdown in nav)
- `src/lib/parseManual.ts` — markdown-to-HTML parser with custom `marked` renderer (callouts, example blocks, procedure steps, formation cards)
- `src/components/MarkdownManual.tsx` — renders parsed HTML with lightbox for images
- `src/components/RoleCard.tsx` — expandable progression card (locked/available/completed states)
- `src/components/TableOfContents.tsx` — auto-generated sidebar TOC from h2 headings
- Routes: `/manual/[id]` (dynamic manual pages), `/test/[id]` (dynamic test pages), `/results?test=X&a=...` (results)

**Markdown conventions in manuals.ts:**
- `> text` → info callout (grey border), `> ⚠ text` → warning callout (amber), `> 🔴 text` → important callout (red)
- ` ```example ` → styled radio example block, ` ```steps ` → numbered procedure circles
- `:::formation[gif]{name="..."}` with `+ pro` / `- con` lines → formation card with GIF
- `<div class="image-row">` → side-by-side images, `<div class="marker-grid">` → icon grid

**Theme:** Dark neutral palette with red accent. CSS custom properties in `globals.css` via Tailwind `@theme`. Key tokens: `bg-primary` (#0f1114), `bg-card` (#16181d), `text-primary` (#e4e5e8), `text-secondary` (#7e828c), `accent-red` (#E13446). No green — all accents are neutral grey or red.

**Assets:** Formation GIFs in `public/animations/`. Manual images organized by manual in `public/manuals/{manual-id}/`. Logo SVG at `public/logo-icon.svg`.

## Cross-Project Workflow

When a new animation is created or updated in `animations/`, the rendered GIF must be manually copied to `training-portal/public/animations/` to appear on the portal. Formation cards in `manuals.ts` reference GIFs by filename via `:::formation[filename.gif]` syntax.

**Obsidian manuals source:** Training manual source files live in `C:\Users\djdav\Obsidian Vaults\Alex's Vault\Inbox\`. Images are in `...\Attachments\`. When converting to portal, strip `![[]]` embeds and copy images to `public/manuals/`.
