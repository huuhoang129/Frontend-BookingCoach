//src/containers/ModalsCollect/SeatBookingModal.tsx
import { Modal } from "antd";
import FortyFiveSeats from "../../components/Seat/FortyFiveSeats";
import NineSeats from "../../components/Seat/NineSeats";
import DoubleDeckSeats36 from "../../components/Seat/ThirtySixSeats";
import DoubleDeckSeats22 from "../../components/Seat/TwentyTwoSeats";

import type { Trip, Seat } from "../../types/booking";

interface SeatBookingModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (trip: Trip, seats: Seat[]) => void;
  vehicleType: string;
  seats: Seat[];
  trip: Trip | null;
}

export default function SeatBookingModal({
  open,
  onClose,
  onConfirm,
  vehicleType,
  seats,
  trip,
}: SeatBookingModalProps) {
  // Lấy danh sách ghế bị khóa
  const disabledSeats = seats
    .filter((s) => s.status === "SOLD" || s.status === "HOLD")
    .map((s) => s.id);

  // Props chung truyền xuống từng layout ghế
  const commonProps = {
    seats,
    trip,
    onConfirm,
    onClose,
    disabledSeats,
  };

  // Chọn layout ghế theo loại xe
  const renderSeatLayout = () => {
    switch (vehicleType.toUpperCase()) {
      case "NORMAL":
        return <FortyFiveSeats {...commonProps} />;
      case "LIMOUSINE":
        return <NineSeats {...commonProps} />;
      case "SLEEPER":
        return <DoubleDeckSeats36 {...commonProps} />;
      case "DOUBLESLEEPER":
        return <DoubleDeckSeats22 {...commonProps} />;
      default:
        return <p>Chưa có sơ đồ ghế cho loại xe này</p>;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={950}
      bodyStyle={{ height: "590px", overflowY: "auto" }}
    >
      {renderSeatLayout()}
    </Modal>
  );
}
