
export interface BookedSeatInfo {
  seatId: string | null;
  price?: number;
  rowIndex: number;
  colIndex: number;
  seatType: string;
}

export interface BookedComboInfo {
  id: string;
  name?: string;
  pricePerUnit?: number;
  quantity: number;
  totalPrice: number;
}

export interface BookingPayload {
  seats: BookedSeatInfo[];
  combos: BookedComboInfo[];
  totalPriceSeats: number;
  totalPriceCombos: number;
  finalTotalPrice: number;

  showTimeId: string;
  roomId: string;
  movieName: string;
  cinemaName: string;
  roomName: string;
  showTimeDetails: string;

  paymentMethod: 'online' | 'offline';
  note: string;

  userId?: string;
}
