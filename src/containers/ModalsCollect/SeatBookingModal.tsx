import { Modal } from "antd";
import FortyFiveSeats from "../../components/Seat/FortyFiveSeats";
import NineSeats from "../../components/Seat/NineSeats";
import DoubleDeckSeats36 from "../../components/Seat/ThirtySixSeats";
import DoubleDeckSeats22 from "../../components/Seat/TwentyTwoSeats";

// ✅ import type chung, không khai báo lại để tránh lỗi
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
  const renderSeatLayout = () => {
    const commonProps = { seats, trip, onConfirm, onClose };

    switch (vehicleType) {
      case "Normal":
        return <FortyFiveSeats {...commonProps} />;
      case "Limousine":
        return <NineSeats {...commonProps} />;
      case "Sleeper":
        return <DoubleDeckSeats36 {...commonProps} />;
      case "DoubleSleeper":
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
      width={890}
      bodyStyle={{ height: "550px", overflowY: "auto" }}
    >
      {renderSeatLayout()}
    </Modal>
  );
}
