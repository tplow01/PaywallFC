// scripts/fetch-fixtures.mjs
// Fetches all 2025/26 PL fixtures from football-data.org and writes lib/fixtures-data.json.
// Run after each matchday to pick up new results: node scripts/fetch-fixtures.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN = process.env.FOOTBALL_DATA_TOKEN || "5743823b06e94e81b92e5df5260763ea";

const res  = await fetch("https://api.football-data.org/v4/competitions/PL/matches?season=2025", {
  headers: { "X-Auth-Token": TOKEN },
});
const data = await res.json();
const matches = data.matches;

if (!matches?.length) {
  console.error("No matches returned:", JSON.stringify(data));
  process.exit(1);
}

const byTeam = {};
for (const m of matches) {
  const norm = {
    id:      m.id,
    utcDate: m.utcDate,
    status:  ["FINISHED", "SCHEDULED", "POSTPONED", "CANCELLED"].includes(m.status) ? m.status : "SCHEDULED",
    homeTeam: { id: m.homeTeam.id, name: m.homeTeam.name, shortName: m.homeTeam.shortName },
    awayTeam: { id: m.awayTeam.id, name: m.awayTeam.name, shortName: m.awayTeam.shortName },
    score: { fullTime: { home: m.score.fullTime.home, away: m.score.fullTime.away } },
  };
  for (const tid of [m.homeTeam.id, m.awayTeam.id]) {
    if (!byTeam[tid]) byTeam[tid] = [];
    byTeam[tid].push(norm);
  }
}

for (const tid of Object.keys(byTeam)) {
  byTeam[tid].sort((a, b) => a.utcDate.localeCompare(b.utcDate));
}

const outPath = path.join(__dirname, "../lib/fixtures-data.json");
fs.writeFileSync(outPath, JSON.stringify(byTeam, null, 2));
console.log(`Saved ${matches.length} matches across ${Object.keys(byTeam).length} teams → lib/fixtures-data.json`);
