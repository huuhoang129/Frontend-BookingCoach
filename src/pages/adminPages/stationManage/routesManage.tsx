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
  Modal,
  Form,
  Select,
  Upload,
  Tag,
  Popconfirm,
  notification,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  NodeIndexOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useRouteManage } from "../../../hooks/stationHooks/useRouteManage";
import type { Route } from "../../../hooks/stationHooks/useRouteManage";

const { Title } = Typography;
const { Option } = Select;

export default function RoutePage() {
  const [api, contextHolder] = notification.useNotification();
  const rm = useRouteManage(api);

  // Theo dõi "Điểm đi" để lọc "Điểm đến" (Add)
  const fromLocationIdAdd = Form.useWatch("fromLocationId", rm.form);
  // Theo dõi "Điểm đi" để lọc "Điểm đến" (Edit)
  const fromLocationIdEdit = Form.useWatch("fromLocationId", rm.editForm);

  const columns: ColumnsType<Route & { index: number }> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 70,
      fixed: "left",
    },
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
          {record.fromLocation?.nameLocations} ➡️{" "}
          {record.toLocation?.nameLocations}
        </Tag>
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "imageRouteCoach",
      key: "imageRouteCoach",
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
      title: "Actions",
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

  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      {/* Cần render contextHolder để notification hoạt động */}
      {contextHolder}

      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="">
          <HomeOutlined /> <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NodeIndexOutlined /> <span>Route Management</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title
        level={3}
        style={{ marginBottom: 20, fontWeight: 700, color: "#111" }}
      >
        Quản lý tuyến đường
      </Title>

      <Card style={{ marginBottom: 20, borderRadius: 12 }}>
        <Flex justify="space-between" align="center" gap={16} wrap="wrap">
          <Flex gap={16} wrap="wrap">
            <Input
              placeholder="🔍 Tìm theo điểm đi/điểm đến..."
              prefix={<SearchOutlined />}
              value={rm.searchText}
              onChange={(e) => rm.setSearchText(e.target.value)}
              style={{ width: 280, borderRadius: 8 }}
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
            onClick={() => rm.setIsAddModal(true)}
          >
            Thêm tuyến đường
          </Button>
        </Flex>
      </Card>

      <Card style={{ borderRadius: 12 }}>
        <Table
          rowKey="id"
          loading={rm.loading}
          dataSource={rm.filteredData}
          columns={columns}
          pagination={{ pageSize: 8 }}
          bordered={false}
        />
      </Card>

      {/* Modal Add */}
      <Modal
        title="Thêm tuyến đường"
        open={rm.isAddModal}
        onCancel={() => rm.setIsAddModal(false)}
        onOk={rm.handleAddRoute}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={rm.form} layout="vertical">
          <Form.Item
            name="fromLocationId"
            label="Điểm đi"
            rules={[{ required: true }]}
          >
            <Select
              onChange={() => {
                rm.form.setFieldsValue({ toLocationId: undefined });
              }}
            >
              {rm.locations.map((l) => (
                <Option key={l.id} value={l.id}>
                  {l.nameLocations} ({l.province?.nameProvince})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="toLocationId"
            label="Điểm đến"
            rules={[{ required: true }]}
          >
            <Select>
              {rm.locations
                .filter((l) => {
                  if (!fromLocationIdAdd) return true;
                  const from = rm.locations.find(
                    (loc) => loc.id === fromLocationIdAdd
                  );
                  return from ? l.province.id !== from.province.id : true;
                })
                .map((l) => (
                  <Option key={l.id} value={l.id}>
                    {l.nameLocations} ({l.province?.nameProvince})
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="imageRouteCoach"
            label="Ảnh tuyến đường"
            valuePropName="fileList"
            rules={[
              { required: true, message: "Vui lòng chọn ảnh tuyến đường" },
            ]}
            getValueFromEvent={(e) =>
              Array.isArray(e) ? e : e?.fileList || []
            }
          >
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Edit */}
      <Modal
        title="Sửa tuyến đường"
        open={rm.isEditModal}
        onCancel={() => rm.setIsEditModal(false)}
        onOk={rm.handleEditRoute}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "#4d940e", borderColor: "#4d940e" },
        }}
      >
        <Form form={rm.editForm} layout="vertical">
          <Form.Item
            name="fromLocationId"
            label="Điểm đi"
            rules={[{ required: true }]}
          >
            <Select
              onChange={() => {
                rm.editForm.setFieldsValue({ toLocationId: undefined });
              }}
            >
              {rm.locations.map((l) => (
                <Option key={l.id} value={l.id}>
                  {l.nameLocations} ({l.province?.nameProvince})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="toLocationId"
            label="Điểm đến"
            rules={[{ required: true }]}
          >
            <Select>
              {rm.locations
                .filter((l) => {
                  if (!fromLocationIdEdit) return true;
                  const from = rm.locations.find(
                    (loc) => loc.id === fromLocationIdEdit
                  );
                  return from ? l.province.id !== from.province.id : true;
                })
                .map((l) => (
                  <Option key={l.id} value={l.id}>
                    {l.nameLocations} ({l.province?.nameProvince})
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="imageRouteCoach"
            label="Ảnh tuyến đường"
            valuePropName="fileList"
            rules={[
              { required: true, message: "Vui lòng chọn ảnh tuyến đường" },
            ]}
            getValueFromEvent={(e) =>
              Array.isArray(e) ? e : e?.fileList || []
            }
          >
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
