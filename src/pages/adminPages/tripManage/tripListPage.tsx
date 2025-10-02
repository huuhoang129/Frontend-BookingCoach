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
  Form,
  message,
  Select,
  DatePicker,
  TimePicker,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  CarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

interface Province {
  id: number;
  nameProvince: string;
}

interface Location {
  id: number;
  nameLocations: string;
  province?: Province;
}

interface Route {
  id: number;
  fromLocation: Location;
  toLocation: Location;
}

interface Vehicle {
  id: number;
  name: string;
  type: string;
  licensePlate: string;
}

interface TripPrice {
  id: number;
  seatType: string;
  priceTrip: number;
  typeTrip: string;
  coachRouteId: number;
}

interface Trip {
  id: number;
  route: Route;
  vehicle: Vehicle;
  price: TripPrice;
  startDate: string;
  startTime: string;
  totalTime?: string;
  status: "OPEN" | "FULL" | "CANCELLED";
}

export default function TripPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterVehicle, setFilterVehicle] = useState<number | null>(null);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [form] = Form.useForm();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [prices, setPrices] = useState<TripPrice[]>([]);

  // fetch data
  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/trips");
      if (res.data.errCode === 0) setTrips(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/routes");
    if (res.data.errCode === 0) setRoutes(res.data.data);
  };

  const fetchVehicles = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/vehicles");
    if (res.data.errCode === 0) setVehicles(res.data.data);
  };

  const fetchPrices = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/trip-prices");
    if (res.data.errCode === 0) setPrices(res.data.data);
  };

  useEffect(() => {
    fetchTrips();
    fetchRoutes();
    fetchVehicles();
    fetchPrices();
  }, []);

  // submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        coachRouteId: values.coachRouteId,
        vehicleId: values.vehicleId,
        tripPriceId: values.tripPriceId,
        startDate: values.startDate.format("YYYY-MM-DD"),
        startTime: values.startTime.format("HH:mm:ss"),
        totalTime: values.totalTime
          ? values.totalTime.format("HH:mm:ss")
          : null,
        status: values.status,
      };

      if (isEdit && editingTrip) {
        const res = await axios.put(
          `http://localhost:8080/api/v1/trips/${editingTrip.id}`,
          { id: editingTrip.id, ...payload }
        );
        if (res.data.errCode === 0) {
          message.success("Cập nhật chuyến thành công");
          fetchTrips();
          setIsModalOpen(false);
        } else message.error(res.data.errMessage);
      } else {
        const res = await axios.post(
          "http://localhost:8080/api/v1/trips",
          payload
        );
        if (res.data.errCode === 0) {
          message.success("Thêm chuyến thành công");
          fetchTrips();
          setIsModalOpen(false);
        } else message.error(res.data.errMessage);
      }
    } catch {}
  };

  const handleDelete = async (id: number) => {
    const res = await axios.delete(`http://localhost:8080/api/v1/trips/${id}`);
    if (res.data.errCode === 0) {
      message.success("Xóa chuyến thành công");
      fetchTrips();
    } else message.error(res.data.errMessage);
  };

  // cập nhật trạng thái inline
  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/v1/trips/${id}`, {
        id,
        status,
      });
      if (res.data.errCode === 0) {
        message.success("Cập nhật trạng thái thành công");
        fetchTrips();
      } else message.error(res.data.errMessage);
    } catch {
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  // filter data
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
    ) {
      match = false;
    }
    if (filterStatus && t.status !== filterStatus) match = false;
    if (filterVehicle && t.vehicle?.id !== filterVehicle) match = false;
    return match;
  });

  // watch modal
  const selectedRoute = Form.useWatch("coachRouteId", form);
  const selectedVehicleId = Form.useWatch("vehicleId", form);
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  // columns
  const columns: ColumnsType<Trip> = [
    {
      title: "Tuyến",
      key: "route",
      render: (_, r) =>
        r.route ? (
          <div style={{ whiteSpace: "pre-line" }}>
            {r.route.fromLocation?.nameLocations} ➡️{" "}
            {r.route.toLocation?.nameLocations}
          </div>
        ) : (
          "—"
        ),
    },
    {
      title: "Xe",
      key: "vehicle",
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
      key: "price",
      render: (_, r) =>
        r.price ? `${r.price.priceTrip.toLocaleString()} đ` : "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s, r) => (
        <Select
          value={s}
          style={{ width: 120 }}
          onChange={(val) => handleStatusChange(r.id, val)}
        >
          <Option value="OPEN">Còn vé</Option>
          <Option value="FULL">Hết vé</Option>
          <Option value="CANCELLED">Đã hủy</Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setIsEdit(true);
                setEditingTrip(r);
                form.setFieldsValue({
                  coachRouteId: r.route?.id,
                  vehicleId: r.vehicle?.id,
                  tripPriceId: r.price?.id,
                  startDate: dayjs(r.startDate),
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
          <CarOutlined />
          <span>Trips</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3} style={{ marginBottom: 20, fontWeight: 700 }}>
        Quản lý chuyến
      </Title>

      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" gap={16} wrap="wrap">
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
              style={{ width: 200 }}
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
              style={{ width: 160 }}
              value={filterStatus || undefined}
              onChange={(val) => setFilterStatus(val || null)}
            >
              <Option value="OPEN">Còn vé</Option>
              <Option value="FULL">Hết vé</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Flex>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setIsEdit(false);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Thêm chuyến
          </Button>
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

      {/* Modal Add/Edit */}
      <Modal
        title={isEdit ? "Sửa chuyến" : "Thêm chuyến"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText={isEdit ? "Cập nhật" : "Lưu"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="coachRouteId"
            label="Tuyến"
            rules={[{ required: true }]}
          >
            <Select>
              {routes.map((r) => (
                <Option key={r.id} value={r.id}>
                  {r.fromLocation?.nameLocations} ➡️{" "}
                  {r.toLocation?.nameLocations}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="vehicleId" label="Xe" rules={[{ required: true }]}>
            <Select>
              {vehicles.map((v) => (
                <Option key={v.id} value={v.id}>
                  {v.licensePlate} - {v.type}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="tripPriceId"
            label="Giá vé"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn giá vé">
              {prices
                .filter((p) => {
                  if (!selectedRoute || !selectedVehicle) return false;
                  return (
                    p.coachRouteId === selectedRoute &&
                    p.seatType?.toLowerCase() ===
                      selectedVehicle.type?.toLowerCase()
                  );
                })
                .map((p) => (
                  <Option key={p.id} value={p.id}>
                    {p.priceTrip.toLocaleString()} đ ({p.typeTrip})
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Ngày đi"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Giờ đi"
            rules={[{ required: true }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
          <Form.Item name="totalTime" label="Thời gian">
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="OPEN">Còn vé</Option>
              <Option value="FULL">Hết vé</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
