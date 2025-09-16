// UI – Table & Pagination
import BaseTable from "../../../components/ui/Table/Table";
// UI – Buttons
import DeleteButton from "../../../components/ui/Button/Delete";
import EditButton from "../../../components/ui/Button/Edit";
import CreateButton from "../../../components/ui/Button/Create"; // 👈 thêm nút tạo mới
import {
  getAllUsers,
  editUser,
  deleteUser,
  createUser, // 👈 API thêm mới
} from "../../../services/userServices/userService.ts";
import { useEffect, useState } from "react";
import { CustomModal } from "../../../components/ui/Modal/Modal";
import { FormInput } from "../../../components/ui/Form/FormInput";
import Pagination from "../../../components/ui/Pagination/Pagination";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userCode?: string;
}

export default function UserManage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // 👉 State cho modal edit
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 👉 State cho modal create
  const [openCreate, setOpenCreate] = useState(false);

  // 👉 State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // 👉 Submit create
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

  // 👉 Phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  return (
    <div className="panel-user-admin">
      <div>
        <h2>Quản Lý Người Dùng</h2>
        <CreateButton onClick={() => setOpenCreate(true)}>
          + Thêm mới người dùng
        </CreateButton>
      </div>

      {/* Bảng users */}
      <div>
        <BaseTable>
          <thead>
            <tr>
              <th>Mã Khách Hàng</th>
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
            ) : currentUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  Không có người dùng nào
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.userCode}</td>
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

      {/* Pagination */}
      <Pagination
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Modal thêm user */}
      <CustomModal
        open={openCreate}
        title="Thêm Người Dùng"
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateSubmit}
      >
        <FormInput name="email" label="Email" />
        <FormInput name="password" label="Mật khẩu" />
        <FormInput name="firstName" label="Tên đầu" />
        <FormInput name="lastName" label="Tên cuối" />
        <FormInput name="phoneNumber" label="Số điện thoại" />
      </CustomModal>

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
