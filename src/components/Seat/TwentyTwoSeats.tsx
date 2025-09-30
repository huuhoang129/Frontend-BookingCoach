import { useState } from "react";
import "../styles/Seats/TwentyTwoSeats.scss";

// icon
import SeatAvailable from "../../assets/icon/seat-1.svg";
import SeatSelected from "../../assets/icon/seat-2.svg";
import SeatSold from "../../assets/icon/seat-3.svg";

import type { Seat, Trip, SeatStatus } from "../../types/booking";
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
            // chỉ thêm nếu chưa có (tránh 2, 2)
            if (!prevSel.some((s) => s.id === clickedSeat.id)) {
              return [...prevSel, clickedSeat];
            }
            return prevSel;
          } else {
            // bỏ chọn
            return prevSel.filter((s) => s.id !== clickedSeat.id);
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

  // 💰 Tính toán tiền
  const basePrice = trip?.basePrice || 0;
  const seatCount = selectedSeats.length;
  const total = seatCount * basePrice;

  // render ghế theo tầng
  const renderFloor = (floor: number) => {
    const floorSeats = seatState.filter((s) => s.floor === floor);

    // mỗi tầng có 11 ghế: 5 hàng đôi + 1 ghế lẻ
    const rows = [
      [floorSeats[0], floorSeats[1]],
      [floorSeats[2], floorSeats[3]],
      [floorSeats[4], floorSeats[5]],
      [floorSeats[6], floorSeats[7]],
      [floorSeats[8], floorSeats[9]],
    ];

    return (
      <table className="twentytwo-seat-table">
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row[0] && (
                <td
                  className={`twentytwo-seat twentytwo-seat-${row[0].status}`}
                  onClick={() => toggleSeat(row[0].id)}
                >
                  <img src={getIcon(row[0].status)} alt="seat" />
                  <p>{row[0].name.replace(/\D/g, "")}</p>
                </td>
              )}
              <td className="aisle"></td>
              {row[1] && (
                <td
                  className={`twentytwo-seat twentytwo-seat-${row[1].status}`}
                  onClick={() => toggleSeat(row[1].id)}
                >
                  <img src={getIcon(row[1].status)} alt="seat" />
                  <p>{row[1].name.replace(/\D/g, "")}</p>
                </td>
              )}
            </tr>
          ))}

          {/* ghế cuối bên trái */}
          {floorSeats[10] && (
            <tr>
              <td
                className={`twentytwo-seat twentytwo-seat-${floorSeats[10].status}`}
                onClick={() => toggleSeat(floorSeats[10].id)}
              >
                <img src={getIcon(floorSeats[10].status)} alt="seat" />
                <p>{floorSeats[10].name}</p>
              </td>
              <td className="aisle"></td>
              <td></td>
            </tr>
          )}
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
            <h2>Xe Hương Dương</h2>
          </div>
          <div className="twentytwo-seat-type">
            <p>XE GIƯỜNG NẰM VIP</p>
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
          {seatCount > 0 && (
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
                <span>{basePrice.toLocaleString("vi-VN")} đ</span>
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
              <li>Wifi</li>
              <li>Chăn và nước uống đóng chai</li>
              <li>Ghế massage</li>
            </ul>
          </div>
        </div>

        {/* Wrapper */}
        <div className="twentytwo-seat-wrapper">
          <h2 className="twentytwo-seat-title">
            {trip?.vehicle.name || "Hương Dương"}
          </h2>

          {/* legend */}
          <div className="twentytwo-seat-legend">
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

          {/* floors */}
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
