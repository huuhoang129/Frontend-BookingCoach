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
  // state
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // fetch
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== CRUD =====
  // thêm mới
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const res = await createUser(values);
      if (res.data.errCode === 0) {
        notifySuccess(
          "Thêm mới thành công",
          "Người dùng đã được thêm vào hệ thống."
        );
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

  // cập nhật
  const handleEdit = async () => {
    if (!editingUser) return;
    try {
      const values = await editForm.validateFields();
      const res = await editUser({ id: editingUser.id, ...values });
      if (res.data.errCode === 0) {
        notifySuccess(
          "Cập nhật thành công",
          "Thông tin người dùng đã được cập nhật."
        );
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

  // xoá
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteUser(id);
      if (res.data.errCode === 0) {
        notifySuccess(
          "Xoá thành công",
          "Người dùng đã được xoá khỏi hệ thống."
        );
        fetchUsers();
      } else {
        notifyError("Không thể xoá người dùng", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá người dùng.");
    }
  };

  // xoá nhiều
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;
    try {
      setLoading(true);
      await Promise.all(ids.map((id) => deleteUser(id)));
      notifySuccess(
        "Xoá thành công",
        "Các người dùng đã chọn đã được xoá khỏi hệ thống."
      );
      fetchUsers();
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá các người dùng đã chọn.");
    } finally {
      setLoading(false);
    }
  };

  // return
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
