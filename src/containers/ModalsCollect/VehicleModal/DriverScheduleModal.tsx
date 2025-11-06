import { Modal, Form, Select, Input } from "antd";
const { Option } = Select;

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  form: any;
  drivers: any[];
  trips: any[];
  title: string;
}

export default function DriverScheduleModal({
  open,
  onCancel,
  onSubmit,
  form,
  drivers,
  trips,
  title,
}: Props) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      okText="Lưu"
      cancelText="Hủy"
      okButtonProps={{
        style: { background: "#4d940e", borderColor: "#4d940e" },
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="userId"
          label="Tài xế"
          rules={[{ required: true, message: "Chọn tài xế" }]}
        >
          <Select placeholder="Chọn tài xế">
            {drivers.map((d) => (
              <Option key={d.id} value={d.id}>
                {d.fullName || `${d.firstName} ${d.lastName}`} ({d.phoneNumber})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="coachTripId"
          label="Chuyến xe"
          rules={[{ required: true, message: "Chọn chuyến xe" }]}
        >
          <Select placeholder="Chọn chuyến xe">
            {trips.map((t) => (
              <Option key={t.id} value={t.id}>
                {t.route
                  ? `${t.route.fromLocation?.nameLocations} → ${t.route.toLocation?.nameLocations}`
                  : `Chuyến ${t.id}`}{" "}
                - {t.startDate} {t.startTime}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
