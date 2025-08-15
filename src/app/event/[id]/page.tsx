
import EventDetail, { EventDetailModel } from "@/components/EventDetail";
import { events } from "@/data/mock";
import { fairPriceFromFDI } from "@/lib/pricing";

type Params = { params: { id: string } };

export default async function EventPage({ params }: { params: { id: string } }) {
  // Await params for Next.js dynamic route compliance
  const awaitedParams = await params;
  if (!awaitedParams || !awaitedParams.id) {
    return <div className="max-w-[960px] mx-auto p-4 text-neutral-200">Invalid event route.</div>;
  }
  const raw = events.find((e) => e.id === awaitedParams.id);
  if (!raw) {
    return <div className="max-w-[960px] mx-auto p-4 text-neutral-200">Event not found.</div>;
  }

  // ---- derive demo pricing/demand (safe defaults if your mock lacks fields)
  const baseCost = { venue: 9400, production: 11600, artist_min: 6500, platform: 1500, giveback: 0 };
  const break_even_cost = baseCost.venue + baseCost.production + baseCost.artist_min + baseCost.platform;

  const capacity = 1200;
  const min = Number((break_even_cost / capacity).toFixed(2));
  const cap = Number((min * 1.15).toFixed(2));
  const fdi = 0.62;

  const fairPrice = {
    min,
    cap,
    current: Number(fairPriceFromFDI(min, cap, fdi).toFixed(2)),
  };

  const event: EventDetailModel = {
    id: raw.id,
    name: raw.name,
    genre: raw.genre,
    distance: raw.distance,

    capacity,
    baseCost,
    break_even_cost,
    fdi,
    pledge_value: 4000,
    projected_sales: 12000,
    fairPrice,
    purchasePrice: 28,

    reasons: ["Near you", `Matches your ${raw.genre} taste`],
  };

  return <EventDetail event={event} />;
}
