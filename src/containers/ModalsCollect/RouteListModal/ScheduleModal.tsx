import { useEffect, useState } from "react";
import { Modal, Form, Select, TimePicker, Button, message } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

interface Route {
  id: number;
  fromLocation: { nameLocations: string };
  toLocation: { nameLocations: string };
}

interface Vehicle {
  id: number;
  name: string;
  type: string;
  licensePlate: string;
}

interface TripPrice {
  id: number;
  seatType: string;
  priceTrip: number;
  typeTrip: string;
  coachRouteId: number;
}

interface VehicleStatus {
  vehicleId: number;
  status: "GOOD" | "NEEDS_MAINTENANCE" | "IN_REPAIR";
}

interface ScheduleModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  isEdit: boolean;
  form: any;
  routes: Route[];
  vehicles: Vehicle[];
  vehicleStatuses: VehicleStatus[];
  prices: TripPrice[];
  editingSchedule: any | null;
}

export default function ScheduleModal({
  open,
  onCancel,
  onSubmit,
  isEdit,
  form,
  routes,
  vehicles,
  vehicleStatuses,
  prices,
  editingSchedule,
}: ScheduleModalProps) {
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Lấy trạng thái xe
  const getVehicleStatus = (vehicleId: number) => {
    const found = vehicleStatuses.find((v) => v.vehicleId === vehicleId);
    return found ? found.status : "UNKNOWN";
  };

  // Khi chọn xe → hiển thị cảnh báo nếu cần bảo dưỡng
  const handleVehicleSelect = (vehicleId: number) => {
    const status = getVehicleStatus(vehicleId);
    if (status === "NEEDS_MAINTENANCE") {
      message.warning(
        "Xe này đang cần bảo dưỡng, vui lòng kiểm tra trước khi tạo lịch!"
      );
    }
  };

  // Reset & khởi tạo form
  useEffect(() => {
    if (open && isEdit && editingSchedule) {
      const routeId = editingSchedule.coachRouteId;
      const vehicleId = editingSchedule.vehicleId;
      const vehicleObj = vehicles.find((v) => v.id === vehicleId) || null;
      setSelectedRoute(routeId || null);
      setSelectedVehicle(vehicleObj);

      form.setFieldsValue({
        ...editingSchedule,
        startTime: editingSchedule.startTime
          ? dayjs(editingSchedule.startTime, "HH:mm:ss")
          : null,
        totalTime: editingSchedule.totalTime
          ? dayjs(editingSchedule.totalTime, "HH:mm:ss")
          : null,
      });
    } else if (!open) {
      form.resetFields();
      setSelectedRoute(null);
      setSelectedVehicle(null);
    }
  }, [open, isEdit, editingSchedule, form, vehicles]);

  return (
    <Modal
      title={isEdit ? "Chỉnh sửa lịch trình" : "Thêm lịch trình"}
      open={open}
      onCancel={onCancel}
      centered
      width={480}
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
        {/* Tuyến */}
        <Form.Item
          name="coachRouteId"
          label="Tuyến"
          rules={[{ required: true, message: "Vui lòng chọn tuyến" }]}
        >
          <Select
            placeholder="Chọn tuyến"
            onChange={(val) => setSelectedRoute(val)}
            showSearch
            optionFilterProp="children"
          >
            {routes.map((r) => (
              <Option key={r.id} value={r.id}>
                {r.fromLocation?.nameLocations} → {r.toLocation?.nameLocations}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Xe (có trạng thái như TripModal) */}
        <Form.Item
          name="vehicleId"
          label="Xe"
          rules={[{ required: true, message: "Vui lòng chọn xe" }]}
        >
          <Select
            placeholder="Chọn xe"
            onChange={(val) => {
              const found = vehicles.find((v) => v.id === val) || null;
              setSelectedVehicle(found);
              handleVehicleSelect(val);
            }}
            showSearch
            optionFilterProp="children"
          >
            {vehicles.map((v) => {
              const status = getVehicleStatus(v.id);
              let disabled = false;
              let label = `${v.licensePlate} - ${v.name}`;
              if (status === "IN_REPAIR") {
                disabled = true;
                label += " (Đang sửa)";
              } else if (status === "NEEDS_MAINTENANCE") {
                label += " ⚠️ (Cần bảo dưỡng)";
              }
              return (
                <Option key={v.id} value={v.id} disabled={disabled}>
                  {label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        {/* Giá vé */}
        <Form.Item
          name="tripPriceId"
          label="Giá vé"
          rules={[{ required: true, message: "Vui lòng chọn giá vé" }]}
        >
          <Select placeholder="Chọn giá vé">
            {prices
              .filter(
                (p) =>
                  selectedRoute &&
                  selectedVehicle &&
                  p.coachRouteId === selectedRoute &&
                  p.seatType?.toLowerCase() ===
                    selectedVehicle.type?.toLowerCase()
              )
              .map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.priceTrip.toLocaleString()} đ ({p.typeTrip})
                </Option>
              ))}
          </Select>
        </Form.Item>

        {/* Giờ khởi hành */}
        <Form.Item
          name="startTime"
          label="Giờ khởi hành"
          rules={[{ required: true, message: "Vui lòng chọn giờ khởi hành" }]}
        >
          <TimePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>

        {/* Thời gian hành trình */}
        <Form.Item
          name="totalTime"
          label="Thời gian hành trình"
          rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
        >
          <TimePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>

        {/* Trạng thái */}
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
