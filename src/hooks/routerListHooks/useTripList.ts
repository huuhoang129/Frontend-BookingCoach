import { useEffect, useState } from "react";
import { Form } from "antd";
import {
  getAllTrips,
  createTrip,
  updateTrip,
  deleteTrip,
} from "../../services/routeListServices/tripListServices";
import { getAllRoutes } from "../../services/stationServices/routesServices";
import { getAllVehicles } from "../../services/vehicleServices/vehicleServices";
import { getAllTripPrices } from "../../services/routeListServices/tripPriceServices";
import { getAllVehicleStatus } from "../../services/vehicleServices/vehicleStatusServices";
import { AppNotification } from "../../components/Notification/AppNotification.tsx";

export interface Route {
  id: number;
  fromLocation: any;
  toLocation: any;
}
export interface Vehicle {
  id: number;
  name: string;
  type: string;
  licensePlate: string;
}
export interface TripPrice {
  id: number;
  seatType: string;
  priceTrip: number;
  typeTrip: string;
  coachRouteId: number;
}
export interface Trip {
  id: number;
  route: Route;
  vehicle: Vehicle;
  price: TripPrice;
  startDate: string;
  startTime: string;
  totalTime?: string;
  status: "OPEN" | "FULL" | "CANCELLED";
  totalSeats?: number;
  availableSeats?: number;
}

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleStatuses, setVehicleStatuses] = useState<any[]>([]);
  const [prices, setPrices] = useState<TripPrice[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [form] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // ===== FETCH =====
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tRes, rRes, vRes, sRes, pRes] = await Promise.all([
        getAllTrips(),
        getAllRoutes(),
        getAllVehicles(),
        getAllVehicleStatus(),
        getAllTripPrices(),
      ]);
      if (tRes.data.errCode === 0) setTrips(tRes.data.data);
      if (rRes.data.errCode === 0) setRoutes(rRes.data.data);
      if (vRes.data.errCode === 0) setVehicles(vRes.data.data);
      if (sRes.data.errCode === 0) setVehicleStatuses(sRes.data.data);
      if (pRes.data.errCode === 0) setPrices(pRes.data.data);
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải dữ liệu chuyến xe.");
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
        startDate: values.startDate.format("YYYY-MM-DD"),
        startTime: values.startTime.format("HH:mm:ss"),
        totalTime: values.totalTime
          ? values.totalTime.format("HH:mm:ss")
          : null,
        status: values.status,
      };

      if (isEdit && editingTrip) {
        const res = await updateTrip(editingTrip.id, payload);
        if (res.data.errCode === 0) {
          notifySuccess(
            "Cập nhật thành công",
            "Thông tin chuyến xe đã được cập nhật."
          );
          setIsModalOpen(false);
          fetchAll();
        } else notifyError("Không thể cập nhật", res.data.errMessage);
      } else {
        const res = await createTrip(payload);
        if (res.data.errCode === 0) {
          notifySuccess(
            "Thêm mới thành công",
            "Chuyến xe đã được thêm vào hệ thống."
          );
          setIsModalOpen(false);
          fetchAll();
        } else notifyError("Không thể thêm chuyến", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xử lý chuyến xe.");
    }
  };

  // ===== DELETE 1 =====
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteTrip(id);
      if (res.data.errCode === 0) {
        notifySuccess("Xoá thành công", "Chuyến xe đã bị xoá khỏi hệ thống.");
        fetchAll();
      } else notifyError("Không thể xoá chuyến", res.data.errMessage);
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá chuyến xe.");
    }
  };

  // ===== DELETE NHIỀU =====
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;
    try {
      setLoading(true);
      await Promise.all(ids.map((id) => deleteTrip(id)));
      notifySuccess(
        "Xoá thành công",
        "Các chuyến xe đã được xoá khỏi hệ thống."
      );
      fetchAll();
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá các chuyến đã chọn.");
    } finally {
      setLoading(false);
    }
  };

  return {
    trips,
    routes,
    vehicles,
    vehicleStatuses,
    prices,
    loading,
    isModalOpen,
    setIsModalOpen,
    isEdit,
    setIsEdit,
    editingTrip,
    setEditingTrip,
    form,
    handleSubmit,
    handleDelete,
    handleBulkDelete,
    contextHolder,
  };
}
