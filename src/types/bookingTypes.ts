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
  method: string;
  amount: number;
  status: string;
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

export interface Booking {
  id: number;
  userId?: number;
  coachTripId: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  customers?: Customer[];
  points?: Point[];
  seats?: Seat[];
  payment?: Payment[];
  trip?: Trip;
}
