"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { events as eventList, artists as artistList, hosts as hostList } from "@/data/mock";

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

function LeftArrow({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 left-[-32px] sm:left-[-40px] z-10 rounded-full bg-black/70 text-white border border-white/10 h-10 w-10 flex items-center justify-center hover:bg-black/80 active:scale-95 transition shadow-lg"
      style={{ pointerEvents: "auto" }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M16 4L8 12l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
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

// Heart icon that can be outlined or filled red
function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      className={filled ? "text-red-500" : "text-neutral-900"}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

/* ---------- Page ---------- */
export default function Home() {
  const router = useRouter();
  const filters = ["Suggested", "Popular", "Near", "Likes", "Following"];
  const artistFilters = ["Suggested", "Popular", "Following"];

  const [eventFilter, setEventFilter] = useState("Suggested");
  const [artistFilter, setArtistFilter] = useState("Suggested");

  // Follow state (hosts for events, artists for artists)
  const [followedHosts, setFollowedHosts] = useState<Set<string>>(new Set());
  const [followedArtists, setFollowedArtists] = useState<Set<string>>(new Set());

  // Like state for events (ids of liked events)
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());

  const toggleFollowHost = (hostId: string) => {
    setFollowedHosts((prev) => {
      const next = new Set(prev);
      next.has(hostId) ? next.delete(hostId) : next.add(hostId);
      return next;
    });
  };
  const toggleFollowArtist = (artistId: string) => {
    setFollowedArtists((prev) => {
      const next = new Set(prev);
      next.has(artistId) ? next.delete(artistId) : next.add(artistId);
      return next;
    });
  };
  const toggleLikeEvent = (eventId: string) => {
    setLikedEvents((prev) => {
      const next = new Set(prev);
      next.has(eventId) ? next.delete(eventId) : next.add(eventId);
      return next;
    });
  };

  // source data
  const hosts = hostList;

  // filter Events
  let events = eventList;
  if (eventFilter === "Near") {
    events = [...events].sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  } else if (eventFilter === "Popular") {
    events = [...events].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  } else if (eventFilter === "Likes") {
    events = events.filter((e) => likedEvents.has(e.id));
  } else if (eventFilter === "Following") {
    events = events.filter((e) => followedHosts.has(e.hostId));
  }

  // filter Artists
  let artists = artistList;
  if (artistFilter === "Popular") {
    artists = [...artists].sort((a, b) => (b.followers ?? 0) - (a.followers ?? 0));
  } else if (artistFilter === "Following") {
    artists = artists.filter((a) => followedArtists.has(a.id));
  }

  // lookups
  const hostById = useMemo(() => new Map(hosts.map((h) => [h.id, h])), [hosts]);
  const artistById = useMemo(() => new Map(artistList.map((a) => [a.id, a])), []); // full list for names

  // paging (safe when empty)
  const EVENTS_PER_PAGE = 3;
  const ARTISTS_PER_PAGE = 5;
  const eventPages = Math.max(1, Math.ceil(events.length / EVENTS_PER_PAGE));
  const artistPages = Math.max(1, Math.ceil(artists.length / ARTISTS_PER_PAGE));
  const [eventPage, setEventPage] = useState(0);
  const [artistPage, setArtistPage] = useState(0);

  const nextEventPage = () => setEventPage((p) => (p + 1) % eventPages);
  const prevEventPage = () => setEventPage((p) => (p - 1 + eventPages) % eventPages);
  const nextArtistPage = () => setArtistPage((p) => (p + 1) % artistPages);
  const prevArtistPage = () => setArtistPage((p) => (p - 1 + artistPages) % artistPages);

  const [profileOpen, setProfileOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      // @ts-ignore
      if (!(e.target as HTMLElement)?.closest("#profile-menu")) setProfileOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  return (
    <div className="min-h-screen w-screen font-sans relative flex flex-col">
      {/* HEADER - fixed */}
      <header className="fixed top-0 inset-x-0 z-20 h-16 flex items-center justify-between px-8 shadow-sm border-b border-gray-200/50 dark:border-gray-800/60 bg-black/60 backdrop-blur">
        <div className="text-2xl font-bold text-gray-100 dark:text-white">Livet</div>
        <div className="relative" id="profile-menu">
          <button
            aria-label="Profile"
            className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow hover:scale-105 transition"
            onClick={() => setProfileOpen((v) => !v)}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6" />
            </svg>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 z-50 py-2">
              <button
                className="w-full text-left px-4 py-2 text-sm text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                onClick={() => {
                  setProfileOpen(false);
                  // TODO: Add sign out logic here
                  alert("Signed out!");
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <main className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden pt-16">
        <div className="absolute inset-0 -z-10">
          <Image src="/hero-concert.jpg" alt="Concert crowd and stage" fill style={{ objectFit: "cover" }} priority unoptimized />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white drop-shadow-lg text-center">Livet</h1>
        <p className="mt-4 text-xl sm:text-2xl italic text-white drop-shadow text-center">Life is a party</p>
      </main>

      {/* FOR YOU */}
      <section className="w-full bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">For You</h2>

          <FilterPills options={filters} value={eventFilter} onChange={(v) => { setEventFilter(v); setEventPage(0); }} />

          <div className="relative mt-6 pr-10">
            <LeftArrow onClick={prevEventPage} label="Previous events" />
            <div className="overflow-hidden rounded-2xl">
              <div className="flex w-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${eventPage * 100}%)` }}>
                {Array.from({ length: eventPages }).map((_, pageIdx) => {
                  const start = pageIdx * EVENTS_PER_PAGE;
                  const slice = events.slice(start, start + EVENTS_PER_PAGE);
                  return (
                    <div key={pageIdx} className="w-full shrink-0 px-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {slice.length === 0 && <div className="col-span-3 text-center py-16 text-neutral-500">No events to display.</div>}
                        {slice.map((ev) => {
                          const host = hostById.get(ev.hostId);
                          const isFollowingHost = !!host && followedHosts.has(host.id);
                          const isLiked = likedEvents.has(ev.id);
                          const displayLikes = ev.likes + (isLiked ? 1 : 0);

                          return (
                            <div key={ev.id} className="flex flex-col items-center">
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => router.push(`/event/${ev.id}`)}
                                onKeyDown={(e) => { if (e.key === "Enter") router.push(`/event/${ev.id}`); }}
                                className="group relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 w-full cursor-pointer"
                              >
                                {/* Event Image / placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#232326" }}>
                                  <span
                                    className="text-2xl sm:text-3xl font-bold text-white drop-shadow text-center w-full select-none"
                                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
                                  >
                                    {ev.name}
                                  </span>
                                </div>

                                {/* Like + Follow (top-left) */}
                                <div className="absolute left-3 top-3 flex gap-2 z-10">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); toggleLikeEvent(ev.id); }}
                                    className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-white/90 text-neutral-900 border border-white/30 hover:bg-white pointer-events-auto"
                                  >
                                    <Heart filled={isLiked} />
                                    {displayLikes.toLocaleString()}
                                  </button>
                                  {host && (
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); toggleFollowHost(host.id); }}
                                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold transition-colors pointer-events-auto ${
                                        isFollowingHost ? "bg-gray-600 hover:bg-gray-500" : "bg-pink-600 hover:bg-pink-700"
                                      }`}
                                    >
                                      {isFollowingHost ? "Following" : "Follow Host"}
                                    </button>
                                  )}
                                </div>

                                {/* Distance */}
                                <span className="absolute right-3 top-3 text-[11px] font-semibold px-2 py-1 rounded-full bg-black/70 text-white border border-white/10">
                                  {ev.distance?.toFixed(1) ?? "0.0"} mi
                                </span>

                                {/* Details */}
                                {(() => {
                                  const performerNames = ev.artistIds.map((id) => artistById.get(id)?.name).filter(Boolean) as string[];
                                  const performerLine =
                                    performerNames.length > 2
                                      ? `${performerNames.slice(0, 2).join(", ")} +${performerNames.length - 2}`
                                      : performerNames.join(", ");
                                  return (
                                    <div className="absolute left-4 right-4 bottom-3 space-y-0.5 text-white drop-shadow">
                                      <div className="text-sm sm:text-base font-semibold">{ev.name}</div>
                                      <div className="text-xs text-white/90">
                                        {ev.genre}
                                        {performerLine ? ` • ${performerLine}` : ""}
                                      </div>
                                      {host && (
                                        <div className="text-[11px] text-white/80">
                                          Host: {host.name} • {host.followers.toLocaleString()} followers
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}
                                <div className="absolute inset-0 ring-0 group-hover:ring-4 ring-pink-500/20 transition-all pointer-events-none" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <RightArrow onClick={nextEventPage} label="Next events" />
          </div>
        </div>
      </section>

      {/* CITY ARTISTS */}
      <section className="w-full bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">City Artists</h2>

          <FilterPills options={artistFilters} value={artistFilter} onChange={(v) => { setArtistFilter(v); setArtistPage(0); }} />

          <div className="relative mt-6 pr-10">
            <LeftArrow onClick={prevArtistPage} label="Previous artists" />
            <div className="overflow-hidden">
              <div className="flex w-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${artistPage * 100}%)` }}>
                {Array.from({ length: artistPages }).map((_, pageIdx) => {
                  const start = pageIdx * ARTISTS_PER_PAGE;
                  const slice = artists.slice(start, start + ARTISTS_PER_PAGE);
                  return (
                    <div key={pageIdx} className="w-full shrink-0 px-3">
                      <div className="flex items-start justify-between gap-6">
                        {slice.length === 0 && <div className="w-full text-center py-16 text-neutral-500">No artists to display.</div>}
                        {slice.map((ar) => {
                          const isFollowingArtist = followedArtists.has(ar.id);
                          return (
                            <div key={ar.id} className="flex flex-col items-center">
                              <button className="relative h-32 w-32 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
                                {/* Image fills the circle; fallback to default */}
                                <Image
                                  src={ar?.image || "/default-artist.jpg"}
                                  alt={ar.name}
                                  fill
                                  className="object-cover object-center"
                                  sizes="128px"
                                  unoptimized
                                />
                                <div className="absolute inset-0 ring-0 hover:ring-4 ring-blue-500/20 transition-all" />
                              </button>
                              <span className="mt-3 text-sm text-neutral-100 font-medium">{ar.name}</span>
                              <span className="text-xs text-neutral-400">
                                {ar.genre} • {ar.followers.toLocaleString()} followers
                              </span>
                              <button
                                onClick={() => toggleFollowArtist(ar.id)}
                                className={`mt-2 px-4 py-1.5 rounded-full text-white text-xs font-semibold transition-colors ${
                                  isFollowingArtist ? "bg-gray-600 hover:bg-gray-500" : "bg-pink-600 hover:bg-pink-700"
                                }`}
                              >
                                {isFollowingArtist ? "Following" : "Follow"}
                              </button>
                            </div>
                          );
                        })}
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
