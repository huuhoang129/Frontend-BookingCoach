import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Card,
  Flex,
  Typography,
  Tag,
  Tooltip,
  Breadcrumb,
  Modal,
  Form,
  message,
  Popconfirm,
  Select,
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
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

/* ============================================================
   🧩 INTERFACES
   ============================================================ */
interface DriverSchedule {
  id: number;
  userId: number;
  coachTripId: number;
  note?: string;
  driver?: {
    id: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    fullName?: string;
  };
  trip?: {
    id: number;
    startDate: string;
    startTime: string;
    route?: {
      nameRoute: string;
      fromLocation?: { id: number; nameLocations: string };
      toLocation?: { id: number; nameLocations: string };
    };
    vehicle?: { name: string; licensePlate: string };
  };
}

interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  fullName?: string;
}

interface CoachTrip {
  id: number;
  startDate: string;
  startTime: string;
  route?: {
    nameRoute: string;
    fromLocation?: { id: number; nameLocations: string };
    toLocation?: { id: number; nameLocations: string };
  };
  vehicle?: { name: string; licensePlate: string };
}

/* ============================================================
   🧩 COMPONENT
   ============================================================ */
export default function DriverSchedulePage() {
  const [schedules, setSchedules] = useState<DriverSchedule[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<CoachTrip[]>([]);

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<DriverSchedule | null>(
    null
  );

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  /* ============================================================
     🔹 FETCH DATA
     ============================================================ */
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8080/api/v1/driver-schedules"
      );
      if (res.data.errCode === 0) {
        setSchedules(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch driver schedules error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/drivers/all");
      if (res.data.errCode === 0) {
        setDrivers(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch drivers error:", err);
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/trips");
      if (res.data.errCode === 0) {
        setTrips(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch trips error:", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchDrivers();
    fetchTrips();
  }, []);

  /* ============================================================
     🔹 HANDLE ADD
     ============================================================ */
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const res = await axios.post(
        "http://localhost:8080/api/v1/driver-schedules",
        values
      );
      if (res.data.errCode === 0) {
        message.success("Thêm lịch làm việc thành công!");
        setIsAddOpen(false);
        form.resetFields();
        fetchSchedules();
      } else {
        message.error(res.data.errMessage || "Lỗi khi thêm lịch làm việc");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ============================================================
     🔹 HANDLE EDIT
     ============================================================ */
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingSchedule) return;
      const res = await axios.put(
        "http://localhost:8080/api/v1/driver-schedules",
        {
          id: editingSchedule.id,
          ...values,
        }
      );
      if (res.data.errCode === 0) {
        message.success("Cập nhật lịch làm việc thành công!");
        setIsEditOpen(false);
        setEditingSchedule(null);
        fetchSchedules();
      } else {
        message.error(res.data.errMessage || "Lỗi khi cập nhật");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ============================================================
     🔹 HANDLE DELETE
     ============================================================ */
  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/driver-schedules/${id}`
      );
      if (res.data.errCode === 0) {
        message.success("Xoá lịch làm việc thành công!");
        fetchSchedules();
      } else {
        message.error(res.data.errMessage || "Lỗi khi xoá lịch");
      }
    } catch (err) {
      console.error("Delete error:", err);
      message.error("Không thể xoá. Kiểm tra kết nối hoặc dữ liệu liên quan.");
    }
  };

  /* ============================================================
     🔹 FILTER SEARCH
     ============================================================ */
  const filteredData = schedules.filter((s) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    const driverName =
      s.driver?.fullName ||
      `${s.driver?.firstName || ""} ${s.driver?.lastName || ""}`;
    return (
      driverName.toLowerCase().includes(searchLower) ||
      s.trip?.route?.nameRoute?.toLowerCase().includes(searchLower) ||
      s.trip?.vehicle?.licensePlate?.toLowerCase().includes(searchLower)
    );
  });

  /* ============================================================
     🔹 TABLE COLUMNS
     ============================================================ */
  const columns: ColumnsType<DriverSchedule> = [
    {
      title: "Tài xế",
      key: "driver",
      render: (_, record) => {
        const name =
          record.driver?.fullName ||
          `${record.driver?.firstName || ""} ${record.driver?.lastName || ""}`;
        return (
          <Flex align="center" gap={8}>
            <UserOutlined style={{ color: "#4d940e" }} />
            <span>{name.trim() || "—"}</span>
          </Flex>
        );
      },
    },
    {
      title: "Tuyến xe",
      key: "route",
      render: (_, record) =>
        record.trip?.route ? (
          <span>
            {record.trip.route.fromLocation?.nameLocations || "?"} →{" "}
            {record.trip.route.toLocation?.nameLocations || "?"}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Xe",
      key: "vehicle",
      render: (_, record) =>
        record.trip?.vehicle ? (
          <span>
            {record.trip.vehicle.name}{" "}
            <Tag color="blue">{record.trip.vehicle.licensePlate}</Tag>
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Ngày khởi hành",
      key: "startDate",
      render: (_, record) => (
        <span>
          {record.trip?.startDate || "—"} {record.trip?.startTime || ""}
        </span>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note) => note || "—",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: "none", color: "#4d940e" }}
              onClick={() => {
                setEditingSchedule(record);
                editForm.setFieldsValue({
                  userId: record.userId,
                  coachTripId: record.coachTripId,
                  note: record.note,
                });
                setIsEditOpen(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xoá"
            description="Bạn có chắc muốn xoá lịch này không?"
            okText="Xoá"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Xoá">
              <Button shape="circle" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ============================================================
     🔹 RENDER
     ============================================================ */
  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined />
          <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <CalendarOutlined />
          <span>Driver Schedule</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3} style={{ marginBottom: 20, fontWeight: 700 }}>
        Quản lý lịch làm việc tài xế
      </Title>

      <Card style={{ marginBottom: 20, borderRadius: 12 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Input
            placeholder="🔍 Tìm theo tài xế, tuyến, biển số..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, borderRadius: 8 }}
          />
          <Button
            icon={<PlusOutlined />}
            style={{
              borderRadius: 8,
              padding: "0 20px",
              background: "#4d940e",
              borderColor: "#4d940e",
              color: "#fff",
              fontWeight: 500,
            }}
            onClick={() => setIsAddOpen(true)}
          >
            Thêm lịch làm việc
          </Button>
        </Flex>
      </Card>

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

      {/* ---------------------- Modal Add ---------------------- */}
      <Modal
        title="Thêm lịch làm việc"
        open={isAddOpen}
        onCancel={() => setIsAddOpen(false)}
        onOk={handleAdd}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="userId"
            label="Tài xế"
            rules={[{ required: true, message: "Chọn tài xế" }]}
          >
            <Select placeholder="Chọn tài xế">
              {drivers.map((d) => (
                <Option key={d.id} value={d.id}>
                  {`${d.firstName} ${d.lastName}`}{" "}
                  {d.phoneNumber && `(${d.phoneNumber})`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="coachTripId"
            label="Chuyến xe"
            rules={[{ required: true, message: "Chọn chuyến xe" }]}
          >
            <Select placeholder="Chọn chuyến xe">
              {trips.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.route
                    ? `${t.route.fromLocation?.nameLocations || "?"} → ${
                        t.route.toLocation?.nameLocations || "?"
                      }`
                    : `Chuyến ${t.id}`}{" "}
                  - {t.startDate} {t.startTime}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ---------------------- Modal Edit ---------------------- */}
      <Modal
        title="Chỉnh sửa lịch làm việc"
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onOk={handleEdit}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="userId"
            label="Tài xế"
            rules={[{ required: true, message: "Chọn tài xế" }]}
          >
            <Select placeholder="Chọn tài xế">
              {drivers.map((d) => (
                <Option key={d.id} value={d.id}>
                  {`${d.firstName} ${d.lastName}`}{" "}
                  {d.phoneNumber && `(${d.phoneNumber})`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="coachTripId"
            label="Chuyến xe"
            rules={[{ required: true, message: "Chọn chuyến xe" }]}
          >
            <Select placeholder="Chọn chuyến xe">
              {trips.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.route
                    ? `${t.route.fromLocation?.nameLocations || "?"} → ${
                        t.route.toLocation?.nameLocations || "?"
                      }`
                    : `Chuyến ${t.id}`}{" "}
                  - {t.startDate} {t.startTime}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
