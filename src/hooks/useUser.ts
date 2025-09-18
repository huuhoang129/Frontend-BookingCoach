import { useEffect, useState } from "react";
import {
  getAllUsers,
  editUser,
  deleteUser,
  createUser,
} from "../services/userServices/userService.ts";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userCode?: string;
}

export function useUserManage(itemsPerPage = 6) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleEditSubmit = async (values: any) => {
    if (!selectedUser) return;
    try {
      const payload = { id: selectedUser.id, ...values };
      await editUser(payload);
      alert("Cập nhật thành công!");
      setOpenEdit(false);
      fetchUsers();
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const handleCreateSubmit = async (values: any) => {
    try {
      await createUser(values);
      alert("Thêm mới thành công!");
      setOpenCreate(false);
      fetchUsers();
    } catch (error) {
      console.error("❌ Lỗi khi thêm user:", error);
      alert("Thêm thất bại!");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      alert("Xoá thành công!");
      fetchUsers();
    } catch (error) {
      console.error("❌ Lỗi khi xoá user:", error);
      alert("Xoá thất bại!");
    }
  };

  // Pagination data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  return {
    users,
    loading,
    openEdit,
    selectedUser,
    openCreate,
    currentPage,
    itemsPerPage,
    currentUsers,

    // actions
    setOpenEdit,
    setOpenCreate,
    setCurrentPage,
    handleOpenEdit,
    handleEditSubmit,
    handleCreateSubmit,
    handleDelete,
  };
}
