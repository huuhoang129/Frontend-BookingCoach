//src/containers/ModalsCollect/VehicleModal/DriverScheduleModal.tsx
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import type {
  DriverSchedule,
  Driver,
  CoachTrip,
} from "../../../hooks/vehicleHooks/useDriverSchedules";
import dayjs from "dayjs";

const { Option } = Select;

interface Props {
  openAdd: boolean;
  setOpenAdd: (v: boolean) => void;
  openEdit: boolean;
  setOpenEdit: (v: boolean) => void;
  formAdd: any;
  formEdit: any;
  handleAdd: () => void;
  handleEdit: () => void;
  editingSchedule: DriverSchedule | null;
  drivers: Driver[];
  trips: CoachTrip[];
  schedules: DriverSchedule[];
}

export default function DriverScheduleModal({
  openAdd,
  setOpenAdd,
  openEdit,
  setOpenEdit,
  formAdd,
  formEdit,
  handleAdd,
  handleEdit,
  drivers,
  trips,
  schedules,
}: Props) {
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);

  // Reset form
  useEffect(() => {
    if (!openAdd) {
      formAdd.resetFields();
      setSelectedTripId(null);
    }
  }, [openAdd]);

  // Danh sách tài xế rảnh phù hợp với chuyến được chọn
  const availableDrivers = (() => {
    if (!selectedTripId) return drivers;

    const trip = trips.find((t) => t.id === selectedTripId);
    if (!trip) return drivers;

    const start = dayjs(
      `${trip.startDate} ${trip.startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const end = start.add(trip.totalTime ?? 0, "hour");

    return drivers.filter((driver) => {
      const conflict = schedules.some((s) => {
        if (s.userId !== driver.id || !s.trip) return false;
        if (s.trip.startDate !== trip.startDate) return false;

        const existingStart = dayjs(
          `${s.trip.startDate} ${s.trip.startTime}`,
          "YYYY-MM-DD HH:mm"
        );
        const existingEnd = existingStart.add(
          (s.trip as CoachTrip).totalTime ?? 0,
          "hour"
        );

        // Kiểm tra trùng giờ
        return existingStart.isBefore(end) && existingEnd.isAfter(start);
      });

      return !conflict;
    });
  })();

  // Chuyến chưa có tài xế nào được phân công
  const unassignedTrips = trips.filter(
    (trip) => !schedules.some((s) => s.coachTripId === trip.id)
  );

  return (
    <Modal
      title={openEdit ? "Chỉnh sửa lịch làm việc" : "Thêm lịch làm việc"}
      open={openAdd || openEdit}
      onCancel={() => {
        if (openAdd) setOpenAdd(false);
        if (openEdit) setOpenEdit(false);
      }}
      centered
      width={480}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            if (openAdd) setOpenAdd(false);
            if (openEdit) setOpenEdit(false);
          }}
        >
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={openEdit ? handleEdit : handleAdd}
          style={{ background: "#4d940e", borderColor: "#4d940e" }}
        >
          {openEdit ? "Cập nhật" : "Lưu"}
        </Button>,
      ]}
    >
      <Form form={openEdit ? formEdit : formAdd} layout="vertical">
        {/* Chọn chuyến xe */}
        <Form.Item
          name="coachTripId"
          label="Chuyến xe"
          rules={[{ required: true, message: "Chọn chuyến xe" }]}
        >
          <Select
            placeholder="Chọn chuyến xe (chỉ hiển thị chuyến chưa phân công tài xế)"
            onChange={(val) => setSelectedTripId(val)}
            disabled={openEdit}
          >
            {unassignedTrips.map((t) => (
              <Option key={t.id} value={t.id}>
                {t.route
                  ? `${t.route.fromLocation?.nameLocations || "?"} → ${
                      t.route.toLocation?.nameLocations || "?"
                    }`
                  : `Chuyến ${t.id}`}{" "}
                - {t.startDate} {t.startTime}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Chọn tài xế */}
        <Form.Item
          name="userId"
          label="Tài xế"
          rules={[{ required: true, message: "Chọn tài xế" }]}
        >
          <Select
            placeholder={
              selectedTripId
                ? "Chọn tài xế (lọc theo lịch rảnh)"
                : "Chọn chuyến xe trước"
            }
            disabled={!selectedTripId}
          >
            {availableDrivers.map((d) => (
              <Option key={d.id} value={d.id}>
                {`${d.firstName} ${d.lastName}`}{" "}
                {d.phoneNumber && `(${d.phoneNumber})`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Ghi chú */}
        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={2} placeholder="Nhập ghi chú (nếu có)" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
