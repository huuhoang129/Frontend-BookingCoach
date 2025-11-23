//hooks/useDriverSchedules.ts
import { useEffect, useState } from "react";
import { Form } from "antd";
import { AppNotification } from "../../components/Notification/AppNotification";
import {
  getAllDriverSchedules,
  createDriverSchedule,
  updateDriverSchedule,
  deleteDriverSchedule,
  getAllDrivers,
} from "../../services/vehicleServices/driverScheduleServices";
import { getAllTrips } from "../../services/routeListServices/tripListServices";

export interface DriverSchedule {
  id: number;
  userId: number;
  coachTripId: number;
  note?: string;
  driver?: {
    id: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    fullName?: string;
  };
  trip?: {
    id: number;
    startDate: string;
    startTime: string;
    route?: {
      nameRoute: string;
      fromLocation?: { id: number; nameLocations: string };
      toLocation?: { id: number; nameLocations: string };
    };
    vehicle?: { name: string; licensePlate: string };
  };
}

export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  fullName?: string;
}

export interface CoachTrip {
  id: number;
  startDate: string;
  startTime: string;
  totalTime: number;
  route?: {
    nameRoute: string;
    fromLocation?: { id: number; nameLocations: string };
    toLocation?: { id: number; nameLocations: string };
  };
  vehicle?: { name: string; licensePlate: string };
}

// hooks
export function useDriverSchedules() {
  const [schedules, setSchedules] = useState<DriverSchedule[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<CoachTrip[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<DriverSchedule | null>(
    null
  );

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // fetch data
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await getAllDriverSchedules();
      const { errCode, errMessage, data } = res.data;

      if (errCode === 0) {
        setSchedules(data || []);
      } else {
        notifyError("Lỗi", errMessage || "Không thể tải lịch làm việc");
      }
    } catch (e: any) {
      notifyError(
        "Lỗi",
        e?.response?.data?.errMessage ||
          "Không thể tải lịch làm việc. Lỗi hệ thống"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await getAllDrivers();
      const { errCode, errMessage, data } = res.data;

      if (errCode === 0) {
        setDrivers(data || []);
      } else {
        notifyError("Lỗi", errMessage || "Không thể tải danh sách tài xế");
      }
    } catch (e: any) {
      notifyError(
        "Lỗi",
        e?.response?.data?.errMessage ||
          "Không thể tải danh sách tài xế. Lỗi hệ thống"
      );
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await getAllTrips();
      const { errCode, errMessage, data } = res.data;

      if (errCode === 0) {
        setTrips(data || []);
      } else {
        notifyError("Lỗi", errMessage || "Không thể tải danh sách chuyến xe");
      }
    } catch (e: any) {
      notifyError(
        "Lỗi",
        e?.response?.data?.errMessage ||
          "Không thể tải danh sách chuyến xe. Lỗi hệ thống"
      );
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchDrivers();
    fetchTrips();
  }, []);

  // thêm mới
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const res = await createDriverSchedule(values);
      const { errCode, errMessage } = res.data;

      if (errCode === 0) {
        notifySuccess("Thành công", errMessage);
        setIsAddModal(false);
        form.resetFields();
        fetchSchedules();
      } else {
        notifyError("Lỗi", errMessage);
      }
    } catch (e: any) {
      notifyError("Lỗi", e?.response?.data?.errMessage);
    }
  };

  // cập nhật
  const handleEdit = async () => {
    if (!editingSchedule) return;

    try {
      const values = await editForm.validateFields();
      const payload = { id: editingSchedule.id, ...values };

      const res = await updateDriverSchedule(editingSchedule.id, payload);
      const { errCode, errMessage } = res.data;

      if (errCode === 0) {
        notifySuccess("Thành công", errMessage);
        setIsEditModal(false);
        setEditingSchedule(null);
        fetchSchedules();
      } else {
        notifyError("Lỗi", errMessage);
      }
    } catch (e: any) {
      notifyError(
        "Lỗi",
        e?.response?.data?.errMessage ||
          "Không thể cập nhật lịch làm việc. Lỗi hệ thống"
      );
    }
  };

  // xóa
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteDriverSchedule(id);
      const { errCode, errMessage } = res.data;

      if (errCode === 0) {
        notifySuccess("Thành công", errMessage);
        fetchSchedules();
      } else {
        notifyError("Lỗi", errMessage);
      }
    } catch (e: any) {
      notifyError(
        "Lỗi",
        e?.response?.data?.errMessage ||
          "Không thể xóa lịch làm việc. Lỗi hệ thống"
      );
    }
  };

  // xóa nhiều
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;

    try {
      setLoading(true);
      await Promise.all(ids.map((id) => deleteDriverSchedule(id)));
      notifySuccess("Thành công", "Các lịch làm việc đã được xóa thành công.");
      fetchSchedules();
    } catch (e: any) {
      notifyError(
        "Lỗi",
        e?.response?.data?.errMessage ||
          "Không thể xóa các lịch đã chọn. Lỗi hệ thống"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    schedules,
    drivers,
    trips,
    loading,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    editingSchedule,
    setEditingSchedule,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    contextHolder,
  };
}
