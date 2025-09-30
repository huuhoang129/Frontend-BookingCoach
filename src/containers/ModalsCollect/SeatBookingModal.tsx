import { Modal } from "antd";
import FortyFiveSeats from "../../components/Seat/FortyFiveSeats";
import NineSeats from "../../components/Seat/NineSeats";
import DoubleDeckSeats36 from "../../components/Seat/ThirtySixSeats";
import DoubleDeckSeats22 from "../../components/Seat/TwentyTwoSeats";

// 🔥 Thêm định nghĩa Seat ở đây
interface Seat {
  id: number;
  name: string;
  status: "AVAILABLE" | "HOLD" | "SOLD";
  floor: number;
}

interface Province {
  id: number;
  nameProvince: string;
}
interface Location {
  id: number;
  nameLocations: string;
  province?: Province;
}
interface Vehicle {
  id: number;
  name: string;
  type: string;
  seatCount: number;
}
interface Route {
  id: number;
  fromLocation: Location;
  toLocation: Location;
}
interface Trip {
  id: number;
  startDate: string;
  startTime: string;
  totalTime?: string;
  status: string;
  route: Route;
  vehicle: Vehicle;
  basePrice: number;
  totalSeats: number;
  availableSeats: number;
  seats: Seat[];
}

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
      footer={null} // ✅ giữ nguyên
      width={890}
      bodyStyle={{ height: "550px", overflowY: "auto" }}
    >
      {renderSeatLayout()}
    </Modal>
  );
}
