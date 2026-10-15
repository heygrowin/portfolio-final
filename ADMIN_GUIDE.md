# HeyGrowin Admin Guide — Ansh Rajput Portfolio

Welcome to the admin panel for **https://portfolio.heygrow.in** (locally at `http://localhost:3000/admin`).

This guide covers everything you need to manage your single-page portfolio without touching code. Every change published in the admin revalidates the homepage immediately (`revalidatePath('/')`) — no redeployments needed.

---

## 1. Quick Start: Logging In
1. Go to `http://localhost:3000/admin` (or `https://portfolio.heygrow.in/admin`).
2. Log in with your admin credentials:
   - **Email:** `anshr71t9@outlook.com`
   - **Password:** `Password123!` (or your custom password)

---

## 2. Add a Project in 2 Minutes
1. Click **Projects** in the sidebar, then **Create New**.
2. Fill in:
   - **Title:** e.g. `Raja Nursery`
   - **Slug:** `raja-nursery` (real URL hash for when permission is granted)
   - **Anonymous Slug:** `plant-nursery` (safe URL hash used while client permission is unticked)
   - **One Liner:** A punchy summary of the system and result.
   - **Status:** Choose `IN USE`, `LIVE`, `RUNNING`, `BUILDING`, `PIVOTED`, or `CONCEPT`.
   - **Tier:** `Flagship` (shown in primary feed) or `Supporting` (revealed under "More work").
   - **Audiences:** Select `Hire`, `Client`, and/or `Build`.
3. Choose the **Post Card** group styles (see section 3 below).
4. Fill in **Client Group**:
   - `Client Name`: e.g. `Raja Nursery`
   - `Client Description`: e.g. `a family plant nursery`
   - `Client Permission`: Leave **unticked** until you have written permission.
5. Click **Publish**.

---

## 3. Choose a Post Style
Each project card is styled like the kind of post that fits its world:

| `postStyle` | Visual Style | Best Used For |
|---|---|---|
| `photo-post` | Instagram-style: author row, visual, caption | Consumer, physical products, visual results (e.g. Raja Nursery) |
| `team-message` | Slack-style: avatar, bold name, time, preview | Internal tools, inventory, operational systems (e.g. Ansh Color Lab) |
| `pro-post` | LinkedIn-style: author, headline, text, banner | B2B consultancies, platforms, education (e.g. SKOLAR) |
| `thread` | X/Twitter-style: connected posts with vertical line | Technical experiments, breakdown threads (e.g. HeyBlog) |
| `chat` | WhatsApp-style: conversation bubbles | Client relationships, direct client requests (e.g. AnandPic) |
| `commit` | GitHub-style: dark card, test badge, code snippet | Developer tools, protocols, agents (e.g. RevenueLoop, Drop) |

---

## 4. Write a Project Story (Five Chapters)
In the project editor, under **Story Chapters**, fill in the 5 human chapters (20–50 words each):
1. **The person:** Who they are in plain, human words.
2. **The struggle:** What was hurting them or costing time/money.
3. **What I built:** The solution in plain words, plus gallery screenshots.
4. **The moment it changed:** The specific turning point or breakthrough.
5. **Today:** What is still running today.

> [!IMPORTANT]
> **Story Drafting Rule:** Where a human detail is missing, write `[confirm: …]` and keep the document as a **draft**. Never invent events, quotes or numbers.

---

## 5. Critical Checkboxes: When to Tick What

### `clientPermission` (on Projects)
- **UNCHECKED (Default):** The client's real name is strictly hidden everywhere (feed, story sheet, and hero notifications). The public site shows their `clientDescription` (e.g., "a family plant nursery") and the URL hash uses `/#plant-nursery`.
- **CHECKED:** Client name is shown, and the URL hash uses the real slug `/#raja-nursery`.

### `quotePermission` (on Projects)
- **UNCHECKED (Default):** The quote is completely hidden from the public story sheet.
- **CHECKED:** Customer quote, name, and photo appear under Chapter 5 (Today).

### `isConcept` (on Media uploads)
- **CHECKED:** An automatic "Concept visual" badge overlays the image. Use this for AI-generated visuals or mockups that are not real screenshots or client photos.
- **UNCHECKED:** Real screenshots and real photos.

---

## 6. Edit Hero Notifications & Timing
1. Go to **Globals > Home** in the sidebar.
2. Under **Hero Settings**, you can edit:
   - Your name, tagline, city label (`Messina`), and timezone (`Europe/Rome`).
   - The button labels and links.
   - The **Notifications** list: reorder cards, change titles, or link to different `NotificationApps`.
   - **Timings**:
     - `startInterval`: Starting delay (default: 600 ms).
     - `acceleration`: Speedup multiplier (default: 0.8).
     - `minimumInterval`: Fastest delay at peak (default: 120 ms).
3. Click **Save**.

---

## 7. Hide or Reorder Sections
1. Go to **Globals > Home > Layout**.
2. Every section (Three Facts, Work, Timeline, Audience Tabs, Cinema, Achievements, Contact) has:
   - **Visible:** Check or uncheck to show or hide the section completely.
   - **Anchor ID:** The HTML id for smooth scrolling (e.g., `#work`, `#timeline`).
   - **Audiences:** Tag with `hire`, `client`, or `build` to control priority when visitors use `?for=` tabs.
3. Drag blocks up or down to reorder them on the homepage.
4. Click **Save**.

---

## 8. Swap CV PDFs
1. Go to **Globals > Site Settings**.
2. Under **CV Modern** and **CV Europass**, upload your new PDF files.
3. Click **Save**. The download buttons update immediately.
