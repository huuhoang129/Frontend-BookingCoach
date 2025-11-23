export interface Customer {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
}

export interface Point {
  id: number;
  type: "PICKUP" | "DROPOFF";
  locationId: number;
  time?: string;
  note?: string;
  Location?: { id: number; nameLocations: string };
}

export interface Seat {
  id: number;
  seatId: number;
  price: number;
}

export interface Payment {
  id: number;
  method: "CASH" | "BANKING" | "VNPAY";
  amount: number;
  status: "SUCCESS" | "FAILED" | "PENDING";
}

export interface Trip {
  id: number;
  startDate: string;
  startTime: string;
  route?: {
    fromLocation: { nameLocations: string };
    toLocation: { nameLocations: string };
  };
}

/** 🎯 BookingStatus: khớp enum DB */
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";

export interface Booking {
  id: number;
  userId?: number;
  coachTripId: number;
  status: BookingStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  customers?: Customer[];
  points?: Point[];
  seats?: Seat[];
  payment?: Payment[];
  trip?: Trip;
  bookingCode?: string;
}
