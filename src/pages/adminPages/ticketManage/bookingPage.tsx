// src/pages/adminPages/bookingManage/BookingPage.tsx
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
import type { Booking, Customer } from "../../../types/bookingTypes";
import BookingModal from "../../../containers/ModalsCollect/TicketModal/BookingModal";

const { Title } = Typography;
const { Option } = Select;

export default function BookingPage() {
  const {
    filteredData,
    loading,
    isModalOpen,
    setIsModalOpen,
    selectedBooking,
    setSelectedBooking,
    handleDelete,
    handleStatusChange,
  } = useBookingManage();

  // 🟢 local state (giống VehiclePage)
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null
  );

  // 🔎 Lọc dữ liệu
  const filteredBookings = useMemo(() => {
    return filteredData
      .filter((b: Booking) => {
        const matchStatus = !selectedStatus || b.status === selectedStatus;
        const matchDate =
          !selectedDate ||
          (b.trip &&
            dayjs(b.trip.startDate).isSame(dayjs(selectedDate), "day"));

        const keyword = searchText.toLowerCase().trim();
        const matchKeyword =
          !keyword ||
          (b.bookingCode && b.bookingCode.toLowerCase().includes(keyword)) ||
          (b.customers &&
            b.customers.some((c) =>
              c.fullName.toLowerCase().includes(keyword)
            ));

        // 🛣️ Lọc theo tuyến
        const routeName = b.trip
          ? `${b.trip.route?.fromLocation?.nameLocations} → ${b.trip.route?.toLocation?.nameLocations}`
          : "";
        const matchRoute = !selectedRoute || routeName === selectedRoute;

        // 💰 Lọc theo khoảng tiền
        let matchPrice = true;
        if (selectedPriceRange) {
          const [min, max] = selectedPriceRange.split("-").map(Number);
          matchPrice =
            b.totalAmount >= min * 1000 && b.totalAmount < max * 1000;
        }

        return (
          matchStatus && matchDate && matchKeyword && matchRoute && matchPrice
        );
      })
      .sort((a, b) => b.id - a.id);
  }, [
    filteredData,
    selectedStatus,
    selectedDate,
    searchText,
    selectedRoute,
    selectedPriceRange,
  ]);

  // Lấy danh sách tuyến duy nhất
  const uniqueRoutes = Array.from(
    new Set(
      filteredData
        .filter((b) => b.trip?.route)
        .map(
          (b) =>
            `${b.trip!.route!.fromLocation!.nameLocations} → ${
              b.trip!.route!.toLocation!.nameLocations
            }`
        )
    )
  );

  // 🧱 Cấu hình bảng
  const columns: ColumnsType<Booking> = [
    { title: "Mã đặt vé", dataIndex: "bookingCode", key: "bookingCode" },
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
      render: (s: string, r) => {
        return (
          <Select
            value={s}
            style={{ width: 150 }}
            onChange={(val) => handleStatusChange(r.id, val)}
          >
            <Option value="PENDING">Chờ xử lý</Option>
            <Option value="CONFIRMED">Đã xác nhận</Option>
            <Option value="CANCELLED">Đã hủy</Option>
            <Option value="EXPIRED" disabled>
              Hết hạn
            </Option>
          </Select>
        );
      },
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
      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Flex gap={16} wrap="wrap">
            <Input
              placeholder="🔍 Tìm theo mã hoặc tên khách hàng..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
            />

            <DatePicker
              placeholder="Chọn ngày đi"
              format="DD/MM/YYYY"
              allowClear
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={(date) =>
                setSelectedDate(date ? date.format("YYYY-MM-DD") : null)
              }
            />

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
              <Option value="EXPIRED">Hết hạn</Option>
            </Select>

            <Select
              placeholder="Lọc theo tuyến"
              allowClear
              style={{ width: 240 }}
              value={selectedRoute || undefined}
              onChange={(val) => setSelectedRoute(val || null)}
            >
              {uniqueRoutes.map((route) => (
                <Option key={route} value={route}>
                  {route}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Khoảng giá (nghìn)"
              allowClear
              style={{ width: 180 }}
              value={selectedPriceRange || undefined}
              onChange={(val) => setSelectedPriceRange(val || null)}
            >
              <Option value="100-200">100k – 200k</Option>
              <Option value="200-400">200k – 400k</Option>
              <Option value="400-600">400k – 600k</Option>
              <Option value="600-1000">600k – 1.000k</Option>
            </Select>
          </Flex>
        </Flex>
      </Card>

      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredBookings}
          columns={columns}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <BookingModal
        open={isModalOpen}
        booking={selectedBooking}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
