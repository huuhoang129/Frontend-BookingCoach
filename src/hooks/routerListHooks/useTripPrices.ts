//src/hooks/routerListHooks/useTripPrices.ts
import { useEffect, useState } from "react";
import { Form } from "antd";
import {
  getAllTripPrices,
  createTripPrice,
  updateTripPrice,
  deleteTripPrice,
} from "../../services/routeListServices/tripPriceServices";
import { getAllRoutes } from "../../services/stationServices/routesServices";
import { AppNotification } from "../../components/Notification/AppNotification.tsx";

// types
export interface Province {
  id: number;
  nameProvince: string;
}

export interface Location {
  id: number;
  nameLocations: string;
  province?: Province;
}

export interface Route {
  id: number;
  fromLocation: Location;
  toLocation: Location;
}

export interface TripPrice {
  id: number;
  coachRouteId: number;
  seatType: "NORMAL" | "SLEEPER" | "DOUBLESLEEPER" | "LIMOUSINE";
  priceTrip: number;
  typeTrip: "NORMAL" | "HOLIDAY";
  route?: Route;
}

// hooks
export function useTripPrices() {
  // states
  const [tripPrices, setTripPrices] = useState<TripPrice[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingTripPrice, setEditingTripPrice] = useState<TripPrice | null>(
    null
  );

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError, notifyWarning } =
    AppNotification();

  // fetch danh sách giá vé
  const fetchTripPrices = async () => {
    setLoading(true);
    try {
      const res = await getAllTripPrices();
      if (res.data.errCode === 0) {
        setTripPrices(res.data.data);
      } else {
        notifyError("Lỗi hệ thống", res.data.errMessage);
      }
    } catch {
      // lỗi hệ thống: message cố định
      notifyError("Lỗi hệ thống", "Không thể tải danh sách giá vé.");
    } finally {
      setLoading(false);
    }
  };

  // fetch danh sách tuyến đường
  const fetchRoutes = async () => {
    try {
      const res = await getAllRoutes();
      if (res.data.errCode === 0) {
        setRoutes(res.data.data);
      } else {
        notifyWarning("Lỗi hệ thống", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách tuyến đường.");
    }
  };

  useEffect(() => {
    fetchTripPrices();
    fetchRoutes();
  }, []);

  // ===== CRUD =====
  // thêm giá vé
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        coachRouteId: values.coachRouteId,
        seatType: values.seatType,
        priceTrip: Number(values.priceTrip),
        typeTrip: values.typeTrip,
      };

      const res = await createTripPrice(payload);
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsAddModal(false);
        form.resetFields();
        fetchTripPrices();
      } else {
        notifyError("Lỗi hệ thống", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể thêm giá vé, vui lòng thử lại.");
    }
  };

  // cập nhật giá vé
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingTripPrice) return;

      const payload = {
        id: editingTripPrice.id,
        coachRouteId: values.coachRouteId,
        seatType: values.seatType,
        priceTrip: Number(values.priceTrip),
        typeTrip: values.typeTrip,
      };

      const res = await updateTripPrice(editingTripPrice.id, payload);
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsEditModal(false);
        editForm.resetFields();
        fetchTripPrices();
      } else {
        notifyError("Lỗi hệ thống", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể cập nhật giá vé.");
    }
  };

  // xóa giá vé
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteTripPrice(id);
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        fetchTripPrices();
      } else {
        notifyError("Lỗi hệ thống", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá giá vé.");
    }
  };

  // xóa nhiều giá vé
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;
    try {
      setLoading(true);
      await Promise.all(ids.map((id) => deleteTripPrice(id)));
      notifySuccess(
        "Thành công",
        "Các giá vé đã chọn đã được xoá khỏi hệ thống."
      );
      fetchTripPrices();
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá các giá vé đã chọn.");
    } finally {
      setLoading(false);
    }
  };

  // return
  return {
    tripPrices,
    routes,
    loading,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    editingTripPrice,
    setEditingTripPrice,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    contextHolder,
  };
}
