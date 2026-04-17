// pages/api/averages.js
// Computes average stats across all PL clubs using pre-fetched fixture data.
import { CLUBS } from "../../lib/clubs";
import { isBlackout, PRICES, SEASON_MONTHS, tvLicSoFar } from "../../lib/calculator";
import fixturesData from "../../lib/fixtures-data.json";

const SKY_MONTHLY    = PRICES.skyNow;
const TNT_MONTHLY    = PRICES.tnt;
const AMAZON_MONTHLY = PRICES.amazon;
const PINT_PRICE     = 6.20;

function monthsElapsed() {
  const start = new Date("2025-08-15");
  const ms    = Math.max(0, new Date() - start);
  return Math.min(ms / (1000 * 60 * 60 * 24 * 30.44), SEASON_MONTHS);
}

export default function handler(req, res) {
  const months  = monthsElapsed();
  const soFar   = (SKY_MONTHLY + TNT_MONTHLY + AMAZON_MONTHLY) * months + tvLicSoFar(months);

  let totalCpg      = 0;
  let totalBlackout = 0;
  let count         = 0;

  for (const club of CLUBS) {
    const matches = fixturesData[String(club.id)];
    if (!matches || matches.length === 0) continue;

    const finished   = matches.filter(m => m.status === "FINISHED");
    const blacked    = finished.filter(m => isBlackout(m.utcDate));
    const streamable = finished.length - blacked.length;
    const cpg        = streamable > 0 ? soFar / streamable : 0;

    totalCpg      += cpg;
    totalBlackout += blacked.length;
    count++;
  }

  if (count === 0) {
    return res.status(500).json({ error: "No fixture data available." });
  }

  const avgCpg      = totalCpg / count;
  const avgBlackout = totalBlackout / count;

  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).json({
    avgCostPerGame:  avgCpg,
    avgPintsPerGame: avgCpg > 0 ? avgCpg / PINT_PRICE : 0,
    avgGamesMissed:  Math.round(avgBlackout),
  });
}
