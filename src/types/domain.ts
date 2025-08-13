// src/types/domain.ts
export type Host = { id: string; name: string; followers: number };

export type Artist = {
  id: string;
  name: string;
  genre: string;
  followers: number;
};

export type Event = {
  id: string;
  name: string;
  genre: string;
  likes: number;
  hostId: string;
  artistIds: string[];
  distance: number; // miles
};
