import { useState } from "react";
import "../styles/Seats/ThirtySixSeats.scss";

// import icon
import SeatAvailable from "../../assets/icon/seat-1.svg";
import SeatSelected from "../../assets/icon/seat-2.svg";
import SeatSold from "../../assets/icon/seat-3.svg";
import { formatDuration, formatStartTime, calcEndTime } from "../../utils/time";
import type { Trip, Seat } from "../../types/booking";

interface DoubleDeckSeats36Props {
  seats: Seat[];
  trip: Trip | null;
  onConfirm?: (trip: Trip, seats: Seat[]) => void; // ✅ thêm
  onClose?: () => void; // ✅ thêm
}

export default function DoubleDeckSeats36({
  seats,
  trip,
  onConfirm,
  onClose,
}: DoubleDeckSeats36Props) {
  const [seatState, setSeatState] = useState<Seat[]>(seats);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const toggleSeat = (id: number) => {
    setSeatState((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status:
                s.status === "AVAILABLE"
                  ? "HOLD"
                  : s.status === "HOLD"
                  ? "AVAILABLE"
                  : s.status,
            }
          : s
      )
    );

    setSelectedSeats((prev) => {
      const seat = seatState.find((s) => s.id === id);
      if (!seat) return prev;

      if (seat.status === "AVAILABLE") {
        return [...prev, seat];
      } else {
        return prev.filter((s) => s.id !== id);
      }
    });
  };

  const getIcon = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return SeatAvailable;
      case "HOLD":
        return SeatSelected;
      case "SOLD":
        return SeatSold;
      default:
        return SeatAvailable;
    }
  };

  // 💰 Tính toán tiền
  const basePrice = trip?.basePrice || 0;
  const seatCount = selectedSeats.length;
  const total = seatCount * basePrice;
  const final = total;

  // render một tầng (18 ghế: 6 hàng × 3 cột)
  const renderFloor = (floor: number) => {
    const floorSeats = seatState.filter((s) => s.floor === floor);
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
                      className={`thirtysix-seat thirtysix-seat-${seat.status}`}
                      onClick={() => toggleSeat(seat.id)}
                    >
                      <img src={getIcon(seat.status)} alt="seat" />
                      <p>{seat.name.replace(/\D/g, "")}</p>
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
      <div className="thirtysix-seat-container">
        {/* Header */}
        <div className="thirtysix-seat-header">
          <div className="thirtysix-seat-title">
            <h2>Xe Hương Dương</h2>
          </div>
          <div className="thirtysix-seat-type">
            <p>XE GIƯỜNG NẰM</p>
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
          {seatCount > 0 && (
            <div className="thirtysix-seat-price-box">
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
                <span>{basePrice.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="price-row">
                <span>Tổng tiền:</span>
                <span>{total.toLocaleString("vi-VN")} đ</span>
              </div>
              <hr className="divider" />
              <div className="price-row total">
                <span>Thanh toán:</span>
                <span>{final.toLocaleString("vi-VN")} đ</span>
              </div>
            </div>
          )}

          <div className="thirtysix-seat-services">
            <h4>Dịch vụ kèm theo</h4>
            <ul>
              <li>Đón trả tận nơi</li>
              <li>Wifi</li>
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

          {/* legend */}
          <div className="thirtysix-seat-legend">
            <div className="thirtysix-seat-legend-item">
              <img src={SeatAvailable} alt="available" /> Ghế trống
            </div>
            <div className="thirtysix-seat-legend-item">
              <img src={SeatSelected} alt="selected" /> Đang chọn
            </div>
            <div className="thirtysix-seat-legend-item">
              <img src={SeatSold} alt="sold" /> Đã bán
            </div>
          </div>

          {/* floors */}
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
          if (trip && onConfirm) {
            onConfirm(trip, selectedSeats);
          }
          onClose?.(); // đóng modal
        }}
      >
        Đặt xe
      </button>
    </div>
  );
}
