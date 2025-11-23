// src/hooks/routerListHooks/useSchedules.ts
import { useState, useEffect } from "react";
import { Form } from "antd";
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  generateTripsFromSchedules,
} from "../../services/routeListServices/scheduleServices";
import { getAllRoutes } from "../../services/stationServices/routesServices";
import { getAllVehicles } from "../../services/vehicleServices/vehicleServices";
import { getAllVehicleStatus } from "../../services/vehicleServices/vehicleStatusServices";
import { getAllTripPrices } from "../../services/routeListServices/tripPriceServices";
import { AppNotification } from "../../components/Notification/AppNotification.tsx";

export function useSchedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleStatuses, setVehicleStatuses] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);
  const [form] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // fetch data
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, rRes, vRes, vsRes, pRes] = await Promise.all([
        getAllSchedules(),
        getAllRoutes(),
        getAllVehicles(),
        getAllVehicleStatus(),
        getAllTripPrices(),
      ]);

      if (sRes.data.errCode === 0) setSchedules(sRes.data.data);
      if (rRes.data.errCode === 0) setRoutes(rRes.data.data);
      if (vRes.data.errCode === 0) setVehicles(vRes.data.data);
      if (vsRes.data.errCode === 0) setVehicleStatuses(vsRes.data.data);
      if (pRes.data.errCode === 0) setPrices(pRes.data.data);
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải dữ liệu lịch trình.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // xóa và cập nhập lịch trình
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        coachRouteId: values.coachRouteId,
        vehicleId: values.vehicleId,
        tripPriceId: values.tripPriceId,
        startTime: values.startTime.format("HH:mm:ss"),
        totalTime: values.totalTime.format("HH:mm:ss"),
        status: values.status,
      };

      let res;
      if (isEdit && editingSchedule) {
        res = await updateSchedule(editingSchedule.id, payload);
      } else {
        res = await createSchedule(payload);
      }

      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsModalOpen(false);
        fetchAll();
      } else {
        notifyError("Thao tác thất bại", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xử lý lịch trình.");
    }
  };

  // xóa lịch trình
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteSchedule(id);
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        fetchAll();
      } else {
        notifyError("Không thể xoá lịch trình", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá lịch trình.");
    }
  };

  // sinh chuyến từ lịch trình
  const handleGenerateTrips = async () => {
    try {
      const res = await generateTripsFromSchedules();
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
      } else {
        notifyError("Không thể sinh chuyến", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể sinh chuyến.");
    }
  };

  return {
    schedules,
    routes,
    vehicles,
    vehicleStatuses,
    prices,
    loading,
    isModalOpen,
    setIsModalOpen,
    isEdit,
    setIsEdit,
    editingSchedule,
    setEditingSchedule,
    form,
    handleSubmit,
    handleDelete,
    handleGenerateTrips,
    contextHolder,
  };
}
