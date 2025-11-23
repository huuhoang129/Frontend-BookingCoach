//src/hooks/stationHooks/useRouteManage.ts
import { useEffect, useState } from "react";
import { Form } from "antd";
import { AppNotification } from "../../components/Notification/AppNotification";
import { toBase64 } from "../../utils/base64";
import {
  getAllRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../../services/stationServices/routesServices";
import { getAllLocations } from "../../services/stationServices/locationServices";

// types
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

export function useRouteManage() {
  // state
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

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // fetch data tuyến đường
  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await getAllRoutes();
      if (res.data.errCode === 0) {
        setRoutes(res.data.data);
      } else {
        notifyError("Không thể tải danh sách tuyến", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách tuyến.");
    } finally {
      setLoading(false);
    }
  };

  // fetch địa điểm
  const fetchLocations = async () => {
    try {
      const res = await getAllLocations();
      if (res.data.errCode === 0) {
        setLocations(res.data.data);
      } else {
        notifyError("Không thể tải danh sách địa điểm", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách địa điểm.");
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchLocations();
  }, []);

  // xử lý ảnh về dạng base64 (lấy phần content)
  const processImage = async (fileList: any[], oldImage?: string | null) => {
    if (fileList?.length > 0) {
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

  // thêm tuyến
  const handleAddRoute = async () => {
    try {
      const values = await form.validateFields();

      // check trùng tuyến trên client
      const duplicate = routes.find(
        (r) =>
          r.fromLocation.id === values.fromLocationId &&
          r.toLocation.id === values.toLocationId
      );
      if (duplicate) {
        notifyError(
          "Trùng tuyến đường",
          `Tuyến từ ${duplicate.fromLocation.nameLocations} ➝ ${duplicate.toLocation.nameLocations} đã tồn tại.`
        );
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
        notifySuccess("Thành công", res.data.errMessage);
        setIsAddModal(false);
        form.resetFields();
        fetchRoutes();
      } else {
        notifyError("Không thể thêm tuyến đường", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể thêm tuyến đường.");
    }
  };

  // cập nhật tuyến
  const handleEditRoute = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingRoute) return;

      // check trùng tuyến (trừ chính nó)
      const duplicate = routes.find(
        (r) =>
          r.id !== editingRoute.id &&
          r.fromLocation.id === values.fromLocationId &&
          r.toLocation.id === values.toLocationId
      );
      if (duplicate) {
        notifyError(
          "Trùng tuyến đường",
          `Tuyến từ ${duplicate.fromLocation.nameLocations} ➝ ${duplicate.toLocation.nameLocations} đã tồn tại.`
        );
        return;
      }

      const base64Image = await processImage(
        values.imageRouteCoach,
        editingRoute.imageRouteCoach || null
      );

      const payload = {
        id: editingRoute.id,
        fromLocationId: values.fromLocationId,
        toLocationId: values.toLocationId,
        imageRouteCoach: base64Image,
      };

      const res = await updateRoute(editingRoute.id, payload);
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsEditModal(false);
        editForm.resetFields();
        setEditingRoute(null);
        fetchRoutes();
      } else {
        notifyError("Không thể cập nhật tuyến đường", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể cập nhật tuyến đường.");
    }
  };

  // xoá một tuyến
  const handleDeleteRoute = async (id: number) => {
    try {
      const res = await deleteRoute(id);
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        fetchRoutes();
      } else {
        notifyError("Không thể xoá tuyến đường", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá tuyến đường.");
    }
  };

  // xoá nhiều tuyến
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;
    try {
      setLoading(true);
      await Promise.all(ids.map((id) => deleteRoute(id)));
      notifySuccess(
        "Thành công",
        "Các tuyến đã chọn đã được xoá khỏi hệ thống."
      );
      fetchRoutes();
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá các tuyến đã chọn.");
    } finally {
      setLoading(false);
    }
  };

  // filter hiển thị
  const filteredData = routes
    .sort((a, b) => a.id - b.id)
    .map((r, idx) => ({ ...r, index: idx + 1 }))
    .filter((r) => {
      let match = true;

      if (
        searchText &&
        !(
          r.fromLocation.nameLocations
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          r.toLocation.nameLocations
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
      ) {
        match = false;
      }

      if (
        filterProvince &&
        r.fromLocation.province.nameProvince !== filterProvince &&
        r.toLocation.province.nameProvince !== filterProvince
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
    handleBulkDelete,
    filteredData,
    contextHolder,
  };
}
