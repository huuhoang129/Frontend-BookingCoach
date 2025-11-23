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
  Tag,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useDriverSchedules } from "../../../hooks/vehicleHooks/useDriverSchedules";
import DriverScheduleModal from "../../../containers/ModalsCollect/VehicleModal/DriverScheduleModal";

const { Title } = Typography;

export default function DriverSchedulePage() {
  const {
    schedules,
    drivers,
    trips,
    loading,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    editingSchedule,
    setEditingSchedule,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    contextHolder,
  } = useDriverSchedules();

  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Filter
  const filteredData = schedules.filter((s) => {
    if (!searchText) return true;
    const lower = searchText.toLowerCase();
    const driverName =
      s.driver?.fullName ||
      `${s.driver?.firstName || ""} ${s.driver?.lastName || ""}`;
    return (
      driverName.toLowerCase().includes(lower) ||
      s.trip?.route?.nameRoute?.toLowerCase().includes(lower) ||
      s.trip?.vehicle?.licensePlate?.toLowerCase().includes(lower)
    );
  });

  const columns: ColumnsType<any> = [
    {
      title: "Tài xế",
      key: "driver",
      render: (_, r) => (
        <Flex align="center" gap={8}>
          <UserOutlined style={{ color: "#4d940e" }} />
          <span>
            {r.driver?.fullName ||
              `${r.driver?.firstName || ""} ${r.driver?.lastName || ""}` ||
              "—"}
          </span>
        </Flex>
      ),
    },
    {
      title: "Tuyến xe",
      key: "route",
      render: (_, r) =>
        r.trip?.route ? (
          <span>
            {r.trip.route.fromLocation?.nameLocations || "?"} →{" "}
            {r.trip.route.toLocation?.nameLocations || "?"}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Xe",
      key: "vehicle",
      render: (_, r) =>
        r.trip?.vehicle ? (
          <span>
            {r.trip.vehicle.name}{" "}
            <Tag color="blue">{r.trip.vehicle.licensePlate}</Tag>
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Ngày khởi hành",
      key: "startDate",
      render: (_, r) => (
        <span>
          {r.trip?.startDate || "—"} {r.trip?.startTime || ""}
        </span>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (n) => n || "—",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, r) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: "none", color: "#4d940e" }}
              onClick={() => {
                setEditingSchedule(r);
                editForm.setFieldsValue({
                  userId: r.userId,
                  coachTripId: r.coachTripId,
                  note: r.note,
                });
                setIsEditModal(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xoá"
            description="Bạn có chắc muốn xoá lịch này không?"
            okText="Xoá"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(r.id)}
          >
            <Tooltip title="Xoá">
              <Button shape="circle" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Checkbox chọn nhiều
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {contextHolder}

      {/* breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <CalendarOutlined /> Quản lý lịch làm việc tài xế
        </Breadcrumb.Item>
      </Breadcrumb>

      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Title level={3} style={{ fontWeight: 700, margin: 0 }}>
          Quản lý lịch làm việc tài xế
        </Title>
      </Flex>

      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Input
            placeholder="🔍 Tìm theo tài xế, tuyến, biển số..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />

          <Flex gap={12} align="center">
            {selectedRowKeys.length > 0 ? (
              <Popconfirm
                title="Xác nhận xoá"
                description="Bạn có chắc muốn xoá các lịch đã chọn không?"
                okText="Xoá"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                onConfirm={() => {
                  handleBulkDelete(selectedRowKeys as number[]);
                  setSelectedRowKeys([]);
                }}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  style={{
                    height: 40,
                    borderRadius: 8,
                    padding: "0 20px",
                    fontWeight: 500,
                  }}
                >
                  Xoá đã chọn
                </Button>
              </Popconfirm>
            ) : (
              <Button
                icon={<PlusOutlined />}
                style={{
                  borderRadius: 8,
                  padding: "0 20px",
                  background: "#4d940e",
                  borderColor: "#4d940e",
                  color: "#fff",
                  fontWeight: 500,
                  height: 40,
                }}
                type="primary"
                onClick={() => setIsAddModal(true)}
              >
                Thêm lịch làm việc
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>

      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 8 }}
          rowSelection={rowSelection}
        />
      </Card>

      <DriverScheduleModal
        openAdd={isAddModal}
        setOpenAdd={setIsAddModal}
        openEdit={isEditModal}
        setOpenEdit={setIsEditModal}
        formAdd={form}
        formEdit={editForm}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        editingSchedule={editingSchedule}
        drivers={drivers}
        trips={trips}
        schedules={schedules}
      />
    </div>
  );
}
