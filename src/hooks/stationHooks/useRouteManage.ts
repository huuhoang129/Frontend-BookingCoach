import { useEffect, useState } from "react";
import { Form } from "antd";
import type { NotificationInstance } from "antd/es/notification/interface";
import { toBase64 } from "../../utils/base64";
import {
  getAllRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../../services/stationServices/routesServices.ts"; // lấy danh sách tuyến
import { getAllLocations } from "../../services/stationServices/locationServices"; // lấy danh sách location

export interface Province {
  id: number;
  nameProvince: string;
}

export interface Location {
  id: number;
  nameLocations: string;
  province: Province;
}

export interface Route {
  id: number;
  fromLocation: Location;
  toLocation: Location;
  imageRouteCoach?: string | null;
}

export function useRouteManage(api: NotificationInstance) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterProvince, setFilterProvince] = useState<string | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);

  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch
  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await getAllRoutes();
      if (res.data.errCode === 0) setRoutes(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await getAllLocations();
      if (res.data.errCode === 0) setLocations(res.data.data);
    } catch {}
  };

  useEffect(() => {
    fetchRoutes();
    fetchLocations();
  }, []);

  // Helper xử lý ảnh
  const processImage = async (fileList: any[], oldImage?: string | null) => {
    if (fileList && fileList.length > 0) {
      const fileObj = fileList[0].originFileObj;
      if (fileObj) {
        const base64 = await toBase64(fileObj as File);
        return (base64 as string).split(",")[1];
      }
    }
    if (oldImage) {
      return oldImage.startsWith("data:image")
        ? oldImage.split(",")[1]
        : oldImage;
    }
    return null;
  };

  // CRUD
  const handleAddRoute = async () => {
    try {
      const values = await form.validateFields();

      // Check trùng tuyến
      const duplicate = routes.find(
        (r) =>
          r.fromLocation.id === values.fromLocationId &&
          r.toLocation.id === values.toLocationId
      );
      if (duplicate) {
        api.error({
          message: "Trùng tuyến đường",
          description: `Tuyến từ ${duplicate.fromLocation.nameLocations} ➝ ${duplicate.toLocation.nameLocations} đã tồn tại.`,
          placement: "topRight",
        });
        return;
      }

      const base64Image = await processImage(values.imageRouteCoach);
      const payload = {
        fromLocationId: values.fromLocationId,
        toLocationId: values.toLocationId,
        imageRouteCoach: base64Image ?? undefined,
      };

      const res = await createRoute(payload);
      if (res.data.errCode === 0) {
        api.success({
          message: "Thành công",
          description: "Thêm tuyến đường thành công.",
          placement: "topRight",
        });
        setIsAddModal(false);
        form.resetFields();
        fetchRoutes();
      } else {
        api.error({
          message: "Lỗi",
          description: res.data.errMessage || "Không thể thêm tuyến",
          placement: "topRight",
        });
      }
    } catch (err) {
      console.error("❌ Add route error:", err);
    }
  };

  const handleEditRoute = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingRoute) return;

      // Check trùng tuyến (trừ chính nó)
      const duplicate = routes.find(
        (r) =>
          r.id !== editingRoute.id &&
          r.fromLocation.id === values.fromLocationId &&
          r.toLocation.id === values.toLocationId
      );
      if (duplicate) {
        api.error({
          message: "Trùng tuyến đường",
          description: `Tuyến từ ${duplicate.fromLocation.nameLocations} ➝ ${duplicate.toLocation.nameLocations} đã tồn tại.`,
          placement: "topRight",
        });
        return;
      }

      const base64Image = await processImage(
        values.imageRouteCoach,
        editingRoute.imageRouteCoach || null
      );

      const payload = {
        fromLocationId: values.fromLocationId,
        toLocationId: values.toLocationId,
        imageRouteCoach: base64Image,
      };

      const res = await updateRoute(editingRoute.id, payload);

      if (res.data.errCode === 0) {
        api.success({
          message: "Thành công",
          description: "Cập nhật tuyến đường thành công.",
          placement: "topRight",
        });
        setIsEditModal(false);
        editForm.resetFields();
        setEditingRoute(null);
        fetchRoutes();
      } else {
        api.error({
          message: "Lỗi",
          description: res.data.errMessage || "Không thể cập nhật tuyến",
          placement: "topRight",
        });
      }
    } catch (err) {
      console.error("❌ Edit route error:", err);
    }
  };

  const handleDeleteRoute = async (id: number) => {
    try {
      const res = await deleteRoute(id);
      if (res.data.errCode === 0) {
        api.success({
          message: "Đã xoá",
          description: "Tuyến đường đã được xoá thành công.",
          placement: "topRight",
        });
        fetchRoutes();
      } else {
        api.error({
          message: "Lỗi",
          description: res.data.errMessage,
          placement: "topRight",
        });
      }
    } catch (err) {
      console.error("❌ Delete route error:", err);
    }
  };

  // Filtered data
  const filteredData = routes
    .sort((a, b) => a.id - b.id)
    .map((r, idx) => ({ ...r, index: idx + 1 }))
    .filter((r) => {
      let match = true;
      if (
        searchText &&
        !(
          r.fromLocation?.nameLocations
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          r.toLocation?.nameLocations
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
      ) {
        match = false;
      }

      if (
        filterProvince &&
        r.fromLocation?.province?.nameProvince !== filterProvince &&
        r.toLocation?.province?.nameProvince !== filterProvince
      ) {
        match = false;
      }

      return match;
    });

  return {
    routes,
    loading,
    searchText,
    setSearchText,
    filterProvince,
    setFilterProvince,
    locations,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    editingRoute,
    setEditingRoute,
    form,
    editForm,
    handleAddRoute,
    handleEditRoute,
    handleDeleteRoute,
    filteredData,
  };
}
