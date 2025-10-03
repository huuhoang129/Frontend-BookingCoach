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
  Modal,
  Form,
  Select,
  Popconfirm,
  Tabs,
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
import { useLocationManage } from "../../../hooks/stationHooks/useLocationManage.ts";
import type { Province } from "../../../hooks/stationHooks/useLocationManage.ts";
import type { Location } from "../../../hooks/stationHooks/useLocationManage.ts";

const { Title } = Typography;
const { Option } = Select;

export default function LocationManage() {
  const lm = useLocationManage();

  // columns province
  const provinceColumns: ColumnsType<Province & { index: number }> = [
    { title: "STT", dataIndex: "index", key: "index", width: 80 },
    { title: "Tên tỉnh", dataIndex: "nameProvince", key: "nameProvince" },
    {
      title: "Mã tỉnh",
      dataIndex: "valueProvince",
      key: "valueProvince",
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              size="small"
              shape="circle"
              icon={<EditOutlined />}
              style={{ color: "#4d940e" }}
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
              type="text"
              size="small"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // columns location
  const locationColumns: ColumnsType<Location & { index: number }> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 80,
      fixed: "left",
    },
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
      width: 150,
      render: (t) => {
        let color = t === "station" ? "green" : "orange";
        let label = t === "station" ? "Bến xe" : "Điểm dừng";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Thuộc tỉnh",
      dataIndex: ["province", "nameProvince"],
      key: "province",
      width: 200,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              shape="circle"
              icon={<EditOutlined />}
              style={{ color: "#4d940e" }}
              onClick={() => {
                lm.setEditingLocation(record);
                lm.locationEditForm.setFieldsValue({
                  ...record,
                  provinceId: record.provinceId,
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
              type="text"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="">
          <HomeOutlined /> <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <EnvironmentOutlined /> <span>Provinces & Locations</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title
        level={3}
        style={{ marginBottom: 20, fontWeight: 700, color: "#111" }}
      >
        Quản lý Tỉnh / Địa điểm
      </Title>

      <Tabs defaultActiveKey="provinces">
        {/* Provinces */}
        <Tabs.TabPane tab="Tỉnh / Thành phố" key="provinces">
          <Card style={{ marginBottom: 20, borderRadius: 12 }}>
            <Flex justify="space-between" align="center" gap={16} wrap="wrap">
              <Input
                placeholder="🔍 Tìm tỉnh..."
                prefix={<SearchOutlined />}
                value={lm.searchProvince}
                onChange={(e) => lm.setSearchProvince(e.target.value)}
                style={{ width: 240, borderRadius: 8 }}
              />
              <Button
                icon={<PlusOutlined />}
                style={{
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
            </Flex>
          </Card>

          <Card style={{ borderRadius: 12 }}>
            <Table
              rowKey="id"
              loading={lm.loadingProvinces}
              dataSource={lm.filteredProvinces}
              columns={provinceColumns}
              pagination={{ pageSize: 8 }}
              bordered={false}
            />
          </Card>
        </Tabs.TabPane>

        {/* Locations */}
        <Tabs.TabPane tab="Địa điểm" key="locations">
          <Card style={{ marginBottom: 20, borderRadius: 12 }}>
            <Flex justify="space-between" align="center" gap={16} wrap="wrap">
              <Flex gap={16} wrap="wrap">
                <Input
                  placeholder="🔍 Tìm địa điểm..."
                  prefix={<SearchOutlined />}
                  value={lm.searchLocation}
                  onChange={(e) => lm.setSearchLocation(e.target.value)}
                  style={{ width: 240, borderRadius: 8 }}
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
                  style={{ width: 160 }}
                  value={lm.filterType || undefined}
                  onChange={(val) => lm.setFilterType(val || null)}
                >
                  <Option value="station">Bến xe</Option>
                  <Option value="stopPoint">Điểm dừng</Option>
                </Select>
              </Flex>

              <Button
                icon={<PlusOutlined />}
                style={{
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
            </Flex>
          </Card>

          <Card style={{ borderRadius: 12 }}>
            <Table
              rowKey="id"
              loading={lm.loadingLocations}
              dataSource={lm.filteredLocations}
              columns={locationColumns}
              pagination={{ pageSize: 8 }}
              bordered={false}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      {/* Modal Province Add */}
      <Modal
        title="Thêm tỉnh mới"
        open={lm.isAddProvince}
        onCancel={() => lm.setIsAddProvince(false)}
        onOk={lm.handleAddProvince}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={lm.provinceForm} layout="vertical">
          <Form.Item
            name="nameProvince"
            label="Tên tỉnh"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Province Edit */}
      <Modal
        title="Sửa tỉnh"
        open={lm.isEditProvince}
        onCancel={() => lm.setIsEditProvince(false)}
        onOk={lm.handleEditProvince}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={lm.provinceEditForm} layout="vertical">
          <Form.Item
            name="nameProvince"
            label="Tên tỉnh"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Location Add */}
      <Modal
        title="Thêm địa điểm mới"
        open={lm.isAddLocation}
        onCancel={() => lm.setIsAddLocation(false)}
        onOk={lm.handleAddLocation}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={lm.locationForm} layout="vertical">
          <Form.Item
            name="nameLocations"
            label="Tên địa điểm"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="provinceId"
            label="Thuộc tỉnh"
            rules={[{ required: true }]}
          >
            <Select>
              {lm.provinces.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.nameProvince}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Loại" initialValue="station">
            <Select>
              <Option value="station">Bến xe</Option>
              <Option value="stopPoint">Điểm dừng</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Location Edit */}
      <Modal
        title="Sửa địa điểm"
        open={lm.isEditLocation}
        onCancel={() => lm.setIsEditLocation(false)}
        onOk={lm.handleEditLocation}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={lm.locationEditForm} layout="vertical">
          <Form.Item
            name="nameLocations"
            label="Tên địa điểm"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="provinceId"
            label="Thuộc tỉnh"
            rules={[{ required: true }]}
          >
            <Select>
              {lm.provinces.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.nameProvince}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Loại">
            <Select>
              <Option value="station">Bến xe</Option>
              <Option value="stopPoint">Điểm dừng</Option>
              <Option value="office">Văn phòng</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
