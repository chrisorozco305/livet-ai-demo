// Recommendation utilities for lightweight event scoring

export type UserPrefs = {
  likedGenres: Set<string>;
  priceBandCenter: number;
  priceBandWidth: number;
};

export type EventLite = {
  id: string;
  genre?: string;
  distance?: number; // miles
  price?: number; // dollars
  purchased?: boolean; // user has purchased this event
};

export type ScoreResult = {
  score: number; // 0..1
  reasons: string[]; // top 2 reasons
};

export function clamp(n: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

/**
 * distanceFit: closer => closer to 1. Uses formula max(0, 1 - (mi||999)/20)
 */
export function distanceFit(mi?: number): number {
  const m = typeof mi === "number" && isFinite(mi) ? mi : 999;
  const raw = 1 - m / 20;
  return clamp(Math.max(0, raw), 0, 1);
}

/**
 * priceFit: 1 when price == center, decays linearly with width. If width <= 0,
 * return 1 when price equals center, otherwise 0.
 */
export function priceFit(price: number | undefined, center: number, width: number): number {
  if (typeof price !== "number" || !isFinite(price)) return 0;
  if (width <= 0) return price === center ? 1 : 0;
  const raw = 1 - Math.abs(price - center) / width;
  return clamp(Math.max(0, raw), 0, 1);
}

/**
 * tasteFit: 1 if user likes the genre, otherwise 0.4 (mild match).
 */
export function tasteFit(user: UserPrefs, genre?: string): number {
  if (!genre) return 0.4;
  return user.likedGenres.has(genre) ? 1 : 0.4;
}

/**
 * scoreEvent: weighted combination and top-2 human-readable reasons.
 * Purchase is the strongest signal (purchaseWeight).
 */
export function scoreEvent(evt: EventLite, user: UserPrefs): ScoreResult {
  const d = distanceFit(evt.distance);
  const p = priceFit(evt.price, user.priceBandCenter, user.priceBandWidth);
  const t = tasteFit(user, evt.genre);
  const purchased = evt.purchased ? 1 : 0;

  // weights: purchases highest, then distance, then price, then taste
  const purchaseWeight = 0.5;
  const distanceWeight = 0.25;
  const priceWeight = 0.15;
  const tasteWeight = 0.1;

  const rawScore = purchaseWeight * purchased + distanceWeight * d + priceWeight * p + tasteWeight * t;
  const score = clamp(rawScore, 0, 1);

  const reasonsPool: { key: string; val: number; label: string }[] = [
    { key: "purchase", val: purchased, label: "Purchased" },
    { key: "distance", val: d, label: "Near you" },
    { key: "price", val: p, label: "In your price range" },
    { key: "taste", val: t, label: evt.genre ? `Matches your ${evt.genre}` : "Matches your genre" },
  ];

  // sort descending by contribution value
  reasonsPool.sort((a, b) => b.val - a.val);
  const reasons = reasonsPool.slice(0, 2).map((r) => r.label);

  return { score, reasons };
}
