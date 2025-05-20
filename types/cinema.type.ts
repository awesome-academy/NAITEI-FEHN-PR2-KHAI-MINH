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
