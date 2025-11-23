import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Button,
  message,
} from "antd";
import type { Vehicle } from "../../../hooks/routerListHooks/useTripList";

const { Option } = Select;

interface TripModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  isEdit: boolean;
  form: any;
  routes: any[];
  vehicles: Vehicle[];
  vehicleStatuses: any[];
  prices: any[];
}

export default function TripModal({
  open,
  onCancel,
  onSubmit,
  isEdit,
  form,
  routes,
  vehicles,
  vehicleStatuses,
  prices,
}: TripModalProps) {
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // reset & init form
  useEffect(() => {
    if (open && isEdit) {
      const r = form.getFieldValue("coachRouteId");
      const vId = form.getFieldValue("vehicleId");
      const v = vehicles.find((x) => x.id === vId) || null;
      setSelectedRoute(r || null);
      setSelectedVehicle(v);
    } else if (!open) {
      setSelectedRoute(null);
      setSelectedVehicle(null);
    }
  }, [open, isEdit, form, vehicles]);

  const getVehicleStatus = (vehicleId: number) => {
    const found = vehicleStatuses.find((v) => v.vehicleId === vehicleId);
    return found ? found.status : "UNKNOWN";
  };

  const handleVehicleSelect = (vehicleId: number) => {
    const status = getVehicleStatus(vehicleId);
    if (status === "NEEDS_MAINTENANCE") {
      message.warning(
        "Xe này đang cần bảo dưỡng, vui lòng kiểm tra trước khi tạo chuyến!"
      );
    }
  };

  return (
    <Modal
      title={isEdit ? "Chỉnh sửa chuyến xe" : "Thêm chuyến xe"}
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
        {/* Tuyến */}
        <Form.Item
          name="coachRouteId"
          label="Tuyến xe"
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

        {/* Xe */}
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

        {/* Ngày đi */}
        <Form.Item
          name="startDate"
          label="Ngày khởi hành"
          rules={[{ required: true, message: "Vui lòng chọn ngày đi" }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        {/* Giờ đi */}
        <Form.Item
          name="startTime"
          label="Giờ khởi hành"
          rules={[{ required: true, message: "Vui lòng chọn giờ đi" }]}
        >
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
        </Form.Item>

        {/* Thời gian */}
        <Form.Item
          name="totalTime"
          label="Thời gian hành trình"
          rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
        >
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
        </Form.Item>

        {/* Trạng thái */}
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          initialValue="OPEN"
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="OPEN">Còn vé</Option>
            <Option value="FULL">Đóng chuyến</Option>
            <Option value="CANCELLED">Đã hủy</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
