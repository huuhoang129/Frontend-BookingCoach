//src/pages/adminPages/ticketManage/cancellationPage.tsx
import {
  Table,
  Card,
  Breadcrumb,
  Typography,
  Space,
  Button,
  Select,
  Tooltip,
  Input,
  Tag,
  Form,
} from "antd";
import {
  HomeOutlined,
  FileTextOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { useState } from "react";
import { useCancellationManage } from "../../../hooks/ticketHooks/useCancellationManage.ts";
import type { Cancellation } from "../../../types/cancellation.ts";
import CancellationDetailModal from "../../../containers/ModalsCollect/TicketModal/BookingCancellationModal";
const { Title } = Typography;
const { Option } = Select;

export default function CancellationManagePage() {
  const {
    data,
    loading,
    contextHolder,
    handleDelete,
    handleStatusUpdate,
    searchText,
    setSearchText,
    filterStatus,
    setFilterStatus,
    filterRefund,
    setFilterRefund,
  } = useCancellationManage();

  // Modal chi tiết
  const [detailModal, setDetailModal] = useState(false);
  const [selected, setSelected] = useState<Cancellation | null>(null);
  const [form] = Form.useForm();

  // Mở modal và đổ dữ liệu vào form
  const openDetail = (record: Cancellation) => {
    setSelected(record);
    form.setFieldsValue({
      status: record.status,
      adminNote: record.adminNote,
    });
    setDetailModal(true);
  };

  // Gửi cập nhật trạng thái
  const handleUpdate = () => {
    if (!selected) return;
    const values = form.getFieldsValue();
    handleStatusUpdate(selected.id, values.status, values.adminNote);
    setDetailModal(false);
  };

  // Cấu hình cột bảng
  const columns = [
    {
      title: "Mã Booking",
      dataIndex: "bookingCode",
      key: "bookingCode",
    },
    {
      title: "Khách hàng",
      key: "user",
      render: (_: any, r: Cancellation) =>
        `${r.user?.firstName} ${r.user?.lastName}`,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      ellipsis: true,
      width: 220,
    },
    {
      title: "Phương thức",
      dataIndex: "refundMethod",
      render: (method: string) => {
        const methodLabels: Record<string, string> = {
          CASH: "Tiền mặt",
          BANK: "Ngân hàng",
        };

        const methodColors: Record<string, string> = {
          CASH: "blue",
          BANK: "green",
        };

        return <Tag color={methodColors[method]}>{methodLabels[method]}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        const statusLabels: Record<string, string> = {
          WAITING: "Chờ duyệt",
          APPROVED: "Đã duyệt",
          REJECTED: "Từ chối",
        };

        const statusColors: Record<string, string> = {
          WAITING: "gold",
          APPROVED: "green",
          REJECTED: "red",
        };

        return <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>;
      },
    },
    {
      title: "Hành động",
      render: (_: any, r: Cancellation) => (
        <Space>
          {/* Xem chi tiết */}
          <Tooltip title="Xem chi tiết">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => openDetail(r)}
            />
          </Tooltip>

          {/* Xóa yêu cầu */}
          <Tooltip title="Xóa">
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(r.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {/* Notification context */}
      {contextHolder}

      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> <span>Trang chủ</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FileTextOutlined /> <span>Yêu cầu hủy vé</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Title */}
      <Title level={3}>Quản lý yêu cầu hủy vé</Title>

      {/* Bộ lọc tìm kiếm */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          {/* Tìm kiếm */}
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm theo mã hoặc tên khách..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260 }}
          />

          {/* Lọc phương thức hoàn tiền */}
          <Select
            placeholder="Lọc theo phương thức"
            allowClear
            style={{ width: 200 }}
            onChange={(v) => setFilterRefund(v || null)}
            value={filterRefund || undefined}
          >
            <Option value="CASH">Tiền mặt</Option>
            <Option value="BANK">Ngân hàng</Option>
          </Select>

          {/* Lọc trạng thái */}
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 200 }}
            onChange={(v) => setFilterStatus(v || null)}
            value={filterStatus || undefined}
          >
            <Option value="WAITING">Chờ duyệt</Option>
            <Option value="APPROVED">Đã duyệt</Option>
            <Option value="REJECTED">Từ chối</Option>
          </Select>
        </Space>
      </Card>

      {/* Bảng danh sách yêu cầu */}
      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Modal chi tiết – cập nhật trạng thái */}
      <CancellationDetailModal
        open={detailModal}
        onClose={() => setDetailModal(false)}
        onSubmit={handleUpdate}
        selected={selected}
        form={form}
      />
    </div>
  );
}
