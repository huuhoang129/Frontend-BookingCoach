import { useState } from "react";
import "../styles/Seats/NineSeats.scss";

// icon ghế
import SeatAvailable from "../../assets/icon/seat-1.svg";
import SeatSelected from "../../assets/icon/seat-2.svg";
import SeatSold from "../../assets/icon/seat-3.svg";

import type { Trip, Seat } from "../../types/booking";
import { formatDuration, formatStartTime, calcEndTime } from "../../utils/time";
import { getSeatNumber } from "../../utils/seat"; // import hàm tiện ích

interface NineSeatsProps {
  seats: Seat[];
  trip: Trip | null;
  onConfirm?: (trip: Trip, seats: Seat[]) => void;
  onClose?: () => void;
}

export default function NineSeats({
  seats,
  trip,
  onConfirm,
  onClose,
}: NineSeatsProps) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Toggle chọn ghế (chỉ ghế trống mới chọn được)
  const toggleSeat = (seat: Seat) => {
    if (seat.status === "SOLD" || seat.status === "HOLD") return; // không cho chọn
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);
      return exists ? prev.filter((s) => s.id !== seat.id) : [...prev, seat];
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
    if (selectedSeats.some((s) => s.id === seat.id)) return "seat-selected";
    if (seat.status === "SOLD" || seat.status === "HOLD") return "seat-sold";
    return "seat-available";
  };

  // 💰 Giá vé
  const unitPrice = trip?.price?.priceTrip ? Number(trip.price.priceTrip) : 0;
  const total = selectedSeats.length * unitPrice;

  return (
    <div className="seat-layout">
      <div className="seat-container">
        {/* Header */}
        <div className="seat-header">
          <div className="seat-title">
            <h2>{trip?.vehicle?.name || "Xe Hương Dương"}</h2>
          </div>

          <div className="seat-type">
            <p>LIMOUSINE 9 CHỖ</p>
          </div>

          <div className="seat-route">
            <span>{trip?.route?.fromLocation?.nameLocations || "?"}</span> -{" "}
            <span>{trip?.route?.toLocation?.nameLocations || "?"}</span>
          </div>

          <div className="seat-time">
            <span>{formatStartTime(trip?.startTime || "")}</span> →{" "}
            <span>
              {calcEndTime(trip?.startTime || "", trip?.totalTime || "")}
            </span>
            <span className="seat-duration">
              ({formatDuration(trip?.totalTime || "")})
            </span>
          </div>

          {/* 💸 Box giá ghế */}
          {selectedSeats.length > 0 && (
            <div className="seat-price-box">
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

          <div className="seat-services">
            <h4>Dịch vụ kèm theo</h4>
            <ul>
              <li>Đón trả tận nơi</li>
              <li>Wifi</li>
              <li>Chăn và nước uống</li>
              <li>Ghế massage</li>
            </ul>
          </div>
        </div>

        {/* Layout ghế */}
        <div className="seat-wrapper">
          <h2 className="seat-title">{trip?.vehicle?.name || "Hương Dương"}</h2>

          {/* legend */}
          <div className="seat-legend">
            <div className="seat-legend-item">
              <img src={SeatAvailable} alt="available" /> Ghế trống
            </div>
            <div className="seat-legend-item">
              <img src={SeatSelected} alt="selected" /> Đang chọn
            </div>
            <div className="seat-legend-item">
              <img src={SeatSold} alt="sold" /> Đã bán / giữ
            </div>
          </div>

          {/* Table layout 9 ghế */}
          <table className="seat-table">
            <tbody>
              <tr>
                <td></td>
                {seats[0] && (
                  <td
                    className={`seat ${getSeatClass(seats[0])}`}
                    onClick={() => toggleSeat(seats[0])}
                  >
                    <img src={getIcon(seats[0])} alt="seat" />
                    <p>{getSeatNumber(seats[0].name)}</p>
                  </td>
                )}
                {seats[1] && (
                  <td
                    className={`seat ${getSeatClass(seats[1])}`}
                    onClick={() => toggleSeat(seats[1])}
                  >
                    <img src={getIcon(seats[1])} alt="seat" />
                    <p>{getSeatNumber(seats[1].name)}</p>
                  </td>
                )}
              </tr>

              <tr>
                {seats[2] && (
                  <td
                    className={`seat ${getSeatClass(seats[2])}`}
                    onClick={() => toggleSeat(seats[2])}
                  >
                    <img src={getIcon(seats[2])} alt="seat" />
                    <p>{getSeatNumber(seats[2].name)}</p>
                  </td>
                )}
                <td></td>
                {seats[3] && (
                  <td
                    className={`seat ${getSeatClass(seats[3])}`}
                    onClick={() => toggleSeat(seats[3])}
                  >
                    <img src={getIcon(seats[3])} alt="seat" />
                    <p>{getSeatNumber(seats[3].name)}</p>
                  </td>
                )}
              </tr>

              <tr>
                {seats[4] && (
                  <td
                    className={`seat ${getSeatClass(seats[4])}`}
                    onClick={() => toggleSeat(seats[4])}
                  >
                    <img src={getIcon(seats[4])} alt="seat" />
                    <p>{getSeatNumber(seats[4].name)}</p>
                  </td>
                )}
                <td></td>
                {seats[5] && (
                  <td
                    className={`seat ${getSeatClass(seats[5])}`}
                    onClick={() => toggleSeat(seats[5])}
                  >
                    <img src={getIcon(seats[5])} alt="seat" />
                    <p>{getSeatNumber(seats[5].name)}</p>
                  </td>
                )}
              </tr>

              <tr>
                {seats[6] && (
                  <td
                    className={`seat ${getSeatClass(seats[6])}`}
                    onClick={() => toggleSeat(seats[6])}
                  >
                    <img src={getIcon(seats[6])} alt="seat" />
                    <p>{getSeatNumber(seats[6].name)}</p>
                  </td>
                )}
                {seats[7] && (
                  <td
                    className={`seat ${getSeatClass(seats[7])}`}
                    onClick={() => toggleSeat(seats[7])}
                  >
                    <img src={getIcon(seats[7])} alt="seat" />
                    <p>{getSeatNumber(seats[7].name)}</p>
                  </td>
                )}
                {seats[8] && (
                  <td
                    className={`seat ${getSeatClass(seats[8])}`}
                    onClick={() => toggleSeat(seats[8])}
                  >
                    <img src={getIcon(seats[8])} alt="seat" />
                    <p>{getSeatNumber(seats[8].name)}</p>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Button */}
      <button
        className="seat-btn"
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
