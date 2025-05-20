// types/adminRoomLayout.type.ts (hoặc tương tự)

export interface AdminSeatType {
  type: number; // Trong API của bạn là số, ví dụ: 15
  name: string;
  avatar?: string;
  description?: string;
  displayOrder?: number;
  color: string;
}

export interface AdminSeat {
  id: string | null; // Có thể null nếu seatType là -1
  roomId: string;
  nameRow: string;
  rowIndex: number;
  colIndex: number;
  seatType: string; // Trong API của bạn là string, ví dụ: "15", "-1"
  status: string; // Ví dụ: "0"
  momoId?: string | null;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminRoom {
  id: string;
  cinemaId?: string; // Thêm các trường khác của Room nếu cần hiển thị
  name: string;
  totalCol: number;
  totalRow: number;
  seatTypes: AdminSeatType[];
  seats: AdminSeat[];
  createdAt?: string;
  updatedAt?: string;
}
