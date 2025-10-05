import { useEffect, useState } from "react";
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
  message,
  Select,
  Tag,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  HomeOutlined,
  CarOutlined,
  ToolOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

interface Vehicle {
  id: number;
  name: string;
  licensePlate: string;
  type: string;
}

interface VehicleStatus {
  id: number;
  vehicleId: number;
  status: "GOOD" | "NEEDS_MAINTENANCE" | "IN_REPAIR";
  note: string;
  lastUpdated: string;
  vehicle: Vehicle;
}

export default function VehicleStatusPage() {
  const [data, setData] = useState<VehicleStatus[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<VehicleStatus | null>(null);
  const [form] = Form.useForm();

  /* =====================
     FETCH DATA
  ===================== */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/vehicle-status"
      );
      if (res.data.errCode === 0) setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/vehicles");
    if (res.data.errCode === 0) setVehicles(res.data.data);
  };

  useEffect(() => {
    fetchData();
    fetchVehicles();
  }, []);

  /* =====================
     SUBMIT FORM
  ===================== */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        vehicleId: values.vehicleId,
        status: values.status,
        note: values.note || null,
      };

      const res = await axios.post(
        "http://localhost:8080/api/v1/vehicle-status",
        payload
      );

      if (res.data.errCode === 0) {
        message.success("Cập nhật tình trạng xe thành công");
        fetchData();
        setIsModalOpen(false);
      } else message.error(res.data.errMessage);
    } catch {}
  };

  const handleDelete = async (vehicleId: number) => {
    const res = await axios.delete(
      `http://localhost:8080/api/v1/vehicle-status/${vehicleId}`
    );
    if (res.data.errCode === 0) {
      message.success("Xóa tình trạng xe thành công");
      fetchData();
    } else message.error(res.data.errMessage);
  };

  /* =====================
     FILTER
  ===================== */
  const filteredData = data.filter((v) => {
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

  /* =====================
     COLUMNS
  ===================== */
  const columns: ColumnsType<VehicleStatus> = [
    {
      title: "Xe",
      key: "vehicle",
      render: (_, r) =>
        r.vehicle
          ? `${r.vehicle.name} (${r.vehicle.licensePlate})`
          : "Không có dữ liệu",
    },
    {
      title: "Loại xe",
      render: (_, r) => r.vehicle?.type || "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => {
        let color = "";
        switch (s) {
          case "GOOD":
            color = "green";
            break;
          case "NEEDS_MAINTENANCE":
            color = "orange";
            break;
          case "IN_REPAIR":
            color = "red";
            break;
        }
        const labelMap: Record<string, string> = {
          GOOD: "Tốt",
          NEEDS_MAINTENANCE: "Cần bảo dưỡng",
          IN_REPAIR: "Đang sửa chữa",
        };
        return <Tag color={color}>{labelMap[s]}</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      ellipsis: true,
    },
    {
      title: "Cập nhật",
      dataIndex: "lastUpdated",
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : "—"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Tooltip title="Sửa tình trạng">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setEditing(r);
                setIsModalOpen(true);
                form.setFieldsValue({
                  vehicleId: r.vehicle?.id,
                  status: r.status,
                  note: r.note,
                });
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa tình trạng">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(r.vehicleId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  /* =====================
     JSX
  ===================== */
  return (
    <div style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <ToolOutlined /> <span>Tình trạng xe</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3} style={{ marginBottom: 20, fontWeight: 700 }}>
        Quản lý tình trạng xe
      </Title>

      <Card style={{ marginBottom: 20 }}>
        <Flex justify="space-between" align="center" gap={16} wrap="wrap">
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
              style={{ width: 200 }}
              value={filterStatus || undefined}
              onChange={(val) => setFilterStatus(val || null)}
            >
              <Option value="GOOD">Tốt</Option>
              <Option value="NEEDS_MAINTENANCE">Cần bảo dưỡng</Option>
              <Option value="IN_REPAIR">Đang sửa chữa</Option>
            </Select>
          </Flex>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setEditing(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Cập nhật tình trạng
          </Button>
        </Flex>
      </Card>

      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Modal Add/Edit */}
      <Modal
        title={editing ? "Sửa tình trạng xe" : "Cập nhật tình trạng xe"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="vehicleId"
            label="Xe"
            rules={[{ required: true, message: "Vui lòng chọn xe" }]}
          >
            <Select placeholder="Chọn xe">
              {vehicles.map((v) => (
                <Option key={v.id} value={v.id}>
                  {v.licensePlate} - {v.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="GOOD">Tốt</Option>
              <Option value="NEEDS_MAINTENANCE">Cần bảo dưỡng</Option>
              <Option value="IN_REPAIR">Đang sửa chữa</Option>
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Ghi chú thêm (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
