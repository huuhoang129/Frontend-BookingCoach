import {
  Table,
  Input,
  Button,
  Card,
  Flex,
  Typography,
  Tooltip,
  Breadcrumb,
  Modal,
  Tag,
  Select,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  HomeOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState, useMemo } from "react";
import { usePayments } from "../../../hooks/ticketHooks/usePaymentsManage.ts";
import type { Payment } from "../../../hooks/ticketHooks/usePaymentsManage.ts";

const { Title } = Typography;
const { Option } = Select;

export default function PaymentPage() {
  const {
    filteredData,
    loading,
    handleStatusChange,
    isModalOpen,
    setIsModalOpen,
    selectedPayment,
    setSelectedPayment,
  } = usePayments();

  // 🟢 Local state (như VehiclePage)
  const [searchText, setSearchText] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null
  );

  // Map sang tiếng Việt cho phương thức và trạng thái
  const methodLabel: Record<string, string> = {
    CASH: "Tiền mặt",
    BANKING: "Chuyển khoản",
    VNPAY: "VNPay",
  };

  const statusLabel: Record<string, string> = {
    PENDING: "Đang xử lý",
    SUCCESS: "Thành công",
    FAILED: "Thất bại",
  };

  // Lọc dữ liệu
  const filteredPayments = useMemo(() => {
    return filteredData
      .filter((p: Payment) => {
        const keyword = searchText.toLowerCase().trim();
        const matchKeyword =
          !keyword ||
          String(p.id).includes(keyword) ||
          String(p.booking?.bookingCode || "")
            .toLowerCase()
            .includes(keyword) ||
          p.method.toLowerCase().includes(keyword);

        const matchMethod = !selectedMethod || p.method === selectedMethod;
        const matchStatus = !selectedStatus || p.status === selectedStatus;

        let matchPrice = true;
        if (selectedPriceRange) {
          const [min, max] = selectedPriceRange.split("-").map(Number);
          matchPrice =
            Number(p.amount) >= min * 1000 && Number(p.amount) < max * 1000;
        }

        return matchKeyword && matchMethod && matchStatus && matchPrice;
      })
      .sort((a, b) => b.id - a.id);
  }, [
    filteredData,
    searchText,
    selectedMethod,
    selectedStatus,
    selectedPriceRange,
  ]);

  // Cấu hình bảng
  const columns: ColumnsType<Payment> = [
    {
      title: "Mã đặt vé",
      key: "bookingCode",
      dataIndex: "booking",
      width: 160,
      render: (b) => b?.bookingCode || "—", // 🟢 bỏ CSS ở đây, hiển thị text bình thường
    },
    {
      title: "Phương thức",
      dataIndex: "method",
      render: (m) => (
        <Tag
          color={m === "CASH" ? "blue" : m === "BANKING" ? "green" : "purple"}
        >
          {methodLabel[m] || m}
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
          <Option value="PENDING">Đang xử lý</Option>
          <Option value="SUCCESS">Thành công</Option>
          <Option value="FAILED">Thất bại</Option>
        </Select>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, r) => (
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
          <DollarOutlined />
          <span>Thanh toán</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3} style={{ marginBottom: 20, fontWeight: 700 }}>
        Quản lý thanh toán
      </Title>

      {/* Bộ lọc */}
      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Flex gap={16} wrap="wrap">
            {/* Input tìm kiếm */}
            <Input
              placeholder="🔍 Tìm theo mã đặt vé, mã thanh toán, phương thức..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320 }}
            />

            {/* Lọc phương thức */}
            <Select
              allowClear
              placeholder="Phương thức"
              style={{ width: 180 }}
              value={selectedMethod || undefined}
              onChange={(val) => setSelectedMethod(val || null)}
            >
              <Option value="CASH">Tiền mặt</Option>
              <Option value="BANKING">Chuyển khoản</Option>
              <Option value="VNPAY">VNPay</Option>
            </Select>

            {/* Lọc khoảng tiền */}
            <Select
              allowClear
              placeholder="Khoảng tiền (nghìn)"
              style={{ width: 200 }}
              value={selectedPriceRange || undefined}
              onChange={(val) => setSelectedPriceRange(val || null)}
            >
              <Option value="100-200">100k – 200k</Option>
              <Option value="200-400">200k – 400k</Option>
              <Option value="400-600">400k – 600k</Option>
              <Option value="600-1000">600k – 1.000k</Option>
            </Select>

            {/* Lọc trạng thái */}
            <Select
              allowClear
              placeholder="Trạng thái"
              style={{ width: 180 }}
              value={selectedStatus || undefined}
              onChange={(val) => setSelectedStatus(val || null)}
            >
              <Option value="PENDING">Đang xử lý</Option>
              <Option value="SUCCESS">Thành công</Option>
              <Option value="FAILED">Thất bại</Option>
            </Select>
          </Flex>
        </Flex>
      </Card>

      {/* Bảng dữ liệu */}
      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredPayments}
          columns={columns}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Modal chi tiết */}
      <Modal
        title={`Chi tiết thanh toán #${selectedPayment?.id}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedPayment && (
          <div style={{ lineHeight: 1.8 }}>
            <Card
              size="small"
              title="💳 Thông tin thanh toán"
              style={{ marginBottom: 16 }}
            >
              <p>
                <b>Mã đặt vé:</b> {selectedPayment.booking?.bookingCode || "—"}
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
                  {methodLabel[selectedPayment.method] ||
                    selectedPayment.method}
                </Tag>
              </p>
              <p>
                <b>Số tiền:</b>{" "}
                {Number(selectedPayment.amount).toLocaleString()} đ
              </p>
            </Card>

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
                {statusLabel[selectedPayment.status] || selectedPayment.status}
              </Tag>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
