import type { Cinema } from "./cinema.type";

export interface Seat {
  seatId: string;
  name: string;
  price: number;
  rowIndex: number;
  colIndex: number;
  seatType: string;
}

export interface Combo {
  id: string;
  name: string;
  pricePerUnit: number;
  quantity: number;
  totalPrice: number;
}

export interface SeatType {
  type: number;
  name: string;
  avatar: string;
  description: string;
  displayOrder: number;
  color: string;
}

export interface Room {
  id: string;
  cinemaId: string;
  name: string;
  totalCol: number;
  totalRow: number;
  seatTypes: SeatType[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  seats: Seat[];
  combos: Combo[];
  cinema: Cinema;
  cinemaId: string;
  totalPriceSeats: number;
  totalPriceCombos: number;
  finalTotalPrice: number;
  showTimeId: string;
  roomId: string;
  movieName: string;
  cinemaName: string;
  roomName: string;
  showTimeDetails: string;
  paymentMethod: string;
  note?: string;
  userId: string;
  bookingRequestTime: string;
  room: Room;
}
