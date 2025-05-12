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
