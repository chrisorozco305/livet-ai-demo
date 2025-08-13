// src/data/mock.ts
import type { Artist, Event, Host } from "@/types/domain";

export const hosts: Host[] = [
  { id: "h1", name: "Neon Nights Co.", followers: 48_200 },
  { id: "h2", name: "Downtown Live", followers: 19_200 },
];

export const artists: Artist[] = [
  { id: "a1",  name: "DJ Aurora",       genre: "EDM",        followers: 120_000 },
  { id: "a2",  name: "Midnight Trio",   genre: "Indie",      followers: 54_000 },
  { id: "a3",  name: "Luna Vox",        genre: "Pop",        followers: 220_000 },
  { id: "a4",  name: "Crimson Tide",    genre: "Rock",       followers: 87_000 },
  { id: "a5",  name: "Sable",           genre: "Hip-Hop",    followers: 133_000 },
  { id: "a6",  name: "Blue Echo",       genre: "R&B",        followers: 76_000 },
  { id: "a7",  name: "Sunset Drive",    genre: "House",      followers: 51_000 },
  { id: "a8",  name: "Velvet Lane",     genre: "Jazz",       followers: 29_000 },
  { id: "a9",  name: "Nova",            genre: "Pop",        followers: 201_000 },
  { id: "a10", name: "Ghostwave",       genre: "Electronic", followers: 99_000 },
];

export const events: Event[] = [
  { id: "e1", name: "Neon City Fest",     genre: "EDM",    likes: 2100, hostId: "h1", artistIds: ["a1","a7","a10"], distance: 2.3 },
  { id: "e2", name: "Indie Under Stars",  genre: "Indie",  likes: 980,  hostId: "h2", artistIds: ["a2","a8"],        distance: 5.1 },
  { id: "e3", name: "Luna Live",          genre: "Pop",    likes: 3400, hostId: "h1", artistIds: ["a3","a9"],        distance: 1.7 },
  { id: "e4", name: "Crimson Arena",      genre: "Rock",   likes: 1260, hostId: "h2", artistIds: ["a4"],             distance: 3.4 },
  { id: "e5", name: "Sable Sessions",     genre: "Hip-Hop",likes: 1720, hostId: "h2", artistIds: ["a5"],             distance: 4.8 },
  { id: "e6", name: "Blue Hour",          genre: "R&B",    likes: 880,  hostId: "h1", artistIds: ["a6"],             distance: 2.9 },
];
