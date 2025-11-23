// src/hooks/userHooks/useDriverManage.ts
import { useEffect, useState } from "react";
import { Form } from "antd";
import {
  getAllDrivers,
  createDriver,
  editDriver,
  deleteDriver,
  getDriverById,
} from "../../services/userServices/driverService";
import { AppNotification } from "../../components/Notification/AppNotification.tsx";

export interface Driver {
  id: number;
  userCode: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  address?: string;
  dateOfBirth?: string;
  citizenId?: string;
}

export function useDrivers() {
  // Danh sách tài xế
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);

  // Xem chi tiết
  const [viewDriver, setViewDriver] = useState<Driver | null>(null);

  // Trạng thái modal
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);

  // Tài xế đang chỉnh sửa
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // Lấy danh sách tài xế
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await getAllDrivers();
      if (res.data.errCode === 0) {
        const list = (res.data.data || []).map((drv: any) => ({
          ...drv,
          address: drv.staffDetail?.address || "",
          dateOfBirth: drv.staffDetail?.dateOfBirth || "",
          citizenId: drv.staffDetail?.citizenId || "",
        }));
        setDrivers(list);
      } else {
        notifyError("Không thể tải danh sách", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách tài xế.");
    } finally {
      setLoading(false);
    }
  };

  // Load khi mở trang
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Thêm tài xế mới
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const res = await createDriver(values);

      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsAddModal(false);
        form.resetFields();
        fetchDrivers();
      } else {
        notifyError("Không thể thêm tài xế", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể thêm tài xế, vui lòng thử lại.");
    }
  };

  // Cập nhật tài xế
  const handleEdit = async () => {
    if (!editingDriver) return;

    try {
      const values = await editForm.validateFields();
      const res = await editDriver(editingDriver.id, values);

      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsEditModal(false);
        setEditingDriver(null);
        fetchDrivers();
      } else {
        notifyError("Không thể cập nhật tài xế", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể cập nhật tài xế.");
    }
  };

  // Xóa một tài xế
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteDriver(id);
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        fetchDrivers();
      } else {
        notifyError("Không thể xoá tài xế", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá tài xế.");
    }
  };

  // Xóa nhiều tài xế
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;

    try {
      setLoading(true);
      await Promise.all(ids.map((id) => deleteDriver(id)));

      notifySuccess("Thành công", "Các tài xế đã được xoá khỏi hệ thống.");
      fetchDrivers();
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá các tài xế đã chọn.");
    } finally {
      setLoading(false);
    }
  };

  // Xem chi tiết tài xế
  const handleView = async (id: number) => {
    try {
      const res = await getDriverById(id);

      if (res.data.errCode !== 0) {
        notifyError("Không thể tải thông tin tài xế", res.data.errMessage);
        return;
      }

      const drv = res.data.data;
      setViewDriver({
        ...drv,
        address: drv.staffDetail?.address || "",
        dateOfBirth: drv.staffDetail?.dateOfBirth || "",
        citizenId: drv.staffDetail?.citizenId || "",
      });

      setIsViewModal(true);
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải thông tin tài xế.");
    }
  };

  return {
    drivers,
    loading,
    viewDriver,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    isViewModal,
    setIsViewModal,
    editingDriver,
    setEditingDriver,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleView,
    contextHolder,
  };
}
