// src/data/mock.ts
import type { Artist, Event, Host } from "@/types/domain";

export const hosts: Host[] = [
  { id: "h1", name: "Neon Nights Co.",   followers: 48_200 },
  { id: "h2", name: "Downtown Live",     followers: 19_200 },
  { id: "h3", name: "Skyline Events",    followers: 76_500 },
  { id: "h4", name: "Harbor Collective", followers: 33_800 },
  { id: "h5", name: "Golden Stage",      followers: 58_600 },
];

export const artists: Artist[] = [
  { id: "a1",  name: "DJ Aurora",        genre: "EDM",        followers: 120_000 },
  { id: "a2",  name: "Midnight Trio",    genre: "Indie",      followers: 54_000 },
  { id: "a3",  name: "Luna Vox",         genre: "Pop",        followers: 220_000 },
  { id: "a4",  name: "Crimson Tide",     genre: "Rock",       followers: 87_000 },
  { id: "a5",  name: "Sable",            genre: "Hip-Hop",    followers: 133_000 },
  { id: "a6",  name: "Blue Echo",        genre: "R&B",        followers: 76_000 },
  { id: "a7",  name: "Sunset Drive",     genre: "House",      followers: 51_000 },
  { id: "a8",  name: "Velvet Lane",      genre: "Jazz",       followers: 29_000 },
  { id: "a9",  name: "Nova",             genre: "Pop",        followers: 201_000 },
  { id: "a10", name: "Ghostwave",        genre: "Electronic", followers: 99_000 },
  { id: "a11", name: "Starlight Choir",  genre: "Classical",  followers: 12_500 },
  { id: "a12", name: "Echo Pulse",       genre: "EDM",        followers: 142_000 },
  { id: "a13", name: "The Nomads",       genre: "Folk",       followers: 44_000 },
  { id: "a14", name: "Silver Strings",   genre: "Country",    followers: 61_000 },
  { id: "a15", name: "Urban Poets",      genre: "Hip-Hop",    followers: 187_000 },
  { id: "a16", name: "Dreamcatcher",     genre: "K-Pop",      followers: 390_000 },
  { id: "a17", name: "Obsidian Sun",     genre: "Metal",      followers: 73_000 },
  { id: "a18", name: "Golden Hour Band", genre: "Jazz",       followers: 26_000 },
  { id: "a19", name: "DeepFlow",         genre: "House",      followers: 112_000 },
  { id: "a20", name: "Cascadia",         genre: "Indie",      followers: 67_000 },
];

export const events: Event[] = [
  { id: "e1",  name: "Neon City Fest",      genre: "EDM",       likes: 2100, hostId: "h1", artistIds: ["a1","a7","a10"], distance: 2.3 },
  { id: "e2",  name: "Indie Under Stars",   genre: "Indie",     likes: 980,  hostId: "h2", artistIds: ["a2","a8"],        distance: 5.1 },
  { id: "e3",  name: "Luna Live",           genre: "Pop",       likes: 3400, hostId: "h1", artistIds: ["a3","a9"],        distance: 1.7 },
  { id: "e4",  name: "Crimson Arena",       genre: "Rock",      likes: 1260, hostId: "h2", artistIds: ["a4"],             distance: 3.4 },
  { id: "e5",  name: "Sable Sessions",      genre: "Hip-Hop",   likes: 1720, hostId: "h2", artistIds: ["a5"],             distance: 4.8 },
  { id: "e6",  name: "Blue Hour",           genre: "R&B",       likes: 880,  hostId: "h1", artistIds: ["a6"],             distance: 2.9 },

  { id: "e7",  name: "Harbor Jazz Nights",  genre: "Jazz",      likes: 430,  hostId: "h4", artistIds: ["a8","a18"],       distance: 7.2 },
  { id: "e8",  name: "Skyline Pulse",       genre: "EDM",       likes: 2980, hostId: "h3", artistIds: ["a12"],            distance: 12.0 },
  { id: "e9",  name: "Starlight Gala",      genre: "Classical", likes: 210,  hostId: "h5", artistIds: ["a11"],            distance: 15.0 },
  { id: "e10", name: "Country Roads Live",  genre: "Country",   likes: 740,  hostId: "h5", artistIds: ["a14"],            distance: 9.8 },
  { id: "e11", name: "Urban Flow",          genre: "Hip-Hop",   likes: 2410, hostId: "h3", artistIds: ["a15"],            distance: 2.0 },
  { id: "e12", name: "Dreamcatcher Tour",   genre: "K-Pop",     likes: 5600, hostId: "h1", artistIds: ["a16"],            distance: 6.5 },
  { id: "e13", name: "Obsidian Rock Fest",  genre: "Metal",     likes: 1330, hostId: "h4", artistIds: ["a17"],            distance: 4.2 },
  { id: "e14", name: "Golden Hour Live",    genre: "Jazz",      likes: 390,  hostId: "h5", artistIds: ["a18"],            distance: 8.6 },
  { id: "e15", name: "DeepFlow Party",      genre: "House",     likes: 1990, hostId: "h3", artistIds: ["a19","a7"],       distance: 1.5 },
  { id: "e16", name: "Cascadia Indie Fest", genre: "Indie",     likes: 870,  hostId: "h2", artistIds: ["a2","a20"],       distance: 13.4 },
  { id: "e17", name: "Nova Lights",         genre: "Pop",       likes: 2780, hostId: "h1", artistIds: ["a9"],             distance: 3.3 },
  { id: "e18", name: "Rock the Harbor",     genre: "Rock",      likes: 1650, hostId: "h4", artistIds: ["a4","a17"],       distance: 6.8 },
  { id: "e19", name: "Velvet Lane Session", genre: "Jazz",      likes: 310,  hostId: "h5", artistIds: ["a8"],             distance: 2.6 },
  { id: "e20", name: "Skyline Beats",       genre: "EDM",       likes: 4510, hostId: "h3", artistIds: ["a1","a12"],       distance: 10.0 },
];
