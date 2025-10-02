import { useState } from "react";
import "../styles/Seats/FortyFiveSeats.scss";

// import icon
import SeatAvailable from "../../assets/icon/seat-1.svg";
import SeatSelected from "../../assets/icon/seat-2.svg";
import SeatSold from "../../assets/icon/seat-3.svg";

import type { Seat, Trip, SeatStatus } from "../../types/booking";
import { formatDuration, formatStartTime, calcEndTime } from "../../utils/time";

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
  const [seatState, setSeatState] = useState<Seat[]>(seats);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const toggleSeat = (id: number) => {
    setSeatState((prev) => {
      const newSeats = prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status:
                s.status === "AVAILABLE"
                  ? ("HOLD" as const)
                  : s.status === "HOLD"
                  ? ("AVAILABLE" as const)
                  : ("SOLD" as const),
            }
          : s
      );

      const clickedSeat = newSeats.find((s) => s.id === id);
      if (clickedSeat) {
        setSelectedSeats((prevSel) => {
          if (clickedSeat.status === "HOLD") {
            if (!prevSel.some((s) => s.id === clickedSeat.id)) {
              return [...prevSel, clickedSeat];
            }
            return prevSel;
          } else {
            return prevSel.filter((s) => s.id !== id);
          }
        });
      }

      return newSeats;
    });
  };

  const getIcon = (status: SeatStatus) => {
    switch (status) {
      case "AVAILABLE":
        return SeatAvailable;
      case "HOLD":
        return SeatSelected;
      case "SOLD":
        return SeatSold;
    }
  };

  // 💰 Tính tiền từ trip.price
  const unitPrice = trip?.price?.priceTrip ? Number(trip.price.priceTrip) : 0;

  const seatCount = selectedSeats.length;
  const total = seatCount * unitPrice;

  // render thân xe (40 ghế: 2 bên × 2 dãy × 10 hàng)
  const renderBody = () => {
    const rows = Array.from({ length: 10 }, (_, i) => [
      seatState[i * 2],
      seatState[i * 2 + 1],
      seatState[i * 2 + 20],
      seatState[i * 2 + 21],
    ]);

    return (
      <table className="fortyfive-seat-table">
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row[0] && (
                <td
                  className={`fortyfive-seat fortyfive-seat-${row[0].status}`}
                  onClick={() => toggleSeat(row[0].id)}
                >
                  <img src={getIcon(row[0].status)} alt="seat" />
                  <p>{row[0].name.replace(/\D/g, "")}</p>
                </td>
              )}
              {row[1] && (
                <td
                  className={`fortyfive-seat fortyfive-seat-${row[1].status}`}
                  onClick={() => toggleSeat(row[1].id)}
                >
                  <img src={getIcon(row[1].status)} alt="seat" />
                  <p>{row[1].name.replace(/\D/g, "")}</p>
                </td>
              )}
              <td className="aisle"></td>
              {row[2] && (
                <td
                  className={`fortyfive-seat fortyfive-seat-${row[2].status}`}
                  onClick={() => toggleSeat(row[2].id)}
                >
                  <img src={getIcon(row[2].status)} alt="seat" />
                  <p>{row[2].name.replace(/\D/g, "")}</p>
                </td>
              )}
              {row[3] && (
                <td
                  className={`fortyfive-seat fortyfive-seat-${row[3].status}`}
                  onClick={() => toggleSeat(row[3].id)}
                >
                  <img src={getIcon(row[3].status)} alt="seat" />
                  <p>{row[3].name.replace(/\D/g, "")}</p>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // render ghế cuối (41–45)
  const renderBack = () => {
    const backSeats = seatState.slice(40, 45);
    return (
      <table className="fortyfive-seat-table back-row">
        <tbody>
          <tr>
            {backSeats.map(
              (seat) =>
                seat && (
                  <td
                    key={seat.id}
                    className={`fortyfive-seat fortyfive-seat-${seat.status}`}
                    onClick={() => toggleSeat(seat.id)}
                  >
                    <img src={getIcon(seat.status)} alt="seat" />
                    <p>{seat.name.replace(/\D/g, "")}</p>
                  </td>
                )
            )}
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="fortyfive-seat-layout">
      <div className="fortyfive-seat-container">
        {/* Header */}
        <div className="fortyfive-seat-header">
          <div className="fortyfive-seat-title">
            <h2>Xe Hương Dương</h2>
          </div>
          <div className="fortyfive-seat-type">
            <p>XE KHÁCH THƯỜNG</p>
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
          {seatCount > 0 && (
            <div className="fortyfive-seat-price-box">
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

          <div className="fortyfive-seat-services">
            <h4>Dịch vụ kèm theo</h4>
            <ul>
              <li>Đón trả tận nơi</li>
              <li>Wifi tốc độ cao</li>
              <li>Chăn, nước uống đóng chai</li>
              <li>Ổ cắm sạc, điều hoà</li>
            </ul>
          </div>
        </div>

        {/* Wrapper */}
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
              <img src={SeatSold} alt="sold" /> Đã bán
            </div>
          </div>

          {/* Body */}
          {renderBody()}

          {/* Back row */}
          {renderBack()}
        </div>
      </div>

      {/* Button */}
      <button
        className="fortyfive-seat-btn"
        disabled={!trip || selectedSeats.length === 0}
        onClick={() => {
          if (trip && onConfirm) {
            onConfirm(trip, selectedSeats);
          }
          onClose?.();
        }}
      >
        Đặt xe
      </button>
    </div>
  );
}
