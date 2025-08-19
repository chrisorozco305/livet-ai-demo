import { describe, it, expect } from 'vitest';
import { scoreEvent, type UserPrefs, type EventLite } from './recs';

const basePrefs: UserPrefs = { likedGenres: new Set(['EDM']), priceBandCenter: 30, priceBandWidth: 10 };

describe('scoreEvent', () => {
  it('returns a score between 0 and 1 for a normal event', () => {
  const ev: EventLite = { id: 'x', genre: 'EDM', distance: 2, price: 30 };
    const s = scoreEvent(ev, basePrefs);
    expect(s.score).toBeGreaterThanOrEqual(0);
    expect(s.score).toBeLessThanOrEqual(1);
    expect(s.reasons.length).toBeGreaterThanOrEqual(1);
  });

  it('handles missing distance gracefully', () => {
  const ev: EventLite = { id: 'x', genre: 'EDM', price: 30 };
    const s = scoreEvent(ev, basePrefs);
    expect(typeof s.score).toBe('number');
  });

  it('handles missing price gracefully', () => {
  const ev: EventLite = { id: 'x', genre: 'EDM', distance: 2 };
    const s = scoreEvent(ev, basePrefs);
    expect(typeof s.score).toBe('number');
  });

  it('handles missing genre gracefully', () => {
  const ev: EventLite = { id: 'x', distance: 2, price: 30 };
    const s = scoreEvent(ev, basePrefs);
    expect(typeof s.score).toBe('number');
  });

  it('gives higher score for closer distance', () => {
  const near = scoreEvent({ id: 'a', genre: 'EDM', distance: 1 }, basePrefs).score;
  const far = scoreEvent({ id: 'b', genre: 'EDM', distance: 20 }, basePrefs).score;
    expect(near).toBeGreaterThan(far);
  });

  it('gives higher score for price near center', () => {
  const ideal = scoreEvent({ id: 'a', genre: 'EDM', distance: 5, price: 30 }, basePrefs).score;
  const off = scoreEvent({ id: 'b', genre: 'EDM', distance: 5, price: 100 }, basePrefs).score;
    expect(ideal).toBeGreaterThan(off);
  });

  it('gives preference to liked genre', () => {
  const liked = scoreEvent({ id: 'a', genre: 'EDM', distance: 5 }, basePrefs).score;
  const disliked = scoreEvent({ id: 'b', genre: 'Rock', distance: 5 }, basePrefs).score;
    expect(liked).toBeGreaterThan(disliked);
  });

  it('returns stable reasons array length', () => {
  const s = scoreEvent({ id: 'a', genre: 'EDM', distance: 1, price: 30 }, basePrefs);
    expect(s.reasons.length).toBe(2);
  });

  it('handles extreme distance values', () => {
  const s1 = scoreEvent({ id: 'a', genre: 'EDM', distance: 0 }, basePrefs).score;
  const s2 = scoreEvent({ id: 'b', genre: 'EDM', distance: 9999 }, basePrefs).score;
    expect(s1).toBeGreaterThan(s2);
  });

  it('works when userPrefs has empty likedGenres', () => {
  const prefs: UserPrefs = { likedGenres: new Set(), priceBandCenter: 30, priceBandWidth: 10 };
  const s = scoreEvent({ id: 'a', genre: 'EDM', distance: 2 }, prefs);
    expect(typeof s.score).toBe('number');
  });
});
