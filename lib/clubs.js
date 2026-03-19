// lib/clubs.js
// football-data.org team IDs for the 2025-26 Premier League season

export const CLUBS = [
  { id: 57,   key: "arsenal",       name: "Arsenal",                   ucl: true  },
  { id: 58,   key: "astonvilla",    name: "Aston Villa",               ucl: false },
  { id: 1044, key: "bournemouth",   name: "AFC Bournemouth",           ucl: false },
  { id: 402,  key: "brentford",     name: "Brentford",                 ucl: false },
  { id: 397,  key: "brighton",      name: "Brighton & Hove Albion",    ucl: false },
  { id: 328,  key: "burnley",       name: "Burnley",                   ucl: false },
  { id: 61,   key: "chelsea",       name: "Chelsea",                   ucl: false },
  { id: 354,  key: "crystalpalace", name: "Crystal Palace",            ucl: false },
  { id: 62,   key: "everton",       name: "Everton",                   ucl: false },
  { id: 63,   key: "fulham",        name: "Fulham",                    ucl: false },
  { id: 341,  key: "leeds",         name: "Leeds United",              ucl: false },
  { id: 64,   key: "liverpool",     name: "Liverpool",                 ucl: true  },
  { id: 65,   key: "mancity",       name: "Manchester City",           ucl: true  },
  { id: 66,   key: "manutd",        name: "Manchester United",         ucl: false },
  { id: 67,   key: "newcastle",     name: "Newcastle United",          ucl: false },
  { id: 351,  key: "nottmforest",   name: "Nottingham Forest",         ucl: false },
  { id: 71,   key: "sunderland",    name: "Sunderland",                ucl: false },
  { id: 73,   key: "tottenham",     name: "Tottenham Hotspur",         ucl: false },
  { id: 563,  key: "westham",       name: "West Ham United",           ucl: false },
  { id: 76,   key: "wolves",        name: "Wolverhampton Wanderers",   ucl: false },
];

export function getClubByKey(key) {
  return CLUBS.find((c) => c.key === key) || null;
}
