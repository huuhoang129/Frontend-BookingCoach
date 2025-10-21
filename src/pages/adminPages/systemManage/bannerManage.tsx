import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Popconfirm,
  Breadcrumb,
  Card,
  Flex,
  Typography,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  PictureOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useBanners } from "../../../hooks/useBanners";

const { Title } = Typography;

export default function BannerManagePage() {
  const {
    banners,
    bannerData,
    setBannerData,
    handleOpenView,
    handleCreate,
    handleEdit,
    handleDelete,
    fetchBanners,
  } = useBanners();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await handleCreate(values);
      message.success("Thêm banner thành công!");
      form.resetFields();
      setIsAddOpen(false);
      fetchBanners();
    } catch {
      message.error("Thêm banner thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditConfirm = async () => {
    try {
      const values = await editForm.validateFields();
      setLoading(true);
      await handleEdit(values);
      message.success("Cập nhật banner thành công!");
      setIsEditOpen(false);
      setBannerData(null);
      fetchBanners();
    } catch {
      message.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Lọc theo tiêu đề banner
  const filteredBanners = banners.filter((b) =>
    b.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<any> = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (img: string, record) => (
        <img
          src={`data:image/png;base64,${img}`}
          alt={record.title}
          style={{
            width: 100,
            height: 60,
            objectFit: "cover",
            borderRadius: 6,
            border: "1px solid #ddd",
          }}
        />
      ),
      width: 140,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              onClick={async () => {
                await handleOpenView(record.id);
                setIsViewOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ color: "#4d940e", border: "none" }}
              onClick={() => {
                setBannerData(record);
                editForm.setFieldsValue({ title: record.title });
                setIsEditOpen(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xoá banner"
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

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="">
          <HomeOutlined />
          <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <PictureOutlined />
          <span>Banner Management</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Title */}
      <Title
        level={3}
        style={{
          marginBottom: 20,
          fontWeight: 700,
          color: "#111",
        }}
      >
        Quản lý Banner
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
          <Input
            placeholder="🔍 Tìm theo tiêu đề banner..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260, borderRadius: 8 }}
          />

          <Button
            icon={<PlusOutlined />}
            onClick={() => setIsAddOpen(true)}
            style={{
              borderRadius: 8,
              padding: "0 20px",
              background: "#4d940e",
              borderColor: "#4d940e",
              color: "#fff",
              fontWeight: 500,
            }}
          >
            Thêm banner
          </Button>
        </Flex>
      </Card>

      {/* Table */}
      <Card
        style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
      >
        <Table
          rowKey="id"
          dataSource={filteredBanners}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 4 }}
        />
      </Card>

      {/* Modal Add */}
      <Modal
        title="Thêm mới Banner"
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
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Nhập tiêu đề banner" }]}
          >
            <Input placeholder="Nhập tiêu đề banner..." />
          </Form.Item>
          <Form.Item
            name="image"
            label="Ảnh banner"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: true, message: "Chọn ảnh banner" }]}
          >
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Edit */}
      <Modal
        title="Chỉnh sửa Banner"
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onOk={handleEditConfirm}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Nhập tiêu đề banner" }]}
          >
            <Input placeholder="Nhập tiêu đề banner..." />
          </Form.Item>
          <Form.Item
            name="image"
            label="Cập nhật ảnh (tuỳ chọn)"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal View */}
      <Modal
        title="Chi tiết Banner"
        open={isViewOpen}
        onCancel={() => setIsViewOpen(false)}
        footer={null}
      >
        {bannerData ? (
          <div style={{ textAlign: "center" }}>
            <img
              src={`data:image/png;base64,${bannerData.image}`}
              alt={bannerData.title}
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 16,
              }}
            />
            <h3>{bannerData.title}</h3>
          </div>
        ) : (
          <p>Đang tải thông tin banner...</p>
        )}
      </Modal>
    </div>
  );
}
