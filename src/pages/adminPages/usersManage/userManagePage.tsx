// src/pages/adminPages/usersManage/userManagePage.tsx
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
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useUserManage } from "../../../hooks/userHooks/useUserManage";
import UserModal from "../../../containers/ModalsCollect/userModal/UserModal";

const { Title } = Typography;

export default function UserManagePage() {
  const {
    users,
    loading,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    editingUser,
    setEditingUser,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    contextHolder,
  } = useUserManage();

  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // lọc dữ liệu
  const filteredData = users.filter((u) => {
    if (!searchText) return true;
    const text = searchText.toLowerCase();
    return (
      u.email?.toLowerCase().includes(text) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(text)
    );
  });

  // cột bảng
  const columns: ColumnsType<any> = [
    {
      title: "Mã KH",
      dataIndex: "userCode",
      key: "userCode",
      width: 100,
    },
    {
      title: "Họ và tên",
      key: "fullName",
      render: (_, record) => (
        <span style={{ fontWeight: 600 }}>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Hành động",
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
                setEditingUser(record);
                editForm.setFieldsValue(record);
                setIsEditModal(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc muốn xoá người dùng "${record.email}" không?`}
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

  // checkbox chọn nhiều
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
          <UserOutlined /> Quản lý khách hàng
        </Breadcrumb.Item>
      </Breadcrumb>

      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Title level={3} style={{ fontWeight: 700, margin: 0 }}>
          Quản lý khách hàng
        </Title>
      </Flex>

      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Input
            placeholder="🔍 Tìm theo email hoặc tên..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260 }}
          />

          <Flex gap={12} align="center">
            {selectedRowKeys.length > 0 ? (
              <Popconfirm
                title="Xác nhận xoá"
                description="Bạn có chắc muốn xoá các người dùng đã chọn không?"
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
                style={{
                  borderRadius: 8,
                  padding: "0 20px",
                  background: "#4d940e",
                  borderColor: "#4d940e",
                  color: "#fff",
                  fontWeight: 500,
                  height: 40,
                }}
                type="primary"
                onClick={() => setIsAddModal(true)}
              >
                Thêm người dùng
              </Button>
            )}
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
          rowSelection={rowSelection}
        />
      </Card>

      {/* mode thêm/sửa */}
      <UserModal
        openAdd={isAddModal}
        setOpenAdd={setIsAddModal}
        openEdit={isEditModal}
        setOpenEdit={setIsEditModal}
        formAdd={form}
        formEdit={editForm}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        editingUser={editingUser}
      />
    </div>
  );
}
