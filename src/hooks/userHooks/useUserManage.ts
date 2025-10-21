// src/hooks/AdminHooks/useUserManage.ts
import { useEffect, useState } from "react";
import { Form, message } from "antd";
import {
  getAllUsers,
  editUser,
  deleteUser,
  createUser,
} from "../../services/userServices/userService";

export function useUserManage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      if (res.data.errCode === 0) {
        setUsers(res.data.data || []);
      }
    } catch (err) {
      console.error("❌ Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const res = await createUser(values);
      if (res.data.errCode === 0) {
        message.success("Thêm người dùng thành công!");
        setIsAddOpen(false);
        form.resetFields();
        fetchUsers();
      } else {
        message.error(res.data.errMessage || "Lỗi khi thêm người dùng");
      }
    } catch (err) {
      console.error("❌ Add user error:", err);
    }
  };

  // Edit user
  const handleEdit = async () => {
    if (!editingUser) return;
    try {
      const values = await editForm.validateFields();
      const res = await editUser({ id: editingUser.id, ...values });
      if (res.data.errCode === 0) {
        message.success("Cập nhật thành công!");
        setIsEditOpen(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        message.error(res.data.errMessage || "Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("❌ Edit error:", err);
    }
  };

  // Delete user
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteUser(id);
      if (res.data.errCode === 0) {
        message.success("Xoá người dùng thành công!");
        fetchUsers();
      } else {
        message.error(res.data.errMessage || "Xoá thất bại!");
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  // Search
  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  return {
    users,
    loading,
    searchText,
    setSearchText,
    filteredUsers,
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    editingUser,
    setEditingUser,
    form,
    editForm,
    handleAdd,
    handleEdit,
    handleDelete,
    fetchUsers,
  };
}
