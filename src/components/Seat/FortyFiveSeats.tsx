import { useState, useRef } from "react";
import "../styles/Seats/FortyFiveSeats.scss";

// Notification custom
import { AppNotification } from "../../components/Notification/AppNotification";

// icons
import SeatAvailable from "../../assets/icon/seat-1.svg";
import SeatSelected from "../../assets/icon/seat-2.svg";
import SeatSold from "../../assets/icon/seat-3.svg";

import type { Seat, Trip } from "../../types/booking";
import { formatDuration, formatStartTime, calcEndTime } from "../../utils/time";
import { getSeatNumber } from "../../utils/seat";

interface FortyFiveSeatsProps {
  seats: Seat[];
  trip: Trip | null;
  onConfirm?: (trip: Trip, seats: Seat[]) => void;
  onClose?: () => void;
}

export default function FortyFiveSeats({
  seats,
  trip,
  onConfirm,
  onClose,
}: FortyFiveSeatsProps) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // ============================
  // 🔔 Notification
  // ============================
  const { notifySuccess, notifyInfo, contextHolder } = AppNotification();

  // ============================
  // 🔥 FIX DOUBLE NOTIFICATION
  // ============================
  const notifyLock = useRef(false);

  const safeNotify = (callback: () => void) => {
    if (notifyLock.current) return;
    notifyLock.current = true;

    callback();

    // khóa 100ms — strict mode render double cũng không bị notify 2 lần
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

  // Icon ghế
  const getIcon = (seat: Seat) => {
    if (selectedSeats.some((s) => s.id === seat.id)) return SeatSelected;
    if (seat.status === "SOLD" || seat.status === "HOLD") return SeatSold;
    return SeatAvailable;
  };

  // Class CSS ghế
  const getSeatClass = (seat: Seat) => {
    if (selectedSeats.some((s) => s.id === seat.id))
      return "fortyfive-seat-selected";
    if (seat.status === "SOLD" || seat.status === "HOLD")
      return "fortyfive-seat-sold";
    return "fortyfive-seat-available";
  };

  // 💰 Giá vé
  const unitPrice = trip?.price?.priceTrip ? Number(trip.price.priceTrip) : 0;
  const total = selectedSeats.length * unitPrice;

  // Render thân xe (40 ghế đầu)
  const renderBody = () => {
    const rows = Array.from({ length: 10 }, (_, i) => [
      seats[i * 2],
      seats[i * 2 + 1],
      seats[i * 2 + 20],
      seats[i * 2 + 21],
    ]);

    return (
      <table className="fortyfive-seat-table">
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((seat, index) =>
                index === 2 ? (
                  <>
                    <td className="aisle" key={`aisle-${idx}`}></td>
                    {seat && (
                      <td
                        key={seat.id}
                        className={`fortyfive-seat ${getSeatClass(seat)}`}
                        onClick={() => toggleSeat(seat)}
                      >
                        <img src={getIcon(seat)} alt="seat" />
                        <p>{getSeatNumber(seat.name)}</p>
                      </td>
                    )}
                  </>
                ) : seat ? (
                  <td
                    key={seat.id}
                    className={`fortyfive-seat ${getSeatClass(seat)}`}
                    onClick={() => toggleSeat(seat)}
                  >
                    <img src={getIcon(seat)} alt="seat" />
                    <p>{getSeatNumber(seat.name)}</p>
                  </td>
                ) : (
                  index !== 2 && <td key={`empty-${idx}-${index}`}></td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Render hàng cuối (41–45)
  const renderBack = () => {
    const backSeats = seats.slice(40, 45);
    return (
      <table className="fortyfive-seat-table back-row">
        <tbody>
          <tr>
            {backSeats.map((seat) => (
              <td
                key={seat.id}
                className={`fortyfive-seat ${getSeatClass(seat)}`}
                onClick={() => toggleSeat(seat)}
              >
                <img src={getIcon(seat)} alt="seat" />
                <p>{getSeatNumber(seat.name)}</p>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="fortyfive-seat-layout">
      {/* 🔔 MUST HAVE — Notification holder */}
      {contextHolder}

      <div className="fortyfive-seat-container">
        {/* Header */}
        <div className="fortyfive-seat-header">
          <div className="fortyfive-seat-title">
            <h2>{trip?.vehicle?.name || "Xe Hương Dương"}</h2>
          </div>

          <div className="fortyfive-seat-type">
            <p>XE GHẾ NGỒI 45 CHỖ</p>
          </div>

          <div className="fortyfive-seat-route">
            <span>{trip?.route?.fromLocation?.nameLocations || "?"}</span> -{" "}
            <span>{trip?.route?.toLocation?.nameLocations || "?"}</span>
          </div>

          <div className="fortyfive-seat-time">
            <span>{formatStartTime(trip?.startTime || "")}</span> →{" "}
            <span>
              {calcEndTime(trip?.startTime || "", trip?.totalTime || "")}
            </span>
            <span className="fortyfive-seat-duration">
              ({formatDuration(trip?.totalTime || "")})
            </span>
          </div>

          {/* 💸 Box giá ghế */}
          {selectedSeats.length > 0 && (
            <div className="fortyfive-seat-price-box">
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

          <div className="fortyfive-seat-services">
            <h4>Dịch vụ kèm theo</h4>
            <ul>
              <li>Wifi tốc độ cao</li>
              <li>Ổ cắm sạc / điều hoà</li>
              <li>Chăn và nước uống</li>
              <li>Đón trả tận nơi</li>
            </ul>
          </div>
        </div>

        {/* Body */}
        <div className="fortyfive-seat-wrapper">
          <h2 className="fortyfive-seat-title">
            {trip?.vehicle?.name || "Hương Dương"}
          </h2>

          {/* legend */}
          <div className="fortyfive-seat-legend">
            <div className="legend-item">
              <img src={SeatAvailable} alt="available" /> Ghế trống
            </div>
            <div className="legend-item">
              <img src={SeatSelected} alt="selected" /> Đang chọn
            </div>
            <div className="legend-item">
              <img src={SeatSold} alt="sold" /> Đã bán / giữ
            </div>
          </div>

          {renderBody()}
          {renderBack()}
        </div>
      </div>

      {/* Button */}
      <button
        className="fortyfive-seat-btn"
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
