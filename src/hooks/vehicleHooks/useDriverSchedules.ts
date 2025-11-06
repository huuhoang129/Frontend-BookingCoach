import { useEffect, useState } from "react";
import { Form, message } from "antd";
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
      fromLocation?: { nameLocations: string };
      toLocation?: { nameLocations: string };
    };
    vehicle?: { name: string; licensePlate: string };
  };
}

export function useDriverSchedules() {
  const [schedules, setSchedules] = useState<DriverSchedule[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<DriverSchedule | null>(
    null
  );

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch
  const fetchData = async () => {
    setLoading(true);
    try {
      const [schRes, driverRes, tripRes] = await Promise.all([
        getAllDriverSchedules(),
        getAllDrivers(),
        getAllTrips(),
      ]);
      if (schRes.data.errCode === 0) setSchedules(schRes.data.data || []);
      if (driverRes.data.errCode === 0) setDrivers(driverRes.data.data || []);
      if (tripRes.data.errCode === 0) setTrips(tripRes.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const res = await createDriverSchedule(values);
      if (res.data.errCode === 0) {
        message.success("Thêm lịch làm việc thành công!");
        form.resetFields();
        setIsAddOpen(false);
        fetchData();
      } else message.error(res.data.errMessage || "Lỗi khi thêm");
    } catch (err) {
      console.error(err);
    }
  };

  // Edit
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingSchedule) return;
      const res = await updateDriverSchedule(editingSchedule.id, values);
      if (res.data.errCode === 0) {
        message.success("Cập nhật lịch làm việc thành công!");
        setIsEditOpen(false);
        fetchData();
      } else message.error(res.data.errMessage || "Lỗi khi cập nhật");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteDriverSchedule(id);
      if (res.data.errCode === 0) {
        message.success("Xóa lịch thành công!");
        fetchData();
      } else message.error(res.data.errMessage || "Lỗi khi xóa");
    } catch (err) {
      message.error("Không thể xóa. Vui lòng thử lại!");
    }
  };

  return {
    schedules,
    drivers,
    trips,
    loading,
    form,
    editForm,
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    editingSchedule,
    setEditingSchedule,
    handleAdd,
    handleEdit,
    handleDelete,
  };
}
