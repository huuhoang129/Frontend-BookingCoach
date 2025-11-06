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

// types
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
  // state
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

  // fetch data
  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const res = await getAllVehicleStatus();
      if (res.data.errCode === 0) setVehicleStatuses(res.data.data);
      else
        notifyError(
          "Không thể tải danh sách tình trạng xe",
          res.data.errMessage
        );
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách tình trạng xe.");
    } finally {
      setLoading(false);
    }
  };

  // fetch data vehicle
  const fetchVehicles = async () => {
    try {
      const res = await getAllVehicles();
      if (res.data.errCode === 0) setVehicles(res.data.data);
      else notifyError("Không thể tải danh sách xe", res.data.errMessage);
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách xe.");
    }
  };

  useEffect(() => {
    fetchStatuses();
    fetchVehicles();
  }, []);

  // ===== CRUD =====
  // thêm tình trạng xe
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const res = await createOrUpdateVehicleStatus(values);

      if (res.data.errCode === 0) {
        notifySuccess(
          "Thêm mới thành công",
          "Tình trạng xe đã được thêm vào hệ thống."
        );
        setIsAddModal(false);
        form.resetFields();
        fetchStatuses();
      } else {
        notifyError("Không thể thêm tình trạng xe", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể thêm tình trạng xe.");
    }
  };

  // cập nhật tình trạng xe
  const handleEdit = async () => {
    if (!editingStatus) return;
    try {
      const values = await editForm.validateFields();
      const res = await createOrUpdateVehicleStatus(values);

      if (res.data.errCode === 0) {
        notifySuccess("Cập nhật thành công", "Tình trạng xe đã được cập nhật.");
        setIsEditModal(false);
        setEditingStatus(null);
        fetchStatuses();
      } else {
        notifyError("Không thể cập nhật tình trạng xe", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể cập nhật tình trạng xe.");
    }
  };

  // xoá tình trạng xe
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteVehicleStatus(id);
      if (res.data.errCode === 0) {
        notifySuccess(
          "Xoá thành công",
          "Tình trạng xe đã được xoá khỏi hệ thống."
        );
        fetchStatuses();
      } else {
        notifyError("Không thể xoá tình trạng xe", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá tình trạng xe.");
    }
  };

  // xoá nhiều tình trạng xe
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;
    try {
      setLoading(true);
      await Promise.all(ids.map((id) => deleteVehicleStatus(id)));
      notifySuccess(
        "Xoá thành công",
        "Các tình trạng xe đã chọn đã được xoá khỏi hệ thống."
      );
      fetchStatuses();
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá các tình trạng xe đã chọn.");
    } finally {
      setLoading(false);
    }
  };

  // return
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
