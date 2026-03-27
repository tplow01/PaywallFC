# Paywall FC — Site Reference Document

**Campaign site:** One-page Next.js landing page
**Goal:** Get fans to sign the petition, building a number large enough to be cited at the 2029 Premier League broadcast rights negotiations
**Stack:** Next.js 14 (Pages Router), React 18, Tailwind CSS v3, GSAP v3
**Last updated:** March 2026

---

## Who This Site Is For

The primary audience is 18–35 year old UK football fans. The research identified three distinct types:

**The Trapped Payer (Adam, Arsenal, 23)**
Has every subscription. Has always had every subscription. Still feels "sick to his stomach" about it. He's not disengaged — he's resentful and paying. He represents the fan who is fully bought in financially and emotionally exhausted by it. He's the most relatable figure for copy that validates frustration.

**The Abstainer (Lewis, Southampton, 23)**
Watches at the pub because it's cheaper. Won't sign petitions. Doesn't trust campaigns. Described the people running football as "out of touch." He's the hardest person to activate, which makes him the most important design target. Every trust signal on the page exists because of Lewis.

**The Exhausted (Harry, Arsenal, 24)**
Pays for Sky and TNT. Has missed games despite having both — not because of cost, but because the technical product failed him. Three words for UK football broadcasting: "extortionate, expensive, poor." No rage. Just flatness. He's past the point of being surprised.

The campaign needs to speak to all three simultaneously. The petition section addresses Lewis's scepticism directly. The calculator validates Adam's resentment with his own numbers. The piracy callout acknowledges Harry's exhaustion without judging it.

---

## Brand System

### Colours

| Token | Hex | Use |
|-------|-----|-----|
| `brand-yellow` | `#fed107` | Primary brand, CTAs, eyebrows, highlights |
| `brand-dark` | `#111011` | Page background |
| `brand-panel` | `#1a1a1a` | Card/panel backgrounds |
| `brand-border` | `#262626` | Borders and dividers |
| `brand-muted` | `#71717A` | Secondary labels, subdued text |
| `brand-text` | `#dfebf7` | Body text and headings |
| `brand-red` | `#e03535` | Problem/danger/blocked states |

**Why black and yellow:** The badge locks it. Yellow carries broadcast urgency (VAR screens, warning signals). Black reads as a blocked screen. Together they've been the colour of English fan protest for decades — anti-Sky banners, boycott scarves. The palette is the argument.

### Typography

| Role | Font | Usage |
|------|------|-------|
| `font-display` | Kanit | All headings, eyebrows, UI labels, stat numbers |
| `font-sans` | Mona Sans Variable | Body prose, fixture data, form inputs |

**Eyebrow standard:** `font-display font-semibold text-[11px] tracking-[3.5px] uppercase`
**H2 standard:** `font-display font-black uppercase` + `fontSize: clamp(2.4rem,5vw,57px)` + `letterSpacing: "-0.02em"` + `lineHeight: "1.05"`
**Body prose standard:** `text-[15.5px] leading-[28px]` + `color: rgba(223,235,247,0.6)`

### Shared Form Input Props

```js
const INPUT_CLS   = "w-full px-5 py-4 font-sans text-[14px] outline-none transition-colors placeholder-[rgba(223,235,247,0.22)] rounded-none";
const INPUT_STYLE = { background: "rgba(223,235,247,0.04)", border: "1px solid rgba(223,235,247,0.1)", color: "#dfebf7" };
const INPUT_FOCUS = {
  onFocus: e => { e.target.style.borderColor = "#fed107"; },
  onBlur:  e => { e.target.style.borderColor = "rgba(223,235,247,0.1)"; },
};
```

### Logo Assets (`/public/`)

| File | Format | Use |
|------|--------|-----|
| `badge.png` | Yellow circle on black | Nav icon, petition success state, footer |
| `picon.png` | P/play mark in yellow circle on black | Favicon, small icon use |
| `silhouette.png` | Black badge on yellow | Use on yellow backgrounds (ticker) |
| `wordmark.png` | "PAYWALL FC" pill on white | Not currently used on site — designed for white backgrounds |

The badge centre mark is a P that doubles as a play button — the dual meaning is intentional. P for Paywall, play for streaming. The rewind/forward arrows and three stars follow football badge convention.

---

## Page Flow

```
Nav (sticky)
↓
Hero — brand statement + video experience
↓
Ticker — price data scrolling banner
↓
Calculator — personalised cost breakdown by club
↓
The Cost — escalation ladder + piracy data
↓
The Problem — why the system is broken
↓
Fan Voices — three primary source interviews
↓
About + Demands — who we are, what we want
↓
Petition — sign + counter
↓
Footer
```

---

## Section Reference

---

### Nav

**File location:** `pages/index.js` — inside `Landing()`, before the hero

**What it does:** Sticky navigation that becomes more opaque on scroll. Contains the badge, three anchor links, and a yellow petition CTA.

**Key decisions:**
- Badge only in the nav — no wordmark. Keeps it minimal and fast at small sizes.
- Nav links are anchors to three key sections (Calculator, The Cost, The Problem). Petition is a separate yellow CTA button rather than a plain text link.
- Mobile menu adds a full-width yellow "Sign the Petition" block at the bottom — the only way for mobile users to navigate directly to the petition section.

**Copy:** Nav links — `Calculator` / `The Cost` / `The Problem`
CTA — `Sign the Petition`

**Scroll state:** On scroll > 20px, background shifts from `rgba(17,16,17,0.94)` to `rgba(17,16,17,0.98)`. The border underneath is always present.

---

### Hero

**File location:** `pages/index.js` — `<section>` immediately after `</header>`

**What it does:** Establishes the campaign before anything else, then delivers the video experience.

**Structure:**
1. H1 brand statement — "Your Club. Their Profit."
2. Two-sentence campaign context — who Paywall FC is and the 2029 deadline
3. Red "The Experience" label with live pulse dot
4. `<VideoSection />` — the interactive popup sequence
5. Caption — "Popups appear automatically · This is what watching football feels like in 2026"

**Why the headline comes first:** The previous version opened with "The Experience — scroll into view to start." That's an instruction, not a brand statement. A new visitor had no context for what they were watching or why it mattered. The h1 fixes this — brand → context → experience.

**The video popup sequence** (`POPUP_SEQUENCE` in constants) runs automatically when the section enters the viewport at 30% threshold. It fires once per page load. Sequence: subscribe prompt → blackout modal → stat flash → another subscribe → stat → expired modal → final stats → total cost. The sequence mimics the actual emotional experience of trying to watch football legally in the UK.

**Popup types:**
- `subscribe` — Sky or TNT branded subscription prompts
- `blackout` — The Saturday 3pm block modal
- `stat` — Full-screen number flash (£349.90, 113, £278.91, £146.32, 30%)
- `expired` — Free trial ended modal
- `final` — Total cost reveal with petition CTA

---

### Ticker

**File location:** `pages/index.js` — between hero and calculator sections

**What it does:** Scrolling yellow banner with key price data. Creates momentum between hero and calculator.

**Content:** Sky Sports: £34.99/mo | TNT Sports: £30.99/mo | TV Licence: £14.54/mo | Total: £775/season | 113 Premier League games blacked out | 30% of the season unwatchable

**Implementation:** Two identical rows of items inside a flex container, animated with `tick` keyframe (28s infinite). The duplicate row creates a seamless loop.

**Silhouette badge** — the black-on-yellow logo version would work here if a logo is ever added to the ticker.

---

### Calculator

**File location:** `pages/index.js` — `<CalculatorSection />` component

**What it does:** Personalised cost breakdown. User selects their club from a dropdown, which fetches their season fixtures via `/api/fixtures/[id]`. The calculator then shows:
- Money spent so far this season (Sky + TNT + TV Licence, pro-rated by months elapsed)
- Their personal blackout count (fixtures falling in the 3pm Saturday window)
- Cost per game they can actually watch
- Spend breakdown by service (Sky / TNT / Licence)
- "Pints in perspective" comparison

**Layout:** Full-width header row (eyebrow + h2 on left, description on right) above a two-column interactive grid. Left panel is sticky (`lg:sticky lg:top-[72px]`) so the club picker stays visible while scrolling through fixtures. Right panel shows the fixture list aligned to the same top edge as the left panel's dropdown.

**Data sources:**
- Club list: `lib/clubs.js` — `CLUBS` array and `getClubByKey()`
- Fixture API: `/api/fixtures/[id]` — fetches from football-data.org
- Blackout detection: `lib/calculator.js` — `isBlackout(utcDate)` checks if a match falls in the 2:45–5:15pm Saturday window
- Cost constants: `lib/calculator.js` — `PRICES`, `SEASON_MONTHS`, `TV_LIC_SEASON`, `tvLicSoFar()`

**Key constants (index.js):**
```js
const SKY_MONTHLY  = PRICES.skyNow;       // £34.99
const TNT_MONTHLY  = PRICES.tnt;          // £30.99
const SKY_SEASON   = SKY_MONTHLY * SEASON_MONTHS;   // £349.90
const TNT_SEASON   = TNT_MONTHLY * 9;               // £278.91
const TOTAL_SEASON = SKY_SEASON + TNT_SEASON + TV_LIC_SEASON; // £775.13
```

**Empty state:** Yellow-bordered prompt to select a club. Fixture list only appears after selection and successful API response.

**Eyebrow:** "Your Numbers"
**H2:** "What are you actually paying?"

---

### The Cost

**File location:** `pages/index.js` — `<section id="costs">`

**What it does:** Escalates from the personal (calculator) to the systemic. Shows what football costs if you want to watch beyond the Premier League, then anchors the piracy data.

**Structure:**
1. Header — "And that's only the Premier League" eyebrow + "£775. And that's just the start." h2
2. Escalation ladder — four tiers from PL only (£775) to all European football (£1,697) to post-2027 with Paramount+ (~£1,757+)
3. Piracy callout panels — "5 million UK adults use illegal streams" + "9% of the adult population"

**The escalation ladder** is the strongest visual on the page. Each row increases in colour intensity (neutral → yellow → red → deeper red) with "Today" and "Coming soon" tags. The ladder is offset to `col-span-8 col-start-5` on desktop — the left 4 columns are intentionally empty, creating a right-anchored composition that gives the numbers room to land.

**Why the piracy callouts replaced the AnimStats:** The original four animated stats (£775, 113, 30%, £1,697) were appearing for the third time on the page by this point — already shown in the ticker and implicit in the calculator. The piracy data is new information at this point in the scroll and reframes the argument: this isn't fans complaining about price, it's documented market failure.

**Source for piracy figures:** Reddit Football Streaming Pain Analysis (2025 industry data). Verify figures before updating.

**Eyebrow:** "And that's only the Premier League"
**H2:** "£775. And that's just the start."

---

### The Problem

**File location:** `pages/index.js` — `<section id="problem">`

**What it does:** Explains the structural causes — fragmented rights and the 3pm blackout — in one continuous argument. The right column provides two large callout panels (113 and 1960) as visual anchors.

**Layout:** 5-column left (text) + 7-column right (callouts) on medium+ screens.

**Left column — one block, not two:** Previous versions had "The Problem" and "The 3pm Blackout" as two separate sub-sections with competing heading levels. This created visual and narrative fragmentation. The current version merges them into a single flowing argument — the paywall and the blackout are two parts of the same system failure.

**The h2:** "Paying full price. Watching half the game." — chosen over the previous "Fans silenced by their own wallets" because the fan interviews showed frustration and exhaustion, not silence. The new line is more accurate to how fans actually describe the experience.

**Right column callouts:**
- `113` — "Premier League games per season — paid for. Subscribed to. Completely unwatchable." Red on dark red background.
- `1960` — "The year the 3pm blackout rule was introduced. Before colour TV. Before satellite. Before the internet existed." Slightly lighter red tint.

Both callouts use `clamp(4rem,10vw,96px)` for the number, `lineHeight: "1"`. The contrast between the large number and the quiet descriptor beneath it does the emotional work without editorialising.

**Verbatim rule quote** sits at the bottom of the left column as a standalone panel — grey text on a dark red background. Source: UEFA Article 48, UEFA Statutes.

**Eyebrow:** "The Problem" (red, not yellow — semantic distinction)
**H2:** "Paying full price. Watching half the game."

---

### Fan Voices

**File location:** `pages/index.js` — section after the Problem

**What it does:** Primary source validation. Three real interviews conducted in early 2026, quoted directly.

**Why "What we heard" not "You're not alone":** The original framing ("Across every club, every age group, every income bracket — the story is the same") overclaimed. All three subjects are 23–24 year old men from southern England. The research is honest — these are three people we actually spoke to, not a representative sample. The current framing owns that: "We spoke to three fans in early 2026."

**The three quotes:**

| Subject | Club | Key tension |
|---------|------|------------|
| Adam, 23 | Arsenal | Pays for everything, feels "sick to my stomach" |
| Lewis, 23 | Southampton | Watches at pub, given up on subscriptions, doesn't trust petitions |
| Harry, 24 | Arsenal | Has Sky and TNT, still misses games, "extortionate, expensive, poor" |

**Visual treatment:** Each quote in a `col-span-12 md:col-span-4` column. Yellow left border (3px, 45% opacity) with a faint yellow background tint. Quote in italic at 17px, attribution in small uppercase tracking.

**Eyebrow:** "What we heard"
**H2:** "Three fans. Same story."

---

### About + Demands

**File location:** `pages/index.js` — section after Fan Voices

**What it does:** Two functions in one section. The About block establishes Paywall FC's identity and credibility. The Demands block states what the campaign wants, specifically and with political context.

**About Paywall FC:**

"A fictional club. A very real fight." — The best copy line on the page. It's self-aware (we know we're not a real club), honest about what we are (a campaign), and confident about what we're doing (fighting for something real).

The paragraph below it covers: what Paywall FC tracks (real cost of watching football in England), who they're not affiliated with, and the 2029 deadline as the reason this is urgent now.

**The three demands:**

| Demand | Core ask | Political anchor |
|--------|----------|-----------------|
| 01 — One fair subscription | All PL matches via a single affordable subscription | — |
| 02 — End the 3pm blackout | Abolish the streaming blackout rule | UK is the only European nation still applying UEFA Article 48 |
| 03 — Fans at the table | Meaningful fan consultation before the 2029 rights deal | Football Governance Act 2025 created the Independent Football Regulator (IFR) with statutory power |

**Demand 3 is the most urgent.** The IFR exists now. It has statutory power. The 2029 rights deal is the next negotiation. The demand is no longer aspirational — there is a mechanism, and there is a deadline.

**Visual treatment:** Three equal-width columns, borderLeft dividers between them on desktop. Yellow gradient tint background. Large watermark numbers (01/02/03) at `rgba(254,209,7,0.09)` — subtle intentionally. The demand title is at 23px, body at 14.7px.

**Eyebrow:** "About Paywall FC" (above About block), "What we're demanding" (above demands)

---

### Petition

**File location:** `pages/index.js` — `<section id="petition">`

**What it does:** Conversion section. The goal of the entire page. Collects first name, last name (optional), email, and club (optional).

**Layout:** Centred, `col-span-6 col-start-4` on large screens. Deliberate narrowing — draws the eye after the wide sections above.

**Structure:**
1. Eyebrow with horizontal rules — "Take Action"
2. H2 — "Add your name." (biggest type on the page outside hero, `clamp(3rem,10vw,88px)`, `lineHeight: "0.88"`)
3. Brief description of what you're signing
4. Sceptic acknowledgement panel
5. Signer count (animated, live-incrementing)
6. "Growing every hour — be part of it" banner
7. Form or success state

**The sceptic panel** directly addresses the Lewis archetype — the person who has seen campaigns like this before and hasn't signed one. It references the Super League precedent (fans won in 48 hours by making it economically inconvenient) and frames the petition counter as a political tool, not a symbolic gesture. It gives a sceptical visitor a reason to consider signing that isn't based on trust in institutions.

**Signer counter:** Initialised at `4261`. Increments by 0–2 every 8 seconds via `setInterval`. The `countGlow` animation applies a yellow text shadow pulse. Uses `suppressHydrationWarning` to avoid server/client mismatch.

**Form fields:**
- First name — required
- Last name — optional
- Email — required
- Club you support — optional

On submit: if email and firstName are present, sets `submitted: true` and shows the success state (badge, "You're in, [firstName].", share prompt).

**H2:** "Add your name."
**Eyebrow:** "Take Action"
**Success state:** "You're in, {firstName}. Share the campaign so others can add their name. Together, we're impossible to ignore."

---

### Footer

**File location:** `pages/index.js` — after petition section

**What it does:** Minimal. Badge + wordmark text on the left, disclaimer in the centre, nav links on the right.

**Copy:** "A campaign project. Not affiliated with the Premier League, Sky, TNT, or any professional football club."

This disclaimer is important — Paywall FC is not affiliated with any broadcaster or club. It protects the campaign legally and credibility-wise.

---

## Key Research Findings

These informed copy and section decisions. Keep this section updated as new research comes in.

**Cost reality (Price of Loyalty, 2025/26)**
- Base cost to stream Arsenal FC: ~£820.10 for the season (cord-cutter approach)
- Sky Sports (NOW): £34.99/month standard
- TNT Sports (discovery+ / HBO Max): £30.99/month
- TV Licence: £14.54/month (rising to £15 from April 2026)
- Amazon Prime: now required for CL only, not PL

**The piracy reality (Reddit Streaming Pain Analysis)**
- ~5 million UK adults (9%) use illegal streams regularly
- 3.6 billion illegal streams per year
- A jailbroken Firestick costs £60–100/year vs £90–130/month legally
- IPTV often provides higher resolution and lower latency than legal services

**The blackout (Price of Loyalty, Reddit Analysis)**
- 57% of fans oppose the blackout (up from 52% in 2023)
- UK is the only European nation still applying UEFA Article 48
- Arsenal 2025/26: 9 confirmed blackout fixtures
- The EFL could expand from 1,059 to 1,891 televised games by removing it
- PL and EFL in talks (2026) about ending it before the next rights cycle

**Fan sentiment (Reddit, Interviews)**
- Fans describe subscription costs as "a second council tax"
- Broadcasters are seen as "deliberately" shuffling rights to force fans into maintaining all subscriptions "just in case"
- The "Other 14" (clubs outside the Big Six) feel the blackout hardest — their matches are shown least often, yet they pay the same base costs
- Common fan language: "deliberate incompetence," "mug" (paying customer), "piss take," "just in case," "thank God for IPTV"

**The political window (Fair Game Research Framework)**
- Football Governance Act 2025 created the Independent Football Regulator (IFR) with statutory licensing power
- IFR focus areas: financial sustainability, governance, fan engagement, transparency
- 2029 rights deal is the next major negotiation point
- Fair Game UK (the institutional campaigner) focuses on revenue distribution, not consumer costs — Paywall FC fills the gap

**Fan collective action precedent (Extra Research)**
- The European Super League was abandoned in 48 hours in April 2021
- Fans won through economic pressure: bus blockades, sponsor campaigns, pitch invasions
- Unity across rival fan bases was the mechanism — not petitions alone
- The lesson: institutional change follows economic inconvenience, not polite requests

---

## Open Issues

**Vercel deployment — 404 NOT_FOUND**
The live deployment returns `404 NOT_FOUND`. The GitHub repo (`git@github.com:tplow01/Paywallfc.git`) contains the Next.js app at its root (pages/ at root level). Root cause unknown — likely a Vercel framework detection or build configuration issue. Needs investigation.

**Form — accessibility**
Petition form inputs have no visible labels, only placeholder text. This fails WCAG 2.1 1.3.1. Required fields (first name, email) are visually identical to optional fields. Adding `sr-only` labels and a visual required indicator would fix this without changing the appearance.

**Fan Voices — demographic range**
All three interview subjects are 23–24 year old men from southern England. The section is now framed honestly ("we spoke to three fans") but broader research coverage would strengthen the section over time.

**Wordmark**
The wordmark (`wordmark.png`) is designed for white backgrounds. It's not currently used on the dark site. If it's needed, an inverted or dark-background version should be created.

**Figma design file**
The Figma file (`s6ZzHYxtMY2tmog8viABEl`) is blank. The MCP server can write to FigJam only, not design frames. The site exists only in code.

---

## File Map

```
paywall-fc/
├── pages/
│   ├── index.js          ← entire site — all sections, components, constants
│   ├── _app.js           ← font imports, global styles wrapper
│   └── api/
│       └── fixtures/
│           └── [id].js   ← fixture fetch from football-data.org
├── lib/
│   ├── calculator.js     ← PRICES, SEASON_MONTHS, TV_LIC_SEASON, tvLicSoFar(), isBlackout()
│   └── clubs.js          ← CLUBS array, getClubByKey()
├── public/
│   ├── badge.png         ← primary logo mark
│   ├── picon.png         ← icon mark only
│   ├── silhouette.png    ← black-on-yellow badge (for yellow backgrounds)
│   └── wordmark.png      ← text wordmark (white background only)
├── styles/
│   └── globals.css       ← Tailwind directives, base styles, keyframe animations
├── tailwind.config.js    ← brand colour tokens, font family definitions
└── SITE_REFERENCE.md     ← this file
```
