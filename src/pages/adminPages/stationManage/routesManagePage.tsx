//src/pages/adminPages/stationManage/routesManagePage.tsx
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
  Tag,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useRouteManage } from "../../../hooks/stationHooks/useRouteManage";
import type { Route } from "../../../hooks/stationHooks/useRouteManage";
import RouteModal from "../../../containers/ModalsCollect/StationModal/RouteModal";

const { Title } = Typography;
const { Option } = Select;

export default function RoutePage() {
  // hooks
  const rm = useRouteManage();

  // state checkbox
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  //  cột bảng
  const columns: ColumnsType<Route & { index: number }> = [
    {
      title: "Điểm đi",
      key: "fromLocation",
      width: 240,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 18, color: "#4d940e" }}>🚏</span>
          <div>
            <div style={{ fontWeight: 600 }}>
              {record.fromLocation?.nameLocations}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              {record.fromLocation?.province?.nameProvince}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Điểm đến",
      key: "toLocation",
      width: 240,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 18, color: "#ff7a00" }}>🎯</span>
          <div>
            <div style={{ fontWeight: 600 }}>
              {record.toLocation?.nameLocations}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              {record.toLocation?.province?.nameProvince}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tuyến",
      key: "route",
      width: 280,
      render: (_, record) => (
        <Tag color="blue" style={{ fontSize: 14, padding: "6px 10px" }}>
          {record.fromLocation?.nameLocations} →{" "}
          {record.toLocation?.nameLocations}
        </Tag>
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "imageRouteCoach",
      width: 150,
      render: (img) =>
        img ? (
          <img
            src={
              img.startsWith("data:image")
                ? img
                : `data:image/png;base64,${img}`
            }
            alt="route"
            style={{
              width: 100,
              borderRadius: 6,
              display: "block",
              margin: "0 auto",
            }}
          />
        ) : (
          "—"
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: "none", color: "#4d940e" }}
              onClick={() => {
                rm.setEditingRoute(record);
                rm.editForm.setFieldsValue({
                  fromLocationId: record.fromLocation?.id,
                  toLocationId: record.toLocation?.id,
                  imageRouteCoach: record.imageRouteCoach
                    ? [
                        {
                          uid: String(record.id),
                          name: "route-image.png",
                          status: "done",
                          url: record.imageRouteCoach.startsWith("data:image")
                            ? record.imageRouteCoach
                            : `data:image/png;base64,${record.imageRouteCoach}`,
                        },
                      ]
                    : [],
                });
                rm.setIsEditModal(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc chắn muốn xoá tuyến từ "${record.fromLocation?.nameLocations}" đến "${record.toLocation?.nameLocations}" không?`}
            okText="Xoá"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => rm.handleDeleteRoute(record.id)}
          >
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              danger
              style={{ border: "none" }}
            />
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
      {rm.contextHolder}

      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NodeIndexOutlined /> Quản lý tuyến đường
        </Breadcrumb.Item>
      </Breadcrumb>

      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Title level={3} style={{ fontWeight: 700, margin: 0 }}>
          Quản lý tuyến đường
        </Title>
      </Flex>

      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          {/* Bộ lọc bên trái */}
          <Flex gap={16} wrap="wrap">
            <Input
              placeholder="🔍 Tìm theo điểm đi / điểm đến..."
              prefix={<SearchOutlined />}
              value={rm.searchText}
              onChange={(e) => rm.setSearchText(e.target.value)}
              style={{ width: 280 }}
            />

            <Select
              allowClear
              placeholder="Chọn tỉnh"
              style={{ width: 200 }}
              value={rm.filterProvince || undefined}
              onChange={(val) => rm.setFilterProvince(val || null)}
            >
              {rm.locations
                .map((l) => l.province?.nameProvince)
                .filter((v, i, arr) => v && arr.indexOf(v) === i)
                .map((p) => (
                  <Option key={p} value={p}>
                    {p}
                  </Option>
                ))}
            </Select>
          </Flex>

          {/* Nút hành động bên phải */}
          <Flex gap={12} align="center">
            {selectedRowKeys.length > 0 ? (
              <Popconfirm
                title="Xác nhận xoá"
                description="Bạn có chắc muốn xoá các tuyến đã chọn không?"
                okText="Xoá"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                onConfirm={() => {
                  rm.handleBulkDelete(selectedRowKeys as number[]);
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
                onClick={() => rm.setIsAddModal(true)}
              >
                Thêm tuyến đường
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>

      <Card>
        <Table
          rowKey="id"
          loading={rm.loading}
          dataSource={rm.filteredData}
          columns={columns}
          pagination={{ pageSize: 8 }}
          rowSelection={rowSelection}
        />
      </Card>

      {/* modal thêm sửa*/}
      <RouteModal
        openAdd={rm.isAddModal}
        setOpenAdd={rm.setIsAddModal}
        openEdit={rm.isEditModal}
        setOpenEdit={rm.setIsEditModal}
        formAdd={rm.form}
        formEdit={rm.editForm}
        handleAdd={rm.handleAddRoute}
        handleEdit={rm.handleEditRoute}
        editingRoute={rm.editingRoute}
        locations={rm.locations}
      />
    </div>
  );
}
