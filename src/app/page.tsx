"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

/* ---------- Reusable UI ---------- */
function FilterPills({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {options.map((name) => (
        <button
          key={name}
          onClick={() => onChange(name)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            value === name
              ? "bg-pink-600 text-white"
              : "border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

function RightArrow({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 right-[-32px] sm:right-[-40px] z-10 rounded-full bg-black/70 text-white border border-white/10 h-10 w-10 flex items-center justify-center hover:bg-black/80 active:scale-95 transition shadow-lg"
      style={{ pointerEvents: "auto" }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M8 4l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ---------- Page ---------- */
export default function Home() {
  const filters = ["Suggested", "Hot", "Popular", "Near", "Liked"];
  const [eventFilter, setEventFilter] = useState("Suggested");
  const [artistFilter, setArtistFilter] = useState("Suggested");

  // sample data to paginate
  const events = useMemo(() => Array.from({ length: 6 }, (_, i) => `Event ${i + 1}`), []);
  const artists = useMemo(() => Array.from({ length: 10 }, (_, i) => `Artist ${i + 1}`), []);

  // paging config
  const EVENTS_PER_PAGE = 3;
  const ARTISTS_PER_PAGE = 5;
  const eventPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const artistPages = Math.ceil(artists.length / ARTISTS_PER_PAGE);
  const [eventPage, setEventPage] = useState(0);
  const [artistPage, setArtistPage] = useState(0);

  const nextEventPage = () => setEventPage((p) => (p + 1) % eventPages);
  const nextArtistPage = () => setArtistPage((p) => (p + 1) % artistPages);

  return (
    <div className="min-h-screen w-screen font-sans relative flex flex-col">
      {/* HEADER - fixed */}
      <header className="fixed top-0 inset-x-0 z-20 h-16 flex items-center justify-between px-8 shadow-sm border-b border-gray-200/50 dark:border-gray-800/60 bg-black/60 backdrop-blur">
        <div className="text-2xl font-bold text-gray-100 dark:text-white">Livet</div>
        <nav>
          <ul className="flex gap-6">
            <li><button className="text-gray-100 hover:text-blue-300 font-medium transition-colors">Home</button></li>
            <li><button className="text-gray-100 hover:text-blue-300 font-medium transition-colors">Events</button></li>
            <li><button className="text-gray-100 hover:text-blue-300 font-medium transition-colors">Artists</button></li>
            <li><button className="text-gray-100 hover:text-blue-300 font-medium transition-colors">Recommended</button></li>
          </ul>
        </nav>
      </header>

      {/* HERO (full screen) */}
      <main className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden pt-16">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-concert.jpg"
            alt="Concert crowd and stage"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-white drop-shadow-lg text-center">Livet</h1>
        <p className="mt-4 text-xl sm:text-2xl italic text-white drop-shadow text-center">Life is a party</p>
      </main>

      {/* CITY EVENTS — slider with 3 squares per page */}
      <section className="w-full bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">City Events</h2>

          <FilterPills options={filters} value={eventFilter} onChange={setEventFilter} />

          <div className="relative mt-6 pr-10">
            {/* viewport */}
            <div className="overflow-hidden rounded-2xl">
              {/* track */}
              <div
                className="flex w-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${eventPage * 100}%)` }}
              >
                {/* pages */}
                {Array.from({ length: eventPages }).map((_, pageIdx) => {
                  const start = pageIdx * EVENTS_PER_PAGE;
                  const slice = events.slice(start, start + EVENTS_PER_PAGE);
                  return (
                    <div
                      key={pageIdx}
                      className="w-full shrink-0 px-2" // <-- add horizontal padding between pages
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {slice.map((label) => (
                          <button
                            key={label}
                            onClick={() => alert(`Open ${label}`)}
                            className="group relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-700" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <span className="absolute left-3 top-3 text-[11px] font-semibold px-2 py-1 rounded-full bg-black/70 text-white border border-white/10">
                              Promoted
                            </span>
                            <span className="absolute right-3 top-3 text-[11px] font-semibold px-2 py-1 rounded-full bg-white/80 text-neutral-800">
                              ❤ 2K
                            </span>
                            <span className="absolute left-4 bottom-3 text-sm sm:text-base text-white/90">
                              {label}
                            </span>
                            <div className="absolute inset-0 ring-0 group-hover:ring-4 ring-pink-500/20 transition-all" />
                          </button>
                        ))}
                        {/* keep grid filled if last page shorter */}
                        {slice.length < EVENTS_PER_PAGE &&
                          Array.from({ length: EVENTS_PER_PAGE - slice.length }).map((_, j) => (
                            <div key={`ev-empty-${j}`} className="aspect-square rounded-2xl border border-dashed border-neutral-800/50" />
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right arrow floated outside */}
            <RightArrow onClick={nextEventPage} label="Next events" />
          </div>
        </div>
      </section>

      {/* CITY ARTISTS — slider with 5 circles per page */}
      <section className="w-full bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">City Artists</h2>

          <FilterPills options={filters} value={artistFilter} onChange={setArtistFilter} />

          <div className="relative mt-6 pr-10">
            {/* viewport */}
            <div className="overflow-hidden">
              {/* track */}
              <div
                className="flex w-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${artistPage * 100}%)` }}
              >
                {/* pages */}
                {Array.from({ length: artistPages }).map((_, pageIdx) => {
                  const start = pageIdx * ARTISTS_PER_PAGE;
                  const slice = artists.slice(start, start + ARTISTS_PER_PAGE);
                  return (
                    <div
                      key={pageIdx}
                      className="w-full shrink-0 px-3" // <-- add horizontal padding between pages
                    >
                      <div className="flex items-start justify-between gap-6">
                        {slice.map((label) => (
                          <button
                            key={label}
                            onClick={() => alert(`Open ${label}`)}
                            className="flex flex-col items-center"
                          >
                            <div className="relative h-32 w-32 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-800 to-neutral-700">
                              <div className="absolute inset-0 ring-0 hover:ring-4 ring-blue-500/20 transition-all" />
                            </div>
                            <span className="mt-3 text-sm text-neutral-300">{label}</span>
                          </button>
                        ))}
                        {/* pad to 5 if fewer */}
                        {slice.length < ARTISTS_PER_PAGE &&
                          Array.from({ length: ARTISTS_PER_PAGE - slice.length }).map((_, j) => (
                            <div key={`ar-empty-${j}`} className="h-32 w-32 rounded-full opacity-0" />
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right arrow floated outside */}
            <RightArrow onClick={nextArtistPage} label="Next artists" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-4 bg-black/60 text-center">
        <span className="italic text-gray-200 text-sm">This app is for demonstration purposes only</span>
      </footer>
    </div>
  );
}
