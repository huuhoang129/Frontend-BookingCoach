// types/booking.ts

export type SeatStatus = "AVAILABLE" | "HOLD" | "SOLD";

export interface Seat {
  id: number;
  name: string;
  status: SeatStatus;
  floor: number;
}

export interface Province {
  id: number;
  nameProvince: string;
}

export interface Location {
  id: number;
  nameLocations: string;
  province?: Province;
}

export interface Vehicle {
  id: number;
  name: string;
  type: string;
  seatCount: number;
}

export interface Route {
  id: number;
  fromLocation: Location;
  toLocation: Location;
}

export interface Trip {
  id: number;
  startDate: string;
  startTime: string;
  totalTime?: string;
  status: string;
  route: Route;
  vehicle: Vehicle;
  basePrice: number;
  totalSeats: number;
  availableSeats: number;
  seats: Seat[];
}
