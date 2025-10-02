import { useEffect, useState } from "react";
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
  message,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

interface Customer {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
}

interface Point {
  id: number;
  type: "PICKUP" | "DROPOFF";
  locationId: number;
  time?: string;
  note?: string;
  Location?: {
    id: number;
    nameLocations: string;
  };
}

interface Seat {
  id: number;
  seatId: number;
  price: number;
}

interface Payment {
  id: number;
  method: string;
  amount: number;
  status: string;
}

interface Trip {
  id: number;
  startDate: string;
  startTime: string;
  route?: {
    fromLocation: { nameLocations: string };
    toLocation: { nameLocations: string };
  };
}

interface Booking {
  id: number;
  userId?: number;
  coachTripId: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  customers?: Customer[];
  points?: Point[];
  seats?: Seat[];
  payment?: Payment[];
  trip?: Trip;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/bookings");
      if (res.data.errCode === 0) setBookings(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/bookings/${id}`
      );
      if (res.data.errCode === 0) {
        message.success("Xóa booking thành công");
        fetchBookings();
      } else {
        message.error(res.data.errMessage);
      }
    } catch {
      message.error("Lỗi khi xóa booking");
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/v1/bookings/${id}`,
        { status }
      );
      if (res.data.errCode === 0) {
        message.success("Cập nhật trạng thái thành công");
        fetchBookings();
      } else {
        message.error(res.data.errMessage);
      }
    } catch {
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  // filter
  const filteredData = bookings.filter((b) => {
    if (!searchText) return true;
    return (
      b.customers?.some((c) =>
        c.fullName.toLowerCase().includes(searchText.toLowerCase())
      ) ||
      String(b.id).includes(searchText) ||
      String(b.totalAmount).includes(searchText)
    );
  });

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
            {r.trip.route.fromLocation?.nameLocations} ➡️{" "}
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
          ? r.customers.map((c) => c.fullName).join(", ")
          : "—",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      render: (v) => `${Number(v).toLocaleString()} đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s, r) => (
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

      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" gap={16} wrap="wrap">
          <Input
            placeholder="🔍 Tìm theo mã, tên KH, số tiền..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
          />
        </Flex>
      </Card>

      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Modal xem chi tiết */}
      <Modal
        title={`Chi tiết Booking #${selectedBooking?.id}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedBooking && (
          <div style={{ lineHeight: 1.8 }}>
            {/* Thông tin chuyến */}
            <Card
              size="small"
              title="🚌 Thông tin chuyến"
              style={{ marginBottom: 16 }}
            >
              <p>
                <b>Tuyến:</b>{" "}
                {selectedBooking.trip?.route
                  ? `${selectedBooking.trip.route.fromLocation?.nameLocations} ➡️ ${selectedBooking.trip.route.toLocation?.nameLocations}`
                  : "—"}
              </p>
              <p>
                <b>Ngày giờ đi:</b>{" "}
                {selectedBooking.trip
                  ? `${dayjs(selectedBooking.trip.startDate).format(
                      "DD/MM/YYYY"
                    )} ${selectedBooking.trip.startTime}`
                  : "—"}
              </p>
              <p>
                <b>Ghế:</b>{" "}
                {selectedBooking.seats?.map((s) => `#${s.seatId}`).join(", ") ||
                  "—"}
              </p>
              <p>
                <b>Tổng tiền:</b>{" "}
                {Number(selectedBooking.totalAmount).toLocaleString()} đ
              </p>
            </Card>

            {/* Khách hàng */}
            <Card
              size="small"
              title="👤 Khách hàng"
              style={{ marginBottom: 16 }}
            >
              {selectedBooking.customers &&
              selectedBooking.customers.length > 0 ? (
                selectedBooking.customers.map((c) => (
                  <div key={c.id} style={{ marginBottom: 8 }}>
                    <b>{c.fullName}</b> - {c.phone}{" "}
                    {c.email ? `(${c.email})` : ""}
                  </div>
                ))
              ) : (
                <p>—</p>
              )}
            </Card>

            {/* Điểm đón / trả */}
            <Card
              size="small"
              title="📍 Điểm đón / trả"
              style={{ marginBottom: 16 }}
            >
              {selectedBooking.points && selectedBooking.points.length > 0 ? (
                selectedBooking.points.map((p) => (
                  <div key={p.id} style={{ marginBottom: 8 }}>
                    <Tag color={p.type === "PICKUP" ? "blue" : "volcano"}>
                      {p.type === "PICKUP" ? "Đón" : "Trả"}
                    </Tag>{" "}
                    {p.Location?.nameLocations || p.locationId}{" "}
                    {p.time ? `(${p.time})` : ""} {p.note ? `- ${p.note}` : ""}
                  </div>
                ))
              ) : (
                <p>—</p>
              )}
            </Card>

            {/* Thanh toán */}
            <Card
              size="small"
              title="💳 Thanh toán"
              style={{ marginBottom: 16 }}
            >
              {selectedBooking.payment && selectedBooking.payment.length > 0 ? (
                selectedBooking.payment.map((p) => (
                  <div key={p.id} style={{ marginBottom: 8 }}>
                    <Tag color="purple">{p.method}</Tag>{" "}
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
                      {p.status}
                    </Tag>
                  </div>
                ))
              ) : (
                <p>—</p>
              )}
            </Card>

            {/* Trạng thái Booking */}
            <Card size="small" title="📌 Trạng thái">
              <Tag
                color={
                  selectedBooking.status === "CONFIRMED"
                    ? "green"
                    : selectedBooking.status === "CANCELLED"
                    ? "red"
                    : "orange"
                }
                style={{ fontSize: 14, padding: "4px 12px" }}
              >
                {selectedBooking.status}
              </Tag>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
