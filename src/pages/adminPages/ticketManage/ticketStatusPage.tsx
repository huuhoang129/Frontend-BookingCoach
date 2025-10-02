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
  EditOutlined,
  EyeOutlined,
  HomeOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

interface Payment {
  id: number;
  bookingId: number;
  method: "CASH" | "BANKING" | "VNPAY";
  status: "PENDING" | "SUCCESS" | "FAILED";
  amount: string;
  transactionCode?: string;
  paidAt?: string;
}

export default function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/bookings/payments/all"
      );
      // ⚠️ bạn nên có 1 API get all payments (hoặc gắn vào bookings)
      if (res.data.errCode === 0) setPayments(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleStatusChange = async (paymentId: number, status: string) => {
    try {
      const res = await axios.put(
        "http://localhost:8080/api/v1/bookings/payments/status",
        { paymentId, status }
      );
      if (res.data.errCode === 0) {
        message.success("Cập nhật trạng thái thành công");
        fetchPayments();
      } else {
        message.error(res.data.errMessage);
      }
    } catch {
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  // filter
  const filteredData = payments.filter((p) => {
    if (!searchText) return true;
    return (
      String(p.id).includes(searchText) ||
      String(p.bookingId).includes(searchText) ||
      p.method.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const columns: ColumnsType<Payment> = [
    { title: "Mã", dataIndex: "id", width: 80 },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      width: 140, // 👉 tăng độ rộng
    },
    {
      title: "Phương thức",
      dataIndex: "method",
      render: (m) => (
        <Tag
          color={m === "CASH" ? "blue" : m === "BANKING" ? "green" : "purple"}
        >
          {m}
        </Tag>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
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
          <Option value="SUCCESS">Thành công</Option>
          <Option value="FAILED">Thất bại</Option>
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
                setSelectedPayment(r);
                setIsModalOpen(true);
              }}
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
          <DollarOutlined />
          <span>Payments</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3} style={{ marginBottom: 20, fontWeight: 700 }}>
        Quản lý thanh toán
      </Title>

      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" gap={16} wrap="wrap">
          <Input
            placeholder="🔍 Tìm theo Payment ID, Booking ID, phương thức..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 320 }}
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

      {/* Modal chi tiết payment */}
      <Modal
        title={`Chi tiết Payment #${selectedPayment?.id}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedPayment && (
          <div style={{ lineHeight: 1.8 }}>
            {/* Thông tin chính */}
            <Card
              size="small"
              title="💳 Thông tin thanh toán"
              style={{ marginBottom: 16 }}
            >
              <p>
                <b>Booking ID:</b> {selectedPayment.bookingId}
              </p>
              <p>
                <b>Phương thức:</b>{" "}
                <Tag
                  color={
                    selectedPayment.method === "CASH"
                      ? "blue"
                      : selectedPayment.method === "BANKING"
                      ? "green"
                      : "purple"
                  }
                >
                  {selectedPayment.method}
                </Tag>
              </p>
              <p>
                <b>Số tiền:</b>{" "}
                {Number(selectedPayment.amount).toLocaleString()} đ
              </p>
            </Card>

            {/* Giao dịch */}
            <Card
              size="small"
              title="📄 Giao dịch"
              style={{ marginBottom: 16 }}
            >
              <p>
                <b>Mã giao dịch:</b> {selectedPayment.transactionCode || "—"}
              </p>
              <p>
                <b>Thời gian thanh toán:</b>{" "}
                {selectedPayment.paidAt
                  ? dayjs(selectedPayment.paidAt).format("DD/MM/YYYY HH:mm")
                  : "—"}
              </p>
            </Card>

            {/* Trạng thái */}
            <Card size="small" title="📌 Trạng thái">
              <Tag
                color={
                  selectedPayment.status === "SUCCESS"
                    ? "green"
                    : selectedPayment.status === "FAILED"
                    ? "red"
                    : "orange"
                }
                style={{ fontSize: 14, padding: "4px 12px" }}
              >
                {selectedPayment.status}
              </Tag>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
