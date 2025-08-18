import { NextResponse } from "next/server";
import { events as eventList } from "@/data/mock";
import { scoreEvent, type UserPrefs } from "@/utils/recs";

function parseGenres(q?: string | null) {
  if (!q) return new Set<string>();
  return new Set(q.split(",").map((s) => s.trim()).filter(Boolean));
}

function toNumber(v: string | string[] | null | undefined, fallback: number) {
  if (!v) return fallback;
  const s = Array.isArray(v) ? v[0] : v;
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const qp = url.searchParams;

    const likedGenres = parseGenres(qp.get("likedGenres") || qp.get("liked_genres") || undefined);
    // if empty, keep as empty Set (caller can seed client-side if desired)

    const priceBandCenter = toNumber(qp.get("bandCenter") || qp.get("band_center"), 30);
    const priceBandWidth = toNumber(qp.get("bandWidth") || qp.get("band_width"), 10);
    const limit = Math.max(1, Math.min(100, toNumber(qp.get("limit"), 5)));

    const userPrefs: UserPrefs = {
      likedGenres,
      priceBandCenter,
      priceBandWidth,
    } as any;

    const list = Array.isArray(eventList) ? eventList : [];

    const scored = list.map((e: any) => {
      const lite = {
        id: e.id,
        genre: e.genre,
        distance: typeof e.distance === "number" ? e.distance : undefined,
        price: typeof e.price === "number" ? e.price : undefined,
      };
      const sc = scoreEvent(lite as any, userPrefs as any);
      return {
        id: e.id,
        name: e.name,
        genre: e.genre,
        distance: typeof e.distance === "number" ? e.distance : null,
        likes: typeof e.likes === "number" ? e.likes : 0,
        score: sc.score,
        reasons: sc.reasons,
      };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const da = a.distance === null ? Infinity : a.distance;
      const db = b.distance === null ? Infinity : b.distance;
      if (da !== db) return da - db;
      return (b.likes ?? 0) - (a.likes ?? 0);
    });

    const out = scored.slice(0, limit).map((s) => ({
      id: s.id,
      name: s.name,
      genre: s.genre,
      distance: s.distance,
      likes: s.likes,
      score: s.score,
      reasons: s.reasons,
    }));

    return NextResponse.json(out);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/recommend error", err);
    return NextResponse.json({ error: "Failed to compute recommendations" }, { status: 500 });
  }
}
