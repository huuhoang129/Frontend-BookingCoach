import { useEffect, useState } from "react";
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
import { getAllTripPrices } from "../../services/routeListServices/tripPriceServices";
import { AppNotification } from "../../components/Notification/AppNotification.tsx";

export interface Schedule {
  id: number;
  route: any;
  vehicle: any;
  price: any;
  startTime: string;
  totalTime?: string;
  status: "ACTIVE" | "INACTIVE";
}

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [form] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // ===== FETCH ALL =====
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, rRes, vRes, pRes] = await Promise.all([
        getAllSchedules(),
        getAllRoutes(),
        getAllVehicles(),
        getAllTripPrices(),
      ]);
      if (sRes.data.errCode === 0) setSchedules(sRes.data.data);
      if (rRes.data.errCode === 0) setRoutes(rRes.data.data);
      if (vRes.data.errCode === 0) setVehicles(vRes.data.data);
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

  // ===== ADD / EDIT =====
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

      if (isEdit && editingSchedule) {
        const res = await updateSchedule(editingSchedule.id, payload);
        if (res.data.errCode === 0) {
          notifySuccess("Cập nhật thành công", "Lịch trình đã được cập nhật.");
          setIsModalOpen(false);
          fetchAll();
        } else notifyError("Không thể cập nhật", res.data.errMessage);
      } else {
        const res = await createSchedule(payload);
        if (res.data.errCode === 0) {
          notifySuccess(
            "Thêm mới thành công",
            "Lịch trình đã được thêm vào hệ thống."
          );
          setIsModalOpen(false);
          fetchAll();
        } else notifyError("Không thể thêm lịch trình", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xử lý lịch trình.");
    }
  };

  // ===== DELETE =====
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteSchedule(id);
      if (res.data.errCode === 0) {
        notifySuccess("Xoá thành công", "Lịch trình đã bị xoá khỏi hệ thống.");
        fetchAll();
      } else notifyError("Không thể xoá lịch trình", res.data.errMessage);
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá lịch trình.");
    }
  };

  // ===== GENERATE =====
  const handleGenerateTrips = async () => {
    try {
      const res = await generateTripsFromSchedules();
      if (res.data.errCode === 0)
        notifySuccess(
          "Sinh chuyến thành công",
          "Các chuyến đã được tạo tự động."
        );
      else notifyError("Không thể sinh chuyến", res.data.errMessage);
    } catch {
      notifyError("Lỗi hệ thống", "Không thể sinh chuyến.");
    }
  };

  return {
    schedules,
    routes,
    vehicles,
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
