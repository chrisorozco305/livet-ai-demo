"use client"

import { useEffect, useState } from "react";

type Ticket = { id: string; name: string; price?: number; purchasedAt: number };

export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('livet:myTickets');
      if (raw) setTickets(JSON.parse(raw));
    } catch (e) {
      setTickets([]);
    }
  }, []);

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto text-neutral-100">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
      {tickets.length === 0 ? (
        <div className="text-neutral-400">You have no tickets yet. Buy a ticket from an event to see it here.</div>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div key={t.id + String(t.purchasedAt)} className="p-4 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-neutral-400">Purchased: {new Date(t.purchasedAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{t.price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.price) : '—'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
