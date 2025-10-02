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
  Select,
  Tooltip,
  Breadcrumb,
  Modal,
  Form,
  message,
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
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

interface Vehicle {
  id: number;
  name: string;
  licensePlate: string;
  type: string;
  numberFloors: number;
  seatCount: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
  description?: string;
}

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  // search & filter state
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterFloor, setFilterFloor] = useState<string | null>(null);
  const [filterSeatStatus, setFilterSeatStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  // modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/v1/vehicles");
      if (res.data.errCode === 0) {
        setVehicles(res.data.data || []);
      }
    } catch (error) {
      console.error("Fetch vehicles error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // handle add
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const res = await axios.post(
        "http://localhost:8080/api/v1/vehicles",
        values
      );
      if (res.data.errCode === 0) {
        message.success("Thêm xe thành công!");
        setIsAddOpen(false);
        form.resetFields();
        fetchVehicles();
      } else {
        message.error(res.data.errMessage || "Lỗi khi thêm xe");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // handle edit
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingVehicle) return;
      const res = await axios.put(
        `http://localhost:8080/api/v1/vehicles/${editingVehicle.id}`,
        values
      );
      if (res.data.errCode === 0) {
        message.success("Cập nhật xe thành công!");
        setIsEditOpen(false);
        setEditingVehicle(null);
        fetchVehicles();
      } else {
        message.error(res.data.errMessage || "Lỗi khi cập nhật xe");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter + Sort logic
  const filteredData = vehicles
    .filter((v) => {
      let match = true;

      if (
        searchText &&
        !(
          v.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (v.licensePlate || "")
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
      ) {
        match = false;
      }

      if (filterType && v.type !== filterType) match = false;
      if (filterFloor && v.numberFloors.toString() !== filterFloor)
        match = false;

      if (filterSeatStatus === "many" && v.availableSeats / v.totalSeats <= 0.7)
        match = false;
      if (
        filterSeatStatus === "medium" &&
        (v.availableSeats / v.totalSeats > 0.7 ||
          v.availableSeats / v.totalSeats < 0.2)
      )
        match = false;
      if (filterSeatStatus === "few" && v.availableSeats / v.totalSeats >= 0.2)
        match = false;

      return match;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "seats") return a.seatCount - b.seatCount;
      if (sortBy === "available") return b.availableSeats - a.availableSeats;
      return 0;
    });

  const typeColors: Record<string, string> = {
    Normal: "blue",
    Sleeper: "orange",
    DoubleSleeper: "purple",
    Limousine: "green",
  };

  const typeIcons: Record<string, string> = {
    Normal: "🚍",
    Sleeper: "🚌",
    DoubleSleeper: "🛏️",
    Limousine: "🚐",
  };

  const columns: ColumnsType<Vehicle> = [
    {
      title: "Tên xe",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <span style={{ fontWeight: 600 }}>
          {typeIcons[record.type] || "🚗"} {record.name}
        </span>
      ),
    },
    { title: "Biển số", dataIndex: "licensePlate", key: "licensePlate" },
    {
      title: "Loại xe",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color={typeColors[type]}>{type}</Tag>,
    },
    {
      title: "Tầng",
      dataIndex: "numberFloors",
      key: "numberFloors",
      width: 90,
    },
    { title: "Ghế", dataIndex: "seatCount", key: "seatCount", width: 90 },
    {
      title: "Trống",
      dataIndex: "availableSeats",
      key: "availableSeats",
      render: (value) => <Tag color="green">🟢 {value}</Tag>,
      width: 110,
    },
    {
      title: "Đã đặt",
      dataIndex: "bookedSeats",
      key: "bookedSeats",
      render: (value) => <Tag color="red">🔴 {value}</Tag>,
      width: 110,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: "none", color: "#4d940e" }}
              onClick={() => {
                setEditingVehicle(record);
                editForm.setFieldsValue(record);
                setIsEditOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xoá">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              danger
              style={{ border: "none" }}
            />
          </Tooltip>
        </Space>
      ),
      width: 120,
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="">
          <HomeOutlined />
          <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <CarOutlined />
          <span>Vehicle Management</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Title */}
      <Title
        level={3}
        style={{
          marginBottom: 20,
          fontWeight: 700,
          color: "#111",
          textAlign: "left",
        }}
      >
        Quản lý xe
      </Title>

      {/* Toolbar */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <Flex justify="space-between" align="center" gap={16} wrap="wrap">
          <Flex gap={16} wrap="wrap">
            <Input
              placeholder="🔍 Tìm theo tên hoặc biển số..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240, borderRadius: 8 }}
            />

            <Select
              allowClear
              placeholder="Loại xe"
              style={{ width: 160 }}
              value={filterType || undefined}
              onChange={(val) => setFilterType(val || null)}
            >
              <Option value="Normal">Normal</Option>
              <Option value="Sleeper">Sleeper</Option>
              <Option value="DoubleSleeper">DoubleSleeper</Option>
              <Option value="Limousine">Limousine</Option>
            </Select>

            <Select
              allowClear
              placeholder="Số tầng"
              style={{ width: 140 }}
              value={filterFloor || undefined}
              onChange={(val) => setFilterFloor(val || null)}
            >
              <Option value="1">1 tầng</Option>
              <Option value="2">2 tầng</Option>
            </Select>

            <Select
              allowClear
              placeholder="Tình trạng ghế"
              style={{ width: 180 }}
              value={filterSeatStatus || undefined}
              onChange={(val) => setFilterSeatStatus(val || null)}
            >
              <Option value="many">Còn trống nhiều</Option>
              <Option value="medium">Còn ít</Option>
              <Option value="few">Gần đầy</Option>
            </Select>

            <Select
              allowClear
              placeholder="Sắp xếp"
              style={{ width: 180 }}
              value={sortBy || undefined}
              onChange={(val) => setSortBy(val || null)}
            >
              <Option value="name">Tên xe (A → Z)</Option>
              <Option value="seats">Số ghế ↑</Option>
              <Option value="available">Ghế trống ↓</Option>
            </Select>
          </Flex>

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
            Thêm xe
          </Button>
        </Flex>
      </Card>

      {/* Table */}
      <Card
        style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 8 }}
          bordered={false}
          style={{ borderRadius: 8 }}
        />
      </Card>

      {/* Modal Add */}
      <Modal
        title="Thêm xe mới"
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
          <Form.Item name="name" label="Tên xe" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="licensePlate" label="Biển số">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="type" label="Loại xe" rules={[{ required: true }]}>
            <Select>
              <Option value="Normal">Normal</Option>
              <Option value="Sleeper">Sleeper</Option>
              <Option value="DoubleSleeper">DoubleSleeper</Option>
              <Option value="Limousine">Limousine</Option>
            </Select>
          </Form.Item>
          <Form.Item name="numberFloors" label="Số tầng" initialValue={1}>
            <Select>
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="seatCount"
            label="Số ghế"
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Edit */}
      <Modal
        title="Chỉnh sửa xe"
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
          <Form.Item name="name" label="Tên xe" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="licensePlate" label="Biển số">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="type" label="Loại xe" rules={[{ required: true }]}>
            <Select>
              <Option value="Normal">Normal</Option>
              <Option value="Sleeper">Sleeper</Option>
              <Option value="DoubleSleeper">DoubleSleeper</Option>
              <Option value="Limousine">Limousine</Option>
            </Select>
          </Form.Item>
          <Form.Item name="numberFloors" label="Số tầng">
            <Select>
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="seatCount"
            label="Số ghế"
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
