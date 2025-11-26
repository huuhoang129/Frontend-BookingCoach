// src/pages/BookingPage/BookingPage.tsx
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import {
  LeftOutlined,
  RightOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import FormInputSearchCoach from "../../components/ui/Form/FormInputSearchCoach";
import SeatBookingModal from "../../containers/ModalsCollect/SeatBookingModal";
import { formatDuration, formatStartTime, calcEndTime } from "../../utils/time";
import DefaultBusImg from "../../assets/logo/default-bus.jpg";
import "./BookingPage.scss";

import {
  useBookingPage,
  VEHICLE_TYPE_MAP,
  getUnitPrice,
} from "../../hooks/ClientHooks/useBookingClient.ts";
import type { Trip, Seat } from "../../hooks/ClientHooks/useBookingClient.ts";

dayjs.locale("vi");

// Bộ chọn khoảng giá trị
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

  // Tính phần trăm thanh trượt
  const getPercent = (value: number) =>
    Math.round(((value - min) / (max - min)) * 100);

  const left = getPercent(minVal);
  const width = getPercent(maxVal) - getPercent(minVal);

  // Gửi giá trị mới ra ngoài mỗi khi thay đổi
  useEffect(() => {
    onChange?.(minVal, maxVal);
  }, [minVal, maxVal]);

  // Đồng bộ khi reset filter bên ngoài
  useEffect(() => {
    setMinVal(defaultMin);
    setMaxVal(defaultMax);
  }, [defaultMin, defaultMax]);

  return (
    <div className="mobi-multi-range">
      {/* Tay trái */}
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

      {/* Tay phải */}
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

      {/* Vùng hiển thị */}
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

export default function BookingPage() {
  // Lấy hook
  const {
    loading,
    days,
    startIndex,
    setStartIndex,
    activeDay,
    handleSelectDay,
    vehicleType,
    setVehicleType,
    timeRange,
    setTimeRange,
    seatRange,
    setSeatRange,
    resetFilters,
    filteredTrips,
    openModal,
    setOpenModal,
    selectedVehicleType,
    selectedSeats,
    selectedTrip,
    openSeatModal,
    handleConfirmBooking,
  } = useBookingPage();

  if (loading) {
    return <p className="booking-loading">Đang tải chuyến xe...</p>;
  }

  return (
    <div className="booking-page">
      {/* Banner và tìm kiếm*/}
      <div className="banner-booking-wrapper">
        <div className="bus-search_bgSearch__nV7TX"></div>
        <div className="search-box-coach">
          <FormInputSearchCoach />
        </div>
      </div>

      <div className="booking-wrapper">
        {/* Bộ lọc*/}
        <div className="filter-panel">
          <div className="filter-inner">
            <div className="filter-header">
              <h3>Bộ lọc</h3>
              <button className="reset-btn" onClick={resetFilters}>
                Đặt lại bộ lọc
              </button>
            </div>

            {/* Lọc theo loại xe */}
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

            {/* Lọc theo giờ chạy */}
            <div className="filter-section">
              <h4>Giờ chạy</h4>
              <DualRangeSlider
                min={0}
                max={1439}
                defaultMin={timeRange[0]}
                defaultMax={timeRange[1]}
                formatLabel={(val) =>
                  dayjs().startOf("day").add(val, "minute").format("HH:mm")
                }
                onChange={(min, max) => setTimeRange([min, max])}
              />
            </div>

            {/* Lọc theo số ghế trống */}
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

        {/* Danh sách chuyến xe */}
        <div className="trip-list">
          {/* Chọn ngày trong tuần */}
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
                  onClick={() => handleSelectDay(day.value)}
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

          {/* Card chuyến xe*/}
          <section className="trip-section trip-list-section">
            <div className="booking-list">
              {filteredTrips.length === 0 ? (
                <p className="booking-empty">Hiện tại chưa có lịch chạy</p>
              ) : (
                filteredTrips.map((trip: Trip) => {
                  const totalSeats = Number(trip.totalSeats) || 0;
                  const availableSeats = Number(trip.availableSeats) || 0;
                  const unitPrice = getUnitPrice(trip);

                  return (
                    <div key={trip.id} className="booking-card">
                      {/* Hình minh họa xe */}
                      <div className="trip-image">
                        <img src={DefaultBusImg} alt="bus" />
                      </div>

                      {/* Thông tin chuyến */}
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

                        {/* Thời gian chạy */}
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

                        {/* Số ghế còn trống */}
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

                        {/* Giá */}
                        <div className="trip-price">
                          {unitPrice.toLocaleString("vi-VN")} đ
                        </div>
                      </div>

                      {/* Nút đặt ghế */}
                      <div className="trip-action">
                        <button
                          className="booking-btn"
                          onClick={() => openSeatModal(trip)}
                        >
                          Đặt xe
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Modal đặt ghế */}
      <SeatBookingModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmBooking}
        vehicleType={selectedVehicleType}
        seats={selectedSeats as Seat[]}
        trip={selectedTrip as Trip | null}
      />
    </div>
  );
}
