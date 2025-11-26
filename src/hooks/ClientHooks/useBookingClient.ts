// src/hooks/useBookingPage.ts
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { searchTrips } from "../../services/routeListServices/tripListServices.ts";

dayjs.locale("vi");

// Types
export interface Seat {
  id: number;
  name: string;
  floor: number;
  status?: "HOLD" | "SOLD" | "CANCELLED";
}

interface Province {
  id: number;
  nameProvince: string;
}

interface Location {
  id: number;
  nameLocations: string;
  province?: Province;
}

interface Vehicle {
  id: number;
  name: string;
  type: string;
  seatCount: number;
  licensePlate: string;
}

interface Route {
  id: number;
  fromLocation: Location;
  toLocation: Location;
}

interface TripPrice {
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
  price?: TripPrice;
  totalSeats: number;
  availableSeats: number;
  seats: Seat[];
}

// Map tên xe
export const VEHICLE_TYPE_MAP: Record<string, string> = {
  NORMAL: "Xe Khách Ngồi 45 chỗ",
  SLEEPER: "Xe Giường Nằm 36 chỗ",
  DOUBLESLEEPER: "Xe Giường Nằm VIP 22 chỗ",
  LIMOUSINE: "Xe Limousine 9 chỗ",
};

// Lấy giá mỗi ghế
export const getUnitPrice = (trip?: Trip) => {
  if (!trip?.price?.priceTrip && trip?.price?.priceTrip !== 0) return 0;
  const p = trip.price.priceTrip as any;
  const n = typeof p === "string" ? Number(p) : (p as number);
  return Number.isFinite(n) ? n : 0;
};

export interface DayOption {
  label: string;
  value: string;
}

// Hook chính
export function useBookingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // Lấy tham số tuyến từ URL
  const fromLocationId = searchParams.get("fromLocationId");
  const toLocationId = searchParams.get("toLocationId");
  // Ngày mặc định
  const today = dayjs().format("YYYY-MM-DD");
  const paramTripDateStart = searchParams.get("tripDateStart") || today;
  // Ngày bắt đầu xem chuyến
  const [tripDateStart, setTripDateStart] = useState(paramTripDateStart);
  // Danh sách chuyến
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  // Bộ lọc
  const [vehicleType, setVehicleType] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 1439]);
  const [seatRange, setSeatRange] = useState<[number, number]>([0, 60]);
  // Modal chọn ghế
  const [openModal, setOpenModal] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  // Chọn ngày trong 6 ngày
  const [activeDay, setActiveDay] = useState(tripDateStart);
  const [startIndex, setStartIndex] = useState(0);

  // Cập nhật khi URL đổi ngày
  useEffect(() => {
    setTripDateStart(paramTripDateStart);
    setActiveDay(paramTripDateStart);
  }, [paramTripDateStart]);

  // Tạo danh sách 6 ngày liên tiếp
  const days: DayOption[] = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = dayjs(tripDateStart).add(i, "day");
      const thu = d.locale("vi").format("dddd");
      return {
        label: `${thu.charAt(0).toUpperCase() + thu.slice(1)}, ${d.format(
          "DD/MM/YYYY"
        )}`,
        value: d.format("YYYY-MM-DD"),
      };
    });
  }, [tripDateStart]);

  // Fetch danh sách chuyến đi
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Nếu thiếu điểm đi/đến
        if (!fromLocationId || !toLocationId) {
          setTrips([]);
          return;
        }

        const res = await searchTrips({
          fromLocationId,
          toLocationId,
          startDate: tripDateStart,
          endDate: dayjs(tripDateStart).add(5, "day").format("YYYY-MM-DD"),
        });

        // Kiểm tra dữ liệu
        if (res && res.data && Array.isArray(res.data.data)) {
          setTrips(res.data.data);
        } else {
          setTrips([]);
        }
      } catch (err) {
        console.error("Lỗi fetch trips:", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchTrips();
  }, [fromLocationId, toLocationId, tripDateStart]);

  // sync URL
  const handleSelectDay = (value: string) => {
    setActiveDay(value);

    const newParams = new URLSearchParams(searchParams);
    newParams.set("tripDateStart", value);
    setSearchParams(newParams);
  };

  // Áp dụng bộ lọc
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Điều kiện lọc
      if (dayjs(trip.startDate).format("YYYY-MM-DD") !== activeDay)
        return false;
      if (vehicleType && trip.vehicle?.type !== vehicleType) return false;
      const parsedTime = dayjs(trip.startTime, "HH:mm:ss");
      const startMinutes = parsedTime.hour() * 60 + parsedTime.minute();
      if (startMinutes < timeRange[0] || startMinutes > timeRange[1])
        return false;
      const availableSeats = Number(trip.availableSeats) || 0;
      if (availableSeats < seatRange[0] || availableSeats > seatRange[1])
        return false;

      return true;
    });
  }, [trips, activeDay, vehicleType, timeRange, seatRange]);

  // Modal chọn ghế
  const openSeatModal = (trip: Trip) => {
    setSelectedVehicleType(trip.vehicle?.type || "");
    setSelectedSeats(trip.seats || []);
    setSelectedTrip(trip);
    setOpenModal(true);
  };

  // Xác nhận đặt vé
  const handleConfirmBooking = (trip: Trip, seats: Seat[]) => {
    // Lưu vào localStorage và điều hướng sang checkout
    localStorage.setItem("bookingData", JSON.stringify({ trip, seats }));
    setOpenModal(false);
    navigate("/checkout");
  };

  // Xóa bộ lọc
  const resetFilters = () => {
    setVehicleType(null);
    setTimeRange([0, 1439]);
    setSeatRange([0, 60]);
  };

  return {
    // dữ liệu chung
    loading,
    days,
    startIndex,
    setStartIndex,
    activeDay,
    handleSelectDay,
    // bộ lọc
    vehicleType,
    setVehicleType,
    timeRange,
    setTimeRange,
    seatRange,
    setSeatRange,
    resetFilters,
    // danh sách chuyến sau khi lọc
    filteredTrips,
    trips,
    // modal chọn ghế
    openModal,
    setOpenModal,
    selectedVehicleType,
    selectedSeats,
    selectedTrip,
    openSeatModal,
    handleConfirmBooking,
  };
}
