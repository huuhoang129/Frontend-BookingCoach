//src/pages/adminPages/vehicleManage/vehiclePage.tsx
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
  CarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useVehicles } from "../../../hooks/vehicleHooks/useVehicles";
import type { Vehicle } from "../../../hooks/vehicleHooks/useVehicles";
import VehicleModal from "../../../containers/ModalsCollect/VehicleModal/VehicleModal";

const { Title } = Typography;
const { Option } = Select;

export default function VehiclePage() {
  // Hooks
  const {
    vehicles,
    loading,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    editingVehicle,
    setEditingVehicle,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    contextHolder,
  } = useVehicles();

  // state
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // lọc dữ liệu
  const filteredData = vehicles.filter((v) => {
    let match = true;
    if (
      searchText &&
      !(
        v.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (v.licensePlate || "").toLowerCase().includes(searchText.toLowerCase())
      )
    )
      match = false;
    if (filterType && v.type !== filterType) match = false;
    return match;
  });

  // Maping màu
  const typeColors: Record<string, string> = {
    NORMAL: "blue",
    SLEEPER: "orange",
    DOUBLESLEEPER: "purple",
    LIMOUSINE: "green",
  };
  const typeIcons: Record<string, string> = {
    NORMAL: "🚍",
    SLEEPER: "🚌",
    DOUBLESLEEPER: "🛏️",
    LIMOUSINE: "🚐",
  };

  // cấu hình bảng
  const columns: ColumnsType<Vehicle> = [
    {
      title: "Tên xe",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <span style={{ fontWeight: 600 }}>
          {typeIcons[record.type] || "🚗"} {record.name}
        </span>
      ),
    },
    { title: "Biển số", dataIndex: "licensePlate", key: "licensePlate" },
    {
      title: "Loại xe",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const typeLabels: Record<string, string> = {
          NORMAL: "Xe Thường",
          SLEEPER: "Xe Giường Nằm",
          DOUBLESLEEPER: "Xe Giường Nằm Đôi",
          LIMOUSINE: "Xe Limousine",
        };
        return <Tag color={typeColors[type]}>{typeLabels[type]}</Tag>;
      },
    },
    {
      title: "Tầng",
      dataIndex: "numberFloors",
      key: "numberFloors",
      width: 90,
    },
    {
      title: "Số ghế",
      dataIndex: "seatCount",
      key: "seatCount",
      width: 90,
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
                setEditingVehicle(record);
                editForm.setFieldsValue(record);
                setIsEditModal(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc muốn xoá xe "${record.name}" không?`}
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

      {/* breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <CarOutlined /> Quản lý xe
        </Breadcrumb.Item>
      </Breadcrumb>

      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Title level={3} style={{ fontWeight: 700, margin: 0 }}>
          Quản lý Xe
        </Title>
      </Flex>

      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          {/* Bộ lọc bên trái */}
          <Flex gap={16} wrap="wrap">
            <Input
              placeholder="🔍 Tìm theo tên hoặc biển số..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
            />
            <Select
              allowClear
              placeholder="Loại xe"
              style={{ width: 180 }}
              value={filterType || undefined}
              onChange={(val) => setFilterType(val || null)}
            >
              <Option value="NORMAL">Xe Thường</Option>
              <Option value="SLEEPER">Xe Giường Nằm</Option>
              <Option value="DOUBLESLEEPER">Xe Giường Nằm Đôi</Option>
              <Option value="LIMOUSINE">Xe Limousine</Option>
            </Select>
          </Flex>

          {/* Nút hành động bên phải */}
          <Flex gap={12} align="center">
            {selectedRowKeys.length > 0 ? (
              <Popconfirm
                title="Xác nhận xoá"
                description="Bạn có chắc muốn xoá các xe đã chọn không?"
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
                Thêm xe
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
      <VehicleModal
        openAdd={isAddModal}
        setOpenAdd={setIsAddModal}
        openEdit={isEditModal}
        setOpenEdit={setIsEditModal}
        formAdd={form}
        formEdit={editForm}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        editingVehicle={editingVehicle}
      />
    </div>
  );
}
