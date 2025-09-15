// UI – Table & Pagination
import BaseTable from "../../../components/ui/Table/Table";
// UI – Buttons
import DeleteButton from "../../../components/ui/Button/Delete";
import EditButton from "../../../components/ui/Button/Edit";
import {
  getAllUsers,
  editUser,
  deleteUser,
} from "../../../services/userServices/userService.ts";
import { useEffect, useState } from "react";
import { CustomModal } from "../../../components/ui/Modal/Modal";
import { FormInput } from "../../../components/ui/Form/FormInput";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export default function UserManage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // 👉 State cho modal
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  // 👉 Mở modal edit
  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  // 👉 Submit edit
  const handleEditSubmit = async (values: any) => {
    if (!selectedUser) return;
    try {
      const payload = {
        id: selectedUser.id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
      };

      await editUser(payload);
      alert("Cập nhật thành công!");
      setOpenEdit(false);
      fetchUsers();
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };

  // 👉 Hàm xoá user
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

  return (
    <div className="panel-user-admin">
      <div>
        <h2>Quản Lý Người Dùng</h2>
      </div>
      <div>
        <BaseTable>
          <thead>
            <tr>
              <th style={{ width: "350px" }}>Email</th>
              <th>Tên đầu</th>
              <th>Tên cuối</th>
              <th>Số điện thoại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  Đang tải...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  Không có người dùng nào
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <EditButton onClick={() => handleOpenEdit(user)}>
                      Sửa
                    </EditButton>
                    <DeleteButton onClick={() => handleDelete(user.id)}>
                      Xoá
                    </DeleteButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </BaseTable>
      </div>

      {/* Modal sửa user */}
      <CustomModal
        open={openEdit}
        title="Chỉnh sửa người dùng"
        onClose={() => setOpenEdit(false)}
        onSubmit={handleEditSubmit}
        initialValues={selectedUser || {}}
      >
        <FormInput name="firstName" label="Tên đầu" />
        <FormInput name="lastName" label="Tên cuối" />
        <FormInput name="email" label="Email" />
        <FormInput name="phoneNumber" label="Số điện thoại" />
      </CustomModal>
    </div>
  );
}
