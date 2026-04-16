// pages/api/fixtures/[teamId].js
//
// Server-side proxy to football-data.org
// The FOOTBALL_DATA_TOKEN env var is injected here — never sent to the client.
import { CLUBS } from "../../../lib/clubs";

function buildFallbackMatches(teamIdNum) {
  const selectedClub = CLUBS.find((c) => c.id === teamIdNum);
  const opponents = CLUBS.filter((c) => c.id !== teamIdNum).slice(0, 12);
  const baseDate = new Date("2025-08-16T15:00:00Z");

  return opponents.map((opp, i) => {
    const homeTeam = i % 2 === 0
      ? { id: teamIdNum, name: selectedClub?.name || "Selected Club", shortName: selectedClub?.name || "Club" }
      : { id: opp.id, name: opp.name, shortName: opp.name };
    const awayTeam = i % 2 === 0
      ? { id: opp.id, name: opp.name, shortName: opp.name }
      : { id: teamIdNum, name: selectedClub?.name || "Selected Club", shortName: selectedClub?.name || "Club" };

    const kickoff = new Date(baseDate);
    kickoff.setUTCDate(baseDate.getUTCDate() + i * 7);

    return {
      id: Number(`${teamIdNum}${i + 1}`),
      utcDate: kickoff.toISOString(),
      status: "FINISHED",
      homeTeam,
      awayTeam,
      score: {
        fullTime: {
          home: (i * 2) % 4,
          away: (i + 1) % 3,
        },
      },
    };
  });
}

export default async function handler(req, res) {
  const { teamId } = req.query;
  const teamIdNum = Number(teamId);

  if (!teamId || isNaN(teamIdNum)) {
    return res.status(400).json({ error: "Invalid teamId" });
  }

  const token =
    process.env.FOOTBALL_DATA_TOKEN ||
    process.env.FOOTBALL_DATA_API_KEY ||
    process.env.FOOTBALL_API_TOKEN;
  if (!token) {
    return res.status(500).json({
      error:
        "API token not configured. Set FOOTBALL_DATA_TOKEN (or FOOTBALL_DATA_API_KEY).",
    });
  }

  try {
    // Try current-season first, then fallback if provider season windows shift.
    const seasons = [2025, 2024];
    let lastError = null;

    for (const season of seasons) {
      const headers = { "X-Auth-Token": token };
      const endpoints = [
        `https://api.football-data.org/v4/teams/${teamIdNum}/matches?competitions=PL&season=${season}`,
        `https://api.football-data.org/v4/competitions/PL/matches?season=${season}`,
      ];

      for (const url of endpoints) {
        const response = await fetch(url, { headers });
        if (!response.ok) {
          lastError = await response.text();
          continue;
        }

        const data = await response.json();
        const matches = Array.isArray(data.matches)
          ? data.matches.filter((m) => m.homeTeam?.id === teamIdNum || m.awayTeam?.id === teamIdNum)
          : [];

        if (matches.length > 0) {
          res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
          return res.status(200).json({ ...data, matches });
        }

        lastError = "No matches returned for season " + season;
      }
    }

    const fallbackMatches = buildFallbackMatches(teamIdNum);
    return res.status(200).json({
      matches: fallbackMatches,
      fallback: true,
      error: "Using fallback fixtures because live API data was unavailable.",
      details: lastError,
    });
  } catch (err) {
    const fallbackMatches = buildFallbackMatches(teamIdNum);
    return res.status(200).json({
      matches: fallbackMatches,
      fallback: true,
      error: "Using fallback fixtures because the live request failed.",
      details: err.message,
    });
  }
}
