import { useState, useEffect } from "react";
import { message, Form } from "antd";
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
  // province state
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);

  // location state
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // search + filter
  const [searchProvince, setSearchProvince] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filterProvince, setFilterProvince] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  // modal state
  const [isAddProvince, setIsAddProvince] = useState(false);
  const [isEditProvince, setIsEditProvince] = useState(false);
  const [editingProvince, setEditingProvince] = useState<Province | null>(null);

  const [isAddLocation, setIsAddLocation] = useState(false);
  const [isEditLocation, setIsEditLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // forms
  const [provinceForm] = Form.useForm();
  const [provinceEditForm] = Form.useForm();
  const [locationForm] = Form.useForm();
  const [locationEditForm] = Form.useForm();

  // fetch provinces
  const fetchProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const res = await getAllProvinces();
      if (res.data.errCode === 0) setProvinces(res.data.data);
    } finally {
      setLoadingProvinces(false);
    }
  };

  // fetch locations
  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const res = await getAllLocations();
      if (res.data.errCode === 0) setLocations(res.data.data);
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
    fetchLocations();
  }, []);

  // CRUD Province
  const handleAddProvince = async () => {
    try {
      const values = await provinceForm.validateFields();
      const res = await createProvince(values);
      if (res.data.errCode === 0) {
        message.success("Thêm tỉnh thành công");
        setIsAddProvince(false);
        provinceForm.resetFields();
        fetchProvinces();
      }
    } catch {}
  };

  const handleEditProvince = async () => {
    try {
      const values = await provinceEditForm.validateFields();
      if (!editingProvince) return;
      const res = await updateProvince(editingProvince.id, values);
      if (res.data.errCode === 0) {
        message.success("Cập nhật tỉnh thành công");
        setIsEditProvince(false);
        fetchProvinces();
      } else {
        message.error(res.data.errMessage || "Cập nhật tỉnh thất bại");
      }
    } catch (e) {
      console.error("❌ Error update Province:", e);
    }
  };

  const handleDeleteProvince = async (id: number) => {
    await deleteProvince(id);
    message.success("Xoá tỉnh thành công");
    fetchProvinces();
  };

  // CRUD Location
  const handleAddLocation = async () => {
    try {
      const values = await locationForm.validateFields();
      const res = await createLocation(values);
      if (res.data.errCode === 0) {
        message.success("Thêm địa điểm thành công");
        setIsAddLocation(false);
        locationForm.resetFields();
        fetchLocations();
      }
    } catch {}
  };

  const handleEditLocation = async () => {
    try {
      const values = await locationEditForm.validateFields();
      if (!editingLocation) return;
      const res = await updateLocation(editingLocation.id, values);
      if (res.data.errCode === 0) {
        message.success("Cập nhật địa điểm thành công");
        setIsEditLocation(false);
        fetchLocations();
      } else {
        message.error(res.data.errMessage || "Cập nhật địa điểm thất bại");
      }
    } catch (e) {
      console.error("❌ Error update Location:", e);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    await deleteLocation(id);
    message.success("Xoá địa điểm thành công");
    fetchLocations();
  };

  // filters
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
      ) {
        match = false;
      }
      if (filterProvince && l.provinceId.toString() !== filterProvince) {
        match = false;
      }
      if (filterType && l.type !== filterType) {
        match = false;
      }
      return match;
    })
    .sort((a, b) => a.id - b.id)
    .map((item, idx) => ({ ...item, index: idx + 1 }));

  return {
    // states
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
    // handlers
    handleAddProvince,
    handleEditProvince,
    handleDeleteProvince,
    handleAddLocation,
    handleEditLocation,
    handleDeleteLocation,
    // data filtered
    filteredProvinces,
    filteredLocations,
  };
}
