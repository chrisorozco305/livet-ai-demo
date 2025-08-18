import { describe, it, expect, vi } from 'vitest';

describe('API /api/recommend integration', () => {
  it('returns an array of results with correct shape and sorted by score desc', async () => {
    // mock the data module before importing the route so imports resolve
    vi.mock('@/data/mock', () => ({
      events: [
        { id: 'e1', name: 'One', genre: 'EDM', likes: 10, distance: 1 },
        { id: 'e2', name: 'Two', genre: 'Pop', likes: 5, distance: 5 },
        { id: 'e3', name: 'Three', genre: 'Rock', likes: 20, distance: 3 },
      ],
    }));

    const mod = await import('../app/api/recommend/route');
    const GET = mod.GET;

    const req = { url: 'http://localhost/api/recommend?limit=6&likedGenres=EDM,Pop' } as any;
    const res: any = await GET(req);

    let body: any;
    if (typeof res.json === 'function') {
      body = await res.json();
    } else if (res._getJSON) {
      body = res._getJSON();
    } else if (res.body) {
      body = res.body;
    } else {
      throw new Error('Unable to read response body from GET()');
    }

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeLessThanOrEqual(6);

    for (let i = 0; i < body.length; i++) {
      const it = body[i];
      expect(it).toHaveProperty('id');
      expect(it).toHaveProperty('name');
      expect(it).toHaveProperty('genre');
      expect(it).toHaveProperty('distance');
      expect(it).toHaveProperty('likes');
      expect(it).toHaveProperty('score');
      expect(it).toHaveProperty('reasons');
      expect(Array.isArray(it.reasons)).toBe(true);
      expect(typeof it.score).toBe('number');
    }

    for (let i = 0; i + 1 < body.length; i++) {
      const a = body[i].score;
      const b = body[i + 1].score;
      expect(a + 1e-9).toBeGreaterThanOrEqual(b);
    }
  });
});
