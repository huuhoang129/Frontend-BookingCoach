import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import FormInputSearchCoach from "../../components/ui/Form/FormInputSearchCoach";
import { searchTrips } from "../../services/stationServices/tripServices.ts";
import "./BookingPage.scss";
import SeatBookingModal from "../../containers/ModalsCollect/SeatBookingModal";
import { formatDuration, formatStartTime, calcEndTime } from "../../utils/time";
import { useNavigate } from "react-router-dom";
import { capitalizeFirst } from "../../utils/string";
import {
  LeftOutlined,
  RightOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import DefaultBusImg from "../../assets/logo/default-bus.jpg";

dayjs.locale("vi");

/* ---------------- Types ---------------- */
interface Seat {
  id: number;
  name: string;
  status: "AVAILABLE" | "HOLD" | "SOLD";
  floor: number;
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
interface Trip {
  id: number;
  startDate: string;
  startTime: string;
  totalTime?: string;
  status: string;
  route: Route;
  vehicle: Vehicle;
  basePrice: number;
  totalSeats: number; // backend trả về
  availableSeats: number; // backend trả về
  seats: Seat[];
}

interface BookingDraft {
  goTrip?: Trip;
  returnTrip?: Trip;
  goSeats?: Seat[];
  returnSeats?: Seat[];
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
    if (onChange) onChange(minVal, maxVal);
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
  Normal: "Xe Khách Ngồi 45 chỗ",
  Sleeper: "Xe Giường Nằm 36 chỗ",
  DoubleSleeper: "Xe Giường Nằm VIP 22 chỗ",
  Limousine: "Xe Limousine 9 chỗ",
};

/* ---------------- BookingPage ---------------- */
export default function BookingPage() {
  const [searchParams] = useSearchParams();

  const fromLocationId = searchParams.get("fromLocationId");
  const toLocationId = searchParams.get("toLocationId");

  const today = dayjs().format("YYYY-MM-DD");
  const tripDateStart = searchParams.get("tripDateStart") || today;
  const tripDateEnd = searchParams.get("tripDateEnd");

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const [vehicleType, setVehicleType] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 1439]);
  const [seatRange, setSeatRange] = useState<[number, number]>([0, 60]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({});

  const weekdays = Array.from({ length: 6 }, (_, i) => {
    const d = dayjs(tripDateStart).add(i, "day");
    const thu = capitalizeFirst(d.format("dddd"));
    return {
      label: `${thu}, ${d.format("DD/MM/YYYY")}`,
      value: d.format("YYYY-MM-DD"),
    };
  });

  const [activeDay, setActiveDay] = useState(tripDateStart);
  const [startIndex, setStartIndex] = useState(0);

  const roundTrip = searchParams.get("roundTrip") || "one";
  const [activeDirection, setActiveDirection] = useState<"go" | "return">("go");

  const navigate = useNavigate();

  const handleConfirmBooking = (trip: Trip, seats: Seat[]) => {
    if (roundTrip === "one") {
      // Lưu localStorage để giữ dữ liệu khi F5
      localStorage.setItem("bookingData", JSON.stringify({ trip, seats }));
      navigate("/checkout");
    } else {
      if (activeDirection === "go") {
        setBookingDraft((prev) => ({ ...prev, goTrip: trip, goSeats: seats }));
        setActiveDirection("return");
      } else {
        const draft = { ...bookingDraft, returnTrip: trip, returnSeats: seats };
        setBookingDraft(draft);

        // Khi đã chọn đủ cả đi và về -> lưu vào localStorage
        localStorage.setItem("bookingData", JSON.stringify(draft));
        navigate("/checkout");
      }
    }
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        if (!fromLocationId || !toLocationId) return;

        const isGo = activeDirection === "go";
        const selectedDate = isGo
          ? tripDateStart
          : tripDateEnd || tripDateStart;

        const res = await searchTrips({
          fromLocationId: isGo ? fromLocationId : toLocationId,
          toLocationId: isGo ? toLocationId : fromLocationId,
          startDate: selectedDate,
          endDate: dayjs(selectedDate).add(5, "day").format("YYYY-MM-DD"),
        });

        if (res && res.data && Array.isArray(res.data.data)) {
          setTrips(res.data.data);
        }
      } catch (err) {
        console.error("❌ Lỗi fetch trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [
    fromLocationId,
    toLocationId,
    tripDateStart,
    tripDateEnd,
    activeDirection,
  ]);

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
                      onChange={() => setVehicleType(type)}
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

          {roundTrip === "both" && (
            <div className="your-trip-box">
              {bookingDraft.goTrip && (
                <div className="trip-summary">
                  <h3>Chuyến của bạn</h3>
                  <h4>
                    Chiều đi:{" "}
                    {dayjs(bookingDraft.goTrip.startDate).format("DD/MM/YYYY")}
                  </h4>
                  <div className="trip-row-tille">
                    <span className="value">
                      {bookingDraft.goTrip.route.fromLocation.nameLocations} →{" "}
                      {bookingDraft.goTrip.route.toLocation.nameLocations}
                    </span>
                  </div>
                  <div className="trip-row">
                    <span className="label">Khởi hành:</span>
                    <span className="value">
                      {formatStartTime(bookingDraft.goTrip.startTime)}
                    </span>
                  </div>
                  <div className="trip-row">
                    <span className="label">Biển số xe:</span>
                    <span className="value">
                      {bookingDraft.goTrip.vehicle.name}
                    </span>
                  </div>
                  <div className="trip-row">
                    <span className="label">Số ghế/giường:</span>
                    <span className="value">
                      {bookingDraft.goSeats?.map((s) => s.name).join(", ")}
                    </span>
                  </div>
                  <div className="trip-row">
                    <span className="label" style={{ fontWeight: "700" }}>
                      Giá ghế:
                    </span>
                    <span className="value">
                      {bookingDraft.goSeats?.length} x{" "}
                      {bookingDraft.goTrip.basePrice.toLocaleString()} đ
                    </span>
                  </div>
                  <hr className="divider" />
                </div>
              )}

              {bookingDraft.returnTrip && (
                <div className="trip-summary">
                  <h4>
                    Chiều về:{" "}
                    {dayjs(bookingDraft.returnTrip.startDate).format(
                      "DD/MM/YYYY"
                    )}
                  </h4>

                  <div className="trip-row-tille">
                    <span className="value">
                      {bookingDraft.returnTrip.route.fromLocation.nameLocations}{" "}
                      → {bookingDraft.returnTrip.route.toLocation.nameLocations}
                    </span>
                  </div>

                  <div className="trip-row">
                    <span className="label">Khởi hành:</span>
                    <span className="value">
                      {formatStartTime(bookingDraft.returnTrip.startTime)}
                    </span>
                  </div>

                  <div className="trip-row">
                    <span className="label">Biển số xe:</span>
                    <span className="value">
                      {bookingDraft.returnTrip.vehicle.name}
                    </span>
                  </div>

                  <div className="trip-row">
                    <span className="label">Số ghế/giường:</span>
                    <span className="value">
                      {bookingDraft.returnSeats?.map((s) => s.name).join(", ")}
                    </span>
                  </div>

                  <div className="trip-row">
                    <span className="label" style={{ fontWeight: "700" }}>
                      Giá ghế:
                    </span>
                    <span className="value">
                      {bookingDraft.returnSeats?.length} x{" "}
                      {bookingDraft.returnTrip.basePrice.toLocaleString()} đ
                    </span>
                  </div>
                </div>
              )}
              <hr className="divider" />

              {bookingDraft.goTrip && bookingDraft.returnTrip && (
                <div className="trip-total">
                  <h4>Tổng Thanh Toán</h4>

                  <div className="trip-row">
                    <span className="label">Giá ghế chiều đi:</span>
                    <span className="value">
                      {(
                        (bookingDraft.goSeats?.length || 0) *
                        bookingDraft.goTrip.basePrice
                      ).toLocaleString()}{" "}
                      đ
                    </span>
                  </div>

                  <div className="trip-row">
                    <span className="label">Giá ghế chiều về:</span>
                    <span className="value">
                      {(
                        (bookingDraft.returnSeats?.length || 0) *
                        bookingDraft.returnTrip.basePrice
                      ).toLocaleString()}{" "}
                      đ
                    </span>
                  </div>

                  <div className="trip-row total">
                    <span className="label">Tổng cộng:</span>
                    <span className="value">
                      {(
                        (bookingDraft.goSeats?.length || 0) *
                          bookingDraft.goTrip.basePrice +
                        (bookingDraft.returnSeats?.length || 0) *
                          bookingDraft.returnTrip.basePrice
                      ).toLocaleString()}{" "}
                      đ
                    </span>
                  </div>

                  <button
                    className="continue-btn"
                    onClick={() =>
                      navigate("/checkout", { state: { ...bookingDraft } })
                    }
                  >
                    Tiếp tục
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Danh sách chuyến bên phải */}
        <div className="trip-list">
          {/* Chọn thứ */}
          {roundTrip !== "both" && (
            <section className="trip-section weekday-section">
              <button
                className={`arrow left ${startIndex === 0 ? "hidden" : ""}`}
                onClick={() => setStartIndex((i) => i - 1)}
                disabled={startIndex === 0}
              >
                <LeftOutlined />
              </button>

              <div className="weekday-list">
                {weekdays.slice(startIndex, startIndex + 4).map((day, idx) => (
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
                  startIndex === weekdays.length - 4 ? "hidden" : ""
                }`}
                onClick={() => setStartIndex((i) => i + 1)}
                disabled={startIndex === weekdays.length - 4}
              >
                <RightOutlined />
              </button>
            </section>
          )}

          {/* Chọn chiều */}
          <section className="trip-section direction-section">
            <div className="direction-options">
              <button
                className={`direction ${
                  activeDirection === "go" ? "active" : ""
                }`}
                onClick={() => setActiveDirection("go")}
              >
                <ArrowRightOutlined className="icon" />
                Chiều đi
              </button>
              {roundTrip === "both" && (
                <button
                  className={`direction ${
                    activeDirection === "return" ? "active" : ""
                  }`}
                  onClick={() => setActiveDirection("return")}
                >
                  <ArrowLeftOutlined className="icon" />
                  Chiều về
                </button>
              )}
            </div>
          </section>

          {/* Danh sách chuyến */}
          <section className="trip-section trip-list-section">
            <div className="booking-list">
              {trips.filter((trip) => {
                const filterDate =
                  activeDirection === "go"
                    ? activeDay
                    : tripDateEnd || activeDay;
                if (dayjs(trip.startDate).format("YYYY-MM-DD") !== filterDate)
                  return false;

                // lọc theo loại xe
                if (vehicleType && trip.vehicle?.type !== vehicleType)
                  return false;

                // lọc theo giờ
                const startMinutes =
                  dayjs(trip.startTime, "HH:mm:ss").hour() * 60 +
                  dayjs(trip.startTime, "HH:mm:ss").minute();
                if (startMinutes < timeRange[0] || startMinutes > timeRange[1])
                  return false;

                // lọc theo ghế
                const totalSeats = Number(trip.totalSeats) || 0;
                const availableSeats = Number(trip.availableSeats) || 0;

                if (
                  availableSeats < seatRange[0] ||
                  availableSeats > seatRange[1]
                )
                  return false;

                return true;
              }).length === 0 ? (
                <p className="booking-empty">Hiện tại chưa có lịch chạy</p>
              ) : (
                trips
                  .filter((trip) => {
                    const filterDate =
                      activeDirection === "go"
                        ? activeDay
                        : tripDateEnd || activeDay;
                    if (
                      dayjs(trip.startDate).format("YYYY-MM-DD") !== filterDate
                    )
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

                    const totalSeats = Number(trip.totalSeats) || 0;
                    const availableSeats = Number(trip.availableSeats) || 0;

                    if (
                      availableSeats < seatRange[0] ||
                      availableSeats > seatRange[1]
                    )
                      return false;

                    return true;
                  })
                  .map((trip) => {
                    const start = dayjs(trip.startTime, "HH:mm:ss");
                    const end = trip.totalTime
                      ? start
                          .add(Number(trip.totalTime.split(":")[0]), "hour")
                          .add(Number(trip.totalTime.split(":")[1]), "minute")
                      : null;

                    const totalSeats = Number(trip.totalSeats) || 0;
                    const availableSeats = Number(trip.availableSeats) || 0;

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
                              <span className="available">
                                {availableSeats}
                              </span>
                              /{totalSeats} chỗ
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
                            {trip.basePrice.toLocaleString("vi-VN")} đ
                          </div>
                        </div>
                        <div className="trip-action">
                          {(activeDirection === "go" &&
                            bookingDraft.goTrip?.id === trip.id) ||
                          (activeDirection === "return" &&
                            bookingDraft.returnTrip?.id === trip.id) ? (
                            <button className="booking-btn selected" disabled>
                              Đang chọn
                            </button>
                          ) : (
                            <button
                              className="booking-btn"
                              onClick={() => {
                                setSelectedVehicleType(
                                  trip.vehicle?.type || ""
                                );
                                setSelectedSeats(trip.seats || []);
                                setSelectedTrip(trip);
                                setOpenModal(true);
                              }}
                            >
                              Đặt xe
                            </button>
                          )}
                        </div>
                        <SeatBookingModal
                          open={openModal}
                          onClose={() => setOpenModal(false)}
                          onConfirm={handleConfirmBooking}
                          vehicleType={selectedVehicleType}
                          seats={selectedSeats}
                          trip={selectedTrip}
                        />
                      </div>
                    );
                  })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
