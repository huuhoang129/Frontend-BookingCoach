//src/pages/adminPages/vehicleManage/vehicleStatusPage.tsx
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
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useVehicleStatus } from "../../../hooks/vehicleHooks/useVehicleStatus";
import VehicleStatusModal from "../../../containers/ModalsCollect/VehicleModal/VehicleStatusModal";

const { Title } = Typography;
const { Option } = Select;

export default function VehicleStatusPage() {
  // Hooks
  const {
    vehicleStatuses,
    vehicles,
    loading,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    editingStatus,
    setEditingStatus,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    contextHolder,
  } = useVehicleStatus();

  // state
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // lọc dữ liệu
  const filteredData = vehicleStatuses.filter((v) => {
    let match = true;
    if (
      searchText &&
      !(
        v.vehicle?.name.toLowerCase().includes(searchText.toLowerCase()) ||
        v.vehicle?.licensePlate
          ?.toLowerCase()
          .includes(searchText.toLowerCase())
      )
    )
      match = false;
    if (filterStatus && v.status !== filterStatus) match = false;
    return match;
  });

  // map màu trạng thái
  const statusColors: Record<string, string> = {
    GOOD: "green",
    NEEDS_MAINTENANCE: "orange",
    IN_REPAIR: "red",
  };
  const statusLabels: Record<string, string> = {
    GOOD: "Tốt",
    NEEDS_MAINTENANCE: "Cần bảo dưỡng",
    IN_REPAIR: "Đang sửa chữa",
  };

  // cấu hình bảng
  const columns: ColumnsType<any> = [
    {
      title: "Xe",
      key: "vehicle",
      render: (_, record) => (
        <span style={{ fontWeight: 600 }}>
          {record.vehicle?.name} ({record.vehicle?.licensePlate})
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
      width: 160,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
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
                setEditingStatus(record);
                editForm.setFieldsValue({
                  vehicleId: record.vehicle?.id,
                  status: record.status,
                  note: record.note,
                });
                setIsEditModal(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc muốn xoá tình trạng xe "${record.vehicle?.name}" không?`}
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

  // checkbox
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
          <ToolOutlined /> Quản lý tình trạng xe
        </Breadcrumb.Item>
      </Breadcrumb>

      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Title level={3} style={{ fontWeight: 700, margin: 0 }}>
          Quản lý tình trạng xe
        </Title>
      </Flex>

      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          {/* Bộ lọc bên trái */}
          <Flex gap={16} wrap="wrap">
            <Input
              placeholder="🔍 Tìm xe, biển số..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
            />
            <Select
              allowClear
              placeholder="Trạng thái"
              style={{ width: 180 }}
              value={filterStatus || undefined}
              onChange={(val) => setFilterStatus(val || null)}
            >
              <Option value="GOOD">Tốt</Option>
              <Option value="NEEDS_MAINTENANCE">Cần bảo dưỡng</Option>
              <Option value="IN_REPAIR">Đang sửa chữa</Option>
            </Select>
          </Flex>

          {/* Nút hành động bên phải */}
          <Flex gap={12} align="center">
            {selectedRowKeys.length > 0 ? (
              <Popconfirm
                title="Xác nhận xoá"
                description="Bạn có chắc muốn xoá các tình trạng đã chọn không?"
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
                Cập nhật tình trạng
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>

      {/* bảng */}
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

      {/* modal thêm sửa */}
      <VehicleStatusModal
        openAdd={isAddModal}
        setOpenAdd={setIsAddModal}
        openEdit={isEditModal}
        setOpenEdit={setIsEditModal}
        formAdd={form}
        formEdit={editForm}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        editingStatus={editingStatus}
        vehicles={vehicles}
      />
    </div>
  );
}
