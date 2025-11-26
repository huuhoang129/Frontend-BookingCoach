//src/pages/adminPages/tripManage/schedulePage.tsx
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
  Tag,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import dayjs from "dayjs";
import { useSchedules } from "../../../hooks/routerListHooks/useSchedules";
import ScheduleModal from "../../../containers/ModalsCollect/RouteListModal/ScheduleModal";

const { Title } = Typography;

export default function SchedulePage() {
  const {
    schedules,
    routes,
    vehicles,
    vehicleStatuses,
    prices,
    loading,
    isModalOpen,
    setIsModalOpen,
    isEdit,
    setIsEdit,
    editingSchedule,
    setEditingSchedule,
    form,
    handleSubmit,
    handleDelete,
    handleGenerateTrips,
    contextHolder,
  } = useSchedules();

  const [searchText, setSearchText] = useState("");

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = schedules.filter((s) => {
    if (!searchText) return true;
    return (
      s.route?.fromLocation?.nameLocations
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      s.route?.toLocation?.nameLocations
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      s.vehicle?.licensePlate?.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Cấu hình các cột hiển thị trong bảng
  const columns: ColumnsType<any> = [
    {
      title: "Tuyến",
      key: "route",
      render: (_, r) =>
        r.route
          ? `${r.route.fromLocation?.nameLocations} → ${r.route.toLocation?.nameLocations}`
          : "—",
    },
    {
      title: "Xe",
      key: "vehicle",
      render: (_, r) =>
        r.vehicle ? `${r.vehicle.licensePlate} (${r.vehicle.name})` : "—",
    },
    {
      title: "Giá vé",
      key: "price",
      render: (_, r) =>
        r.price ? `${r.price.priceTrip.toLocaleString()} đ` : "—",
    },
    {
      title: "Giờ khởi hành",
      key: "startTime",
      render: (_, r) =>
        r.startTime ? dayjs(r.startTime, "HH:mm:ss").format("HH:mm") : "—",
    },
    {
      title: "Thời gian hành trình",
      key: "totalTime",
      render: (_, r) =>
        r.totalTime ? dayjs(r.totalTime, "HH:mm:ss").format("HH:mm") : "—",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, r) => (
        <Tag
          color={r.status === "ACTIVE" ? "green" : "red"}
          style={{ borderRadius: 6, fontWeight: 500, padding: "2px 8px" }}
        >
          {r.status === "ACTIVE" ? "Hoạt động" : "Ngừng"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      width: 130,
      render: (_, record) => (
        <Space>
          {/* Sửa lịch trình */}
          <Tooltip title="Sửa lịch trình">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{
                color: "#4d940e",
                border: "none",
                background: "transparent",
              }}
              onClick={() => {
                setIsEdit(true);
                setEditingSchedule(record);
                setIsModalOpen(true);
              }}
            />
          </Tooltip>

          {/* Xóa lịch trình */}
          <Tooltip title="Xóa lịch trình">
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc muốn xóa lịch trình này?"
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                style={{ border: "none" }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {contextHolder}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <CalendarOutlined /> Quản lý lịch trình
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Tiêu đề trang */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Title level={3} style={{ fontWeight: 700, margin: 0 }}>
          Quản lý lịch trình
        </Title>
      </Flex>

      {/* Khu vực bộ lọc và nút chức năng */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Input
            placeholder="Tìm tuyến, xe..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260 }}
          />

          <Flex gap={8}>
            {/* Sinh chuyến tự động từ lịch trình */}
            <Button
              icon={<ThunderboltOutlined />}
              onClick={handleGenerateTrips}
              style={{
                borderRadius: 8,
                padding: "0 20px",
                fontWeight: 500,
                height: 40,
              }}
            >
              Sinh chuyến
            </Button>

            {/* Thêm lịch trình mới */}
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                setIsEdit(false);
                form.resetFields();
                setIsModalOpen(true);
              }}
              style={{
                borderRadius: 8,
                padding: "0 20px",
                background: "#4d940e",
                borderColor: "#4d940e",
                color: "#fff",
                fontWeight: 500,
                height: 40,
              }}
            >
              Thêm lịch
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Bảng hiển thị danh sách lịch trình */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Modal thêm và sửa lịch trình */}
      <ScheduleModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        form={form}
        routes={routes}
        vehicles={vehicles}
        vehicleStatuses={vehicleStatuses}
        prices={prices}
        editingSchedule={editingSchedule}
      />
    </div>
  );
}
