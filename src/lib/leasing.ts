// Leasing/borgmodel: de klant betaalt de volledige aanschafprijs vooraf.
// Hoe langer het spel wordt gehouden, hoe groter het deel van die prijs dat
// "verbruikt" is; de rest wordt terugbetaald bij het terugbrengen. Na 56
// dagen (8 weken) is de prijs volledig verbruikt en is het spel van de klant.
//
// De curve is een aflopende trap: de eerste dagen wegen het zwaarst mee
// (4,5%/dag), daarna steeds minder (3,2% → ~2,0% → ~1,15% per dag).
const LEASE_BREAKPOINTS: [days: number, cumulativePercent: number][] = [
  [0, 0],
  [2, 9],
  [7, 25],
  [30, 70],
  [56, 100],
];

export const LEASE_PAYOFF_DAYS = LEASE_BREAKPOINTS[LEASE_BREAKPOINTS.length - 1][0];

export const LEASE_MILESTONES = [
  { label: "2 dagen", shortLabel: "2d", days: 2 },
  { label: "1 week", shortLabel: "7d", days: 7 },
  { label: "2 weken", shortLabel: "14d", days: 14 },
  { label: "1 maand", shortLabel: "30d", days: 30 },
  { label: "8 weken (volledig van jou)", shortLabel: "8w", days: 56 },
];

function owedFraction(daysHeld: number): number {
  const days = Math.max(0, daysHeld);
  const last = LEASE_BREAKPOINTS[LEASE_BREAKPOINTS.length - 1];
  if (days >= last[0]) return 1;

  for (let i = 0; i < LEASE_BREAKPOINTS.length - 1; i++) {
    const [d0, p0] = LEASE_BREAKPOINTS[i];
    const [d1, p1] = LEASE_BREAKPOINTS[i + 1];
    if (days <= d1) {
      const t = (days - d0) / (d1 - d0);
      return (p0 + t * (p1 - p0)) / 100;
    }
  }
  return 1;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateOwedAmount(purchasePrice: number, daysHeld: number): number {
  return round2(purchasePrice * owedFraction(daysHeld));
}

export function calculateRefundAmount(purchasePrice: number, daysHeld: number): number {
  return round2(purchasePrice - calculateOwedAmount(purchasePrice, daysHeld));
}

export function daysBetween(start: Date, end: Date): number {
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endDay.getTime() - startDay.getTime()) / (24 * 60 * 60 * 1000));
}
