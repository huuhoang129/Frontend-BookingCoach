//src/pages/adminPages/usersManage/driverManagePage.tsx
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
  Popconfirm,
  Tag,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  CarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import dayjs from "dayjs";
import { useDrivers } from "../../../hooks/userHooks/useDriverManage";
import DriverModal from "../../../containers/ModalsCollect/userModal/DriverModal";

const { Title } = Typography;

export default function DriverManagePage() {
  const {
    drivers,
    loading,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    isViewModal,
    setIsViewModal,
    editingDriver,
    setEditingDriver,
    viewDriver,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleView,
    contextHolder,
  } = useDrivers();

  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Lọc dữ liệu (role = Driver)
  const filteredDrivers = drivers.filter((d) => {
    if (d.role !== "Driver") return false;
    if (!searchText) return true;
    return (
      d.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      `${d.firstName} ${d.lastName}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  });

  // Cấu hình bảng
  const columns: ColumnsType<any> = [
    { title: "Mã tài xế", dataIndex: "userCode", key: "userCode", width: 120 },
    {
      title: "Họ và tên",
      key: "fullName",
      render: (_, r) => (
        <span style={{ fontWeight: 600 }}>
          {r.firstName} {r.lastName}
        </span>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY") : "—"),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: () => <Tag color="green">Tài xế</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => handleView(record.id)}
            />
          </Tooltip>

          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: "none", color: "#4d940e" }}
              onClick={() => {
                setEditingDriver(record);
                editForm.setFieldsValue(record);
                setIsEditModal(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc muốn xoá tài xế "${record.email}" không?`}
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

      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <CarOutlined /> Quản lý tài xế
        </Breadcrumb.Item>
      </Breadcrumb>

      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Title level={3} style={{ fontWeight: 700, margin: 0 }}>
          Quản lý tài xế
        </Title>
      </Flex>

      {/* Bộ lọc và nút */}
      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Input
            placeholder="🔍 Tìm theo email hoặc tên..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260 }}
          />

          <Flex gap={12}>
            {selectedRowKeys.length > 0 ? (
              <Popconfirm
                title="Xác nhận xoá"
                description="Bạn có chắc muốn xoá các tài xế đã chọn không?"
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
                  style={{
                    height: 40,
                    borderRadius: 8,
                    padding: "0 20px",
                    fontWeight: 500,
                  }}
                >
                  Xoá đã chọn
                </Button>
              </Popconfirm>
            ) : (
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setIsAddModal(true)}
                style={{
                  borderRadius: 8,
                  padding: "0 20px",
                  background: "#4d940e",
                  borderColor: "#4d940e",
                  fontWeight: 500,
                  height: 40,
                }}
              >
                Thêm tài xế
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>

      {/* Bảng */}
      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredDrivers}
          columns={columns}
          pagination={{ pageSize: 8 }}
          rowSelection={rowSelection}
        />
      </Card>

      {/* Modal thêm / sửa / xem */}
      <DriverModal
        openAdd={isAddModal}
        setOpenAdd={setIsAddModal}
        openEdit={isEditModal}
        setOpenEdit={setIsEditModal}
        openView={isViewModal}
        setOpenView={setIsViewModal}
        formAdd={form}
        formEdit={editForm}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        editingDriver={editingDriver}
        viewDriver={viewDriver}
      />
    </div>
  );
}
