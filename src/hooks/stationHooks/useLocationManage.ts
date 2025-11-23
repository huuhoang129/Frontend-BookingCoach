//src/hooks/stationHooks/useLocationManage.ts
import { useState, useEffect } from "react";
import { Form } from "antd";
import {
  getAllProvinces,
  createProvince,
  updateProvince,
  deleteProvince,
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../services/stationServices/locationServices.ts";
import { AppNotification } from "../../components/Notification/AppNotification.tsx";

// types
export interface Province {
  id: number;
  nameProvince: string;
  valueProvince: string;
}

export interface Location {
  id: number;
  nameLocations: string;
  type: string;
  provinceId: number;
  province?: Province;
}

export function useLocationManage() {
  // danh sách tỉnh
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  // danh sách địa điểm
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  // filter search
  const [searchProvince, setSearchProvince] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filterProvince, setFilterProvince] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  // modal province
  const [isAddProvince, setIsAddProvince] = useState(false);
  const [isEditProvince, setIsEditProvince] = useState(false);
  const [editingProvince, setEditingProvince] = useState<Province | null>(null);
  // modal location
  const [isAddLocation, setIsAddLocation] = useState(false);
  const [isEditLocation, setIsEditLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  // form
  const [provinceForm] = Form.useForm();
  const [provinceEditForm] = Form.useForm();
  const [locationForm] = Form.useForm();
  const [locationEditForm] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // fetch data tỉnh/thành phố
  const fetchProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const res = await getAllProvinces();
      if (res.data.errCode === 0) {
        setProvinces(res.data.data);
      } else {
        notifyError("Không thể tải danh sách tỉnh", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách tỉnh.");
    } finally {
      setLoadingProvinces(false);
    }
  };

  // fetch data địa điểm
  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const res = await getAllLocations();
      if (res.data.errCode === 0) {
        setLocations(res.data.data);
      } else {
        notifyError("Không thể tải danh sách địa điểm", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách địa điểm.");
    } finally {
      setLoadingLocations(false);
    }
  };

  // Gọi fetch ban đầu
  useEffect(() => {
    fetchProvinces();
    fetchLocations();
  }, []);

  // thêm mới tỉnh/thành phố
  const handleAddProvince = async () => {
    try {
      const values = await provinceForm.validateFields();
      const res = await createProvince(values);

      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsAddProvince(false);
        provinceForm.resetFields();
        fetchProvinces();
      } else {
        notifyError("Không thể thêm tỉnh", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể thêm tỉnh.");
    }
  };

  // cập nhật tỉnh/thành phố
  const handleEditProvince = async () => {
    try {
      const values = await provinceEditForm.validateFields();
      if (!editingProvince) return;

      const res = await updateProvince(editingProvince.id, values);

      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsEditProvince(false);
        fetchProvinces();
      } else {
        notifyError("Không thể cập nhật tỉnh", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể cập nhật tỉnh.");
    }
  };

  // xóa tỉnh/thành phố
  const handleDeleteProvince = async (id: number) => {
    try {
      const res = await deleteProvince(id);
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        fetchProvinces();
      } else {
        notifyError("Không thể xoá tỉnh", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá tỉnh.");
    }
  };

  // xóa nhiều tỉnh/thành phố
  const handleBulkDeleteProvince = async (ids: number[]) => {
    if (!ids.length) return;
    try {
      setLoadingProvinces(true);
      const results = await Promise.all(ids.map((id) => deleteProvince(id)));

      const hasError = results.some((res) => res.data.errCode !== 0);

      if (!hasError) {
        notifySuccess("Thành công", "Các tỉnh đã chọn đã được xoá.");
        fetchProvinces();
      } else {
        notifyError(
          "Không thể xoá các tỉnh đã chọn",
          "Một số tỉnh không thể xoá, vui lòng thử lại."
        );
        fetchProvinces();
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá các tỉnh đã chọn.");
    } finally {
      setLoadingProvinces(false);
    }
  };

  /* ===== CRUD LOCATION ===== */
  // thêm mới địa điểm
  const handleAddLocation = async () => {
    try {
      const values = await locationForm.validateFields();
      const res = await createLocation(values);

      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsAddLocation(false);
        locationForm.resetFields();
        fetchLocations();
      } else {
        notifyError("Không thể thêm địa điểm", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể thêm địa điểm.");
    }
  };

  // cập nhật địa điểm
  const handleEditLocation = async () => {
    try {
      const values = await locationEditForm.validateFields();
      if (!editingLocation) return;

      const res = await updateLocation(editingLocation.id, values);

      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsEditLocation(false);
        fetchLocations();
      } else {
        notifyError("Không thể cập nhật địa điểm", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể cập nhật địa điểm.");
    }
  };

  // xóa địa điểm
  const handleDeleteLocation = async (id: number) => {
    try {
      const res = await deleteLocation(id);
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        fetchLocations();
      } else {
        notifyError("Không thể xoá địa điểm", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá địa điểm.");
    }
  };

  // xóa nhiều địa điểm
  const handleBulkDeleteLocation = async (ids: number[]) => {
    if (!ids.length) return;
    try {
      setLoadingLocations(true);
      const results = await Promise.all(ids.map((id) => deleteLocation(id)));

      const hasError = results.some((res) => res.data.errCode !== 0);

      if (!hasError) {
        notifySuccess("Thành công", "Các địa điểm đã chọn đã được xoá.");
        fetchLocations();
      } else {
        notifyError(
          "Không thể xoá các địa điểm đã chọn",
          "Một số địa điểm không thể xoá, vui lòng thử lại."
        );
        fetchLocations();
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá các địa điểm đã chọn.");
    } finally {
      setLoadingLocations(false);
    }
  };

  // filter kết quả
  const filteredProvinces = provinces
    .filter((p) =>
      p.nameProvince.toLowerCase().includes(searchProvince.toLowerCase())
    )
    .sort((a, b) => a.id - b.id)
    .map((item, idx) => ({ ...item, index: idx + 1 }));

  const filteredLocations = locations
    .filter((l) => {
      let match = true;
      if (
        searchLocation &&
        !l.nameLocations.toLowerCase().includes(searchLocation.toLowerCase())
      )
        match = false;
      if (filterProvince && l.provinceId.toString() !== filterProvince)
        match = false;
      if (filterType && l.type !== filterType) match = false;
      return match;
    })
    .sort((a, b) => a.id - b.id)
    .map((item, idx) => ({ ...item, index: idx + 1 }));

  // return
  return {
    provinces,
    loadingProvinces,
    locations,
    loadingLocations,
    searchProvince,
    setSearchProvince,
    searchLocation,
    setSearchLocation,
    filterProvince,
    setFilterProvince,
    filterType,
    setFilterType,
    isAddProvince,
    setIsAddProvince,
    isEditProvince,
    setIsEditProvince,
    editingProvince,
    setEditingProvince,
    isAddLocation,
    setIsAddLocation,
    isEditLocation,
    setIsEditLocation,
    editingLocation,
    setEditingLocation,
    provinceForm,
    provinceEditForm,
    locationForm,
    locationEditForm,
    handleAddProvince,
    handleEditProvince,
    handleDeleteProvince,
    handleBulkDeleteProvince,
    handleAddLocation,
    handleEditLocation,
    handleDeleteLocation,
    handleBulkDeleteLocation,
    filteredProvinces,
    filteredLocations,
    contextHolder,
  };
}
