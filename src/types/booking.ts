// Trạng thái ghế trong 1 chuyến cụ thể
export type SeatStatus = "HOLD" | "SOLD" | "CANCELLED" | undefined;

// Ghế (Seat trong Vehicle)
export interface Seat {
  id: number;
  name: string;
  floor: number;
  status?: SeatStatus;
}

// Tỉnh / Địa điểm
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
  numberFloors?: number;
}

// Tuyến
export interface Route {
  id: number;
  fromLocation: Location;
  toLocation: Location;
}

// Bảng giá chuyến
export interface TripPrice {
  id: number;
  coachRouteId: number;
  seatType: "SEAT" | "SLEEPER" | "DOUBLESLEEPER" | "LIMOUSINE";
  priceTrip: number | string;
  typeTrip: "NORMAL" | "HOLIDAY";
}

// Chuyến xe (CoachTrip)
export interface Trip {
  id: number;
  startDate: string;
  startTime: string;
  totalTime?: string;
  status: "OPEN" | "FULL" | "CANCELLED";
  route: Route;
  vehicle: Vehicle;
  price?: TripPrice;
  totalSeats: number;
  availableSeats: number;
  seats: Seat[];
}

// Thông tin tạm thời của booking
export interface BookingDraft {
  goTrip?: Trip;
  returnTrip?: Trip;
  goSeats?: Seat[];
  returnSeats?: Seat[];
}
