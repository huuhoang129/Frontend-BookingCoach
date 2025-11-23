// src/hooks/userHooks/useUserManage.ts
import { useEffect, useState } from "react";
import { Form } from "antd";
import {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
} from "../../services/userServices/userService";
import { AppNotification } from "../../components/Notification/AppNotification.tsx";

export function useUserManage() {
  // Danh sách người dùng
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Trạng thái modal
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);

  // Người dùng đang chỉnh sửa
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();

      if (res.data.errCode === 0) {
        setUsers(res.data.data || []);
      } else {
        notifyError("Không thể tải danh sách", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  // Load khi mở trang
  useEffect(() => {
    fetchUsers();
  }, []);

  // Thêm người dùng mới
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const res = await createUser(values);

      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsAddModal(false);
        form.resetFields();
        fetchUsers();
      } else {
        notifyError("Không thể thêm người dùng", res.data.errMessage);
      }
    } catch {
      notifyError(
        "Lỗi hệ thống",
        "Không thể thêm người dùng, vui lòng thử lại."
      );
    }
  };

  // Cập nhật thông tin người dùng
  const handleEdit = async () => {
    if (!editingUser) return;

    try {
      const values = await editForm.validateFields();
      const res = await editUser({ id: editingUser.id, ...values });

      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsEditModal(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        notifyError("Không thể cập nhật người dùng", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể cập nhật người dùng.");
    }
  };

  // Xóa một người dùng
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteUser(id);

      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        fetchUsers();
      } else {
        notifyError("Không thể xoá người dùng", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá người dùng.");
    }
  };

  // Xóa nhiều người dùng
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;

    try {
      setLoading(true);
      await Promise.all(ids.map((id) => deleteUser(id)));

      notifySuccess("Thành công", "Các người dùng đã được xoá khỏi hệ thống.");
      fetchUsers();
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá các người dùng đã chọn.");
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    editingUser,
    setEditingUser,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    contextHolder,
  };
}
