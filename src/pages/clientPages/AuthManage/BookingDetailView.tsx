// src/pages/clientPages/AuthManage/BookingDetailView.tsx
import { Button, Descriptions, Tag } from "antd";
import "./BookingDetailView.scss";

interface BookingDetailViewProps {
  booking: any;
  onBack: () => void;
}

export default function BookingDetailView({
  booking,
  onBack,
}: BookingDetailViewProps) {
  const mainCustomer = Array.isArray(booking.customers)
    ? booking.customers[0]
    : booking.customers;

  const seats = Array.isArray(booking.seats)
    ? booking.seats.map(
        (s: any) => `${s.seat?.name || "Ghế ?"} (Tầng ${s.seat?.floor || 1})`
      )
    : [];

  const payment = Array.isArray(booking.payment)
    ? booking.payment[0]
    : booking.payment;

  const paymentStatusTag = (() => {
    const status = payment?.status;

    if (status === "SUCCESS") return <Tag color="green">ĐÃ THANH TOÁN</Tag>;
    if (status === "PENDING")
      return <Tag color="orange">ĐANG CHỜ XÁC NHẬN</Tag>;
    if (status === "FAILED") return <Tag color="red">THANH TOÁN THẤT BẠI</Tag>;

    return <Tag>KHÔNG RÕ</Tag>;
  })();

  const formattedTotalAmount = booking.totalAmount
    ? Number(booking.totalAmount).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
    : "--";

  const trip = booking.trip;
  const fromLocation = trip?.route?.fromLocation?.nameLocations;
  const toLocation = trip?.route?.toLocation?.nameLocations;

  const startDate = trip?.startDate
    ? new Date(trip.startDate).toLocaleDateString("vi-VN")
    : "--";

  const startTime = trip?.startTime ? trip.startTime.slice(0, 5) : "--";

  const pickupPoint = booking.points?.find((p: any) => p.type === "PICKUP");
  const dropoffPoint = booking.points?.find((p: any) => p.type === "DROPOFF");

  const pickupLocation = pickupPoint?.Location?.nameLocations;
  const dropoffLocation = dropoffPoint?.Location?.nameLocations;

  return (
    <div className="booking-detail">
      <Button onClick={onBack} style={{ marginBottom: 16 }}>
        ← Quay lại lịch sử đặt vé
      </Button>

      <h3 style={{ marginBottom: 16 }}>Chi tiết đơn đặt vé</h3>

      {/* THÔNG TIN VÉ */}
      <Descriptions
        className="bd-section bd-fixed-label"
        bordered
        column={1}
        title="Thông tin vé"
      >
        <Descriptions.Item label="Mã vé">
          <Tag color="blue">{booking.bookingCode}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày đặt vé">
          {booking.createdAt
            ? new Date(booking.createdAt).toLocaleString("vi-VN")
            : "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Tổng số ghế đã đặt">
          {seats.length}
        </Descriptions.Item>

        <Descriptions.Item label="Tổng số tiền">
          {formattedTotalAmount}
        </Descriptions.Item>
      </Descriptions>

      {/* THÔNG TIN HÀNH KHÁCH */}
      <Descriptions
        className="bd-section bd-fixed-label"
        bordered
        column={1}
        title="Thông tin hành khách"
      >
        <Descriptions.Item label="Họ và tên người đặt vé">
          {mainCustomer?.fullName || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Số điện thoại">
          {mainCustomer?.phone || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Địa chỉ email">
          {mainCustomer?.email || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Danh sách ghế ngồi">
          {seats.join(", ")}
        </Descriptions.Item>
      </Descriptions>

      {/* THÔNG TIN CHUYẾN ĐI */}
      <Descriptions
        className="bd-section bd-fixed-label"
        bordered
        column={1}
        title="Thông tin chuyến đi"
      >
        <Descriptions.Item label="Tuyến xe">
          {fromLocation && toLocation
            ? `${fromLocation} → ${toLocation}`
            : "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày khởi hành">
          {startDate}
        </Descriptions.Item>

        <Descriptions.Item label="Giờ khởi hành dự kiến">
          {startTime}
        </Descriptions.Item>

        <Descriptions.Item label="Điểm đón khách">
          {pickupLocation || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Điểm trả khách">
          {dropoffLocation || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Tên xe">
          {trip?.vehicle?.name || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Loại xe">
          {trip?.vehicle?.type || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Biển số xe">
          {trip?.vehicle?.licensePlate || "--"}
        </Descriptions.Item>
      </Descriptions>

      {/* THÔNG TIN THANH TOÁN */}
      <Descriptions
        className="bd-section bd-fixed-label"
        bordered
        column={1}
        title="Thông tin thanh toán"
      >
        <Descriptions.Item label="Trạng thái thanh toán">
          {paymentStatusTag}
        </Descriptions.Item>

        <Descriptions.Item label="Phương thức thanh toán">
          {payment?.method || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Mã giao dịch (nếu có)">
          {payment?.transactionCode || payment?.vnp_TransactionNo || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Thời gian thanh toán">
          {payment?.paidAt
            ? new Date(payment.paidAt).toLocaleString("vi-VN")
            : "--"}
        </Descriptions.Item>
      </Descriptions>

      <Button
        type="primary"
        style={{ marginTop: 20 }}
        onClick={() =>
          window.open(
            `http://localhost:8080/api/v1/bookings/${booking.id}/invoice`,
            "_blank"
          )
        }
      >
        Tải hóa đơn (PDF)
      </Button>
    </div>
  );
}
