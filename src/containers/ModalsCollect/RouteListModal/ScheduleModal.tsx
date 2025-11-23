// src/containers/ModalsCollect/RouteListModal/ScheduleModal.tsx
import { useEffect } from "react";
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
  const getVehicleStatus = (vehicleId: number) => {
    const found = vehicleStatuses.find((v) => v.vehicleId === vehicleId);
    return found ? found.status : "UNKNOWN";
  };

  const handleVehicleSelect = (vehicleId: number) => {
    const status = getVehicleStatus(vehicleId);
    if (status === "NEEDS_MAINTENANCE") {
      message.warning("Xe cần bảo dưỡng, vui lòng kiểm tra!");
    }
  };

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (isEdit && editingSchedule) {
      const e = editingSchedule;
      form.setFieldsValue({
        coachRouteId: e.coachRouteId,
        vehicleId: e.vehicleId,
        tripPriceId: e.tripPriceId,
        startTime: e.startTime ? dayjs(e.startTime, "HH:mm:ss") : null,
        totalTime: e.totalTime ? dayjs(e.totalTime, "HH:mm:ss") : null,
        status: e.status,
      });
    }
  }, [open]);

  const currentRoute = form.getFieldValue("coachRouteId");
  const currentVehicleId = form.getFieldValue("vehicleId");
  const currentVehicle = vehicles.find((v) => v.id === currentVehicleId);

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
        <Form.Item
          name="coachRouteId"
          label="Tuyến"
          rules={[{ required: true, message: "Vui lòng chọn tuyến" }]}
        >
          <Select placeholder="Chọn tuyến" showSearch>
            {routes.map((r) => (
              <Option key={r.id} value={r.id}>
                {r.fromLocation?.nameLocations} → {r.toLocation?.nameLocations}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="vehicleId"
          label="Xe"
          rules={[{ required: true, message: "Vui lòng chọn xe" }]}
        >
          <Select
            placeholder="Chọn xe"
            showSearch
            onChange={(val) => handleVehicleSelect(val)}
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

        <Form.Item
          name="tripPriceId"
          label="Giá vé"
          rules={[{ required: true, message: "Vui lòng chọn giá vé" }]}
        >
          <Select>
            {prices
              .filter(
                (p) =>
                  currentRoute &&
                  currentVehicle &&
                  p.coachRouteId === currentRoute &&
                  p.seatType.toLowerCase() === currentVehicle.type.toLowerCase()
              )
              .map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.priceTrip.toLocaleString()} đ ({p.typeTrip})
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
        >
          <Select>
            <Option value="ACTIVE">Hoạt động</Option>
            <Option value="INACTIVE">Ngừng</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
