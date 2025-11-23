//src/hooks/vehicleHooks/useVehicleStatus.ts
import { useEffect, useState } from "react";
import { Form } from "antd";
import {
  getAllVehicleStatus,
  createOrUpdateVehicleStatus,
  deleteVehicleStatus,
} from "../../services/vehicleServices/vehicleStatusServices";
import { getAllVehicles } from "../../services/vehicleServices/vehicleServices";
import { AppNotification } from "../../components/Notification/AppNotification.tsx";

export interface Vehicle {
  id: number;
  name: string;
  licensePlate: string;
  type: string;
}

export interface VehicleStatus {
  id: number;
  vehicleId: number;
  status: "GOOD" | "NEEDS_MAINTENANCE" | "IN_REPAIR";
  note?: string;
  vehicle?: Vehicle;
}

export function useVehicleStatus() {
  const [vehicleStatuses, setVehicleStatuses] = useState<VehicleStatus[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<VehicleStatus | null>(
    null
  );

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // Fetch danh sách trạng thái xe
  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const res = await getAllVehicleStatus();
      const { errCode, errMessage, data } = res.data;

      if (errCode === 0) setVehicleStatuses(data);
      else notifyError("Lỗi", errMessage);
    } catch (e: any) {
      notifyError("Lỗi", e?.response?.data?.errMessage || "Lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách xe
  const fetchVehicles = async () => {
    try {
      const res = await getAllVehicles();
      const { errCode, errMessage, data } = res.data;

      if (errCode === 0) setVehicles(data);
      else notifyError("Lỗi", errMessage);
    } catch (e: any) {
      notifyError("Lỗi", e?.response?.data?.errMessage || "Lỗi hệ thống");
    }
  };

  useEffect(() => {
    fetchStatuses();
    fetchVehicles();
  }, []);

  // Thêm tình trạng xe
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const res = await createOrUpdateVehicleStatus(values);
      const { errCode, errMessage } = res.data;

      if (errCode === 0) {
        notifySuccess("Thành công", errMessage);
        setIsAddModal(false);
        form.resetFields();
        fetchStatuses();
      } else {
        notifyError("Lỗi", errMessage);
      }
    } catch (e: any) {
      notifyError("Lỗi", e?.response?.data?.errMessage || "Lỗi hệ thống");
    }
  };

  // Cập nhật tình trạng xe
  const handleEdit = async () => {
    if (!editingStatus) return;

    try {
      const values = await editForm.validateFields();
      const res = await createOrUpdateVehicleStatus(values);
      const { errCode, errMessage } = res.data;

      if (errCode === 0) {
        notifySuccess("Thành công", errMessage);
        setIsEditModal(false);
        setEditingStatus(null);
        fetchStatuses();
      } else {
        notifyError("Lỗi", errMessage);
      }
    } catch (e: any) {
      notifyError("Lỗi", e?.response?.data?.errMessage || "Lỗi hệ thống");
    }
  };

  // Xóa tình trạng xe
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteVehicleStatus(id);
      const { errCode, errMessage } = res.data;

      if (errCode === 0) {
        notifySuccess("Thành công", errMessage);
        fetchStatuses();
      } else {
        notifyError("Lỗi", errMessage);
      }
    } catch (e: any) {
      notifyError("Lỗi", e?.response?.data?.errMessage || "Lỗi hệ thống");
    }
  };

  // Xóa nhiều tình trạng xe
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;

    try {
      setLoading(true);
      await Promise.all(ids.map((id) => deleteVehicleStatus(id)));
      notifySuccess("Thành công", "Xóa các tình trạng xe đã chọn thành công");
      fetchStatuses();
    } catch (e: any) {
      notifyError("Lỗi", e?.response?.data?.errMessage || "Lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return {
    vehicleStatuses,
    vehicles,
    loading,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    editingStatus,
    setEditingStatus,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    contextHolder,
  };
}
