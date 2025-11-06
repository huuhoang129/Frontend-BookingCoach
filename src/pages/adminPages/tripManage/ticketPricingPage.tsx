// src/pages/adminPages/tripManage/ticketPricingPage.tsx
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
  Select,
  Popconfirm,
  Tag,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useTripPrices } from "../../../hooks/routerListHooks/useTripPrices";
import TripPriceModal from "../../../containers/ModalsCollect/RouteListModal/TripPriceModal";

const { Title } = Typography;
const { Option } = Select;

export default function TripPricePage() {
  // hook dữ liệu và modal
  const {
    tripPrices,
    routes,
    loading,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    editingTripPrice,
    setEditingTripPrice,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    contextHolder,
  } = useTripPrices();

  // state filter, search
  const [searchText, setSearchText] = useState("");
  const [filterSeatType, setFilterSeatType] = useState<string | null>(null);
  const [filterTypeTrip, setFilterTypeTrip] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // state chọn nhiều dòng

  // lọc dữ liệu hiển thị
  const filteredData = tripPrices.filter((p) => {
    let match = true;

    if (
      searchText &&
      !(
        p.route?.fromLocation?.nameLocations
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        p.route?.toLocation?.nameLocations
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    )
      match = false;

    if (filterSeatType && p.seatType !== filterSeatType) match = false;
    if (filterTypeTrip && p.typeTrip !== filterTypeTrip) match = false;

    return match;
  });

  // label và màu hiển thị
  const seatTypeColors: Record<string, string> = {
    NORMAL: "blue",
    SLEEPER: "orange",
    DOUBLESLEEPER: "purple",
    LIMOUSINE: "green",
  };
  const seatTypeLabels: Record<string, string> = {
    NORMAL: "Ghế ngồi",
    SLEEPER: "Giường nằm",
    DOUBLESLEEPER: "Giường đôi",
    LIMOUSINE: "Limousine",
  };
  const typeTripColors: Record<string, string> = {
    NORMAL: "default",
    HOLIDAY: "red",
  };
  const typeTripLabels: Record<string, string> = {
    NORMAL: "Ngày thường",
    HOLIDAY: "Ngày lễ",
  };

  // danh sách cột
  const columns: ColumnsType<any> = [
    {
      title: "Tuyến",
      key: "route",
      render: (_, record) =>
        record.route ? (
          <span style={{ fontWeight: 600 }}>
            {record.route.fromLocation?.nameLocations} →{" "}
            {record.route.toLocation?.nameLocations}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Loại ghế",
      dataIndex: "seatType",
      render: (t) => <Tag color={seatTypeColors[t]}>{seatTypeLabels[t]}</Tag>,
      width: 150,
    },
    {
      title: "Loại chuyến",
      dataIndex: "typeTrip",
      render: (t) => <Tag color={typeTripColors[t]}>{typeTripLabels[t]}</Tag>,
      width: 150,
    },
    {
      title: "Giá vé",
      dataIndex: "priceTrip",
      render: (val) => (
        <span style={{ fontWeight: 600, color: "#4d940e" }}>
          {new Intl.NumberFormat("vi-VN").format(val)} đ
        </span>
      ),
      width: 150,
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
                setEditingTripPrice(record);
                editForm.setFieldsValue({
                  coachRouteId: record.coachRouteId,
                  seatType: record.seatType,
                  priceTrip: record.priceTrip,
                  typeTrip: record.typeTrip,
                });
                setIsEditModal(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc muốn xoá giá vé cho tuyến ${
              record.route
                ? `${record.route.fromLocation?.nameLocations} → ${record.route.toLocation?.nameLocations}`
                : "này"
            } không?`}
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

  // checkbox chọn dòng
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedKeys);
    },
  };

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {contextHolder}

      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <DollarOutlined /> Giá vé
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* title */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Title level={3} style={{ fontWeight: 700, margin: 0 }}>
          Quản lý Giá vé
        </Title>
      </Flex>

      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          {/* Bộ lọc bên trái */}
          <Flex gap={16} wrap="wrap">
            <Input
              placeholder="🔍 Tìm theo điểm đi/điểm đến..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280 }}
            />
            <Select
              allowClear
              placeholder="Loại ghế"
              style={{ width: 180 }}
              value={filterSeatType || undefined}
              onChange={(val) => setFilterSeatType(val || null)}
            >
              <Option value="NORMAL">Ghế ngồi</Option>
              <Option value="SLEEPER">Giường nằm</Option>
              <Option value="DOUBLESLEEPER">Giường đôi</Option>
              <Option value="LIMOUSINE">Limousine</Option>
            </Select>
            <Select
              allowClear
              placeholder="Loại chuyến"
              style={{ width: 180 }}
              value={filterTypeTrip || undefined}
              onChange={(val) => setFilterTypeTrip(val || null)}
            >
              <Option value="NORMAL">Ngày thường</Option>
              <Option value="HOLIDAY">Ngày lễ</Option>
            </Select>
          </Flex>

          {/* Nút hành động bên phải */}
          <Flex gap={12} align="center">
            {selectedRowKeys.length > 0 ? (
              <Popconfirm
                title="Xác nhận xoá"
                description="Bạn có chắc muốn xoá các giá vé đã chọn không?"
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
                Thêm giá vé
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

      {/* modal thêmsửa */}
      <TripPriceModal
        openAdd={isAddModal}
        setOpenAdd={setIsAddModal}
        openEdit={isEditModal}
        setOpenEdit={setIsEditModal}
        formAdd={form}
        formEdit={editForm}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        routes={routes}
        editingTripPrice={editingTripPrice}
      />
    </div>
  );
}
