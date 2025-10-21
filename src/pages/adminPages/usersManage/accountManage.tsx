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
  Select,
  Tooltip,
  Breadcrumb,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useAccounts } from "../../../hooks/useAccounts";

const { Title } = Typography;
const { Option } = Select;

export default function AccountManagePage() {
  const { accounts, loading, handleLock, handleUnlock, fetchAccounts } =
    useAccounts();

  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Filter logic
  const filteredData = accounts.filter((acc) => {
    let match = true;
    if (
      searchText &&
      !acc.email.toLowerCase().includes(searchText.toLowerCase())
    )
      match = false;
    if (roleFilter && acc.role !== roleFilter) match = false;
    if (statusFilter && acc.status !== statusFilter) match = false;
    return match;
  });

  // Tag colors
  const statusColors: Record<string, string> = {
    Active: "green",
    Locked: "red",
  };

  const roleColors: Record<string, string> = {
    Admin: "geekblue",
    Staff: "gold",
    Client: "green",
    Driver: "purple",
  };

  // Table columns
  const columns: ColumnsType<any> = [
    {
      title: "Tên người dùng",
      key: "fullName",
      render: (_, record) => {
        const fullName = `${record.firstName || ""} ${
          record.lastName || ""
        }`.trim();
        return fullName ? (
          <span style={{ fontWeight: 500 }}>{fullName}</span>
        ) : (
          <i style={{ color: "#888" }}>Chưa cập nhật</i>
        );
      },
      width: 220,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => (
        <span style={{ fontWeight: 500, color: "#333" }}>{text}</span>
      ),
      width: 250,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color={roleColors[role] || "default"}>{role}</Tag>,
      width: 140,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
      width: 130,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? dayjs(date).format("DD/MM/YYYY HH:mm") : <i>—</i>,
      width: 160,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.status === "Active" ? (
            <Popconfirm
              title="Xác nhận khóa tài khoản"
              description={`Bạn có chắc muốn khóa "${record.email}" không?`}
              okText="Khóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={async () => {
                await handleLock(record.id);
                message.success("Đã khóa tài khoản!");
              }}
            >
              <Tooltip title="Khóa tài khoản">
                <Button
                  shape="circle"
                  icon={<LockOutlined />}
                  danger
                  style={{ border: "none" }}
                />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Xác nhận mở khóa"
              description={`Bạn có chắc muốn mở khóa "${record.email}" không?`}
              okText="Mở khóa"
              cancelText="Hủy"
              onConfirm={async () => {
                await handleUnlock(record.id);
                message.success("Đã mở khóa tài khoản!");
              }}
            >
              <Tooltip title="Mở khóa tài khoản">
                <Button
                  shape="circle"
                  icon={<UnlockOutlined />}
                  style={{ color: "#4d940e", border: "none" }}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
      width: 120,
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
          <UserOutlined />
          <span>Account Management</span>
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
        Quản lý tài khoản
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
              style={{ width: 160 }}
              value={roleFilter || undefined}
              onChange={(val) => setRoleFilter(val || null)}
            >
              <Option value="Admin">Admin</Option>
              <Option value="Staff">Staff</Option>
              <Option value="Client">Client</Option>
              <Option value="Driver">Driver</Option>
            </Select>

            <Select
              allowClear
              placeholder="Trạng thái"
              style={{ width: 160 }}
              value={statusFilter || undefined}
              onChange={(val) => setStatusFilter(val || null)}
            >
              <Option value="Active">Active</Option>
              <Option value="Locked">Locked</Option>
            </Select>
          </Flex>

          <Button
            icon={<TeamOutlined />}
            onClick={fetchAccounts}
            style={{
              borderRadius: 8,
              padding: "0 20px",
              background: "#4d940e",
              borderColor: "#4d940e",
              color: "#fff",
              fontWeight: 500,
            }}
          >
            Làm mới danh sách
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
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 8 }}
          bordered={false}
          style={{ borderRadius: 8 }}
        />
      </Card>
    </div>
  );
}
