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
  TimePicker,
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
  vehicleType: string;
}

interface Schedule {
  id: number;
  route: Route;
  vehicle: Vehicle;
  price: TripPrice;
  startTime: string;
  totalTime?: string; // TIME (hh:mm:ss)
  status: "ACTIVE" | "INACTIVE";
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [form] = Form.useForm();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [prices, setPrices] = useState<TripPrice[]>([]);

  // fetch
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/schedules");
      if (res.data.errCode === 0) setSchedules(res.data.data);
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
    fetchSchedules();
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
        startTime: values.startTime.format("HH:mm:ss"),
        totalTime: values.totalTime.format("HH:mm:ss"),
        status: values.status,
      };

      console.log("👉 Submit payload:", payload);

      if (isEdit && editingSchedule) {
        const res = await axios.put(
          `http://localhost:8080/api/v1/schedules/${editingSchedule.id}`,
          payload
        );
        if (res.data.errCode === 0) {
          message.success("Cập nhật lịch trình thành công");
          fetchSchedules();
          setIsModalOpen(false);
        } else {
          message.error(res.data.errMessage);
        }
      } else {
        const res = await axios.post(
          "http://localhost:8080/api/v1/schedules",
          payload
        );
        if (res.data.errCode === 0) {
          message.success("Thêm lịch trình thành công");
          fetchSchedules();
          setIsModalOpen(false);
        } else message.error(res.data.errMessage);
      }
    } catch {}
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/schedules/${id}`
      );
      if (res.data.errCode === 0) {
        message.success("Xóa lịch trình thành công");
        fetchSchedules();
      } else {
        message.error(res.data.errMessage);
      }
    } catch (e) {
      message.error("Lỗi khi xóa lịch trình");
    }
  };

  const handleGenerateTrips = async () => {
    const res = await axios.post(
      "http://localhost:8080/api/v1/schedules/generate-trips"
    );
    if (res.data.errCode === 0) {
      message.success("Sinh chuyến từ lịch trình thành công");
    } else {
      message.error(res.data.errMessage);
    }
  };

  // filter
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

  // watch modal fields
  const selectedRoute = Form.useWatch("coachRouteId", form);
  const selectedVehicleId = Form.useWatch("vehicleId", form);
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  // log debug
  console.log("👉 selectedRoute =", selectedRoute);
  console.log("👉 selectedVehicle =", selectedVehicle);
  console.log("👉 all prices =", prices);

  // columns
  const columns: ColumnsType<Schedule> = [
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
      title: "Giá vé",
      key: "price",
      render: (_, r) =>
        r.price ? `${r.price.priceTrip.toLocaleString()} đ` : "—",
    },
    {
      title: "Giờ khởi hành",
      dataIndex: "startTime",
      render: (t) => (t ? dayjs(t, "HH:mm:ss").format("HH:mm") : "—"),
    },
    {
      title: "Thời gian hành trình",
      dataIndex: "totalTime",
      render: (t) => (t ? dayjs(t, "HH:mm:ss").format("HH:mm") : "—"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === "ACTIVE" ? "green" : "red"}>
          {s === "ACTIVE" ? "Hoạt động" : "Ngừng"}
        </Tag>
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
          <CalendarOutlined />
          <span>Schedules</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3} style={{ marginBottom: 20, fontWeight: 700 }}>
        Quản lý lịch trình
      </Title>

      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" gap={16} wrap="wrap">
          <Input
            placeholder="🔍 Tìm tuyến, xe..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260 }}
          />

          <Flex gap={10}>
            <Button
              icon={<ThunderboltOutlined />}
              onClick={handleGenerateTrips}
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
            >
              Thêm lịch trình
            </Button>
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
        />
      </Card>

      {/* Modal Add/Edit */}
      <Modal
        title={isEdit ? "Sửa lịch trình" : "Thêm lịch trình"}
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
                  const match =
                    selectedRoute &&
                    selectedVehicle &&
                    p.coachRouteId === selectedRoute &&
                    p.seatType?.toLowerCase() ===
                      selectedVehicle.type?.toLowerCase(); // 🔥 dùng seatType
                  console.log(
                    `👉 Check priceId=${p.id}, coachRouteId=${p.coachRouteId}, seatType=${p.seatType}, vehicle.type=${selectedVehicle?.type}, match=${match}`
                  );
                  return match;
                })
                .map((p) => (
                  <Option key={p.id} value={p.id}>
                    {p.priceTrip.toLocaleString()} đ ({p.typeTrip})
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Giờ khởi hành"
            rules={[{ required: true }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="totalTime"
            label="Thời gian hành trình"
            rules={[{ required: true, message: "Chọn thời gian hành trình" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="ACTIVE">
            <Select>
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="INACTIVE">Ngừng</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
