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
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  CarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useState } from "react";
import { useTrips } from "../../../hooks/routerListHooks/useTripList";
import TripModal from "../../../containers/ModalsCollect/RouteListModal/TripListModal";

dayjs.extend(isBetween);
const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function TripPage() {
  const {
    trips,
    routes,
    vehicles,
    vehicleStatuses,
    prices,
    loading,
    isModalOpen,
    setIsModalOpen,
    isEdit,
    setIsEdit,
    setEditingTrip,
    form,
    handleSubmit,
    handleDelete,
    handleBulkDelete,
    contextHolder,
  } = useTrips();

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterVehicle, setFilterVehicle] = useState<number | null>(null);
  const [filterDateRange, setFilterDateRange] = useState<
    [dayjs.Dayjs, dayjs.Dayjs] | null
  >(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 🔍 Lọc dữ liệu
  const filteredData = trips.filter((t) => {
    let match = true;
    if (
      searchText &&
      !(
        t.route?.fromLocation?.nameLocations
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        t.route?.toLocation?.nameLocations
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        t.vehicle?.name.toLowerCase().includes(searchText.toLowerCase())
      )
    )
      match = false;
    if (filterVehicle && t.vehicle?.id !== filterVehicle) match = false;
    if (filterStatus && t.status !== filterStatus) match = false;
    if (filterDateRange && filterDateRange.length === 2) {
      const start = dayjs(t.startDate);
      const from = filterDateRange[0].startOf("day");
      const to = filterDateRange[1].endOf("day");
      if (!start.isBetween(from, to, "day", "[]")) match = false;
    }
    return match;
  });

  // 🧱 Cột bảng
  const columns: ColumnsType<any> = [
    {
      title: "Tuyến",
      render: (_, r) =>
        r.route ? (
          <span style={{ fontWeight: 600 }}>
            {r.route.fromLocation?.nameLocations} →{" "}
            {r.route.toLocation?.nameLocations}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Xe",
      render: (_, r) =>
        r.vehicle ? `${r.vehicle.licensePlate} (${r.vehicle.type})` : "—",
    },
    {
      title: "Ngày đi",
      dataIndex: "startDate",
      render: (d) => dayjs(d).format("DD/MM/YYYY"),
    },
    { title: "Giờ đi", dataIndex: "startTime" },
    { title: "Thời gian", dataIndex: "totalTime" },
    {
      title: "Giá vé",
      render: (_, r) =>
        r.price ? (
          <span style={{ fontWeight: 600, color: "#4d940e" }}>
            {r.price.priceTrip.toLocaleString()} đ
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: "none", color: "#4d940e" }}
              onClick={() => {
                setEditingTrip(record);
                form.setFieldsValue({
                  coachRouteId: record.route?.id,
                  vehicleId: record.vehicle?.id,
                  tripPriceId: record.price?.id,
                  startDate: dayjs(record.startDate),
                  startTime: dayjs(record.startTime, "HH:mm:ss"),
                  totalTime: record.totalTime
                    ? dayjs(record.totalTime, "HH:mm:ss")
                    : null,
                  status: record.status,
                });
                setIsEdit(true);
                setIsModalOpen(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc muốn xoá chuyến từ "${record.route?.fromLocation?.nameLocations}" không?`}
            okText="Xoá"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
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

  // checkbox
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  // =================== RENDER ===================
  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {contextHolder}

      {/* breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <CarOutlined /> Quản lý chuyến xe
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* title */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Title level={3} style={{ fontWeight: 700, margin: 0 }}>
          Quản lý chuyến xe
        </Title>
      </Flex>

      {/* filter + actions */}
      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          {/* Bộ lọc bên trái */}
          <Flex gap={16} wrap="wrap">
            <Input
              placeholder="🔍 Tìm tuyến, xe..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
            />
            <Select
              allowClear
              placeholder="Chọn xe"
              style={{ width: 160 }}
              value={filterVehicle || undefined}
              onChange={(val) => setFilterVehicle(val || null)}
            >
              {vehicles.map((v) => (
                <Option key={v.id} value={v.id}>
                  {v.licensePlate} - {v.type}
                </Option>
              ))}
            </Select>
            <Select
              allowClear
              placeholder="Trạng thái"
              style={{ width: 140 }}
              value={filterStatus || undefined}
              onChange={(val) => setFilterStatus(val || null)}
            >
              <Option value="OPEN">Còn vé</Option>
              <Option value="FULL">Hết vé</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
            <RangePicker
              allowClear
              placeholder={["Từ ngày", "Đến ngày"]}
              format="DD/MM/YYYY"
              value={filterDateRange as any}
              onChange={(dates) => setFilterDateRange(dates as any)}
            />
          </Flex>

          {/* Nút hành động bên phải */}
          <Flex gap={12} align="center">
            {selectedRowKeys.length > 0 ? (
              <Popconfirm
                title="Xác nhận xoá"
                description="Bạn có chắc muốn xoá các chuyến đã chọn không?"
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
                onClick={() => {
                  setIsEdit(false);
                  form.resetFields();
                  setIsModalOpen(true);
                }}
              >
                Thêm chuyến
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>

      {/* Bảng */}
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

      {/* Modal thêm/sửa */}
      <TripModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        form={form}
        routes={routes}
        vehicles={vehicles}
        vehicleStatuses={vehicleStatuses}
        prices={prices}
      />
    </div>
  );
}
