"use client"

import React, { useEffect, useState } from "react";

type RecLog = { t: number; type: string; eventId?: string; meta?: any };

export default function DevDebugPage() {
  const [logs, setLogs] = useState<RecLog[]>([]);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [followedHosts, setFollowedHosts] = useState<string[]>([]);
  const [followedArtists, setFollowedArtists] = useState<string[]>([]);

  useEffect(() => {
    // read logs and localStorage on client
    // window.__recLogs may be mutated by the app; read a snapshot
    // localStorage keys used by the app: 'livet:likedEvents', 'livet:followedHosts', 'livet:followedArtists'
    const w = typeof window !== "undefined" ? (window as any) : undefined;
    setLogs((w && Array.isArray(w.__recLogs) && w.__recLogs.slice()) || []);

    const parseList = (k: string) => {
      try {
        const raw = localStorage.getItem(k);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === "object") return Object.keys(parsed);
        return [];
      } catch (e) {
        return [];
      }
    };

    setLikedEvents(parseList("livet:likedEvents"));
    setFollowedHosts(parseList("livet:followedHosts"));
    setFollowedArtists(parseList("livet:followedArtists"));
  }, []);

  const refresh = () => {
    const w = typeof window !== "undefined" ? (window as any) : undefined;
    setLogs((w && Array.isArray(w.__recLogs) && w.__recLogs.slice()) || []);
    const parseList = (k: string) => {
      try {
        const raw = localStorage.getItem(k);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === "object") return Object.keys(parsed);
        return [];
      } catch (e) {
        return [];
      }
    };
    setLikedEvents(parseList("livet:likedEvents"));
    setFollowedHosts(parseList("livet:followedHosts"));
    setFollowedArtists(parseList("livet:followedArtists"));
  };

  const clearLogs = () => {
    const w = typeof window !== "undefined" ? (window as any) : undefined;
    if (w) w.__recLogs = [];
    setLogs([]);
  };

  const clearLocal = () => {
    localStorage.removeItem("livet:likedEvents");
    localStorage.removeItem("livet:followedHosts");
    localStorage.removeItem("livet:followedArtists");
    refresh();
  };

  const copyJSON = (obj: any) => {
    try {
      navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dev Debug — Logs & LocalStorage</h1>

      <section className="mb-6">
        <div className="flex gap-2 mb-2">
          <button className="px-3 py-1 bg-slate-700 text-white rounded" onClick={refresh}>
            Refresh
          </button>
          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={clearLogs}>
            Clear Logs
          </button>
          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={clearLocal}>
            Clear LocalStorage
          </button>
        </div>

        <div className="mb-2">
          <h2 className="font-semibold">In-memory Logs (window.__recLogs)</h2>
          <div className="mt-2 p-2 bg-slate-50 border rounded max-h-64 overflow-auto">
            {logs.length === 0 ? (
              <div className="text-slate-500">No logs</div>
            ) : (
              logs.map((l, i) => (
                <pre key={i} className="text-xs mb-1">{JSON.stringify(l, null, 2)}</pre>
              ))
            )}
          </div>
          <div className="mt-2">
            <button
              className="px-2 py-1 bg-slate-700 text-white rounded mr-2"
              onClick={() => copyJSON(logs)}
            >
              Copy Logs JSON
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Persisted State (localStorage)</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-slate-500">likedEvents</div>
            <pre className="p-2 bg-slate-50 border rounded max-h-48 overflow-auto mt-1">{JSON.stringify(likedEvents, null, 2)}</pre>
            <button className="mt-2 px-2 py-1 bg-slate-700 text-white rounded" onClick={() => copyJSON(likedEvents)}>
              Copy
            </button>
          </div>

          <div>
            <div className="text-sm text-slate-500">followedHosts</div>
            <pre className="p-2 bg-slate-50 border rounded max-h-48 overflow-auto mt-1">{JSON.stringify(followedHosts, null, 2)}</pre>
            <button className="mt-2 px-2 py-1 bg-slate-700 text-white rounded" onClick={() => copyJSON(followedHosts)}>
              Copy
            </button>
          </div>

          <div>
            <div className="text-sm text-slate-500">followedArtists</div>
            <pre className="p-2 bg-slate-50 border rounded max-h-48 overflow-auto mt-1">{JSON.stringify(followedArtists, null, 2)}</pre>
            <button className="mt-2 px-2 py-1 bg-slate-700 text-white rounded" onClick={() => copyJSON(followedArtists)}>
              Copy
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
