import { useState } from "react";
import "../styles/Seats/TwentyTwoSeats.scss";

// icon
import SeatAvailable from "../../assets/icon/seat-1.svg";
import SeatSelected from "../../assets/icon/seat-2.svg";
import SeatSold from "../../assets/icon/seat-3.svg";

import type { Seat, Trip } from "../../types/booking";
import { formatDuration, formatStartTime, calcEndTime } from "../../utils/time";

interface DoubleDeckSeats22Props {
  seats: Seat[];
  trip: Trip | null;
  onConfirm?: (trip: Trip, seats: Seat[]) => void;
  onClose?: () => void;
}

export default function DoubleDeckSeats22({
  seats,
  trip,
  onConfirm,
  onClose,
}: DoubleDeckSeats22Props) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // ✅ Toggle chọn ghế
  const toggleSeat = (seat: Seat) => {
    if (seat.status === "SOLD" || seat.status === "HOLD") return;
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);
      return exists ? prev.filter((s) => s.id !== seat.id) : [...prev, seat];
    });
  };

  // ✅ Icon ghế
  const getIcon = (seat: Seat) => {
    if (selectedSeats.some((s) => s.id === seat.id)) return SeatSelected;
    if (seat.status === "SOLD" || seat.status === "HOLD") return SeatSold;
    return SeatAvailable;
  };

  // ✅ Class ghế
  const getSeatClass = (seat: Seat) => {
    if (selectedSeats.some((s) => s.id === seat.id))
      return "twentytwo-seat-selected";
    if (seat.status === "SOLD" || seat.status === "HOLD")
      return "twentytwo-seat-sold";
    return "twentytwo-seat-available";
  };

  // 💰 Giá vé
  const unitPrice = trip?.price?.priceTrip ? Number(trip.price.priceTrip) : 0;
  const total = selectedSeats.length * unitPrice;

  // ✅ Render từng tầng
  const renderFloor = (floor: number) => {
    const floorSeats = seats.filter((s) => s.floor === floor);

    const rows = [
      [floorSeats[0], floorSeats[1]],
      [floorSeats[2], floorSeats[3]],
      [floorSeats[4], floorSeats[5]],
      [floorSeats[6], floorSeats[7]],
      [floorSeats[8], floorSeats[9]],
      [floorSeats[10]], // ghế cuối
    ];

    return (
      <table className="twentytwo-seat-table">
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row[0] && (
                <td
                  className={`twentytwo-seat ${getSeatClass(row[0])}`}
                  onClick={() => toggleSeat(row[0])}
                >
                  <img src={getIcon(row[0])} alt="seat" />
                  <p>{row[0].name.replace(/\D/g, "")}</p>
                </td>
              )}
              {row[1] ? (
                <>
                  <td className="aisle"></td>
                  <td
                    className={`twentytwo-seat ${getSeatClass(row[1])}`}
                    onClick={() => toggleSeat(row[1])}
                  >
                    <img src={getIcon(row[1])} alt="seat" />
                    <p>{row[1].name.replace(/\D/g, "")}</p>
                  </td>
                </>
              ) : (
                <>
                  <td className="aisle"></td>
                  <td></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="twentytwo-seat-layout">
      <div className="twentytwo-seat-container">
        {/* Header */}
        <div className="twentytwo-seat-header">
          <div className="twentytwo-seat-title">
            <h2>{trip?.vehicle?.name || "Xe Hương Dương"}</h2>
          </div>

          <div className="twentytwo-seat-type">
            <p>XE GIƯỜNG NẰM VIP 22 CHỖ</p>
          </div>

          <div className="twentytwo-seat-route">
            <span>{trip?.route?.fromLocation?.nameLocations || "?"}</span> -{" "}
            <span>{trip?.route?.toLocation?.nameLocations || "?"}</span>
          </div>

          <div className="twentytwo-seat-time">
            <span>{formatStartTime(trip?.startTime || "")}</span> →{" "}
            <span>
              {calcEndTime(trip?.startTime || "", trip?.totalTime || "")}
            </span>
            <span className="twentytwo-seat-duration">
              ({formatDuration(trip?.totalTime || "")})
            </span>
          </div>

          {/* 💸 Box giá ghế */}
          {selectedSeats.length > 0 && (
            <div className="twentytwo-seat-price-box">
              <h4>Giá ghế:</h4>
              <div className="price-row">
                <span>Ghế:</span>
                <span>
                  {selectedSeats
                    .map((s) => s.name.replace(/\D/g, ""))
                    .join(", ")}
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

          <div className="twentytwo-seat-services">
            <h4>Dịch vụ kèm theo</h4>
            <ul>
              <li>Đón trả tận nơi</li>
              <li>Wifi miễn phí</li>
              <li>Chăn & nước uống</li>
              <li>Ghế massage cao cấp</li>
            </ul>
          </div>
        </div>

        {/* Wrapper */}
        <div className="twentytwo-seat-wrapper">
          <h2 className="twentytwo-seat-title">
            {trip?.vehicle?.name || "Hương Dương"}
          </h2>

          {/* Legend */}
          <div className="twentytwo-seat-legend">
            <div className="legend-item">
              <img src={SeatAvailable} alt="available" /> Ghế trống
            </div>
            <div className="legend-item">
              <img src={SeatSelected} alt="selected" /> Đang chọn
            </div>
            <div className="legend-item">
              <img src={SeatSold} alt="sold" /> Đã đặt / giữ
            </div>
          </div>

          {/* Floors */}
          <div className="twentytwo-floors">
            <div className="floor-block">
              <h3 className="twentytwo-floor-title">Tầng 1</h3>
              {renderFloor(1)}
            </div>
            <div className="floor-block">
              <h3 className="twentytwo-floor-title">Tầng 2</h3>
              {renderFloor(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        className="twentytwo-seat-btn"
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
