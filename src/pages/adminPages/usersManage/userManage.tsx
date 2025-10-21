import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
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
  HomeOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useUserManage } from "../../../hooks/userHooks/useUserManage.ts";

const { Title } = Typography;

export default function UserManagePage() {
  const {
    filteredUsers,
    loading,
    searchText,
    setSearchText,
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    setEditingUser,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useUserManage();

  const columns: ColumnsType<any> = [
    { title: "Mã KH", dataIndex: "userCode", key: "userCode", width: 100 },
    { title: "Email", dataIndex: "email", key: "email", width: 200 },
    { title: "Tên đầu", dataIndex: "firstName", key: "firstName" },
    { title: "Tên cuối", dataIndex: "lastName", key: "lastName" },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 160,
    },
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
                setIsEditOpen(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc muốn xoá "${record.email}" không?`}
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
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="">
          <HomeOutlined />
          <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <UserOutlined />
          <span>User Management</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title
        level={3}
        style={{ marginBottom: 20, fontWeight: 700, color: "#111" }}
      >
        Quản lý người dùng
      </Title>

      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <Flex justify="space-between" align="center" gap={16} wrap="wrap">
          <Input
            placeholder="🔍 Tìm theo email..."
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
            Thêm người dùng
          </Button>
        </Flex>
      </Card>

      <Card
        style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredUsers}
          columns={columns}
          pagination={{ pageSize: 8 }}
          bordered={false}
        />
      </Card>

      {/* Modal Add */}
      <Modal
        title="Thêm người dùng"
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
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="firstName"
            label="Tên đầu"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Tên cuối"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Số điện thoại">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Edit */}
      <Modal
        title="Chỉnh sửa người dùng"
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
            name="firstName"
            label="Tên đầu"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Tên cuối"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Số điện thoại">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
