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
  Upload,
  Select,
  Tag,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  NodeIndexOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";
import { toBase64 } from "../../../utils/base64";

const { Title } = Typography;
const { Option } = Select;

interface Province {
  id: number;
  nameProvince: string;
}

interface Location {
  id: number;
  nameLocations: string;
  province: Province;
}

interface Route {
  id: number;
  fromLocation: Location;
  toLocation: Location;
  imageRouteCoach?: string | null;
}

export default function RoutePage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterProvince, setFilterProvince] = useState<string | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);

  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/routes");
      if (res.data.errCode === 0) {
        setRoutes(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/locations");
      if (res.data.errCode === 0) {
        setLocations(res.data.data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchRoutes();
    fetchLocations();
  }, []);

  const processImage = async (fileList: any[], oldImage?: string | null) => {
    if (fileList && fileList.length > 0) {
      const fileObj = fileList[0].originFileObj;
      if (fileObj) {
        const base64 = await toBase64(fileObj as File);
        return (base64 as string).split(",")[1];
      }
    }
    // Nếu không chọn ảnh mới thì giữ ảnh cũ
    if (oldImage) {
      return oldImage.startsWith("data:image")
        ? oldImage.split(",")[1]
        : oldImage;
    }
    return null;
  };

  const handleAddRoute = async () => {
    try {
      const values = await form.validateFields();
      const base64Image = await processImage(values.imageRouteCoach);

      const payload = {
        fromLocationId: values.fromLocationId,
        toLocationId: values.toLocationId,
        imageRouteCoach: base64Image,
      };

      const res = await axios.post(
        "http://localhost:8080/api/v1/routes",
        payload
      );
      if (res.data.errCode === 0) {
        message.success("Thêm tuyến đường thành công");
        setIsAddModal(false);
        form.resetFields();
        fetchRoutes();
      } else {
        message.error(res.data.errMessage);
      }
    } catch {}
  };

  const handleEditRoute = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingRoute) return;

      const base64Image = await processImage(
        values.imageRouteCoach,
        editingRoute.imageRouteCoach || null
      );

      const payload = {
        fromLocationId: values.fromLocationId,
        toLocationId: values.toLocationId,
        imageRouteCoach: base64Image,
      };

      const res = await axios.put(
        `http://localhost:8080/api/v1/routes/${editingRoute.id}`,
        payload
      );

      if (res.data.errCode === 0) {
        message.success("Cập nhật tuyến đường thành công");
        setIsEditModal(false);
        editForm.resetFields();
        setEditingRoute(null);
        fetchRoutes();
      } else {
        message.error(res.data.errMessage);
      }
    } catch {}
  };

  const handleDeleteRoute = async (id: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/routes/${id}`
      );
      if (res.data.errCode === 0) {
        message.success("Xoá tuyến đường thành công");
        fetchRoutes();
      } else {
        message.error(res.data.errMessage);
      }
    } catch {}
  };

  const filteredData = routes.filter((r) => {
    let match = true;

    if (
      searchText &&
      !(
        r.fromLocation?.nameLocations
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        r.toLocation?.nameLocations
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    ) {
      match = false;
    }

    if (
      filterProvince &&
      r.fromLocation?.province?.nameProvince !== filterProvince &&
      r.toLocation?.province?.nameProvince !== filterProvince
    ) {
      match = false;
    }

    return match;
  });

  const columns: ColumnsType<Route> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      fixed: "left",
    },
    {
      title: "Điểm đi",
      key: "fromLocation",
      width: 240,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 18, color: "#4d940e" }}>🚏</span>
          <div>
            <div style={{ fontWeight: 600, whiteSpace: "normal" }}>
              {record.fromLocation?.nameLocations}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              {record.fromLocation?.province?.nameProvince}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Điểm đến",
      key: "toLocation",
      width: 240,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 18, color: "#ff7a00" }}>🎯</span>
          <div>
            <div style={{ fontWeight: 600, whiteSpace: "normal" }}>
              {record.toLocation?.nameLocations}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              {record.toLocation?.province?.nameProvince}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tuyến",
      key: "route",
      width: 280,
      render: (_, record) => (
        <Tag
          color="blue"
          style={{
            fontSize: 14,
            padding: "6px 10px",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          {record.fromLocation?.nameLocations} ➡️{" "}
          {record.toLocation?.nameLocations}
        </Tag>
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "imageRouteCoach",
      key: "imageRouteCoach",
      width: 150,
      render: (img) =>
        img ? (
          <img
            src={
              img.startsWith("data:image")
                ? img
                : `data:image/png;base64,${img}`
            }
            alt="route"
            style={{
              width: 100,
              borderRadius: 6,
              display: "block",
              margin: "0 auto",
            }}
          />
        ) : (
          "—"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: "none", color: "#4d940e" }}
              onClick={() => {
                setEditingRoute(record);
                editForm.setFieldsValue({
                  fromLocationId: record.fromLocation?.id,
                  toLocationId: record.toLocation?.id,
                  imageRouteCoach: record.imageRouteCoach
                    ? [
                        {
                          uid: String(record.id),
                          name: "route-image.png",
                          status: "done",
                          url: record.imageRouteCoach.startsWith("data:image")
                            ? record.imageRouteCoach
                            : `data:image/png;base64,${record.imageRouteCoach}`,
                        },
                      ]
                    : [],
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
              onClick={() => handleDeleteRoute(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="">
          <HomeOutlined />
          <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NodeIndexOutlined />
          <span>Route Management</span>
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
        Quản lý tuyến đường
      </Title>

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
              placeholder="Chọn tỉnh"
              style={{ width: 200 }}
              value={filterProvince || undefined}
              onChange={(val) => setFilterProvince(val || null)}
            >
              {locations
                .map((l) => l.province?.nameProvince)
                .filter(
                  (value, index, self) => value && self.indexOf(value) === index
                )
                .map((p) => (
                  <Option key={p} value={p}>
                    {p}
                  </Option>
                ))}
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
            Thêm tuyến đường
          </Button>
        </Flex>
      </Card>

      <Card style={{ borderRadius: 12 }}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 8 }}
          bordered={false}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal Add */}
      <Modal
        title="Thêm tuyến đường"
        open={isAddModal}
        onCancel={() => setIsAddModal(false)}
        onOk={handleAddRoute}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fromLocationId"
            label="Điểm đi"
            rules={[{ required: true }]}
          >
            <Select>
              {locations.map((l) => (
                <Option key={l.id} value={l.id}>
                  {l.nameLocations} ({l.province?.nameProvince})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="toLocationId"
            label="Điểm đến"
            rules={[{ required: true }]}
          >
            <Select>
              {locations.map((l) => (
                <Option key={l.id} value={l.id}>
                  {l.nameLocations} ({l.province?.nameProvince})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="imageRouteCoach"
            label="Ảnh tuyến đường"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e && Array.isArray(e.fileList) ? e.fileList : [];
            }}
          >
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Edit */}
      <Modal
        title="Sửa tuyến đường"
        open={isEditModal}
        onCancel={() => setIsEditModal(false)}
        onOk={handleEditRoute}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="fromLocationId"
            label="Điểm đi"
            rules={[{ required: true }]}
          >
            <Select>
              {locations.map((l) => (
                <Option key={l.id} value={l.id}>
                  {l.nameLocations} ({l.province?.nameProvince})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="toLocationId"
            label="Điểm đến"
            rules={[{ required: true }]}
          >
            <Select>
              {locations.map((l) => (
                <Option key={l.id} value={l.id}>
                  {l.nameLocations} ({l.province?.nameProvince})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="imageRouteCoach"
            label="Ảnh tuyến đường"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e && Array.isArray(e.fileList) ? e.fileList : [];
            }}
          >
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
