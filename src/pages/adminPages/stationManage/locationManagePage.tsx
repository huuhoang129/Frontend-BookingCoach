//src/pages/adminPages/stationManage/locationManagePage.tsx
import {
  Table,
  Input,
  Button,
  Space,
  Card,
  Flex,
  Typography,
  Tag,
  Tooltip,
  Breadcrumb,
  Select,
  Popconfirm,
  Tabs,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useLocationManage } from "../../../hooks/stationHooks/useLocationManage";
import type {
  Province,
  Location,
} from "../../../hooks/stationHooks/useLocationManage";
import ProvinceModal from "../../../containers/ModalsCollect/StationModal/ProvinceModal";
import LocationModal from "../../../containers/ModalsCollect/StationModal/LocationModal";

const { Title } = Typography;
const { Option } = Select;

export default function LocationManage() {
  const lm = useLocationManage();
  const [selectedProvinceKeys, setSelectedProvinceKeys] = useState<React.Key[]>(
    []
  );
  const [selectedLocationKeys, setSelectedLocationKeys] = useState<React.Key[]>(
    []
  );

  // cột
  const provinceColumns: ColumnsType<Province & { index: number }> = [
    {
      title: "Tên tỉnh",
      dataIndex: "nameProvince",
      key: "nameProvince",
      width: 250,
    },
    {
      title: "Mã tỉnh",
      dataIndex: "valueProvince",
      key: "valueProvince",
      width: 120,
      align: "center",
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
                lm.setEditingProvince(record);
                lm.provinceEditForm.setFieldsValue(record);
                lm.setIsEditProvince(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc chắn muốn xoá tỉnh "${record.nameProvince}" không?`}
            okText="Xoá"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => lm.handleDeleteProvince(record.id)}
          >
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              style={{ border: "none" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const locationColumns: ColumnsType<Location & { index: number }> = [
    {
      title: "Tên địa điểm",
      dataIndex: "nameLocations",
      key: "nameLocations",
      width: 250,
      render: (text) => (
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-block",
            maxWidth: 230,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 140,
      render: (t) => (
        <Tag color={t === "STATION" ? "green" : "orange"}>
          {t === "STATION" ? "Bến xe" : "Điểm dừng"}
        </Tag>
      ),
    },
    {
      title: "Thuộc tỉnh",
      dataIndex: ["province", "nameProvince"],
      key: "province",
      width: 200,
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
                lm.setEditingLocation(record);
                lm.locationEditForm.setFieldsValue({
                  nameLocations: record.nameLocations,
                  provinceId: record.provinceId,
                  type: record.type,
                });
                lm.setIsEditLocation(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc chắn muốn xoá địa điểm "${record.nameLocations}" không?`}
            okText="Xoá"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => lm.handleDeleteLocation(record.id)}
          >
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              style={{ border: "none" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const provinceSelection = {
    selectedRowKeys: selectedProvinceKeys,
    onChange: (keys: React.Key[]) => setSelectedProvinceKeys(keys),
  };

  const locationSelection = {
    selectedRowKeys: selectedLocationKeys,
    onChange: (keys: React.Key[]) => setSelectedLocationKeys(keys),
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            itemSelectedColor: "#4d940e",
            inkBarColor: "#4d940e",
            itemHoverColor: "#4d940e",
          },
        },
      }}
    >
      <div
        style={{
          padding: 24,
          background: "#f4f6f9",
          minHeight: "100vh",
          fontFamily: "Lexend, sans-serif",
        }}
      >
        {lm.contextHolder}
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            <HomeOutlined /> Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <EnvironmentOutlined /> Quản lý Tỉnh / Địa điểm
          </Breadcrumb.Item>
        </Breadcrumb>

        <Title level={3} style={{ marginBottom: 20, fontWeight: 700 }}>
          Quản lý Tỉnh / Địa điểm
        </Title>

        <Tabs defaultActiveKey="provinces">
          {/* Tab tỉnh */}
          <Tabs.TabPane tab="Tỉnh / Thành phố" key="provinces">
            <Card
              style={{
                marginBottom: 20,
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
                <Input
                  placeholder="🔍 Tìm tỉnh..."
                  prefix={<SearchOutlined />}
                  value={lm.searchProvince}
                  onChange={(e) => lm.setSearchProvince(e.target.value)}
                  style={{ width: 260, borderRadius: 8 }}
                />

                {selectedProvinceKeys.length > 0 ? (
                  <Popconfirm
                    title="Xác nhận xoá"
                    description="Bạn có chắc muốn xoá các tỉnh đã chọn không?"
                    okText="Xoá"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => {
                      lm.handleBulkDeleteProvince(
                        selectedProvinceKeys as number[]
                      );
                      setSelectedProvinceKeys([]);
                    }}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      style={{
                        height: 38,
                        borderRadius: 8,
                        padding: "0 20px",
                        fontWeight: 500,
                      }}
                    >
                      Xoá các tỉnh đã chọn
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    style={{
                      height: 38,
                      borderRadius: 8,
                      padding: "0 20px",
                      background: "#4d940e",
                      borderColor: "#4d940e",
                      color: "#fff",
                      fontWeight: 500,
                    }}
                    onClick={() => lm.setIsAddProvince(true)}
                  >
                    Thêm tỉnh
                  </Button>
                )}
              </Flex>
            </Card>
            <Card style={{ borderRadius: 10 }}>
              <Table
                rowKey="id"
                loading={lm.loadingProvinces}
                dataSource={lm.filteredProvinces}
                columns={provinceColumns}
                pagination={{ pageSize: 8 }}
                rowSelection={provinceSelection}
              />
            </Card>
          </Tabs.TabPane>

          {/* Tab địa điểm*/}
          <Tabs.TabPane tab="Địa điểm" key="locations">
            <Card
              style={{
                marginBottom: 20,
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
                <Flex gap={16} wrap="wrap">
                  <Input
                    placeholder="🔍 Tìm địa điểm..."
                    prefix={<SearchOutlined />}
                    value={lm.searchLocation}
                    onChange={(e) => lm.setSearchLocation(e.target.value)}
                    style={{ width: 260, borderRadius: 8 }}
                  />

                  <Select
                    allowClear
                    placeholder="Chọn tỉnh"
                    style={{ width: 200 }}
                    value={lm.filterProvince || undefined}
                    onChange={(val) => lm.setFilterProvince(val || null)}
                  >
                    {lm.provinces.map((p) => (
                      <Option key={p.id} value={p.id.toString()}>
                        {p.nameProvince}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    allowClear
                    placeholder="Loại địa điểm"
                    style={{ width: 180 }}
                    value={lm.filterType || undefined}
                    onChange={(val) => lm.setFilterType(val || null)}
                  >
                    <Option value="STATION">Bến xe</Option>
                    <Option value="STOP_POINT">Điểm dừng</Option>
                  </Select>
                </Flex>

                {selectedLocationKeys.length > 0 ? (
                  <Popconfirm
                    title="Xác nhận xoá"
                    description="Bạn có chắc muốn xoá các địa điểm đã chọn không?"
                    okText="Xoá"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => {
                      lm.handleBulkDeleteLocation(
                        selectedLocationKeys as number[]
                      );
                      setSelectedLocationKeys([]);
                    }}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      style={{
                        height: 38,
                        borderRadius: 8,
                        padding: "0 20px",
                        fontWeight: 500,
                      }}
                    >
                      Xoá các địa điểm đã chọn
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    style={{
                      height: 38,
                      borderRadius: 8,
                      padding: "0 20px",
                      background: "#4d940e",
                      borderColor: "#4d940e",
                      color: "#fff",
                      fontWeight: 500,
                    }}
                    onClick={() => lm.setIsAddLocation(true)}
                  >
                    Thêm địa điểm
                  </Button>
                )}
              </Flex>
            </Card>

            <Card style={{ borderRadius: 10 }}>
              <Table
                rowKey="id"
                loading={lm.loadingLocations}
                dataSource={lm.filteredLocations}
                columns={locationColumns}
                pagination={{ pageSize: 8 }}
                rowSelection={locationSelection}
              />
            </Card>
          </Tabs.TabPane>
        </Tabs>

        {/* modal */}
        <ProvinceModal
          openAdd={lm.isAddProvince}
          setOpenAdd={lm.setIsAddProvince}
          openEdit={lm.isEditProvince}
          setOpenEdit={lm.setIsEditProvince}
          formAdd={lm.provinceForm}
          formEdit={lm.provinceEditForm}
          handleAdd={lm.handleAddProvince}
          handleEdit={lm.handleEditProvince}
          editingProvince={lm.editingProvince}
        />

        <LocationModal
          openAdd={lm.isAddLocation}
          setOpenAdd={lm.setIsAddLocation}
          openEdit={lm.isEditLocation}
          setOpenEdit={lm.setIsEditLocation}
          formAdd={lm.locationForm}
          formEdit={lm.locationEditForm}
          handleAdd={lm.handleAddLocation}
          handleEdit={lm.handleEditLocation}
          editingLocation={lm.editingLocation}
          provinces={lm.provinces}
        />
      </div>
    </ConfigProvider>
  );
}
