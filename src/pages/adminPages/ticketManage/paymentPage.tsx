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
import { usePayments } from "../../../hooks/ticketHooks/usePaymentsManage.ts";
import type { Payment } from "../../../hooks/ticketHooks/usePaymentsManage.ts";

const { Title } = Typography;
const { Option } = Select;

export default function PaymentPage() {
  const {
    filteredData,
    loading,
    searchText,
    setSearchText,
    handleStatusChange,
    isModalOpen,
    setIsModalOpen,
    selectedPayment,
    setSelectedPayment,
  } = usePayments();

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

  const columns: ColumnsType<Payment> = [
    { title: "Mã đặt vé", dataIndex: "bookingId", width: 140 },
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

      {/* Ô tìm kiếm */}
      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" gap={16} wrap="wrap">
          <Input
            placeholder="🔍 Tìm theo Mã thanh toán, Mã đặt vé, phương thức..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 320 }}
          />
        </Flex>
      </Card>

      {/* Bảng dữ liệu */}
      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredData}
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
                <b>Mã đặt vé:</b> {selectedPayment.bookingId}
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
