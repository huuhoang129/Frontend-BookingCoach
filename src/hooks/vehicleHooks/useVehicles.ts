// src/hooks/vehicleHooks/useVehicles.ts
import { useEffect, useState } from "react";
import { Form } from "antd";
import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../services/vehicleServices/vehicleServices";
import { AppNotification } from "../../components/Notification/AppNotification.tsx";

export interface Vehicle {
  id: number;
  name: string;
  licensePlate: string;
  type: "NORMAL" | "SLEEPER" | "DOUBLESLEEPER" | "LIMOUSINE";
  numberFloors: number;
  seatCount: number;
  description?: string;
}

export function useVehicles() {
  // Danh sách xe
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal và xe đang chỉnh sửa
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // Cấu hình số tầng và số ghế theo loại xe
  const configByType: Record<
    string,
    { numberFloors: number; seatCount: number }
  > = {
    NORMAL: { numberFloors: 1, seatCount: 45 },
    LIMOUSINE: { numberFloors: 1, seatCount: 9 },
    SLEEPER: { numberFloors: 2, seatCount: 36 },
    DOUBLESLEEPER: { numberFloors: 2, seatCount: 22 },
  };

  // Lấy danh sách xe
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await getAllVehicles();
      const { errCode, errMessage, data } = res.data;

      if (errCode === 0) {
        setVehicles(data);
      } else {
        notifyError("Không thể tải danh sách xe", errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách xe");
    } finally {
      setLoading(false);
    }
  };

  // Load khi mở trang
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Thêm xe
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const config = configByType[values.type];
      const payload = { ...values, ...config };

      const res = await createVehicle(payload);
      const { errCode, errMessage } = res.data;

      if (errCode === 0) {
        notifySuccess("Thành công", errMessage);
        setIsAddModal(false);
        form.resetFields();
        fetchVehicles();
      } else {
        notifyError("Không thể thêm xe", errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể thêm xe");
    }
  };

  // Cập nhật xe
  const handleEdit = async () => {
    if (!editingVehicle) return;

    try {
      const values = await editForm.validateFields();
      const config = configByType[values.type];
      const payload = { id: editingVehicle.id, ...values, ...config };

      const res = await updateVehicle(editingVehicle.id, payload);
      const { errCode, errMessage } = res.data;

      if (errCode === 0) {
        notifySuccess("Thành công", errMessage);
        setIsEditModal(false);
        setEditingVehicle(null);
        fetchVehicles();
      } else {
        notifyError("Không thể cập nhật xe", errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể cập nhật xe");
    }
  };

  // Xoá xe
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteVehicle(id);
      const { errCode, errMessage } = res.data;

      if (errCode === 0) {
        notifySuccess("Thành công", errMessage);
        fetchVehicles();
      } else {
        notifyError("Không thể xoá xe", errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá xe");
    }
  };

  // Xoá nhiều xe
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;

    try {
      setLoading(true);
      await Promise.all(ids.map((id) => deleteVehicle(id)));

      notifySuccess("Thành công", "Các xe đã được xoá khỏi hệ thống.");
      fetchVehicles();
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá các xe đã chọn");
    } finally {
      setLoading(false);
    }
  };

  return {
    vehicles,
    loading,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    editingVehicle,
    setEditingVehicle,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    contextHolder,
  };
}
