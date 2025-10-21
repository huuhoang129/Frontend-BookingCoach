import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  message,
  Popconfirm,
  Breadcrumb,
  Card,
  Flex,
  Typography,
  Tag,
  Tooltip,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  TeamOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEmployees } from "../../../hooks/useEmployees";

const { Title } = Typography;
const { Option } = Select;

export default function EmployeeManagePage() {
  const {
    employees,
    loading,
    viewEmployee,
    fetchEmployees,
    handleCreateSubmit,
    handleEditSubmit,
    handleDelete,
    handleOpenView,
  } = useEmployees();

  // state UI
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<any | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter data
  const filteredEmployees = employees
    .filter((e) =>
      roleFilter ? e.role === roleFilter : ["Admin", "Driver"].includes(e.role)
    )
    .filter((e) => e.email?.toLowerCase().includes(searchText.toLowerCase()));

  const roleColors: Record<string, string> = {
    Admin: "geekblue",
    Driver: "green",
  };

  // Table columns
  const columns: ColumnsType<any> = [
    {
      title: "Mã NV",
      dataIndex: "employeeCode",
      key: "employeeCode",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 150,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 130,
      render: (role) => <Tag color={roleColors[role]}>{role}</Tag>,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 150,
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY") : "—"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 140,
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
                setEditingEmp(record);
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

  // Create
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await handleCreateSubmit(values);
      message.success("Thêm nhân viên thành công!");
      setIsAddOpen(false);
      form.resetFields();
      fetchEmployees();
    } catch {
      message.error("Thêm nhân viên thất bại!");
    }
  };

  // Edit
  const handleEdit = async () => {
    if (!editingEmp) return;
    try {
      const values = await editForm.validateFields();
      await handleEditSubmit(values, editingEmp.id);
      message.success("Cập nhật nhân viên thành công!");
      setIsEditOpen(false);
      setEditingEmp(null);
      fetchEmployees();
    } catch {
      message.error("Cập nhật thất bại!");
    }
  };

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="">
          <HomeOutlined />
          <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <TeamOutlined />
          <span>Employee Management</span>
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
        Quản lý nhân viên
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
              placeholder="🔍 Tìm theo email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240, borderRadius: 8 }}
            />

            <Select
              allowClear
              placeholder="Vai trò"
              style={{ width: 180 }}
              value={roleFilter || undefined}
              onChange={(val) => setRoleFilter(val || null)}
            >
              <Option value="Admin">Admin</Option>
              <Option value="Driver">Driver</Option>
            </Select>
          </Flex>

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
            Thêm nhân viên
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
          dataSource={filteredEmployees}
          columns={columns}
          pagination={{ pageSize: 8 }}
          bordered={false}
        />
      </Card>

      {/* Modal Add */}
      <Modal
        title="Thêm nhân viên"
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
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="Driver">Driver</Option>
            </Select>
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="citizenId" label="CMND/CCCD">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Edit */}
      <Modal
        title="Chỉnh sửa nhân viên"
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
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="Driver">Driver</Option>
            </Select>
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="citizenId" label="CMND/CCCD">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal View */}
      <Modal
        title="Thông tin nhân viên"
        open={isViewOpen}
        onCancel={() => setIsViewOpen(false)}
        footer={null}
      >
        {viewEmployee ? (
          <div style={{ lineHeight: "28px" }}>
            <p>
              <b>Mã NV:</b> {viewEmployee.employeeCode}
            </p>
            <p>
              <b>Họ tên:</b> {viewEmployee.firstName} {viewEmployee.lastName}
            </p>
            <p>
              <b>Email:</b> {viewEmployee.email}
            </p>
            <p>
              <b>SĐT:</b> {viewEmployee.phoneNumber}
            </p>
            <p>
              <b>Vai trò:</b> {viewEmployee.role}
            </p>
            <p>
              <b>Địa chỉ:</b> {viewEmployee.address || "—"}
            </p>
            <p>
              <b>Ngày sinh:</b>{" "}
              {viewEmployee.dateOfBirth
                ? dayjs(viewEmployee.dateOfBirth).format("DD/MM/YYYY")
                : "—"}
            </p>
            <p>
              <b>CMND/CCCD:</b> {viewEmployee.citizenId || "—"}
            </p>
          </div>
        ) : (
          <p>Đang tải thông tin...</p>
        )}
      </Modal>
    </div>
  );
}
