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
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { useDriverSchedules } from "../../../hooks/vehicleHooks/useDriverSchedules";
import DriverScheduleModal from "../../../containers/ModalsCollect/VehicleModal/DriverScheduleModal";

const { Title } = Typography;

export default function DriverSchedulePage() {
  const {
    schedules,
    drivers,
    trips,
    loading,
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    setEditingSchedule,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useDriverSchedules();

  const [searchText, setSearchText] = useState("");

  const filtered = schedules.filter((s) => {
    const text = searchText.toLowerCase();
    const driverName =
      s.driver?.fullName ||
      `${s.driver?.firstName || ""} ${s.driver?.lastName || ""}`;
    return (
      driverName.toLowerCase().includes(text) ||
      s.trip?.route?.fromLocation?.nameLocations
        ?.toLowerCase()
        .includes(text) ||
      s.trip?.vehicle?.licensePlate?.toLowerCase().includes(text)
    );
  });

  const columns: ColumnsType<any> = [
    {
      title: "Tài xế",
      render: (_, r) =>
        r.driver ? (
          <span>
            {r.driver.fullName || `${r.driver.firstName} ${r.driver.lastName}`}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Tuyến xe",
      render: (_, r) =>
        r.trip?.route ? (
          <span>
            {r.trip.route.fromLocation?.nameLocations} →{" "}
            {r.trip.route.toLocation?.nameLocations}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Xe",
      render: (_, r) =>
        r.trip?.vehicle
          ? `${r.trip.vehicle.name} (${r.trip.vehicle.licensePlate})`
          : "—",
    },
    {
      title: "Ngày khởi hành",
      render: (_, r) =>
        r.trip ? `${r.trip.startDate} ${r.trip.startTime}` : "—",
    },
    { title: "Ghi chú", dataIndex: "note" },
    {
      title: "Hành động",
      render: (_, r) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: "none", color: "#4d940e" }}
              onClick={() => {
                setEditingSchedule(r);
                editForm.setFieldsValue(r);
                setIsEditOpen(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xoá?"
            onConfirm={() => handleDelete(r.id)}
          >
            <Tooltip title="Xoá">
              <Button
                shape="circle"
                icon={<DeleteOutlined />}
                danger
                style={{ border: "none" }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <CalendarOutlined /> Lịch tài xế
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3}>Quản lý lịch làm việc tài xế</Title>

      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center">
          <Input
            placeholder="🔍 Tìm tài xế, tuyến, xe..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setIsAddOpen(true)}
            style={{ background: "#4d940e", borderColor: "#4d940e" }}
          >
            Thêm lịch
          </Button>
        </Flex>
      </Card>

      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filtered}
          columns={columns}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Modal thêm */}
      <DriverScheduleModal
        open={isAddOpen}
        onCancel={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        form={form}
        drivers={drivers}
        trips={trips}
        title="Thêm lịch làm việc"
      />

      {/* Modal sửa */}
      <DriverScheduleModal
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onSubmit={handleEdit}
        form={editForm}
        drivers={drivers}
        trips={trips}
        title="Sửa lịch làm việc"
      />
    </div>
  );
}
