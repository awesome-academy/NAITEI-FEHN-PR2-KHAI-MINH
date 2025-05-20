// For seats as part of a fetched Booking object from db.json
export interface SeatInBooking {
  seatId: string; // This is the ID of the seat in the /seats collection (e.g., "00900601")
  name: string;   // User-friendly seat name (e.g., "H6")
  price: number;
  rowIndex: number;
  colIndex: number;
  seatType: string; // ID of the seat type
}

// For combos as part of a fetched Booking object from db.json
export interface ComboInBooking {
  id: string; // Combo ID (e.g., "sweet_combo_69")
  name: string;
  pricePerUnit: number;
  quantity: number;
  totalPrice: number;
}

// Represents a complete booking object as fetched from the server or stored in db.json
export interface Booking {
  id: number; // In your db.json sample, id is a number
  seats: SeatInBooking[];
  combos: ComboInBooking[];
  totalPriceSeats: number;
  totalPriceCombos: number;
  finalTotalPrice: number;
  showTimeId: string;
  roomId: string;
  movieName: string;
  cinemaName: string;
  roomName: string;
  showTimeDetails: string; // e.g., "17:15 ~ 19:18"
  paymentMethod: 'online' | 'offline';
  note?: string;
  userId: string;
  bookingRequestTime: string; // ISO Date string, e.g., "2025-05-19T04:19:59.164Z"
  status: 'pending' | 'accepted' | 'rejected'; // Status of the booking
}

// --- Existing types for BookingPayload (used when creating a new booking) ---

// Information for a seat when creating a booking
export interface BookedSeatInfo {
  seatId: string | null; // seatId from the /seats collection
  // name is not part of payload, it's derived from seatId or known by client
  price?: number; // Price might be sent or confirmed by server
  rowIndex: number; // For reference or validation
  colIndex: number; // For reference or validation
  seatType: string; // ID of the seat type
}

// Information for a combo when creating a booking
export interface BookedComboInfo {
  id: string; // Combo ID
  name?: string; // Optional in payload, can be fetched by id if needed
  pricePerUnit?: number; // Optional in payload
  quantity: number;
  totalPrice: number; // Usually calculated: pricePerUnit * quantity
}

// Payload sent to the server to create a new booking
export interface BookingPayload {
  seats: BookedSeatInfo[];
  combos: BookedComboInfo[];
  totalPriceSeats: number;
  totalPriceCombos: number;
  finalTotalPrice: number;
  showTimeId: string;
  cinemaId: string;
  movieId: string;
  roomId: string;
  movieName: string; // Denormalized for easier display/query later
  cinemaName: string; // Denormalized
  roomName: string; // Denormalized
  showTimeDetails: string; // Denormalized
  paymentMethod: 'online' | 'offline';
  note: string;
  userId?: string; // Should be set by the server based on authenticated user or passed if admin creates for user
  // bookingRequestTime, id, and initial status ('pending') are typically set by the server upon creation.
}
