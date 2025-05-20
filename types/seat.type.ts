export interface Seat {
  id: string | null; // id có thể null nếu là ghế không hợp lệ hoặc lối đi từ dữ liệu gốc
  dbId?: string; // Một id duy nhất từ DB nếu có, khác với id hiển thị/momoId
  roomId: string;
  showTimeId?: string; // QUAN TRỌNG: Để biết ghế này thuộc suất chiếu nào
  nameRow: string;
  rowIndex: number;
  colIndex: number;
  seatType: string; // "-1" cho lối đi, hoặc id của SeatType
  status: string;   // "0" (trống), "1" (đã đặt), "selected" (đang chọn - client-side)
  momoId?: string | null; // Hoặc một định danh ghế khác
  price: number;
  createdAt?: string;
  updatedAt?: string;
}
