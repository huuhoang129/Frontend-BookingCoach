//src/pages/adminPages/systemManage/bannerManagePage.tsx
import {
  Table,
  Input,
  Button,
  Card,
  Flex,
  Typography,
  Tooltip,
  Breadcrumb,
  Popconfirm,
  Space,
  Modal,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  PictureOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { useBanners } from "../../../hooks/systemHooks/useBanners";
import BannerModal from "../../../containers/ModalsCollect/SystemModal/BannerModal";

const { Title } = Typography;

export default function BannerManagePage() {
  const {
    banners,
    bannerData,
    setBannerData,
    handleOpenView,
    handleDelete,
    handleBulkDelete,
    loading,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    form,
    editForm,
    handleAdd,
    handleEdit,
    contextHolder,
  } = useBanners();

  // Trạng thái tìm kiếm, chọn nhiều và hiển thị chi tiết
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Lọc danh sách banner
  const filteredData = banners.filter((b) =>
    b.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Cấu hình cột bảng banner
  const columns: ColumnsType<any> = [
    {
      title: "Ảnh banner",
      dataIndex: "image",
      key: "image",
      width: 160,
      render: (img: string, record) => (
        <img
          src={
            img
              ? `data:image/png;base64,${img}`
              : "https://via.placeholder.com/120x70?text=No+Image"
          }
          alt={record.title}
          style={{
            width: 120,
            height: 70,
            objectFit: "cover",
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />
      ),
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
                editForm.setFieldsValue({
                  title: record.title,
                  image: [],
                });
                setIsEditModal(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title={`Xoá banner "${record.title}"?`}
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

  // Checkbox
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {contextHolder}

      {/* Điều hướng breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <PictureOutlined /> Quản lý Banner
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Tiêu đề trang */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Title level={3} style={{ fontWeight: 700, margin: 0 }}>
          Quản lý Banner
        </Title>
      </Flex>

      {/* Bộ lọc và thao tác thêm/xoá */}
      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Flex gap={16} wrap="wrap">
            <Input
              placeholder="Tìm theo tiêu đề..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
            />
          </Flex>

          <Flex gap={12} align="center">
            {selectedRowKeys.length > 0 ? (
              <Popconfirm
                title="Xác nhận xoá các banner đã chọn?"
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
                  style={{ height: 40, borderRadius: 8 }}
                >
                  Xoá đã chọn
                </Button>
              </Popconfirm>
            ) : (
              <Button
                icon={<PlusOutlined />}
                type="primary"
                style={{
                  background: "#4d940e",
                  borderColor: "#4d940e",
                  height: 40,
                  borderRadius: 8,
                }}
                onClick={() => setIsAddModal(true)}
              >
                Thêm banner
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>

      {/* Bảng danh sách banner */}
      <Card style={{ borderRadius: 12 }}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 6 }}
          rowSelection={rowSelection}
        />
      </Card>

      {/* Modal thêm/sửa banner */}
      <BannerModal
        openAdd={isAddModal}
        setOpenAdd={setIsAddModal}
        openEdit={isEditModal}
        setOpenEdit={setIsEditModal}
        formAdd={form}
        formEdit={editForm}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        editingBanner={bannerData}
      />

      {/* Modal xem chi tiết banner */}
      <Modal
        title="Chi tiết Banner"
        open={isViewOpen}
        onCancel={() => setIsViewOpen(false)}
        footer={null}
        centered
      >
        {bannerData ? (
          <div style={{ textAlign: "center" }}>
            <img
              src={`data:image/png;base64,${bannerData.image}`}
              style={{
                width: "100%",
                borderRadius: 8,
                marginBottom: 16,
                maxHeight: 320,
                objectFit: "cover",
              }}
            />
            <h3>{bannerData.title}</h3>

            <Button
              type="primary"
              style={{
                marginTop: 12,
                background: "#4d940e",
                borderColor: "#4d940e",
              }}
              icon={<EditOutlined />}
              onClick={() => {
                setIsViewOpen(false);
                setIsEditModal(true);
                editForm.setFieldsValue({ title: bannerData.title });
              }}
            >
              Sửa ngay
            </Button>
          </div>
        ) : (
          <p>Đang tải dữ liệu...</p>
        )}
      </Modal>
    </div>
  );
}
