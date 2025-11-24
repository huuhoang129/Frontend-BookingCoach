// src/pages/adminPages/bookingManage/components/BookingDetailModal.tsx
import { Modal, Tag, Card as InfoCard } from "antd";
import dayjs from "dayjs";
import type {
  Booking,
  Customer,
  Seat,
  Payment,
  Point,
} from "../../../types/bookingTypes";

interface Props {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export default function BookingDetailModal({ open, booking, onClose }: Props) {
  if (!booking) return null;

  const statusLabel: Record<string, string> = {
    SUCCESS: "Thành công",
    FAILED: "Thất bại",
    PENDING: "Đang xử lý",
    CONFIRMED: "Đã xác nhận",
    CANCELLED: "Đã hủy",
    EXPIRED: "Hết hạn",
  };

  const methodLabel: Record<string, string> = {
    CASH: "Tiền mặt",
    BANKING: "Chuyển khoản",
    VNPAY: "VNPay",
  };

  return (
    <Modal
      title={`Chi tiết Booking #${booking.id}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div style={{ lineHeight: 1.8 }}>
        {/* Thông tin chuyến */}
        <InfoCard
          size="small"
          title="🚌 Thông tin chuyến"
          style={{ marginBottom: 16 }}
        >
          <p>
            <b>Tuyến:</b>{" "}
            {booking.trip?.route
              ? `${booking.trip.route.fromLocation?.nameLocations} → ${booking.trip.route.toLocation?.nameLocations}`
              : "—"}
          </p>
          <p>
            <b>Ngày giờ đi:</b>{" "}
            {booking.trip
              ? `${dayjs(booking.trip.startDate).format("DD/MM/YYYY")} - ${
                  booking.trip.startTime
                }`
              : "—"}
          </p>
          <p>
            <b>Ghế:</b>{" "}
            {booking.seats?.map((s: Seat) => s.seat?.name).join(", ") || "—"}
          </p>
          <p>
            <b>Xe:</b>{" "}
            {booking.trip?.vehicle
              ? `${booking.trip.vehicle.name} || ${booking.trip.vehicle.licensePlate}`
              : "—"}
          </p>
          <p>
            <b>Tổng tiền:</b> {Number(booking.totalAmount).toLocaleString()} đ
          </p>
        </InfoCard>

        {/* Khách hàng */}
        <InfoCard
          size="small"
          title="👤 Khách hàng"
          style={{ marginBottom: 16 }}
        >
          {booking.customers?.length
            ? booking.customers.map((c: Customer) => (
                <div key={c.id}>
                  <b>{c.fullName}</b> - {c.phone}{" "}
                  {c.email ? `(${c.email})` : ""}
                </div>
              ))
            : "—"}
        </InfoCard>

        {/* Điểm đón trả */}
        <InfoCard
          size="small"
          title="📍 Điểm đón / trả"
          style={{ marginBottom: 16 }}
        >
          {booking.points?.length
            ? booking.points.map((p: Point) => (
                <div key={p.id}>
                  <Tag color={p.type === "PICKUP" ? "blue" : "volcano"}>
                    {p.type === "PICKUP" ? "Điểm đón" : "Điểm trả"}
                  </Tag>{" "}
                  {p.Location?.nameLocations} {p.time ? `(${p.time})` : ""}{" "}
                  {p.note ? `- ${p.note}` : ""}
                </div>
              ))
            : "—"}
        </InfoCard>

        {/* Thanh toán */}
        <InfoCard
          size="small"
          title="💳 Thanh toán"
          style={{ marginBottom: 16 }}
        >
          {booking.payment?.length
            ? booking.payment.map((p: Payment) => (
                <div key={p.id}>
                  <Tag color="purple">{methodLabel[p.method] || p.method}</Tag>{" "}
                  {Number(p.amount).toLocaleString()} đ -{" "}
                  <Tag
                    color={
                      p.status === "SUCCESS"
                        ? "green"
                        : p.status === "FAILED"
                        ? "red"
                        : "orange"
                    }
                  >
                    {statusLabel[p.status] || p.status}
                  </Tag>
                </div>
              ))
            : "—"}
        </InfoCard>

        {/* Trạng thái */}
        <InfoCard size="small" title="📌 Trạng thái">
          <Tag
            color={
              booking.status === "CONFIRMED"
                ? "green"
                : booking.status === "CANCELLED"
                ? "red"
                : booking.status === "EXPIRED"
                ? "gray"
                : "orange"
            }
            style={{ fontSize: 14, padding: "4px 12px" }}
          >
            {statusLabel[booking.status] || booking.status}
          </Tag>
        </InfoCard>
      </div>
    </Modal>
  );
}
