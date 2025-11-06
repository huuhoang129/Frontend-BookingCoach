//src/hooks/vehicleHooks/useVehicles.ts
import { useEffect, useState } from "react";
import { Form } from "antd";
import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../services/vehicleServices/vehicleServices";
import { AppNotification } from "../../components/Notification/AppNotification.tsx";

// type
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
  // state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  const configByType: Record<
    string,
    { numberFloors: number; seatCount: number }
  > = {
    NORMAL: { numberFloors: 1, seatCount: 45 },
    LIMOUSINE: { numberFloors: 1, seatCount: 9 },
    SLEEPER: { numberFloors: 2, seatCount: 36 },
    DOUBLESLEEPER: { numberFloors: 2, seatCount: 22 },
  };

  // fetche vehicle
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await getAllVehicles();
      if (res.data.errCode === 0) setVehicles(res.data.data);
      else notifyError("Không thể tải danh sách xe", res.data.errMessage);
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách xe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // ===== CRUD =====
  // thêm xe mới
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const config = configByType[values.type];
      const payload = { ...values, ...config };

      const res = await createVehicle(payload);
      if (res.data.errCode === 0) {
        notifySuccess("Thêm mới thành công", "Xe đã được thêm vào hệ thống.");
        setIsAddModal(false);
        form.resetFields();
        fetchVehicles();
      } else {
        notifyError("Không thể thêm xe", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể thêm xe, vui lòng thử lại.");
    }
  };

  // cập nhật xe
  const handleEdit = async () => {
    if (!editingVehicle) return;
    try {
      const values = await editForm.validateFields();
      const config = configByType[values.type];
      const payload = { id: editingVehicle.id, ...values, ...config };

      const res = await updateVehicle(editingVehicle.id, payload);
      if (res.data.errCode === 0) {
        notifySuccess("Cập nhật thành công", "Thông tin xe đã được cập nhật.");
        setIsEditModal(false);
        setEditingVehicle(null);
        fetchVehicles();
      } else {
        notifyError("Không thể cập nhật xe", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể cập nhật xe.");
    }
  };

  // xoá xe
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteVehicle(id);
      if (res.data.errCode === 0) {
        notifySuccess("Xoá thành công", "Xe đã được xoá khỏi hệ thống.");
        fetchVehicles();
      } else {
        notifyError("Không thể xoá xe", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá xe.");
    }
  };

  // xoá nhiều xe
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;
    try {
      setLoading(true);
      await Promise.all(ids.map((id) => deleteVehicle(id)));
      notifySuccess(
        "Xoá thành công",
        "Các xe đã chọn đã được xoá khỏi hệ thống."
      );
      fetchVehicles();
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá các xe đã chọn.");
    } finally {
      setLoading(false);
    }
  };

  // return
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
