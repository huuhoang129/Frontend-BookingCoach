import { useState } from "react";
import { Modal, Button } from "antd";

// Import 4 component chọn ghế bạn đã tạo
import NineSeats from "../../components/Seat/NineSeats";
import ThirtyTwoSeats from "../../components/Seat/TwentyTwoSeats";
import ThirtySixSeats from "../../components/Seat/ThirtySixSeats";
import FortyFiveSeats from "../../components/Seat/FortyFiveSeats";

export default function SeatTestPage() {
  const [open, setOpen] = useState<string | null>(null);

  const handleOpen = (type: string) => setOpen(type);
  const handleClose = () => setOpen(null);

  const renderSeatComponent = () => {
    switch (open) {
      case "9":
        return <NineSeats />;
      case "32":
        return <ThirtyTwoSeats />;
      case "36":
        return <ThirtySixSeats />;
      case "45":
        return <FortyFiveSeats />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Test chọn ghế các loại xe</h2>
      <div style={{ display: "flex", gap: 12 }}>
        <Button onClick={() => handleOpen("9")}>Xe 9 ghế</Button>
        <Button onClick={() => handleOpen("32")}>Xe 32 ghế</Button>
        <Button onClick={() => handleOpen("36")}>Xe 36 ghế</Button>
        <Button onClick={() => handleOpen("45")}>Xe 45 ghế</Button>
      </div>

      <Modal
        open={!!open}
        onCancel={handleClose}
        onOk={handleClose}
        width={830}
        footer={null}
        bodyStyle={{
          height: "550px",
          overflowY: "auto",
        }}
      >
        {renderSeatComponent()}
      </Modal>
    </div>
  );
}
