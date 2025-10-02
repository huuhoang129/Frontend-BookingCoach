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
  Tabs,
  Select,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;
const { Option } = Select;

interface Province {
  id: number;
  nameProvince: string;
  valueProvince: string;
}

interface Location {
  id: number;
  nameLocations: string;
  type: string;
  provinceId: number;
  province?: Province;
}

export default function LocationPage() {
  // province state
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);

  // location state
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // search
  const [searchProvince, setSearchProvince] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // filters for locations
  const [filterProvince, setFilterProvince] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  // modal
  const [isAddProvince, setIsAddProvince] = useState(false);
  const [isEditProvince, setIsEditProvince] = useState(false);
  const [editingProvince, setEditingProvince] = useState<Province | null>(null);

  const [isAddLocation, setIsAddLocation] = useState(false);
  const [isEditLocation, setIsEditLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const [provinceForm] = Form.useForm();
  const [provinceEditForm] = Form.useForm();
  const [locationForm] = Form.useForm();
  const [locationEditForm] = Form.useForm();

  // fetch
  const fetchProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/provinces");
      if (res.data.errCode === 0) {
        setProvinces(res.data.data);
      }
    } finally {
      setLoadingProvinces(false);
    }
  };

  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/locations");
      if (res.data.errCode === 0) {
        setLocations(res.data.data);
      }
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
    fetchLocations();
  }, []);

  // CRUD Provinces
  const handleAddProvince = async () => {
    try {
      const values = await provinceForm.validateFields();
      const res = await axios.post(
        "http://localhost:8080/api/v1/provinces",
        values
      );
      if (res.data.errCode === 0) {
        message.success("Thêm tỉnh thành công");
        setIsAddProvince(false);
        provinceForm.resetFields();
        fetchProvinces();
      }
    } catch (e) {}
  };

  const handleEditProvince = async () => {
    try {
      const values = await provinceEditForm.validateFields();
      if (!editingProvince) return;
      // giả sử có update API PUT /provinces/:id
      // nếu chưa có thì thêm service update
      message.info("API updateProvince chưa implement");
      setIsEditProvince(false);
    } catch (e) {}
  };

  // CRUD Locations
  const handleAddLocation = async () => {
    try {
      const values = await locationForm.validateFields();
      const res = await axios.post(
        "http://localhost:8080/api/v1/locations",
        values
      );
      if (res.data.errCode === 0) {
        message.success("Thêm điểm đón/trả thành công");
        setIsAddLocation(false);
        locationForm.resetFields();
        fetchLocations();
      }
    } catch (e) {}
  };

  const handleEditLocation = async () => {
    try {
      const values = await locationEditForm.validateFields();
      if (!editingLocation) return;
      message.info("API updateLocation chưa implement");
      setIsEditLocation(false);
    } catch (e) {}
  };

  // filter
  const filteredProvinces = provinces.filter((p) =>
    p.nameProvince.toLowerCase().includes(searchProvince.toLowerCase())
  );
  const filteredLocations = locations.filter((l) => {
    let match = true;

    if (
      searchLocation &&
      !l.nameLocations.toLowerCase().includes(searchLocation.toLowerCase())
    ) {
      match = false;
    }

    if (filterProvince && l.provinceId.toString() !== filterProvince) {
      match = false;
    }

    if (filterType && l.type !== filterType) {
      match = false;
    }

    return match;
  });

  // columns
  const provinceColumns: ColumnsType<Province> = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Tên tỉnh", dataIndex: "nameProvince", key: "nameProvince" },
    {
      title: "Mã tỉnh",
      dataIndex: "valueProvince",
      key: "valueProvince",
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100, // 👈 giới hạn chiều rộng
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              size="small"
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: "none", color: "#4d940e" }}
              onClick={() => {
                setEditingProvince(record);
                provinceEditForm.setFieldsValue(record);
                setIsEditProvince(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xoá">
            <Button
              size="small"
              shape="circle"
              icon={<DeleteOutlined />}
              danger
              style={{ border: "none" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const locationColumns: ColumnsType<Location> = [
    { title: "ID", dataIndex: "id", key: "id", width: 80, fixed: "left" },
    {
      title: "Tên địa điểm",
      dataIndex: "nameLocations",
      key: "nameLocations",
      width: 250,
      render: (text) => (
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-block",
            maxWidth: 230,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (t) => {
        let color = t === "station" ? "green" : "orange";
        let label = t === "station" ? "Bến xe" : "Điểm dừng";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Thuộc tỉnh",
      dataIndex: ["province", "nameProvince"],
      key: "province",
      width: 200,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: "none", color: "#4d940e" }}
              onClick={() => {
                setEditingLocation(record);
                locationEditForm.setFieldsValue(record);
                setIsEditLocation(true);
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
          <EnvironmentOutlined />
          <span>Provinces & Locations</span>
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
        Quản lý Tỉnh / Địa điểm
      </Title>

      <Tabs defaultActiveKey="provinces">
        {/* Provinces */}
        <Tabs.TabPane tab="Tỉnh / Thành phố" key="provinces">
          <Card style={{ marginBottom: 20, borderRadius: 12 }}>
            <Flex justify="space-between" align="center" gap={16} wrap="wrap">
              <Input
                placeholder="🔍 Tìm tỉnh..."
                prefix={<SearchOutlined />}
                value={searchProvince}
                onChange={(e) => setSearchProvince(e.target.value)}
                style={{ width: 240, borderRadius: 8 }}
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
                onClick={() => setIsAddProvince(true)}
              >
                Thêm tỉnh
              </Button>
            </Flex>
          </Card>

          <Card style={{ borderRadius: 12 }}>
            <Table
              rowKey="id"
              loading={loadingProvinces}
              dataSource={filteredProvinces}
              columns={provinceColumns}
              pagination={{ pageSize: 8 }}
              bordered={false}
            />
          </Card>
        </Tabs.TabPane>

        {/* Locations */}
        <Tabs.TabPane tab="Địa điểm" key="locations">
          <Card style={{ marginBottom: 20, borderRadius: 12 }}>
            <Flex justify="space-between" align="center" gap={16} wrap="wrap">
              <Flex gap={16} wrap="wrap">
                <Input
                  placeholder="🔍 Tìm địa điểm..."
                  prefix={<SearchOutlined />}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  style={{ width: 240, borderRadius: 8 }}
                />

                {/* Bộ lọc theo tỉnh */}
                <Select
                  allowClear
                  placeholder="Chọn tỉnh"
                  style={{ width: 200 }}
                  value={filterProvince || undefined}
                  onChange={(val) => setFilterProvince(val || null)}
                >
                  {provinces.map((p) => (
                    <Option key={p.id} value={p.id.toString()}>
                      {p.nameProvince}
                    </Option>
                  ))}
                </Select>

                {/* Bộ lọc theo loại địa điểm */}
                <Select
                  allowClear
                  placeholder="Loại địa điểm"
                  style={{ width: 160 }}
                  value={filterType || undefined}
                  onChange={(val) => setFilterType(val || null)}
                >
                  <Option value="station">Bến xe</Option>
                  <Option value="stopPoint">Điểm dừng</Option>
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
                onClick={() => setIsAddLocation(true)}
              >
                Thêm địa điểm
              </Button>
            </Flex>
          </Card>

          <Card style={{ borderRadius: 12 }}>
            <Table
              rowKey="id"
              loading={loadingLocations}
              dataSource={filteredLocations}
              columns={locationColumns}
              pagination={{ pageSize: 8 }}
              bordered={false}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      {/* Modal Province Add */}
      <Modal
        title="Thêm tỉnh mới"
        open={isAddProvince}
        onCancel={() => setIsAddProvince(false)}
        onOk={handleAddProvince}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={provinceForm} layout="vertical">
          <Form.Item
            name="nameProvince"
            label="Tên tỉnh"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Province Edit */}
      <Modal
        title="Sửa tỉnh"
        open={isEditProvince}
        onCancel={() => setIsEditProvince(false)}
        onOk={handleEditProvince}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={provinceEditForm} layout="vertical">
          <Form.Item
            name="nameProvince"
            label="Tên tỉnh"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Location Add */}
      <Modal
        title="Thêm địa điểm mới"
        open={isAddLocation}
        onCancel={() => setIsAddLocation(false)}
        onOk={handleAddLocation}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={locationForm} layout="vertical">
          <Form.Item
            name="nameLocations"
            label="Tên địa điểm"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="provinceId"
            label="Thuộc tỉnh"
            rules={[{ required: true }]}
          >
            <Select>
              {provinces.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.nameProvince}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Loại" initialValue="station">
            <Select>
              <Option value="station">Bến xe</Option>
              <Option value="stopPoint">Điểm dừng</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Location Edit */}
      <Modal
        title="Sửa địa điểm"
        open={isEditLocation}
        onCancel={() => setIsEditLocation(false)}
        onOk={handleEditLocation}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={locationEditForm} layout="vertical">
          <Form.Item
            name="nameLocations"
            label="Tên địa điểm"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="provinceId"
            label="Thuộc tỉnh"
            rules={[{ required: true }]}
          >
            <Select>
              {provinces.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.nameProvince}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Loại">
            <Select>
              <Option value="station">Bến xe</Option>
              <Option value="office">Văn phòng</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
