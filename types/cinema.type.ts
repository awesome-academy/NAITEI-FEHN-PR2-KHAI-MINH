import type { Room } from "./room.type";

export interface Cinema {
  id: string;
  name: string;
  address: string;
  city: string;
  logo: string;
  lat: number;
  lon: number;
  createdAt: string;
  updatedAt: string;
  rooms?: Room[];
}

export interface CinemaType {
  id: string;
  name: string;
  address: string;
  city: string;
  logo: string;
  lat: number;
  lon: number;
  createdAt: string;
  updatedAt: string;
}

export interface CinemaFormDataForModal
  extends Omit<Cinema, "rooms" | "createdAt" | "updatedAt"> {}
