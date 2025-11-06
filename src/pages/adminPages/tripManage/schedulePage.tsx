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
    prices,
    loading,
    isModalOpen,
    setIsModalOpen,
    isEdit,
    setIsEdit,
    setEditingSchedule,
    form,
    handleSubmit,
    handleDelete,
    handleGenerateTrips,
    contextHolder,
  } = useSchedules();

  const [searchText, setSearchText] = useState("");

  // ====== Lọc dữ liệu ======
  const filteredData = schedules.filter((s) => {
    if (!searchText) return true;
    return (
      s.route?.fromLocation?.nameLocations
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      s.route?.toLocation?.nameLocations
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      s.vehicle?.licensePlate.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // ====== Cấu hình bảng ======
  const columns: ColumnsType<any> = [
    {
      title: "Tuyến",
      render: (_, r) =>
        r.route
          ? `${r.route.fromLocation?.nameLocations} → ${r.route.toLocation?.nameLocations}`
          : "—",
    },
    {
      title: "Xe",
      render: (_, r) =>
        r.vehicle ? `${r.vehicle.licensePlate} (${r.vehicle.type})` : "—",
    },
    {
      title: "Giá vé",
      render: (_, r) =>
        r.price ? `${r.price.priceTrip.toLocaleString()} đ` : "—",
    },
    {
      title: "Giờ khởi hành",
      render: (_, r) =>
        r.startTime ? dayjs(r.startTime, "HH:mm:ss").format("HH:mm") : "—",
    },
    {
      title: "Thời gian hành trình",
      render: (_, r) =>
        r.totalTime ? dayjs(r.totalTime, "HH:mm:ss").format("HH:mm") : "—",
    },
    {
      title: "Trạng thái",
      render: (_, r) => (
        <Tag color={r.status === "ACTIVE" ? "green" : "red"}>
          {r.status === "ACTIVE" ? "Hoạt động" : "Ngừng"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_, r) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ color: "#4d940e", border: "none" }}
              onClick={() => {
                setIsEdit(true);
                setEditingSchedule(r);
                form.setFieldsValue({
                  coachRouteId: r.route?.id,
                  vehicleId: r.vehicle?.id,
                  tripPriceId: r.price?.id,
                  startTime: dayjs(r.startTime, "HH:mm:ss"),
                  totalTime: r.totalTime
                    ? dayjs(r.totalTime, "HH:mm:ss")
                    : null,
                  status: r.status,
                });
                setIsModalOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(r.id)}
              style={{ border: "none" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // ====== JSX ======
  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {contextHolder}

      {/* breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <CalendarOutlined /> Quản lý lịch trình
        </Breadcrumb.Item>
      </Breadcrumb>

      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Title level={3} style={{ fontWeight: 700, margin: 0 }}>
          Quản lý lịch trình
        </Title>
      </Flex>

      {/* bộ lọc */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Input
            placeholder="🔍 Tìm tuyến, xe..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260 }}
          />

          <Flex gap={8}>
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

      {/* bảng */}
      <Card
        style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* modal thêm/sửa */}
      <ScheduleModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        form={form}
        routes={routes}
        vehicles={vehicles}
        prices={prices}
      />
    </div>
  );
}
