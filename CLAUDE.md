# Claude Code & Antigravity Standing Rules

These rules apply to every session for the Ansh Rajput single-page portfolio & Payload CMS project.

## 1. Execution & Workflow
- Build strictly in the phases outlined in Section 13 of `REQUIREMENTS.md`.
- After each phase: run it, test it, report with status tags, commit with git, then continue.
- Status reporting format:
  - **IMPLEMENTED**: Works and thoroughly tested.
  - **PLACEHOLDER**: Built and waiting for content/credentials.
  - **PLANNED**: Not yet built.
- Never claim something works if it has not been verified/run.

## 2. Hard Boundaries & Safety
- **No DNS / Paid Accounts**: Never touch DNS, GoDaddy, domains, or create paid accounts/services. Provide numbered steps for secrets or accounts when needed.
- **Secrets**: Store secrets only in `.env` (git-ignored) with a committed `.env.example`.
- **Honest Content**: Never invent numbers, testimonials, quotes, likes, comments, followers, clients, or users. Missing facts become visible `[confirm: …]` placeholders in the CMS, never on the public site.
- **Single Page Architecture**: The public portfolio is strictly a single page at `/`. Do NOT add multi-page routes for projects. Project stories open in a full-screen sheet with shareable hash (e.g., `/#raja-nursery`).
- **CMS Controlled**: Everything visible (text, images, order, toggles) must come from the CMS, not hard-coded in React/HTML.
- **Code Clarity**: Keep code simple, modular, and readable so Ansh can explain every line in an interview.

## 3. Tech Stack & Decisions
- **Framework**: Next.js (App Router, TypeScript)
- **CMS**: Payload CMS 3 inside the same Next.js app, admin at `/admin`
- **Database**: Postgres on Neon (or local Postgres dev) via `@payloadcms/db-postgres`
- **Media**: Cloudflare R2 via `@payloadcms/storage-s3` (local media fallback during dev)
- **Styling**: Tailwind CSS + CSS variables for design tokens (HeyGrowin palette)
- **Typeface**: IBM Plex Sans (self-hosted with `next/font`)
- **Hero**: Pixel-perfect CMS-driven recreation of `reference/hero-prototype.html`
- **Localization**: CMS prepared for `en` (default) and `it` (second)
