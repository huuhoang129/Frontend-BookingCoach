import {
  Table,
  Input,
  Button,
  Space,
  Card,
  Flex,
  Typography,
  Tooltip,
  Breadcrumb,
  Modal,
  Tag,
  Select,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState, useMemo } from "react";
import { useBookingManage } from "../../../hooks/ticketHooks/useBookingManage";
import type {
  Booking,
  Customer,
  Seat,
  Payment,
  Point,
} from "../../../types/bookingTypes";

const { Title } = Typography;
const { Option } = Select;

export default function BookingPage() {
  const {
    filteredData,
    loading,
    searchText,
    setSearchText,
    isModalOpen,
    setIsModalOpen,
    selectedBooking,
    setSelectedBooking,
    handleDelete,
    handleStatusChange,
  } = useBookingManage();

  // ✅ Thêm state cho bộ lọc
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // ✅ Dữ liệu sau khi lọc theo ngày và trạng thái
  const filteredBookings = useMemo(() => {
    return filteredData.filter((b: Booking) => {
      const matchStatus = !selectedStatus || b.status === selectedStatus;
      const matchDate =
        !selectedDate ||
        (b.trip && dayjs(b.trip.startDate).isSame(dayjs(selectedDate), "day"));
      return matchStatus && matchDate;
    });
  }, [filteredData, selectedStatus, selectedDate]);

  // ✅ Cột bảng
  const columns: ColumnsType<Booking> = [
    {
      title: "Mã",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "Tuyến",
      key: "trip",
      render: (_, r) =>
        r.trip?.route ? (
          <div>
            {r.trip.route.fromLocation?.nameLocations} →{" "}
            {r.trip.route.toLocation?.nameLocations}
          </div>
        ) : (
          "—"
        ),
    },
    {
      title: "Ngày đi",
      key: "tripDate",
      render: (_, r) =>
        r.trip ? dayjs(r.trip.startDate).format("DD/MM/YYYY") : "—",
    },
    {
      title: "Khách hàng",
      key: "customers",
      render: (_, r) =>
        r.customers && r.customers.length > 0
          ? r.customers.map((c: Customer) => c.fullName).join(", ")
          : "—",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      render: (v: number) => `${Number(v).toLocaleString()} đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s: string, r) => (
        <Select
          value={s}
          style={{ width: 140 }}
          onChange={(val) => handleStatusChange(r.id, val)}
        >
          <Option value="PENDING">Chờ xử lý</Option>
          <Option value="CONFIRMED">Đã xác nhận</Option>
          <Option value="CANCELLED">Đã hủy</Option>
        </Select>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedBooking(r);
                setIsModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(r.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined />
          <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FileTextOutlined />
          <span>Bookings</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3} style={{ marginBottom: 20, fontWeight: 700 }}>
        Quản lý đặt vé
      </Title>

      {/* Bộ lọc */}
      {/* Toolbar */}
      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          {/* Nhóm bộ lọc bên trái */}
          <Flex gap={16} wrap="wrap">
            {/* 🔍 Tìm kiếm */}
            <Input
              placeholder="🔍 Tìm theo mã, tên KH, số tiền..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
            />

            {/* 📅 Lọc theo ngày */}
            <DatePicker
              placeholder="Chọn ngày đi"
              format="DD/MM/YYYY"
              allowClear
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={(date) =>
                setSelectedDate(date ? date.format("YYYY-MM-DD") : null)
              }
            />

            {/* 📌 Lọc theo trạng thái */}
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              style={{ width: 180 }}
              value={selectedStatus || undefined}
              onChange={(val) => setSelectedStatus(val || null)}
            >
              <Option value="PENDING">Chờ xử lý</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Flex>
        </Flex>
      </Card>

      {/* Bảng dữ liệu */}
      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredBookings}
          columns={columns}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Modal chi tiết */}
      <Modal
        title={`Chi tiết Booking #${selectedBooking?.id}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedBooking && <BookingDetail booking={selectedBooking} />}
      </Modal>
    </div>
  );
}

/* -------- Component nhỏ hiển thị chi tiết Booking -------- */
import { Card as InfoCard } from "antd";

function BookingDetail({ booking }: { booking: Booking }) {
  const statusLabel: Record<string, string> = {
    SUCCESS: "Thành công",
    FAILED: "Thất bại",
    PENDING: "Đang xử lý",
    CONFIRMED: "Đã xác nhận",
    CANCELLED: "Đã hủy",
  };

  const methodLabel: Record<string, string> = {
    CASH: "Tiền mặt",
    BANKING: "Chuyển khoản",
    VNPAY: "VNPay",
  };

  return (
    <div style={{ lineHeight: 1.8 }}>
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
            ? `${dayjs(booking.trip.startDate).format("DD/MM/YYYY")} ${
                booking.trip.startTime
              }`
            : "—"}
        </p>
        <p>
          <b>Ghế:</b>{" "}
          {booking.seats?.map((s: Seat) => `#${s.seatId}`).join(", ") || "—"}
        </p>
        <p>
          <b>Tổng tiền:</b> {Number(booking.totalAmount).toLocaleString()} đ
        </p>
      </InfoCard>

      <InfoCard size="small" title="👤 Khách hàng" style={{ marginBottom: 16 }}>
        {booking.customers?.length
          ? booking.customers.map((c: Customer) => (
              <div key={c.id}>
                <b>{c.fullName}</b> - {c.phone} {c.email ? `(${c.email})` : ""}
              </div>
            ))
          : "—"}
      </InfoCard>

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

      <InfoCard size="small" title="💳 Thanh toán" style={{ marginBottom: 16 }}>
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

      <InfoCard size="small" title="📌 Trạng thái">
        <Tag
          color={
            booking.status === "CONFIRMED"
              ? "green"
              : booking.status === "CANCELLED"
              ? "red"
              : "orange"
          }
          style={{ fontSize: 14, padding: "4px 12px" }}
        >
          {statusLabel[booking.status] || booking.status}
        </Tag>
      </InfoCard>
    </div>
  );
}
