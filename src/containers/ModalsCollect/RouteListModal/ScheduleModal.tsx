import { Modal, Form, Select, TimePicker, Button } from "antd";
import type { FormInstance } from "antd";

interface ScheduleModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  isEdit: boolean;
  form: FormInstance;
  routes: any[];
  vehicles: any[];
  prices: any[];
}

const { Option } = Select;

export default function ScheduleModal({
  open,
  onCancel,
  onSubmit,
  isEdit,
  form,
  routes,
  vehicles,
  prices,
}: ScheduleModalProps) {
  return (
    <Modal
      title={isEdit ? "Chỉnh sửa lịch trình" : "Thêm lịch trình"}
      open={open}
      onCancel={onCancel}
      width={480}
      centered
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSubmit}
          style={{ background: "#4d940e", borderColor: "#4d940e" }}
        >
          {isEdit ? "Cập nhật" : "Lưu"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="coachRouteId"
          label="Tuyến"
          rules={[{ required: true, message: "Vui lòng chọn tuyến" }]}
        >
          <Select placeholder="Chọn tuyến">
            {routes.map((r) => (
              <Option key={r.id} value={r.id}>
                {r.fromLocation.nameLocations} → {r.toLocation.nameLocations}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="vehicleId"
          label="Xe"
          rules={[{ required: true, message: "Vui lòng chọn xe" }]}
        >
          <Select placeholder="Chọn xe">
            {vehicles.map((v) => (
              <Option key={v.id} value={v.id}>
                {v.licensePlate} ({v.name})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="tripPriceId"
          label="Giá vé"
          rules={[{ required: true, message: "Vui lòng chọn giá vé" }]}
        >
          <Select placeholder="Chọn giá vé">
            {prices.map((p) => (
              <Option key={p.id} value={p.id}>
                {p.priceTrip.toLocaleString()} đ
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="startTime"
          label="Giờ khởi hành"
          rules={[{ required: true, message: "Vui lòng chọn giờ khởi hành" }]}
        >
          <TimePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="totalTime"
          label="Thời gian hành trình"
          rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
        >
          <TimePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          initialValue="ACTIVE"
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="ACTIVE">Hoạt động</Option>
            <Option value="INACTIVE">Ngừng</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
