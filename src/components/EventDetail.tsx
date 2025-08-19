"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clamp, toPct, riskPct, fairPriceFromFDI } from "@/lib/pricing";

export type CostBreakdown = {
  venue: number; production: number; artist_min: number; platform: number; giveback?: number;
};

export type EventDetailModel = {
  id: string;
  name: string;
  genre?: string;
  distance?: number;

  // demand/pricing
  capacity: number;
  baseCost: CostBreakdown;
  break_even_cost: number;            // sum(baseCost)
  fdi: number;                        // 0..1
  pledge_value: number;               // $
  projected_sales: number;            // $
  fairPrice: { current: number; min: number; cap: number };

  // resale (per-user)
  purchasePrice: number;
  reasons?: string[];
};

export default function EventDetail({ event }: { event: EventDetailModel }) {
  const router = useRouter();
  const [local, setLocal] = useState(event);

  const fdiPct = toPct(local.fdi);
  const risk = riskPct(local.pledge_value, local.projected_sales, local.break_even_cost);

  function onPledge() {
    const pledge_value = local.pledge_value + 20;
    const fdi = clamp(local.fdi + 0.02, 0, 1);
    const current = fairPriceFromFDI(local.fairPrice.min, local.fairPrice.cap, fdi);
    setLocal({ ...local, pledge_value, fdi, fairPrice: { ...local.fairPrice, current } });
  }

  function onBuy() {
    try {
      const raw = localStorage.getItem('livet:myTickets');
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ id: local.id, name: local.name, price: local.fairPrice.current, purchasedAt: Date.now() });
      localStorage.setItem('livet:myTickets', JSON.stringify(arr));
    } catch (e) {
      // ignore storage errors
    }
    // navigate to My Tickets
    router.push('/my-tickets');
  }

  const [ask, setAsk] = useState<number | "">("");
  const overCap = typeof ask === "number" && ask > local.purchasePrice * 1.15;

  return (
    <div className="max-w-[960px] mx-auto p-4 text-neutral-100">
      <h1 className="text-2xl font-bold">{local.name}</h1>
      <p className="text-sm text-neutral-400 mt-1">
        {local.genre ?? "Event"} • {local.distance?.toFixed(1) ?? "0.0"} mi away
      </p>
      {local.reasons?.length ? (
        <p className="text-xs text-neutral-400 mt-1">Because: {local.reasons.slice(0,2).join(" • ")}</p>
      ) : null}

      {/* FDI + Risk */}
      <section className="mt-4 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm font-medium mb-2">Fansourced Demand: {fdiPct}%</div>
        <div className="h-2 bg-neutral-800 rounded">
          <div
            className={`h-2 rounded ${fdiPct>=70?"bg-emerald-500":fdiPct>=40?"bg-amber-400":"bg-rose-500"}`}
            style={{ width: `${fdiPct}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-neutral-300">Risk: {risk}%</div>
      </section>

      {/* Fair Price */}
      <section className="mt-4 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm font-medium mb-2">Fair Price</div>
        <div className="flex flex-wrap gap-4 text-sm">
          <span>Current: <b>${local.fairPrice.current.toFixed(2)}</b></span>
          <span>Min: ${local.fairPrice.min.toFixed(2)}</span>
          <span>Cap: ${local.fairPrice.cap.toFixed(2)}</span>
        </div>
        <ul className="mt-2 text-xs text-neutral-300 leading-6">
          <li>Venue: ${local.baseCost.venue.toFixed(2)}</li>
          <li>Production: ${local.baseCost.production.toFixed(2)}</li>
          <li>Artist: ${local.baseCost.artist_min.toFixed(2)}</li>
          <li>Platform (≤5%): ${local.baseCost.platform.toFixed(2)}</li>
          {"giveback" in local.baseCost && <li>Give-back: ${local.baseCost.giveback!.toFixed(2)}</li>}
        </ul>
        <p className="mt-2 text-[11px] text-neutral-500">
          Prices are capped and transparent. If demand spikes, extra value goes to give-backs/VIP upgrades.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={onBuy} className="px-4 py-2 rounded bg-pink-600 text-white font-semibold hover:bg-pink-700 transition">Buy Ticket</button>
          <button className="px-4 py-2 rounded bg-neutral-800 text-white font-semibold hover:bg-neutral-700 transition">Wishlist</button>
          <button className="px-4 py-2 rounded bg-neutral-800 text-white font-semibold hover:bg-neutral-700 transition">Share Event</button>
          <button className="px-4 py-2 rounded bg-neutral-800 text-white font-semibold hover:bg-neutral-700 transition">Plan with Friends</button>
        </div>
      </section>

      {/* Crowdfund */}
      <section className="mt-4 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm font-medium mb-2">Crowdfund</div>
        <button onClick={onPledge} className="border border-neutral-700 rounded px-3 py-2 text-sm hover:bg-neutral-900">
          Pledge $20
        </button>
      </section>

      {/* Resale check */}
      <section className="mt-4 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm font-medium mb-2">Resale check</div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={ask}
            onChange={(e)=>setAsk(e.target.value===""?"":Number(e.target.value))}
            placeholder="Ask price"
            className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-sm w-32"
          />
          <span className="text-xs">
            {ask===""
              ? "Enter a price to check"
              : overCap
              ? "Blocked: over 15% cap"
              : "Allowed (≤ 15% cap)"}
          </span>
        </div>
      </section>
    </div>
  );
}
