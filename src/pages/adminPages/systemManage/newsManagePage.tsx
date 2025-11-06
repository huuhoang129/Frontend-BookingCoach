import { useState } from "react";
import {
  Table,
  Card,
  Flex,
  Button,
  Space,
  Tooltip,
  Breadcrumb,
  Typography,
  Tag,
  Popconfirm,
  Select,
  Input,
} from "antd";
import {
  HomeOutlined,
  ReadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import { useNews } from "../../../hooks/systemHooks/useNews.ts";
import NewsModals from "../../../containers/ModalsCollect/NewsModals.tsx";

const { Title } = Typography;
const { Option } = Select;

export default function NewsManagePage() {
  const {
    newsList,
    loading,
    selectedNews,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    handleCreateSubmit,
    handleEditSubmit,
    handleDelete,
    handleGetById,
  } = useNews();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const pageSize = 6;

  // Bộ lọc + tìm kiếm
  const filteredNews = newsList.filter((n) => {
    const status = n.status?.toLowerCase();
    const type = n.newsType;
    const titleMatch = n.title
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    return (
      (!statusFilter || status === statusFilter.toLowerCase()) &&
      (!typeFilter || type === typeFilter) &&
      (!searchText || titleMatch)
    );
  });

  // Cột bảng
  const columns: ColumnsType<any> = [
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 120,
      render: (thumb, record) =>
        thumb ? (
          <img
            src={thumb}
            alt={record.title}
            style={{
              width: 100,
              height: 60,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />
        ) : (
          "—"
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (t) => <b>{t}</b>,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      render: (author) =>
        author ? `${author.firstName} ${author.lastName}` : "—",
      width: 180,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Published"
              ? "green"
              : status === "Draft"
              ? "orange"
              : "default"
          }
        >
          {status}
        </Tag>
      ),
      width: 130,
    },
    {
      title: "Loại tin",
      dataIndex: "newsType",
      key: "newsType",
      render: (t) => (
        <Tag color="blue">
          {t === "News"
            ? "Tin tức"
            : t === "Featured"
            ? "Nổi bật"
            : t === "Recruitment"
            ? "Tuyển dụng"
            : t === "Service"
            ? "Dịch vụ"
            : "Khác"}
        </Tag>
      ),
      width: 150,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 140,
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: "none", color: "#4d940e" }}
              onClick={() => handleGetById(record.id, () => setOpenEdit(true))}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc muốn xoá tin "${record.title}" không?`}
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
    <div
      style={{
        padding: 24,
        background: "#f4f6f9",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="">
          <HomeOutlined />
          <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <ReadOutlined />
          <span>News Management</span>
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
        Quản lý Tin tức
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
              placeholder="🔍 Tìm theo tiêu đề..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240, borderRadius: 8 }}
            />

            <Select
              allowClear
              placeholder="Trạng thái"
              style={{ width: 160 }}
              value={statusFilter || undefined}
              onChange={(val) => setStatusFilter(val || null)}
            >
              <Option value="Draft">Bản nháp</Option>
              <Option value="Published">Đã xuất bản</Option>
            </Select>

            <Select
              allowClear
              placeholder="Loại tin"
              style={{ width: 180 }}
              value={typeFilter || undefined}
              onChange={(val) => setTypeFilter(val || null)}
            >
              <Option value="News">Tin tức</Option>
              <Option value="Featured">Tin nổi bật</Option>
              <Option value="Recruitment">Tin tuyển dụng</Option>
              <Option value="Service">Tin dịch vụ</Option>
            </Select>
          </Flex>

          <Button
            icon={<PlusOutlined />}
            onClick={() => setOpenCreate(true)}
            style={{
              borderRadius: 8,
              padding: "0 20px",
              background: "#4d940e",
              borderColor: "#4d940e",
              color: "#fff",
              fontWeight: 500,
            }}
          >
            Thêm tin tức
          </Button>
        </Flex>
      </Card>

      {/* Table */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          overflowX: "auto",
        }}
      >
        <Table
          rowKey="id"
          dataSource={filteredNews}
          columns={columns}
          loading={loading}
          pagination={{
            pageSize,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
          }}
          bordered={false}
        />
      </Card>

      {/* Modals giữ nguyên */}
      <NewsModals
        openCreate={openCreate}
        setOpenCreate={setOpenCreate}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        selectedNews={selectedNews}
        handlers={{
          handleCreate: handleCreateSubmit,
          handleEdit: handleEditSubmit,
        }}
      />
    </div>
  );
}
