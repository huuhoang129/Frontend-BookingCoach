//src/pages/adminPages/usersManage/accountManagePage.tsx
import { useEffect, useMemo, useState } from "react";
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
} from "antd";
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  HomeOutlined,
  UserOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useAccounts } from "../../../hooks/userHooks/useAccountsManage";

const { Title } = Typography;
const { Option } = Select;

export default function AccountManagePage() {
  const {
    accounts,
    loading,
    handleLock,
    handleUnlock,
    fetchAccounts,
    contextHolder,
  } = useAccounts();

  // state lọc và tìm kiếm
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Bảng màu/nhãn cho trạng thái và vai trò
  const statusColors: Record<string, string> = {
    Active: "green",
    Locked: "red",
  };
  const roleColors: Record<string, string> = {
    Admin: "geekblue",
    Client: "green",
    Driver: "purple",
  };
  const statusLabels: Record<string, string> = {
    Active: "Đang hoạt động",
    Locked: "Đang khóa",
  };
  const roleLabels: Record<string, string> = {
    Admin: "Quản trị viên",
    Client: "Khách hàng",
    Driver: "Tài xế",
  };

  // tình toán dữ liêu đã lọc
  const filteredData = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return accounts.filter((acc) => {
      if (q && !acc.email.toLowerCase().includes(q)) return false;
      if (roleFilter && acc.role !== roleFilter) return false;
      if (statusFilter && acc.status !== statusFilter) return false;
      return true;
    });
  }, [accounts, searchText, roleFilter, statusFilter]);

  // cột bảng
  const columns: ColumnsType<any> = useMemo(
    () => [
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
        render: (role: string) => (
          <Tag color={roleColors[role] || "default"}>
            {roleLabels[role] || role}
          </Tag>
        ),
        width: 160,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: string) => (
          <Tag color={statusColors[status] || "default"}>
            {statusLabels[status] || status}
          </Tag>
        ),
        width: 160,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date?: string) =>
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
                onConfirm={() => handleLock(record.id)}
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
                onConfirm={() => handleUnlock(record.id)}
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
    ],
    [handleLock, handleUnlock]
  );

  // làm mới
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAccounts();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {contextHolder}

      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <UserOutlined /> Quản lý tài khoản
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title
        level={3}
        style={{ marginBottom: 20, fontWeight: 700, color: "#111" }}
      >
        Quản lý tài khoản
      </Title>

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
              placeholder="Tìm theo email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240, borderRadius: 8 }}
              allowClear
            />

            <Select
              allowClear
              placeholder="Vai trò"
              style={{ width: 160 }}
              value={roleFilter || undefined}
              onChange={(val) => setRoleFilter(val || null)}
            >
              <Option value="Admin">Quản trị viên</Option>
              <Option value="Client">Khách hàng</Option>
              <Option value="Driver">Tài xế</Option>
            </Select>

            <Select
              allowClear
              placeholder="Trạng thái"
              style={{ width: 160 }}
              value={statusFilter || undefined}
              onChange={(val) => setStatusFilter(val || null)}
            >
              <Option value="Active">Đang hoạt động</Option>
              <Option value="Locked">Đang khóa</Option>
            </Select>
          </Flex>

          <Button
            icon={<ReloadOutlined spin={refreshing} />}
            onClick={handleRefresh}
            loading={refreshing}
            style={{
              borderRadius: 8,
              padding: "0 20px",
              background: "#4d940e",
              borderColor: "#4d940e",
              color: "#fff",
              fontWeight: 500,
              transition: "all 0.3s ease",
              height: 40,
            }}
          >
            Làm mới danh sách
          </Button>
        </Flex>
      </Card>

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
