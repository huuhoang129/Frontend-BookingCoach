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
  Tag,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";

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

interface TripPrice {
  id: number;
  coachRouteId: number;
  seatType: "SEAT" | "SLEEPER" | "DOUBLESLEEPER" | "LIMOUSINE";
  priceTrip: number;
  typeTrip: "NORMAL" | "HOLIDAY";
  route?: Route;
}

export default function TripPricePage() {
  const [tripPrices, setTripPrices] = useState<TripPrice[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [filterSeatType, setFilterSeatType] = useState<string | null>(null);
  const [filterTypeTrip, setFilterTypeTrip] = useState<string | null>(null);

  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingTripPrice, setEditingTripPrice] = useState<TripPrice | null>(
    null
  );

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchTripPrices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/trip-prices");
      if (res.data.errCode === 0) {
        setTripPrices(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/routes");
      if (res.data.errCode === 0) {
        setRoutes(res.data.data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchTripPrices();
    fetchRoutes();
  }, []);

  const handleAddTripPrice = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        coachRouteId: values.coachRouteId,
        seatType: values.seatType,
        priceTrip: Number(values.priceTrip),
        typeTrip: values.typeTrip,
      };
      const res = await axios.post(
        "http://localhost:8080/api/v1/trip-prices",
        payload
      );
      if (res.data.errCode === 0) {
        message.success("Thêm giá vé thành công");
        setIsAddModal(false);
        form.resetFields();
        fetchTripPrices();
      } else {
        message.error(res.data.errMessage);
      }
    } catch {}
  };

  const handleEditTripPrice = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingTripPrice) return;
      const payload = {
        id: editingTripPrice.id,
        coachRouteId: values.coachRouteId,
        seatType: values.seatType,
        priceTrip: Number(values.priceTrip),
        typeTrip: values.typeTrip,
      };
      const res = await axios.put(
        `http://localhost:8080/api/v1/trip-prices/${editingTripPrice.id}`,
        payload
      );
      if (res.data.errCode === 0) {
        message.success("Cập nhật giá vé thành công");
        setIsEditModal(false);
        fetchTripPrices();
      } else {
        message.error(res.data.errMessage);
      }
    } catch {}
  };

  const handleDeleteTripPrice = async (id: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/trip-prices/${id}`
      );
      if (res.data.errCode === 0) {
        message.success("Xoá giá vé thành công");
        fetchTripPrices();
      } else {
        message.error(res.data.errMessage);
      }
    } catch {}
  };

  // Filter
  const filteredData = tripPrices.filter((p) => {
    let match = true;

    if (
      searchText &&
      !(
        p.route?.fromLocation?.nameLocations
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        p.route?.toLocation?.nameLocations
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    ) {
      match = false;
    }

    if (filterSeatType && p.seatType !== filterSeatType) match = false;
    if (filterTypeTrip && p.typeTrip !== filterTypeTrip) match = false;

    return match;
  });

  const seatTypeColors: Record<string, string> = {
    SEAT: "blue",
    SLEEPER: "orange",
    DOUBLESLEEPER: "purple",
    LIMOUSINE: "green",
  };

  const typeTripColors: Record<string, string> = {
    NORMAL: "default",
    HOLIDAY: "red",
  };

  const columns: ColumnsType<TripPrice> = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    {
      title: "Tuyến",
      key: "route",
      render: (_, record) =>
        record.route ? (
          <span style={{ fontWeight: 600 }}>
            {record.route.fromLocation?.nameLocations} ➡️{" "}
            {record.route.toLocation?.nameLocations}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Loại ghế",
      dataIndex: "seatType",
      key: "seatType",
      render: (t) => <Tag color={seatTypeColors[t] || "default"}>{t}</Tag>,
      width: 150,
    },
    {
      title: "Loại chuyến",
      dataIndex: "typeTrip",
      key: "typeTrip",
      render: (t) => <Tag color={typeTripColors[t] || "default"}>{t}</Tag>,
      width: 150,
    },
    {
      title: "Giá vé",
      dataIndex: "priceTrip",
      key: "priceTrip",
      render: (val) => (
        <span style={{ fontWeight: 600, color: "#4d940e" }}>
          {new Intl.NumberFormat("vi-VN").format(val)} đ
        </span>
      ),
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: "none", color: "#4d940e" }}
              onClick={() => {
                setEditingTripPrice(record);
                editForm.setFieldsValue({
                  coachRouteId: record.coachRouteId,
                  seatType: record.seatType,
                  priceTrip: record.priceTrip,
                  typeTrip: record.typeTrip,
                });
                setIsEditModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xoá">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              danger
              style={{ border: "none" }}
              onClick={() => handleDeleteTripPrice(record.id)}
            />
          </Tooltip>
        </Space>
      ),
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
          <DollarOutlined />
          <span>Trip Prices</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title
        level={3}
        style={{
          marginBottom: 20,
          fontWeight: 700,
          color: "#111",
          textAlign: "left",
        }}
      >
        Quản lý Giá vé theo Tuyến
      </Title>

      {/* Toolbar */}
      <Card style={{ marginBottom: 20, borderRadius: 12 }}>
        <Flex justify="space-between" align="center" gap={16} wrap="wrap">
          <Flex gap={16} wrap="wrap">
            <Input
              placeholder="🔍 Tìm theo điểm đi/điểm đến..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280, borderRadius: 8 }}
            />
            <Select
              allowClear
              placeholder="Loại ghế"
              style={{ width: 180 }}
              value={filterSeatType || undefined}
              onChange={(val) => setFilterSeatType(val || null)}
            >
              <Option value="SEAT">Ghế ngồi</Option>
              <Option value="SLEEPER">Giường nằm</Option>
              <Option value="DOUBLESLEEPER">Giường đôi</Option>
              <Option value="LIMOUSINE">Limousine</Option>
            </Select>
            <Select
              allowClear
              placeholder="Loại chuyến"
              style={{ width: 180 }}
              value={filterTypeTrip || undefined}
              onChange={(val) => setFilterTypeTrip(val || null)}
            >
              <Option value="NORMAL">Ngày thường</Option>
              <Option value="HOLIDAY">Ngày lễ</Option>
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
            onClick={() => setIsAddModal(true)}
          >
            Thêm giá vé
          </Button>
        </Flex>
      </Card>

      {/* Table */}
      <Card style={{ borderRadius: 12 }}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 8 }}
          bordered={false}
        />
      </Card>

      {/* Modal Add */}
      <Modal
        title="Thêm giá vé"
        open={isAddModal}
        onCancel={() => setIsAddModal(false)}
        onOk={handleAddTripPrice}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
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
          <Form.Item
            name="seatType"
            label="Loại ghế"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="SEAT">Ghế ngồi</Option>
              <Option value="SLEEPER">Giường nằm</Option>
              <Option value="DOUBLESLEEPER">Giường đôi</Option>
              <Option value="LIMOUSINE">Limousine</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="typeTrip"
            label="Loại chuyến"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="NORMAL">Ngày thường</Option>
              <Option value="HOLIDAY">Ngày lễ</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="priceTrip"
            label="Giá vé (đ)"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Edit */}
      <Modal
        title="Sửa giá vé"
        open={isEditModal}
        onCancel={() => setIsEditModal(false)}
        onOk={handleEditTripPrice}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={editForm} layout="vertical">
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
          <Form.Item
            name="seatType"
            label="Loại ghế"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="SEAT">Ghế ngồi</Option>
              <Option value="SLEEPER">Giường nằm</Option>
              <Option value="DOUBLESLEEPER">Giường đôi</Option>
              <Option value="LIMOUSINE">Limousine</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="typeTrip"
            label="Loại chuyến"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="NORMAL">Ngày thường</Option>
              <Option value="HOLIDAY">Ngày lễ</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="priceTrip"
            label="Giá vé (đ)"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
