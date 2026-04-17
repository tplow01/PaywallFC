// lib/calculator.js
// Core Paywall FC calculation logic

export const SEASON_START = new Date("2025-08-15");
export const TODAY        = new Date();

// Monthly costs — Sky Sports + TNT Sports + Amazon Prime.
// All included in the campaign's stacked "full legal spend" framing.
export const PRICES = {
  skyNow:     34.99, // NOW Sports — no contract
  skyBundle:  37.00, // Sky TV bundle — 24-month contract
  tnt:        30.99, // TNT Sports / HBO Max
  amazon:      8.99, // Amazon Prime Video
  tvLicEarly: 14.54, // TV Licence Aug 2025 – Mar 2026
  tvLicLate:  15.00, // TV Licence Apr 2026 – May 2026
};

// Full season = 10 months (Aug 2025 – May 2026)
export const SEASON_MONTHS = 10;

// TV Licence full season cost (8 months early + 2 months late)
export const TV_LIC_SEASON = (8 * PRICES.tvLicEarly) + (2 * PRICES.tvLicLate);

// Months elapsed since season start (fractional)
export function monthsElapsed() {
  const ms   = TODAY - SEASON_START;
  const days = ms / (1000 * 60 * 60 * 24);
  return Math.min(days / 30.44, SEASON_MONTHS);
}

// TV licence accrued so far (split rate)
export function tvLicSoFar(months) {
  const earlyMonths = Math.min(months, 8);
  const lateMonths  = Math.max(0, months - 8);
  return (earlyMonths * PRICES.tvLicEarly) + (lateMonths * PRICES.tvLicLate);
}

// TV licence remaining
export function tvLicRemaining(months) {
  return TV_LIC_SEASON - tvLicSoFar(months);
}

// Total cost so far — Sky + TNT + Amazon + TV Licence
export function calcSoFar(skyMode, months) {
  const sky = skyMode === "now" ? PRICES.skyNow : PRICES.skyBundle;
  return (sky + PRICES.tnt + PRICES.amazon) * months + tvLicSoFar(months);
}

// Minimum remaining cost — Sky + TNT + Amazon + TV Licence for remaining months
export function calcRemaining(skyMode, months) {
  const remaining = SEASON_MONTHS - months;
  const sky       = skyMode === "now" ? PRICES.skyNow : PRICES.skyBundle;
  return (sky + PRICES.tnt + PRICES.amazon) * remaining + tvLicRemaining(months);
}

// Is a match a 3pm Saturday blackout?
// Uses the actual UTC kickoff time from the API.
// BST (UTC+1): last Sunday March → last Sunday October
// GMT (UTC+0): last Sunday October → last Sunday March
export function isBlackout(utcDate) {
  const d = new Date(utcDate);
  const year = d.getUTCFullYear();

  // Last Sunday of March (BST starts)
  const bstStart = lastSundayOf(year, 2); // month index 2 = March
  // Last Sunday of October (GMT resumes)
  const bstEnd   = lastSundayOf(year, 9); // month index 9 = October

  const isBST = d >= bstStart && d < bstEnd;
  const offsetMs = isBST ? 3600000 : 0;
  const ukDate = new Date(d.getTime() + offsetMs);

  const isUKSaturday = ukDate.getUTCDay() === 6;
  const ukMins = ukDate.getUTCHours() * 60 + ukDate.getUTCMinutes();

  // UK broadcast closed period: Saturday 14:45–17:15
  return isUKSaturday && ukMins >= 14 * 60 + 45 && ukMins <= 17 * 60 + 15;
}

// Helper: last Sunday of a given month (UTC midnight)
function lastSundayOf(year, monthIndex) {
  // Start from the last day of the month and walk back to Sunday
  const d = new Date(Date.UTC(year, monthIndex + 1, 0)); // last day of month
  d.setUTCDate(d.getUTCDate() - d.getUTCDay()); // walk back to Sunday
  return d;
}

// Cost per streamable game
export function costPerGame(totalSoFar, streamableCount) {
  if (streamableCount === 0) return 0;
  return totalSoFar / streamableCount;
}
