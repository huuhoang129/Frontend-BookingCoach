import { useState } from "react";
import "../styles/Seats/NineSeats.scss";

// icon
import SeatAvailable from "../../assets/icon/seat-1.svg";
import SeatSelected from "../../assets/icon/seat-2.svg";
import SeatSold from "../../assets/icon/seat-3.svg";

import type { Seat, Trip, SeatStatus } from "../../types/booking";
import { formatDuration, formatStartTime, calcEndTime } from "../../utils/time";

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
            // chỉ thêm nếu chưa tồn tại
            if (!prevSel.some((s) => s.id === clickedSeat.id)) {
              return [...prevSel, clickedSeat];
            }
            return prevSel;
          } else {
            // nếu bỏ chọn thì filter ra
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

  // 💰 tiền
  const basePrice = trip?.basePrice || 0;
  const seatCount = selectedSeats.length;
  const total = seatCount * basePrice;

  return (
    <div className="seat-layout">
      <div className="seat-container">
        {/* Header */}
        <div className="seat-header">
          <div className="seat-title">
            <h2>Xe Hương Dương</h2>
          </div>

          <div className="seat-type">
            <p>LIMOUSINE</p>
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
          {seatCount > 0 && (
            <div className="seat-price-box">
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

          <div className="seat-services">
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
        <div className="seat-wrapper">
          <h2 className="seat-title">{trip?.vehicle.name || "Hương Dương"}</h2>

          {/* legend */}
          <div className="seat-legend">
            <div className="seat-legend-item">
              <img src={SeatAvailable} alt="available" /> Ghế trống
            </div>
            <div className="seat-legend-item">
              <img src={SeatSelected} alt="selected" /> Đang chọn
            </div>
            <div className="seat-legend-item">
              <img src={SeatSold} alt="sold" /> Đã bán
            </div>
          </div>

          {/* Seat layout */}
          <table className="seat-table">
            <tbody>
              <tr>
                <td></td>
                {seatState[0] && (
                  <td
                    className={`seat seat-${seatState[0].status}`}
                    onClick={() => toggleSeat(seatState[0].id)}
                  >
                    <img src={getIcon(seatState[0].status)} alt="seat" />
                    <p>{seatState[0].name.replace(/\D/g, "")}</p>
                  </td>
                )}
                {seatState[1] && (
                  <td
                    className={`seat seat-${seatState[1].status}`}
                    onClick={() => toggleSeat(seatState[1].id)}
                  >
                    <img src={getIcon(seatState[1].status)} alt="seat" />
                    <p>{seatState[1].name.replace(/\D/g, "")}</p>
                  </td>
                )}
              </tr>

              <tr>
                {seatState[2] && (
                  <td
                    className={`seat seat-${seatState[2].status}`}
                    onClick={() => toggleSeat(seatState[2].id)}
                  >
                    <img src={getIcon(seatState[2].status)} alt="seat" />
                    <p>{seatState[2].name.replace(/\D/g, "")}</p>
                  </td>
                )}
                <td></td>
                {seatState[3] && (
                  <td
                    className={`seat seat-${seatState[3].status}`}
                    onClick={() => toggleSeat(seatState[3].id)}
                  >
                    <img src={getIcon(seatState[3].status)} alt="seat" />
                    <p>{seatState[3].name.replace(/\D/g, "")}</p>
                  </td>
                )}
              </tr>

              <tr>
                {seatState[4] && (
                  <td
                    className={`seat seat-${seatState[4].status}`}
                    onClick={() => toggleSeat(seatState[4].id)}
                  >
                    <img src={getIcon(seatState[4].status)} alt="seat" />
                    <p>{seatState[4].name.replace(/\D/g, "")}</p>
                  </td>
                )}
                <td></td>
                {seatState[5] && (
                  <td
                    className={`seat seat-${seatState[5].status}`}
                    onClick={() => toggleSeat(seatState[5].id)}
                  >
                    <img src={getIcon(seatState[5].status)} alt="seat" />
                    <p>{seatState[5].name.replace(/\D/g, "")}</p>
                  </td>
                )}
              </tr>

              <tr>
                {seatState[6] && (
                  <td
                    className={`seat seat-${seatState[6].status}`}
                    onClick={() => toggleSeat(seatState[6].id)}
                  >
                    <img src={getIcon(seatState[6].status)} alt="seat" />
                    <p>{seatState[6].name.replace(/\D/g, "")}</p>
                  </td>
                )}
                {seatState[7] && (
                  <td
                    className={`seat seat-${seatState[7].status}`}
                    onClick={() => toggleSeat(seatState[7].id)}
                  >
                    <img src={getIcon(seatState[7].status)} alt="seat" />
                    <p>{seatState[7].name.replace(/\D/g, "")}</p>
                  </td>
                )}
                {seatState[8] && (
                  <td
                    className={`seat seat-${seatState[8].status}`}
                    onClick={() => toggleSeat(seatState[8].id)}
                  >
                    <img src={getIcon(seatState[8].status)} alt="seat" />
                    <p>{seatState[8].name.replace(/\D/g, "")}</p>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button
        className="seat-btn"
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
