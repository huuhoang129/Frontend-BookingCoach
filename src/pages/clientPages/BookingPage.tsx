// src/pages/BookingPage/BookingPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import FormInputSearchCoach from "../../components/ui/Form/FormInputSearchCoach";
import { searchTrips } from "../../services/routeListServices/tripListServices.ts";
import "./BookingPage.scss";
import SeatBookingModal from "../../containers/ModalsCollect/SeatBookingModal";
import { formatDuration, formatStartTime, calcEndTime } from "../../utils/time";
import { capitalizeFirst } from "../../utils/string";
import {
  LeftOutlined,
  RightOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import DefaultBusImg from "../../assets/logo/default-bus.jpg";

dayjs.locale("vi");

/* ---------------- Types ---------------- */
interface Seat {
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

interface Trip {
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

/* ---------------- DualRangeSlider ---------------- */
interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  defaultMin: number;
  defaultMax: number;
  formatLabel?: (val: number) => string;
  onChange?: (min: number, max: number) => void;
}

function DualRangeSlider({
  min,
  max,
  step = 1,
  defaultMin,
  defaultMax,
  formatLabel,
  onChange,
}: DualRangeSliderProps) {
  const [minVal, setMinVal] = useState(defaultMin);
  const [maxVal, setMaxVal] = useState(defaultMax);

  const getPercent = (value: number) =>
    Math.round(((value - min) / (max - min)) * 100);

  const left = getPercent(minVal);
  const width = getPercent(maxVal) - getPercent(minVal);

  useEffect(() => {
    onChange?.(minVal, maxVal);
  }, [minVal, maxVal]);

  return (
    <div className="mobi-multi-range">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={(e) =>
          setMinVal(Math.min(Number(e.target.value), maxVal - step))
        }
        className="thumb thumb--left"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={(e) =>
          setMaxVal(Math.max(Number(e.target.value), minVal + step))
        }
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track"></div>
        <div
          className="slider__range"
          style={{ left: `${left}%`, width: `${width}%` }}
        ></div>
        <div className="slider__left-value">
          {formatLabel ? formatLabel(minVal) : minVal}
        </div>
        <div className="slider__right-value">
          {formatLabel ? formatLabel(maxVal) : maxVal}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Helpers ---------------- */
const VEHICLE_TYPE_MAP: Record<string, string> = {
  NORMAL: "Xe Khách Ngồi 45 chỗ",
  SLEEPER: "Xe Giường Nằm 36 chỗ",
  DOUBLESLEEPER: "Xe Giường Nằm VIP 22 chỗ",
  LIMOUSINE: "Xe Limousine 9 chỗ",
};

const getUnitPrice = (trip?: Trip) => {
  if (!trip?.price?.priceTrip && trip?.price?.priceTrip !== 0) return 0;
  const p = trip.price.priceTrip as any;
  const n = typeof p === "string" ? Number(p) : (p as number);
  return Number.isFinite(n) ? n : 0;
};

/* ---------------- BookingPage ---------------- */
export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fromLocationId = searchParams.get("fromLocationId");
  const toLocationId = searchParams.get("toLocationId");

  const today = dayjs().format("YYYY-MM-DD");
  const tripDateStart = searchParams.get("tripDateStart") || today;

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleType, setVehicleType] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 1439]);
  const [seatRange, setSeatRange] = useState<[number, number]>([0, 60]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [activeDay, setActiveDay] = useState(tripDateStart);
  const [startIndex, setStartIndex] = useState(0);

  const days = Array.from({ length: 6 }, (_, i) => {
    const d = dayjs(tripDateStart).add(i, "day");
    const thu = capitalizeFirst(d.format("dddd"));
    return {
      label: `${thu}, ${d.format("DD/MM/YYYY")}`,
      value: d.format("YYYY-MM-DD"),
    };
  });

  const handleConfirmBooking = (trip: Trip, seats: Seat[]) => {
    localStorage.setItem("bookingData", JSON.stringify({ trip, seats }));
    navigate("/checkout");
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        if (!fromLocationId || !toLocationId) return;

        const res = await searchTrips({
          fromLocationId,
          toLocationId,
          startDate: tripDateStart,
          endDate: dayjs(tripDateStart).add(5, "day").format("YYYY-MM-DD"),
        });

        if (res && res.data && Array.isArray(res.data.data)) {
          setTrips(res.data.data);
        } else {
          setTrips([]);
        }
      } catch (err) {
        console.error("❌ Lỗi fetch trips:", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchTrips();
  }, [fromLocationId, toLocationId, tripDateStart]);

  if (loading) {
    return <p className="booking-loading">Đang tải chuyến xe...</p>;
  }

  return (
    <div className="booking-page">
      {/* Banner */}
      <div className="banner-booking-wrapper">
        <div className="bus-search_bgSearch__nV7TX"></div>
        <div className="search-box-coach">
          <FormInputSearchCoach />
        </div>
      </div>

      <div className="booking-wrapper">
        {/* Bộ lọc bên trái */}
        <div className="filter-panel">
          <div className="filter-inner">
            <div className="filter-header">
              <h3>BỘ LỌC</h3>
              <button
                className="reset-btn"
                onClick={() => {
                  setVehicleType(null);
                  setTimeRange([0, 1439]);
                  setSeatRange([0, 60]);
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>

            {/* Loại xe */}
            <div className="filter-section">
              <h4>Loại xe</h4>
              <div className="filter-options">
                {Object.keys(VEHICLE_TYPE_MAP).map((type) => (
                  <label key={type}>
                    <input
                      type="radio"
                      name="vehicleType"
                      value={type}
                      checked={vehicleType === type}
                      onChange={() =>
                        setVehicleType((prev) => (prev === type ? null : type))
                      }
                    />
                    {VEHICLE_TYPE_MAP[type]}
                  </label>
                ))}
              </div>
            </div>

            {/* Giờ chạy */}
            <div className="filter-section">
              <h4>Giờ chạy</h4>
              <DualRangeSlider
                min={0}
                max={1439}
                defaultMin={timeRange[0]}
                defaultMax={timeRange[1]}
                step={1}
                formatLabel={(val) =>
                  dayjs().startOf("day").add(val, "minute").format("HH:mm")
                }
                onChange={(min, max) => setTimeRange([min, max])}
              />
            </div>

            {/* Lượng ghế trống */}
            <div className="filter-section">
              <h4>Lượng ghế trống</h4>
              <DualRangeSlider
                min={0}
                max={60}
                defaultMin={seatRange[0]}
                defaultMax={seatRange[1]}
                onChange={(min, max) => setSeatRange([min, max])}
              />
            </div>
          </div>
        </div>

        {/* Danh sách chuyến bên phải */}
        <div className="trip-list">
          {/* Chọn thứ */}
          <section className="trip-section weekday-section">
            <button
              className={`arrow left ${startIndex === 0 ? "hidden" : ""}`}
              onClick={() => setStartIndex((i) => Math.max(i - 1, 0))}
              disabled={startIndex === 0}
            >
              <LeftOutlined />
            </button>

            <div className="weekday-list">
              {days.slice(startIndex, startIndex + 4).map((day, idx) => (
                <button
                  key={idx}
                  className={`weekday ${
                    activeDay === day.value ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveDay(day.value);
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set("tripDateStart", day.value);
                    window.history.replaceState(
                      {},
                      "",
                      `${window.location.pathname}?${newParams.toString()}`
                    );
                  }}
                >
                  {day.label}
                </button>
              ))}
            </div>

            <button
              className={`arrow right ${
                startIndex >= days.length - 4 ? "hidden" : ""
              }`}
              onClick={() =>
                setStartIndex((i) => Math.min(i + 1, days.length - 4))
              }
              disabled={startIndex >= days.length - 4}
            >
              <RightOutlined />
            </button>
          </section>

          {/* Danh sách chuyến */}
          <section className="trip-section trip-list-section">
            <div className="booking-list">
              {(() => {
                const filteredTrips = trips.filter((trip) => {
                  if (dayjs(trip.startDate).format("YYYY-MM-DD") !== activeDay)
                    return false;
                  if (vehicleType && trip.vehicle?.type !== vehicleType)
                    return false;

                  const startMinutes =
                    dayjs(trip.startTime, "HH:mm:ss").hour() * 60 +
                    dayjs(trip.startTime, "HH:mm:ss").minute();
                  if (
                    startMinutes < timeRange[0] ||
                    startMinutes > timeRange[1]
                  )
                    return false;

                  const availableSeats = Number(trip.availableSeats) || 0;
                  if (
                    availableSeats < seatRange[0] ||
                    availableSeats > seatRange[1]
                  )
                    return false;

                  return true;
                });

                if (filteredTrips.length === 0) {
                  return (
                    <p className="booking-empty">Hiện tại chưa có lịch chạy</p>
                  );
                }

                return filteredTrips.map((trip) => {
                  const totalSeats = Number(trip.totalSeats) || 0;
                  const availableSeats = Number(trip.availableSeats) || 0;
                  const unitPrice = getUnitPrice(trip);

                  return (
                    <div key={trip.id} className="booking-card">
                      <div className="trip-image">
                        <img src={DefaultBusImg} alt="bus" />
                      </div>

                      <div className="trip-details">
                        <div className="trip-name">
                          <h3>Hương Dương</h3>
                          <span className="vehicle-type">
                            {trip.vehicle?.type &&
                              VEHICLE_TYPE_MAP[trip.vehicle?.type]}
                          </span>
                          <p className="trip-start">
                            <ClockCircleOutlined
                              style={{ marginRight: 6, color: "#13663b" }}
                            />
                            Khởi hành lúc: {formatStartTime(trip.startTime)}
                          </p>
                        </div>

                        <div className="trip-time">
                          <div className="time-left">
                            <p>{formatStartTime(trip.startTime)}</p>
                          </div>
                          <div className="time-middle">
                            <span className="time-duration">
                              {formatDuration(trip.totalTime)}
                            </span>
                          </div>
                          <div className="time-right">
                            <p>
                              {calcEndTime(trip.startTime, trip.totalTime) ||
                                "??:??"}
                            </p>
                          </div>
                        </div>

                        <div className="trip-seats">
                          <p>
                            Còn{" "}
                            <span className="available">{availableSeats}</span>/
                            {totalSeats} chỗ
                          </p>
                          <div className="seats-bar">
                            <div
                              className="seats-fill"
                              style={{
                                width: `${
                                  (availableSeats / (totalSeats || 1)) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="trip-price">
                          {unitPrice.toLocaleString("vi-VN")} đ
                        </div>
                      </div>

                      <div className="trip-action">
                        <button
                          className="booking-btn"
                          onClick={() => {
                            setSelectedVehicleType(trip.vehicle?.type || "");
                            setSelectedSeats(trip.seats || []);
                            setSelectedTrip(trip);
                            setOpenModal(true);
                          }}
                        >
                          Đặt xe
                        </button>
                      </div>

                      <SeatBookingModal
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        onConfirm={handleConfirmBooking}
                        vehicleType={selectedVehicleType}
                        seats={selectedSeats}
                        trip={selectedTrip as any}
                      />
                    </div>
                  );
                });
              })()}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
