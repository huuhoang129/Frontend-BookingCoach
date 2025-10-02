export type SeatStatus = "AVAILABLE" | "HOLD" | "SOLD";

// Ghế
export interface Seat {
  id: number;
  name: string;
  status: "AVAILABLE" | "HOLD" | "SOLD";
  floor: number;
}

// Tỉnh, địa điểm
export interface Province {
  id: number;
  nameProvince: string;
}
export interface Location {
  id: number;
  nameLocations: string;
  province?: Province;
}

// Xe
export interface Vehicle {
  id: number;
  name: string;
  type: string;
  seatCount: number;
  licensePlate: string;
}

// Tuyến
export interface Route {
  id: number;
  fromLocation: Location;
  toLocation: Location;
}

export interface TripPrice {
  id: number;
  coachRouteId: number;
  seatType: "SEAT" | "SLEEPER" | "DOUBLESLEEPER" | "LIMOUSINE";
  priceTrip: number | string;
  typeTrip: "NORMAL" | "HOLIDAY";
}

export interface Trip {
  id: number;
  startDate: string;
  startTime: string;
  totalTime?: string;
  status: string;
  route: Route;
  vehicle: Vehicle;
  price?: TripPrice; // ✅ thay basePrice
  totalSeats: number;
  availableSeats: number;
  seats: Seat[];
}
