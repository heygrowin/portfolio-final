# Build brief v2 — Ansh Rajput single-page portfolio + admin panel

Paste this whole file into Claude Code in a **new, empty folder** (do not reuse the previous portfolio project).
Before pasting, put `hero-prototype.html` (the approved hero prototype) inside a folder called `reference/` in the project root.

---

## 0. How you (Claude Code) must work

- First save this brief as `REQUIREMENTS.md` and create a short `CLAUDE.md` with the standing rules from this section, so they load every session.
- Build in the phases of Section 13. After each phase: run it, test it, report, commit, then continue.
- **Environment check first:** run `node -v`, `npm -v`, `git --version`. Node 20.9+ is required. If missing or too old, STOP and tell me exactly how to install it on macOS (Apple Silicon). Never install system software yourself.
- Report every feature as **IMPLEMENTED** (works, tested) / **PLACEHOLDER** (built, waiting for my content) / **PLANNED** (not built). Never claim something works if you have not run it.
- **Never** touch DNS, GoDaddy, domains, or create paid accounts or paid services. When an account or secret is needed, stop and give me numbered steps; I'll do it and hand you the values.
- Secrets only in `.env` (git-ignored) with a committed `.env.example`.
- **Never invent content:** no fake numbers, testimonials, quotes, likes, comments, followers, clients or users. Use only Section 12. Missing facts become visible `[confirm: …]` placeholders in the CMS, never on the public site.
- Keep code simple and readable. I must be able to explain it in an interview.
- The previous version of this site was rejected for being a generic multi-page portfolio. **This is a single page.** Do not add routes for projects.

---

## 1. What we are building

A **single-page, mobile-first** personal portfolio at **https://portfolio.heygrow.in**, with a full **admin panel** at `/admin` where I can change every word, image, project, section order and setting **without touching code again**.

**Who it's for (one page serves all three):**
1. Recruiters for data / software / AI internships in Europe — they scan for 2–5 minutes, want the result first.
2. Small-business owners (HeyGrowin clients) — want proof I solve real problems and stay to support them.
3. Founders and collaborators — want proof I build, measure and change course.

**The core idea:** I don't just make websites — I build the systems small businesses run on, and they keep running. The page proves this through real client stories told so that a 15-year-old and a 70-year-old feel the same thing.

**Rules of taste:** few things, each excellent ("gold, not clothes"). Stories over links. No skill-percentage bars, no "passionate developer" lines, no grid of 15 identical cards, no heavy 3D, no custom cursor.

---

## 2. Hard constraints

- **Mobile first.** Design and build at 375 px first, then 768 and 1280. Thumb-reachable actions.
- **One page.** Everything lives at `/`. Project stories open in a full-screen sheet on the same page with a shareable hash (e.g. `/#raja-nursery`). Opening that URL directly must open the sheet.
- **Everything editable from the admin.** Any visible text, image or setting must come from the CMS, not code.
- **Free to run.** Free tiers only.
- **Fast.** Lighthouse mobile ≥ 90 for Performance, Accessibility, Best Practices, SEO. Hero must render without waiting for any video or large image.
- **Accessible.** Keyboard navigation, visible focus, focus trapped inside the open sheet and returned on close, `Esc` closes the sheet, alt text required, WCAG AA contrast, full `prefers-reduced-motion` support.
- **Italian later with no code.** Enable CMS localisation now: `en` default, `it` second; all text fields localised.
- **Honest by design.** Project status labels; automatic "Concept visual" label on AI-generated images; client names hidden until I tick permission.

---

## 3. Stack (decided — ask before changing anything)

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| CMS + admin | Payload CMS 3 inside the same Next.js app, admin at `/admin` |
| Database | Postgres on **Neon** (free) via `@payloadcms/db-postgres` |
| Media | **Cloudflare R2** via `@payloadcms/storage-s3` |
| Styling | Tailwind CSS + CSS variables for design tokens |
| Motion | CSS transitions and CSS scroll-driven animations first; tiny JS only where needed (hero sequence, sheet gestures). No heavy animation libraries unless you ask me first. |
| Hosting | **Vercel Hobby** (free). Payload needs a Node server, so not Cloudflare Pages. |
| Contact form | Payload form-builder plugin (stored in admin). Email notification via Brevo SMTP only if I give credentials. |
| Analytics | Vercel Web Analytics (cookieless), toggle in admin |

Start from the official Payload 3 + Next.js template (`npx create-payload-app`, Postgres). Pin exact dependency versions.

---

## 4. The page, top to bottom

The home page is built from **CMS blocks**. In the admin I can **reorder, hide, duplicate and edit** every block. Each block has: `visible`, `anchorId`, `audiences` (hire / client / build).

### 4.1 Hero — "My systems, talking" (the signature moment)

**Recreate the behaviour and look of `reference/hero-prototype.html` exactly**, then make it CMS-driven. Summary:
- Full-screen dark "phone lockscreen at night": deep teal-to-navy gradient, a status bar with the real **Messina time** (Europe/Rome), big lockscreen clock with date and "Messina".
- Notification cards from my systems arrive one by one — slow at first, then accelerating — each with an app icon tile, app name, "now", a bold title and one line of text. The newest card is on top; older ones compress into an iOS-style stack behind.
- At the peak, the cards fly up into the clock and **the clock becomes my name** with the tagline.
- What remains: one stacked group card "*N* updates from systems I built" with a pulsing green dot. Tapping it expands a readable list of all updates.
- Two buttons: **See my work** (scrolls to Work) and **Message me on WhatsApp**.
- Honest note under the buttons: "These are the kinds of updates my clients' systems send every day." plus a **Replay** link.
- **Skip** button during the sequence. Reduced motion → show the final state immediately.
- The sequence plays fully on the first visit only; on return visits (sessionStorage/localStorage flag, try/catch-guarded) jump to the final state with Replay available.
- **CMS fields:** name, tagline, honest note, button labels and links, timezone and city label, and an ordered **notifications list**: app (relation to a NotificationApp with name, icon choice, tile colour from a fixed palette), title, body. Timing settings: start interval, acceleration, minimum interval.

### 4.2 Night to day

As the visitor scrolls past the hero, the page transitions from the night colours into the light HeyGrowin page (CSS scroll-driven animation on the hero's bottom edge / background). This is the only scroll-linked effect on the page. Keep it subtle on mobile.

### 4.3 Three facts

Three short, true statements I can edit, shown plainly and confidently — not as a generic stats band with gradient accents. Seed:
- 4 businesses run on systems I built
- 2+ years — my longest-running system, still in daily use
- 300+ Google search queries my pages appear for

Each fact has an optional `source note` field visible to me in the admin only.

### 4.4 Work — projects as posts

A vertical feed of project cards. **Each card is styled like the kind of post that fits the project's world**, restyled in the HeyGrowin palette and fonts, with **no real platform logos** and **no likes, comments, follower or view counts**:

| `postStyle` value | Looks like |
|---|---|
| `photo-post` | Instagram-style photo post: avatar row, square image, short caption |
| `team-message` | Slack-style message: avatar, bold name, time, message with an attached preview image |
| `pro-post` | LinkedIn-style post: avatar, name + one-line headline, short text, attached image |
| `thread` | X/Twitter-style thread: 2–3 short connected posts with a thread line |
| `chat` | WhatsApp-style chat: one or two message bubbles, optional image |
| `commit` | GitHub-style commit card: dark card, commit message, "tests passing" badge, small code snippet |

Every card shows the project **status pill** (see 6.1) and is a single large tap target. Tapping opens the **Story sheet**. Cards appear in the order I set. Tier `flagship` projects come first; a "More work" toggle at the end reveals `supporting` projects.

### 4.5 Story sheet (opens over the page)

A full-screen sheet that slides up (on desktop: a centred panel, max 760 px). Grab handle; swipe down or `Esc` or a close button to close; scroll position on the page is preserved. URL hash updates while open.

Order inside the sheet — **result first, then the story**:
1. **Hero image** of the real result (screenshot or photo), with "Concept visual" label if `isConcept`.
2. **At a glance** row: Role · Duration · Stack · Result (one short line each). Recruiters read this; everyone else reads on.
3. **The story — five chapters**, each optional and hidden if empty:
   - *The person* — who they are, in human words.
   - *The struggle* — what was hurting.
   - *What I built* — in plain words, with an image gallery.
   - *The moment it changed* — the turning point.
   - *Today* — what is still running, plus an optional **customer quote** (shown only if `quotePermission` is ticked; name and optional photo).
4. **Trade-offs I made** — 1–3 short points (optional).
5. **Links** — only if I add them. Links are optional on purpose.
6. **Next story** button to move to the next project without closing.

### 4.6 Growth timeline

A vertical timeline (it is a real sequence, so year markers are appropriate). Editable items: year, title, one line. Seed in Section 12.

### 4.7 "What I can do for you" — audience tabs

Three tabs: **Hire me** / **Your business** / **Build together**. Each tab: heading, two or three lines, one button (label + link). Selecting a tab also sets `?for=hire|client|build`, and the page reorders the following blocks by their `audiences` tags (server-side, works without JavaScript). The Contact block's heading changes with the tab.

### 4.8 Cinema (optional block)

A dark strip with a muted, looping, `playsinline` video (lazy-loaded only near the viewport, poster image first, poster only under reduced motion or Save-Data), film title, credit line, and a "Watch the film" button to an external URL. Hidden by default until I upload the video.

### 4.9 Achievements

Small, tidy list (not tags-cloud). Editable: title, detail, year.

### 4.10 Contact

Heading and text per audience (hire / client / build / default). Large, thumb-sized buttons: WhatsApp, Email, Download CV (modern PDF) and a smaller "Europass version" link (both PDFs uploaded in admin). Optional short form (name, email, message; audience auto-filled).

### 4.11 Floating bottom navigation

A small floating pill bar on mobile with 3 items: Work · About · Contact (labels and targets editable). Hidden while the hero sequence is playing and while a sheet is open. On desktop it becomes a slim top bar.

---

## 5. Design system — HeyGrowin brand

**Colours (fixed tokens):**

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | page |
| `--surface` | `#F8FAFC` | sheet backgrounds, alternate blocks |
| `--brand` | `#0F766E` | brand colour, primary buttons and links on light |
| `--accent` | `#10B981` | small accents only: pulse dot, focus ring, primary button on dark |
| `--ink` | `#0F172A` | headings |
| `--text` | `#475569` | body |
| `--muted` | `#64748B` | meta text |
| `--line` | `#E2E8F0` | hairlines |
| `--night-1` / `--night-2` | `#0A2A2A` / `#0F172A` | hero and cinema only |

Light page by default; respect the visitor's dark mode for the light sections (define dark values for every token under `prefers-color-scheme: dark`). Hero and cinema are always dark.

**Type:** IBM Plex Sans (self-hosted with `next/font`), weights 400/500/600/700, matching my CV. Clear type scale; body 17 px on mobile, line length under 70 characters.

**Avoid these generic "AI-made site" tells:**
- fade-and-slide-up on every section; animated hovers on every card
- ALL-CAPS tracked labels above every heading
- one word coloured or italicised inside headlines
- `→` appended to every button label
- identical rounded cards with the same grey shadow everywhere
- gradient washes as decoration
- monospace labels used as decoration

**Motion principle:** one orchestrated moment (the hero). After that, motion only answers the visitor's actions: opening/closing the sheet, expanding the notification group, switching tabs. Plus the single night-to-day scroll transition.

---

## 6. CMS data model (Payload)

### 6.1 Collections

**Projects**
- `title`, `slug` (used as the hash), `oneLiner`
- `status`: `IN USE` / `LIVE` / `RUNNING` / `BUILDING` / `PIVOTED` / `CONCEPT`
- `tier`: `flagship` / `supporting` / `hidden`, `order`
- `audiences`: hire / client / build
- **Post card group:** `postStyle` (Section 4.4), `postAuthorName`, `postAuthorAvatar`, `postHeadline` (for pro-post), `postText` (or array of short posts for `thread`; array of bubbles for `chat`), `postImage`, `postTime` label, `codeSnippet` (for `commit`)
- **Client group:** `clientName`, `clientPermission` (checkbox). If unticked, the site shows `clientDescription` (e.g. "a family plant nursery") instead of the name everywhere.
- **At a glance:** `role`, `duration`, `stack` (tags), `result`
- **Story chapters:** `person`, `struggle`, `built`, `turningPoint`, `today` (rich text each)
- `gallery`: array of `{ image, caption }`
- **Quote:** `quoteText`, `quoteName`, `quotePhoto`, `quotePermission` (checkbox — quote hidden unless ticked)
- `tradeOffs`: array of short text
- `links`: optional array of `{ label, url }`
- Drafts, versions, live preview.

**Media** (→ R2): `alt` (required), `caption`, **`isConcept`** (checkbox; when ticked the site overlays a small "Concept visual" label wherever the image appears; admin help: "Tick for AI-generated or illustrative images that are not real screenshots or photos"). Responsive sizes 480/768/1280/1920, served as WebP/AVIF via `next/image`.

**NotificationApps** — `name`, `icon` (select from a fixed set of simple line icons: leaf, box, cap, page, tag, send, shield, camera, cart, chart), `tileColor` (select from a fixed brand-safe list).

**TimelineItems** — `year`, `title`, `line`, `order`.

**Achievements** — `title`, `detail`, `year`, `order`.

**Users** — single admin, no public sign-up.

### 6.2 Globals

**Home** — the `layout` blocks field (Section 4), plus the hero's notifications list and timings.
**SiteSettings** — name, role line, location, email, WhatsApp number, LinkedIn, GitHub, Instagram, business site URL, `cvModern` (PDF), `cvEuropass` (PDF), SEO defaults, OG image, favicon, analytics toggle.
**Navigation** — bottom-bar items.

### 6.3 Admin experience

- Live preview (mobile and desktop widths) for Home and Projects.
- Drafts, scheduled publishing, version history with restore.
- Drag-and-drop ordering for blocks, projects, notifications, timeline.
- Help text on every field a non-developer might hesitate on.
- Publishing revalidates the page instantly (`afterChange` → `revalidatePath('/')`). No redeploys for content.
- Admin branded with the HeyGrowin emerald.
- Write `ADMIN_GUIDE.md`: add a project in 2 minutes; choose a post style; write a story; hide/reorder sections; edit hero notifications; swap CV PDFs; when to tick `isConcept`, `clientPermission`, `quotePermission`.

---

## 7. SEO and sharing

- Metadata from CMS; canonical `https://portfolio.heygrow.in`.
- When a story hash is shared, the page still has good default OG tags (hash URLs can't change OG); also generate a static OG image per project at `/og/[slug].png` I can link to manually.
- JSON-LD `Person` (name, jobTitle, affiliation University of Messina, sameAs links).
- `sitemap.xml`, `robots.txt`.

---

## 8. Performance budget

- Hero is plain HTML/CSS + < 6 KB of JS for the sequence. No video, no big image in the hero.
- Total JS on first load as small as possible; sheet code and gallery images load on demand.
- Images lazy-loaded below the fold; cinema video only loads near the viewport.
- Test on a throttled mid-range phone profile; LCP < 2.5 s.

---

## 9. Privacy

- Cookieless analytics (no banner needed).
- Footer privacy note: what the contact form stores and how to ask for deletion.
- Never show private numbers (e.g. CRM lead counts) anywhere public.

---

## 10. Testing

- Unit tests for: hero timing and final-state logic, audience reordering, `clientPermission` / `quotePermission` / `isConcept` rendering rules, hash → sheet opening.
- Playwright smoke test at 390×844 and 1280×800: hero completes, Skip works, Replay works, a card opens its sheet, `Esc` closes it, hash URL opens directly, tabs reorder blocks.
- Lighthouse report for `/` (paste scores in your phase report).

---

## 11. Deployment (Phase 7, with me)

Give me numbered steps for: Neon project + connection string; Cloudflare R2 bucket + API token + public URL; Vercel project from GitHub; all env vars; Payload secret; first admin user.
**DNS — I do this myself in GoDaddy:** CNAME `portfolio` → the target Vercel shows (usually `cname.vercel-dns.com`), then add `portfolio.heygrow.in` in the Vercel project. Verify HTTPS and that `/admin` is reachable only over HTTPS.

---

## 12. Seed content (use exactly; mark stories as drafts)

### Identity
- Name: **Ansh Rajput**
- Role line: Founder of HeyGrowin · Data Analysis student, University of Messina
- Tagline: **I build the systems small businesses run on.**
- Location: Messina, Italy
- Email: anshr71t9@outlook.com · WhatsApp: +39 351 493 0310
- LinkedIn: https://in.linkedin.com/in/ansh-rajput-529328428
- GitHub: https://github.com/heygrowin · Business: https://heygrow.in

### Hero notifications (in this order)
| App | Title | Body |
|---|---|---|
| Raja Nursery | New online order | Someone just ordered plants from the website. |
| Ansh Color Lab | Stock updated | Today's sales are already in the inventory. |
| SKOLAR | New student enquiry | A student wants to study in Italy. |
| HeyBlog | Article published | Written, checked and published. Nobody touched it. |
| AnandPic | Homepage updated | The owner changed the festive banner. No code needed. |
| Raja Nursery | Bill generated | Invoice ready at the counter. |
| HeyGrowin Outreach | Follow-up due | A business is waiting for a reply today. |
| SKOLAR | Application moved forward | Documents complete. Next step unlocked. |
| Raja Nursery | Pots logged | Every pot that left today is tracked. |
| RevenueLoop | Spend blocked | No money moves without a human yes. |
| Ansh Color Lab | Stock updated | Evening sales synced. |
| HeyBlog | Duplicate caught | Too close to an older post, so it was skipped. |
| Raja Nursery | New online order | Another order from the website. |
| SKOLAR | New student enquiry | A family is asking about Master's programmes. |

App icons/colours: Raja Nursery leaf #15803D · Ansh Color Lab box #0F766E · SKOLAR cap #1E40AF · HeyBlog page #334155 · AnandPic tag #B45309 · HeyGrowin Outreach send #0E7490 · RevenueLoop shield #475569.
Honest note: "These are the kinds of updates my clients' systems send every day."

### Projects

**1. Raja Nursery** — flagship · `IN USE` · postStyle `photo-post` · audiences client, hire
- Facts: took a plant nursery from no online presence to a full digital setup — a website, social media management that brought in new customers, an upgrade to a working e-commerce store, custom billing software and a pot-tracking system.
- At a glance: Role — designed, built and supports everything · Duration — `[confirm]` · Stack — `[confirm]` · Result — from no website to an online store with its own billing and pot tracking.

**2. Ansh Color Lab** — flagship · `IN USE` · postStyle `team-message` · audiences client, hire
- Facts: built an inventory management system the business has run on for 2+ years, then added further internal systems; same-day support and bug fixes keep the client with us.
- At a glance: Role — built and supports it · Duration — 2+ years in use · Stack — `[confirm]` · Result — daily inventory runs on it.

**3. SKOLAR** — flagship · `LIVE` · postStyle `pro-post` · audiences client, hire
- Facts: study-abroad consultancy helping students reach Bachelor's and Master's programmes in Italy. Launched their website, which now brings them clients, and built the back office behind it: student records and documents, workflow management and application tracking.

**4. HeyBlog** — flagship · `RUNNING` · postStyle `thread` · audiences hire, build · link https://heygrow.in/blog
- Facts: a blog that writes, checks and publishes itself — trending topic → scoring and ranking → local LLM draft (Ollama) → three-model gate (writing, quality, harmful-content check) → duplicate check → publish. Zero manual steps; runs on an 8 GB Mac mini at zero API cost; auto-starts on boot and resumes interrupted runs. Pages appear in Google Search for 300+ queries; clicks stayed low, which taught me impressions are not readers, so I moved my effort to direct client work.
- Trade-off: chose quality gates and zero cost over volume and speed.

**5. AnandPic** — supporting · `LIVE` · postStyle `chat` · audiences client
- Facts: partnered with a new business from launch day; built a website the owner controls end to end — banners, products, categories, festive sales — with no code and no running cost.
- Business type: `[confirm]`.

**6. RevenueLoop** — supporting · `BUILDING` · postStyle `commit` · audiences hire, build
- Facts: an AI agent that cannot spend money on its own. Language models only propose; deterministic code owns money, permissions and risk. Append-only ledger, human approval for any spend, isolated sandbox for untrusted code. 138/138 tests passing on ~2,440 lines of core code. Python, SQLite.

**7. Drop** — supporting · `BUILDING` · postStyle `commit` · audiences hire, build
- Facts: open-source PC↔phone file transfer. Pair once and devices find each other on the local network — no QR codes, no cloud; token-authenticated transfer. Wrote the protocol specification and a Java reference client; 25/25 cross-language tests passing. Android app in progress. Python, Java.

**8. HeyGrowin Outreach Engine** — supporting · `RUNNING` · postStyle `team-message` · audiences client, build
- Facts: the CRM I built and use to find clients — tracks B2B leads, follow-ups and meetings across email, WhatsApp and phone. (Do not show the lead count publicly.)

All projects: `clientPermission` **unticked** until I confirm with each client. Client descriptions to use meanwhile: Raja Nursery → "a family plant nursery"; Ansh Color Lab → "a local photo and colour lab" `[confirm]`; SKOLAR → "a study-abroad consultancy in Italy"; AnandPic → `[confirm]`.

**Story drafting rule:** for each flagship, write a draft of each chapter (person, struggle, built, turning point, today) from the facts above only — 20–50 words per chapter, simple warm language a 15-year-old and a 70-year-old both understand. Where a human detail is missing, write `[confirm: …]` and keep the document as a **draft**. Never invent events, quotes or numbers.

### Timeline
- 2022 — Tech behind the stage: video editing, animation and web work for my school's annual functions (certified 2022 and 2023).
- 2024 — First client system: an inventory system still in use today.
- 2025 — NGO internship: led digital outreach for Samarpit's Girl Rising Project (4 months).
- 2026 — Moved to Messina for a Bachelor's in Data Analysis; HeyGrowin takes on clients in India and Italy.
- Now — Building, studying, and looking for an internship in data, software or applied AI.

### Audience tabs
- **Hire me** — "I ship working systems and I can explain every decision. Looking for an internship in data, software or applied AI." Button: Download my CV.
- **Your business** — "Tell me what's costing you time or money. I'll build the system that fixes it, and I stay to support it." Button: Message me on WhatsApp.
- **Build together** — "Building something? I like hard problems with real users." Button: Email me.

### Cinema
- Title: Crossing the Genesis · Credit: Written and directed by Harshita & Ansh Rajput · Line: An AI-generated sci-fi film made for the Future Vision XPRIZE competition. Video, poster and film URL: PLACEHOLDER; block hidden until uploaded.

### Achievements
- SOF National Cyber Olympiad 2023–24 — Gold Medal of Distinction; International Rank 275, Zonal Rank 24, School Rank 1.
- 2nd place, AI & Robotics competition — Krishna Public School (2025–26).
- 2nd place, Snapshot photography competition — Krishna Public School (2025–26).
- 3rd place, Video Making — "Kalam Within Me" inter-school competition.
- School Cyber In-charge — organised inter-school events including EVOLV 2025.

### Contact headings
- hire: "Looking for an intern who ships? Let's talk."
- client: "Tell me what's costing your business time or money."
- build: "Building something? Let's build it properly."
- default: "Say hello."

---

## 13. Phases and acceptance criteria

1. **Foundation** — environment check; Payload 3 + Next.js + Postgres (ask me: local Postgres or a Neon dev branch); tokens and fonts; all collections and globals; admin login.
   ✅ I can log in and create a Project.
2. **Hero** — recreate `reference/hero-prototype.html` as a CMS-driven component.
   ✅ Side-by-side with the prototype on 390×844 it looks and behaves the same; editing a notification in admin changes the hero after publish.
3. **Page blocks** — facts, work feed with all six post styles, timeline, tabs, cinema, achievements, contact, bottom nav, night-to-day transition.
   ✅ Reordering or hiding a block in admin changes the page with no redeploy.
4. **Story sheet** — open/close, swipe, `Esc`, focus trap, hash deep links, next story, permission and concept rules.
   ✅ `/#raja-nursery` opens the sheet directly; closing returns to the same scroll position.
5. **Polish** — responsive at 375/768/1280, dark-mode light sections, reduced motion, accessibility pass, SEO, OG images.
   ✅ Lighthouse mobile ≥ 90 on all four scores (paste them).
6. **Seed + guide** — idempotent seed script with Section 12 content and draft stories; `ADMIN_GUIDE.md`; tests passing.
   ✅ Fresh database + seed = complete site.
7. **Deploy with me** — Section 11.
   ✅ https://portfolio.heygrow.in is live and editable from `/admin`.

Final report: IMPLEMENTED / PLACEHOLDER / PLANNED list; every env var and where it lives; the three things most likely to break and how to fix them.

---

## 14. Do not

- Do not create extra pages or project routes.
- Do not add features not in this brief without asking.
- Do not use paid APIs, fonts, templates or services.
- Do not show fake engagement, numbers, quotes or testimonials.
- Do not hard-code any visible content.
- Do not touch heygrow.in, its blog, or any DNS settings.
