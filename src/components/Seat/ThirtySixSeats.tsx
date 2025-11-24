import { useState, useRef } from "react";
import "../styles/Seats/ThirtySixSeats.scss";

// Notification custom
import { AppNotification } from "../../components/Notification/AppNotification";

// icon ghế
import SeatAvailable from "../../assets/icon/seat-1.svg";
import SeatSelected from "../../assets/icon/seat-2.svg";
import SeatSold from "../../assets/icon/seat-3.svg";

import { formatDuration, formatStartTime, calcEndTime } from "../../utils/time";
import { getSeatNumber } from "../../utils/seat";
import type { Trip, Seat } from "../../types/booking";

interface DoubleDeckSeats36Props {
  seats: Seat[];
  trip: Trip | null;
  onConfirm?: (trip: Trip, seats: Seat[]) => void;
  onClose?: () => void;
}

export default function DoubleDeckSeats36({
  seats,
  trip,
  onConfirm,
  onClose,
}: DoubleDeckSeats36Props) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // ============================
  // 🔔 Notification
  // ============================
  const { notifySuccess, notifyInfo, contextHolder } = AppNotification();

  // ============================
  // 🔥 FIX DOUBLE NOTIFY
  // ============================
  const notifyLock = useRef(false);

  const safeNotify = (callback: () => void) => {
    if (notifyLock.current) return; // chặn double
    notifyLock.current = true;

    callback();

    setTimeout(() => {
      notifyLock.current = false;
    }, 100);
  };
  // ============================

  // Toggle chọn ghế
  const toggleSeat = (seat: Seat) => {
    if (seat.status === "SOLD" || seat.status === "HOLD") return;

    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);

      if (exists) {
        safeNotify(() =>
          notifyInfo(
            "Hủy chọn ghế",
            `Đã bỏ chọn ghế ${getSeatNumber(seat.name)}`
          )
        );
        return prev.filter((s) => s.id !== seat.id);
      } else {
        safeNotify(() =>
          notifySuccess("Chọn ghế", `Đã chọn ghế ${getSeatNumber(seat.name)}`)
        );
        return [...prev, seat];
      }
    });
  };

  // icon hiển thị
  const getIcon = (seat: Seat) => {
    if (selectedSeats.some((s) => s.id === seat.id)) return SeatSelected;
    if (seat.status === "SOLD" || seat.status === "HOLD") return SeatSold;
    return SeatAvailable;
  };

  // class theo trạng thái
  const getSeatClass = (seat: Seat) => {
    if (selectedSeats.some((s) => s.id === seat.id))
      return "thirtysix-seat-selected";
    if (seat.status === "SOLD" || seat.status === "HOLD")
      return "thirtysix-seat-sold";
    return "thirtysix-seat-available";
  };

  // 💰 Giá vé
  const unitPrice = trip?.price?.priceTrip ? Number(trip.price.priceTrip) : 0;
  const total = selectedSeats.length * unitPrice;

  // Render tầng
  const renderFloor = (floor: number) => {
    const floorSeats = seats.filter((s) => s.floor === floor);
    const rows = Array.from({ length: 6 }, (_, i) => [
      floorSeats[i * 3],
      floorSeats[i * 3 + 1],
      floorSeats[i * 3 + 2],
    ]);

    return (
      <table className="thirtysix-seat-table">
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map(
                (seat) =>
                  seat && (
                    <td
                      key={seat.id}
                      className={`thirtysix-seat ${getSeatClass(seat)}`}
                      onClick={() => toggleSeat(seat)}
                    >
                      <img src={getIcon(seat)} alt="seat" />
                      <p>{getSeatNumber(seat.name)}</p>
                    </td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="thirtysix-seat-layout">
      {/* 🔔 MUST HAVE */}
      {contextHolder}

      <div className="thirtysix-seat-container">
        {/* Header */}
        <div className="thirtysix-seat-header">
          <div className="thirtysix-seat-title">
            <h2>{trip?.vehicle?.name || "Xe Hương Dương"}</h2>
          </div>

          <div className="thirtysix-seat-type">
            <p>XE GIƯỜNG NẰM 36 CHỖ</p>
          </div>

          <div className="thirtysix-seat-route">
            <span>{trip?.route?.fromLocation?.nameLocations || "?"}</span> -{" "}
            <span>{trip?.route?.toLocation?.nameLocations || "?"}</span>
          </div>

          <div className="thirtysix-seat-time">
            <span>{formatStartTime(trip?.startTime || "")}</span> →{" "}
            <span>
              {calcEndTime(trip?.startTime || "", trip?.totalTime || "")}
            </span>
            <span className="thirtysix-seat-duration">
              ({formatDuration(trip?.totalTime || "")})
            </span>
          </div>

          {/* 💸 Box giá ghế */}
          {selectedSeats.length > 0 && (
            <div className="thirtysix-seat-price-box">
              <h4>Giá ghế:</h4>
              <div className="price-row">
                <span>Ghế:</span>
                <span>
                  {selectedSeats.map((s) => getSeatNumber(s.name)).join(", ")}
                </span>
              </div>
              <hr className="divider" />
              <div className="price-row">
                <span>Đơn giá:</span>
                <span>{unitPrice.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="price-row">
                <span>Tổng tiền:</span>
                <span>{total.toLocaleString("vi-VN")} đ</span>
              </div>
              <hr className="divider" />
              <div className="price-row total">
                <span>Thanh toán:</span>
                <span>{total.toLocaleString("vi-VN")} đ</span>
              </div>
            </div>
          )}

          <div className="thirtysix-seat-services">
            <h4>Dịch vụ kèm theo</h4>
            <ul>
              <li>Đón trả tận nơi</li>
              <li>Wifi miễn phí</li>
              <li>Chăn và nước uống đóng chai</li>
              <li>Ghế massage</li>
            </ul>
          </div>
        </div>

        {/* Wrapper */}
        <div className="thirtysix-seat-wrapper">
          <h2 className="thirtysix-seat-title">
            {trip?.vehicle?.name || "Hương Dương"}
          </h2>

          <div className="thirtysix-seat-legend">
            <div className="thirtysix-seat-legend-item">
              <img src={SeatAvailable} alt="available" /> Ghế trống
            </div>
            <div className="thirtysix-seat-legend-item">
              <img src={SeatSelected} alt="selected" /> Đang chọn
            </div>
            <div className="thirtysix-seat-legend-item">
              <img src={SeatSold} alt="sold" /> Đã bán / giữ
            </div>
          </div>

          <div className="thirtysix-floors">
            <div className="floor-block">
              <h3 className="thirtysix-floor-title">Tầng 1</h3>
              {renderFloor(1)}
            </div>
            <div className="floor-block">
              <h3 className="thirtysix-floor-title">Tầng 2</h3>
              {renderFloor(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        className="thirtysix-seat-btn"
        disabled={!trip || selectedSeats.length === 0}
        onClick={() => {
          if (trip && onConfirm) onConfirm(trip, selectedSeats);
          onClose?.();
        }}
      >
        Đặt xe
      </button>
    </div>
  );
}
