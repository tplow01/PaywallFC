// pages/api/fixtures/[teamId].js
// Serves pre-fetched 2025/26 PL fixture data from lib/fixtures-data.json.
// To refresh: run `node scripts/fetch-fixtures.mjs` then redeploy.
import fixturesData from "../../../lib/fixtures-data.json";

function isAllowedOrigin(req) {
  if (process.env.NODE_ENV === "development") return true;
  const origin = req.headers.origin || req.headers.referer || "";
  return origin.includes("paywall.vercel.app") || /paywallfc[^.]*\.vercel\.app/.test(origin);
}

export default function handler(req, res) {
  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { teamId } = req.query;
  const teamIdNum = Number(teamId);

  if (!teamId || isNaN(teamIdNum)) {
    return res.status(400).json({ error: "Invalid teamId" });
  }

  const matches = fixturesData[String(teamIdNum)];

  if (!matches || matches.length === 0) {
    return res.status(404).json({ error: "No fixture data for this team." });
  }

  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).json({ matches });
}
