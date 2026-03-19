# Paywall FC — Streaming Cost Calculator

A Next.js app showing UK football fans exactly what it costs to legally stream their club this season — and the games the 3pm Saturday blackout rule means they can't watch regardless of what they pay.

Live fixture data from [football-data.org](https://www.football-data.org/).

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add your API token

Create a `.env.local` file in the root (this is gitignored — never commit it):

```
FOOTBALL_DATA_TOKEN=your_token_here
```

Your token from football-data.org goes here. It lives server-side only — it is **never** sent to the browser.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. In Vercel project settings → **Environment Variables**, add:
   - `FOOTBALL_DATA_TOKEN` = your token
4. Deploy

That's it. Vercel automatically handles the API routes as serverless functions — your token stays on the server.

---

## How it works

| Route | What it does |
|---|---|
| `/` | Campaign home (yellow branding) — hero, petition, embedded calculator |
| `/landing` | Redirects permanently to `/` (old URL) |
| `/api/fixtures/[teamId]` | Server proxy to football-data.org — injects token, returns PL matches for the season |

### Calculation logic

- **Cost so far** = (Sky + TNT + Amazon if UCL) × months elapsed + TV Licence (split rate)
- **Remaining** = same rates × months left (assuming club wins everything)
- **Cost per game** = cost so far ÷ streamable games (blackouts excluded from denominator)
- **Blackout detection** = Saturday 15:00 UK time (accounts for BST/GMT)

### TV Licence split rate
- Aug 2025 – Mar 2026: £14.54/mo
- Apr 2026 – May 2026: £15.00/mo

---

## Project structure

```
paywall-fc/
├── pages/
│   ├── _app.js              # App wrapper, Google Fonts
│   ├── index.js             # Campaign home (yellow landing + calculator section)
│   ├── landing.js           # Redirects /landing → /
│   └── api/
│       └── fixtures/
│           └── [teamId].js  # Server proxy — token lives here
├── lib/
│   ├── calculator.js        # Cost calculation logic
│   └── clubs.js             # Club data + football-data.org IDs
├── styles/
│   └── globals.css          # Brand palette + base styles
├── .env.example             # Copy to .env.local
├── .gitignore               # Excludes .env.local + node_modules
└── package.json
```
