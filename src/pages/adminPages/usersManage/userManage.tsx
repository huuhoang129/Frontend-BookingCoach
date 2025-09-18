import BaseTable from "../../../components/ui/Table/Table";
import DeleteButton from "../../../components/ui/Button/Delete";
import EditButton from "../../../components/ui/Button/Edit";
import CreateButton from "../../../components/ui/Button/Create";
import { CustomModal } from "../../../components/ui/Modal/Modal";
import { FormInput } from "../../../components/ui/Form/FormInput";
import Pagination from "../../../components/ui/Pagination/Pagination";
import { useUserManage } from "../../../hooks/useUser.ts";

export default function UserManage() {
  const {
    users,
    loading,
    openEdit,
    selectedUser,
    openCreate,
    currentPage,
    itemsPerPage,
    currentUsers,
    setOpenEdit,
    setOpenCreate,
    setCurrentPage,
    handleOpenEdit,
    handleEditSubmit,
    handleCreateSubmit,
    handleDelete,
  } = useUserManage();

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
              <th style={{ width: "150px" }}>Mã Khách Hàng</th>
              <th style={{ width: "250px" }}>Email</th>
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
                  colSpan={6}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  Đang tải...
                </td>
              </tr>
            ) : currentUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
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

      {/* Modal user */}
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

      {/* Modal user */}
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
