import { useState } from "react";
import BaseTable from "../../../components/ui/Table/Table";
import DeleteButton from "../../../components/ui/Button/Delete";
import EditButton from "../../../components/ui/Button/Edit";
import QuickViewButton from "../../../components/ui/Button/quickView";
import CreateButton from "../../../components/ui/Button/Create";
import { Dropdown } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { CustomModal } from "../../../components/ui/Modal/Modal";
import { FormInput } from "../../../components/ui/Form/FormInput";
import { FormSelect } from "../../../components/ui/Form/FormSelect";
import { FormDatePicker } from "../../../components/ui/Form/FormDatePicker";
import { FormViewItem } from "../../../components/ui/Form/FormViewItem";
import Pagination from "../../../components/ui/Pagination/Pagination";
import { useEmployees } from "../../../hooks/useEmployees";
import type { Employee } from "../../../hooks/useEmployees";

export default function EmployeeManage() {
  const {
    employees,
    loading,
    viewEmployee,
    handleCreateSubmit,
    handleEditSubmit,
    handleDelete,
    handleOpenView,
  } = useEmployees();

  const [currentPage, setCurrentPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [roleFilter, setRoleFilter] = useState<string>("");

  const itemsPerPage = 6;
  const filteredEmployees = roleFilter
    ? employees.filter((emp) => emp.role === roleFilter)
    : employees;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Filter menu
  const roleMenu = {
    items: [
      { key: "", label: "Tất cả" },
      { key: "Driver", label: "Driver" },
      { key: "Staff", label: "Staff" },
    ],
    onClick: (e: any) => setRoleFilter(e.key),
  };

  return (
    <div className="panel-employee-admin">
      <h2>Quản Lý Nhân Viên</h2>
      <CreateButton onClick={() => setOpenCreate(true)}>
        + Thêm mới nhân viên
      </CreateButton>

      <BaseTable>
        <thead>
          <tr>
            <th>Mã Nhân Viên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>
              Vai trò{" "}
              <Dropdown menu={roleMenu} trigger={["click"]}>
                <FilterOutlined
                  style={{
                    cursor: "pointer",
                    color: roleFilter ? "#FFFF99" : "inherit",
                  }}
                />
              </Dropdown>
            </th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Đang tải...
              </td>
            </tr>
          ) : (
            currentEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.employeeCode}</td>
                <td>{emp.email}</td>
                <td>{emp.phoneNumber}</td>
                <td>{emp.role}</td>
                <td>
                  <QuickViewButton
                    onClick={async () => {
                      await handleOpenView(emp.id);
                      setOpenView(true);
                    }}
                  >
                    Xem
                  </QuickViewButton>
                  <EditButton
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setOpenEdit(true);
                    }}
                  >
                    Sửa
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(emp.id)}>
                    Xoá
                  </DeleteButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </BaseTable>

      {/* Modal Create */}
      <CustomModal
        open={openCreate}
        title="Thêm nhân viên"
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateSubmit}
      >
        <FormInput name="firstName" label="Tên đầu" />
        <FormInput name="lastName" label="Tên cuối" />
        <FormInput name="email" label="Email" />
        <FormInput name="phoneNumber" label="Số điện thoại" />
        <FormSelect
          name="role"
          label="Vai trò"
          options={[
            { label: "Nhân viên", value: "Staff" },
            { label: "Tài xế", value: "Driver" },
          ]}
        />
        <FormInput name="address" label="Địa chỉ" />
        <FormDatePicker name="dateOfBirth" label="Ngày sinh" />
        <FormInput name="citizenId" label="CMND/CCCD" />
      </CustomModal>

      {/* Modal Edit */}
      <CustomModal
        open={openEdit}
        title="Chỉnh sửa nhân viên"
        onClose={() => setOpenEdit(false)}
        onSubmit={(values) =>
          selectedEmployee && handleEditSubmit(values, selectedEmployee.id)
        }
        initialValues={selectedEmployee || {}}
      >
        <FormInput name="firstName" label="Tên đầu" />
        <FormInput name="lastName" label="Tên cuối" />
        <FormInput name="email" label="Email" />
        <FormInput name="phoneNumber" label="Số điện thoại" />
        <FormSelect
          name="role"
          label="Vai trò"
          options={[
            { label: "Nhân viên", value: "Staff" },
            { label: "Tài xế", value: "Driver" },
          ]}
        />
        <FormInput name="address" label="Địa chỉ" />
        <FormDatePicker name="dateOfBirth" label="Ngày sinh" />
        <FormInput name="citizenId" label="CMND/CCCD" />
      </CustomModal>

      {/* Modal View */}
      <CustomModal
        open={openView}
        title="Thông tin nhân viên"
        onClose={() => setOpenView(false)}
        onSubmit={() => {}}
      >
        {viewEmployee && (
          <>
            <FormViewItem
              label="Mã nhân viên"
              value={viewEmployee.employeeCode}
            />
            <FormViewItem label="Tên đầu" value={viewEmployee.firstName} />
            <FormViewItem label="Tên cuối" value={viewEmployee.lastName} />
            <FormViewItem label="Email" value={viewEmployee.email} />
            <FormViewItem
              label="Số điện thoại"
              value={viewEmployee.phoneNumber}
            />
            <FormViewItem label="Vai trò" value={viewEmployee.role} />
            <FormViewItem label="Địa chỉ" value={viewEmployee.address} />
            <FormViewItem label="Ngày sinh" value={viewEmployee.dateOfBirth} />
            <FormViewItem label="CMND/CCCD" value={viewEmployee.citizenId} />
          </>
        )}
      </CustomModal>

      {/* Pagination */}
      <Pagination
        totalItems={employees.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
