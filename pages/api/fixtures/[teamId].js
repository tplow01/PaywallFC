// pages/api/fixtures/[teamId].js
//
// Server-side proxy to football-data.org
// The FOOTBALL_DATA_TOKEN env var is injected here — never sent to the client.

export default async function handler(req, res) {
  const { teamId } = req.query;

  if (!teamId || isNaN(Number(teamId))) {
    return res.status(400).json({ error: "Invalid teamId" });
  }

  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "API token not configured" });
  }

  try {
    // Fetch all PL matches for this team in the 2025-26 season
    const url = `https://api.football-data.org/v4/teams/${teamId}/matches?competitions=PL&season=2025`;

    const response = await fetch(url, {
      headers: {
        "X-Auth-Token": token,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();

    // Cache for 5 minutes on Vercel edge
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
