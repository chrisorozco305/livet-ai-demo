"use client"

import { useEffect, useMemo, useState } from "react";
import { scoreEvent } from "@/utils/recs";
import { events as mockEvents } from "@/data/mock";

type DevRecLog = { type: string; eventId?: string; ts: number; meta?: any };

export default function DevDebugPage() {
  const [logs, setLogs] = useState<DevRecLog[]>([]);
  const [likedEventIds, setLikedEventIds] = useState<string[]>([]);
  const [serverResults, setServerResults] = useState<any[] | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    const load = () => {
      const w = typeof window !== "undefined" ? (window as any) : undefined;
      setLogs((w && Array.isArray(w.__recLogs) && w.__recLogs.slice()) || []);

      try {
        const raw = localStorage.getItem("livet:likedEvents");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setLikedEventIds(parsed as string[]);
          else if (parsed && typeof parsed === "object") setLikedEventIds(Object.keys(parsed));
          else setLikedEventIds([]);
        } else setLikedEventIds([]);
      } catch {
        setLikedEventIds([]);
      }
      setLastUpdated(Date.now());
    };

    load();
    if (autoRefresh) {
      const id = setInterval(load, 1500);
      return () => clearInterval(id);
    }
  }, [autoRefresh]);

  const userPrefs = useMemo(() => {
    const likedGenres = new Set<string>();
    for (const id of likedEventIds) {
      const e = (mockEvents as any).find((x: any) => x.id === id);
      if (e && e.genre) likedGenres.add(e.genre);
    }
    return {
      likedGenres,
      priceBandCenter: 30,
      priceBandWidth: 10,
    } as const;
  }, [likedEventIds]);

  const localScores = useMemo(() => {
    return (mockEvents as any[]).map((ev: any) => {
      const lite = { id: ev.id, genre: ev.genre, distance: ev.distance ?? null, price: (ev as any).price ?? null, likes: ev.likes ?? 0 };
      const scored = scoreEvent(lite, { likedGenres: userPrefs.likedGenres as Set<string>, priceBandCenter: (userPrefs as any).priceBandCenter, priceBandWidth: (userPrefs as any).priceBandWidth } as any);
      return { ev, scored };
    });
  }, [userPrefs]);

  const fetchServer = async () => {
    try {
      const g = Array.from((userPrefs as any).likedGenres || []).join(',');
      const res = await fetch('/api/recommend?limit=20&likedGenres=' + encodeURIComponent(g));
      const json = await res.json();
      setServerResults(json);
    } catch (e) {
      setServerResults([{ error: String(e) }]);
    }
  };

  const clearLogs = () => {
    const w = typeof window !== "undefined" ? (window as any) : undefined;
    if (w) w.__recLogs = [];
    setLogs([]);
  };

  const clearLocal = () => {
    localStorage.removeItem('livet:likedEvents');
    localStorage.removeItem('livet:followedHosts');
    localStorage.removeItem('livet:followedArtists');
    setLikedEventIds([]);
  };

  const copy = async (obj: any) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Recommendation Debug</h1>
        <div className="text-sm text-slate-500">Last update: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '—'}</div>
      </div>

      <div className="mb-4 flex gap-2">
        <button className="px-3 py-1 bg-slate-700 text-white rounded" onClick={() => { setAutoRefresh(v=>!v); }}>
          {autoRefresh ? 'Stop Auto' : 'Auto Refresh'}
        </button>
        <button className="px-3 py-1 bg-slate-700 text-white rounded" onClick={() => { setLastUpdated(Date.now()); setLogs((typeof window !== 'undefined' && (window as any).__recLogs) || []); }}>Refresh Now</button>
        <button className="px-3 py-1 bg-amber-600 text-white rounded" onClick={clearLogs}>Clear Logs</button>
        <button className="px-3 py-1 bg-amber-600 text-white rounded" onClick={clearLocal}>Clear LocalStorage</button>
        <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => copy({ logs, likedEventIds, userPrefs, serverResults })}>Copy Snapshot</button>
        <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={fetchServer}>Fetch /api/recommend</button>
      </div>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">In-memory logs (window.__recLogs)</h2>
        <div className="max-h-48 overflow-auto border p-2 bg-white rounded">
          {logs.length === 0 ? <div className="text-slate-500">No logs</div> : logs.map((l,i)=> (
            <div key={i} className="text-xs py-1 border-b last:border-b-0">
              <div><strong>{l.type}</strong> — {l.eventId ?? ''} <span className="text-slate-400">@ {new Date(l.ts).toLocaleTimeString()}</span></div>
              {l.meta ? <pre className="text-[11px] mt-1">{JSON.stringify(l.meta,null,2)}</pre> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">Persisted / Derived State</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-2 border rounded">
            <div className="text-sm text-slate-500">likedEventIds</div>
            <pre className="text-xs mt-1 max-h-36 overflow-auto">{JSON.stringify(likedEventIds, null, 2)}</pre>
          </div>
          <div className="p-2 border rounded">
            <div className="text-sm text-slate-500">userPrefs (derived)</div>
            <pre className="text-xs mt-1">{JSON.stringify({ likedGenres: Array.from((userPrefs as any).likedGenres || []), priceBandCenter: (userPrefs as any).priceBandCenter, priceBandWidth: (userPrefs as any).priceBandWidth }, null, 2)}</pre>
          </div>
          <div className="p-2 border rounded">
            <div className="text-sm text-slate-500">serverResults (last fetch)</div>
            <pre className="text-xs mt-1 max-h-36 overflow-auto">{JSON.stringify(serverResults, null, 2)}</pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Local scoring (scoreEvent)</h2>
        <div className="grid gap-2">
          {localScores.map(({ ev, scored }) => (
            <div key={ev.id} className="p-2 border rounded flex justify-between items-start">
              <div>
                <div className="font-medium">{ev.name} <span className="text-slate-400 text-sm">({ev.genre})</span></div>
                <div className="text-xs text-slate-500">distance: {ev.distance ?? '—'} mi · price: {(ev as any).price ?? '—'} · likes: {ev.likes}</div>
                <div className="mt-1 text-sm">Score: <strong>{scored.score.toFixed(3)}</strong></div>
                <div className="flex gap-2 mt-1">{scored.reasons.map((r:any,idx:number)=>(<div key={idx} className="text-[11px] bg-slate-100 px-2 py-0.5 rounded">{r}</div>))}</div>
              </div>
              <div className="text-right">
                <button className="px-2 py-1 bg-slate-700 text-white rounded" onClick={() => copy({ ev, scored })}>Copy</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
