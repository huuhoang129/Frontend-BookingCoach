// UI – Table & Pagination
import BaseTable from "../../../components/ui/Table/Table";
// UI – Buttons
import DeleteButton from "../../../components/ui/Button/Delete";
import EditButton from "../../../components/ui/Button/Edit";
import QuickViewButton from "../../../components/ui/Button/quickView";
import {
  getAllEmployees,
  editEmployee,
  deleteEmployee,
  getEmployeeById,
  createEmployee,
} from "../../../services/userServices/employeeService.ts";
import { useEffect, useState } from "react";
import { Dropdown } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { CustomModal } from "../../../components/ui/Modal/Modal";
import { FormInput } from "../../../components/ui/Form/FormInput";
import { FormSelect } from "../../../components/ui/Form/FormSelect";
import { FormDatePicker } from "../../../components/ui/Form/FormDatePicker";
import { FormViewItem } from "../../../components/ui/Form/FormViewItem";
import Pagination from "../../../components/ui/Pagination/Pagination";
import CreateButton from "../../../components/ui/Button/Create";

interface Employee {
  id: number;
  employeeCode: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  address?: string;
  dateOfBirth?: string;
  citizenId?: string;
}

export default function EmployeeManage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // số nhân viên mỗi trang
  const [openCreate, setOpenCreate] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("");
  // 👉 State cho modal
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  // 1. lọc danh sách theo roleFilter
  const filteredEmployees = roleFilter
    ? employees.filter((emp) => emp.role === roleFilter)
    : employees;

  // 2. phân trang trên danh sách đã lọc
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleOpenView = async (id: number) => {
    try {
      const res = await getEmployeeById(id);
      const emp = res.data?.data || res.data;

      setViewEmployee({
        ...emp,
        address: emp.staffDetail?.address || "",
        dateOfBirth: emp.staffDetail?.dateOfBirth || "",
        citizenId: emp.staffDetail?.citizenId || "",
      });

      setOpenView(true);
    } catch (error) {
      console.error("❌ Lỗi khi lấy nhân viên:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getAllEmployees();
      const employees = (res.data.data || []).map((emp: any) => ({
        ...emp,
        address: emp.staffDetail?.address || "",
        dateOfBirth: emp.staffDetail?.dateOfBirth || "",
        citizenId: emp.staffDetail?.citizenId || "",
      }));
      setEmployees(employees);
    } catch (err) {
      console.error("❌ Lỗi khi fetch employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (values: any) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        role: values.role,
        address: values.address,
        dateOfBirth: values.dateOfBirth,
        citizenId: values.citizenId,
      };

      await createEmployee(payload);
      alert("Thêm mới nhân viên thành công!");

      setOpenCreate(false);
      fetchEmployees(); // load lại danh sách
    } catch (error) {
      console.error("❌ Lỗi thêm mới:", error);
      alert("Thêm mới thất bại!");
    }
  };

  const handleOpenEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenEdit(true);
  };

  const handleEditSubmit = async (values: any) => {
    if (!selectedEmployee) return;
    try {
      const payload = {
        id: selectedEmployee.id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        role: values.role,
        address: values.address,
        dateOfBirth: values.dateOfBirth,
        citizenId: values.citizenId,
      };

      await editEmployee(payload);
      alert("Cập nhật nhân viên thành công!");
      setOpenEdit(false);
      fetchEmployees();
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      alert("Xoá nhân viên thành công!");
      fetchEmployees();
    } catch (error) {
      console.error("❌ Lỗi khi xoá:", error);
      alert("Xoá thất bại!");
    }
  };

  // Menu filter role
  const roleMenu = {
    items: [
      { key: "", label: "Tất cả" },
      { key: "Driver", label: "Driver" },
      { key: "Staff", label: "Staff" },
    ],
    onClick: (e: any) => {
      setRoleFilter(e.key);
    },
  };

  return (
    <div className="panel-employee-admin">
      <div>
        <h2>Quản Lý Nhân Viên</h2>
        <CreateButton onClick={() => setOpenCreate(true)}>
          + Thêm mới nhân viên
        </CreateButton>

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
          <FormDatePicker
            name="dateOfBirth"
            label="Ngày sinh"
            placeholder="Chọn ngày sinh"
          />
          <FormInput name="citizenId" label="CMND/CCCD" />
        </CustomModal>
      </div>
      <div>
        <BaseTable>
          <thead>
            <tr>
              <th>Mã Nhân Viên</th>
              <th style={{ width: "250px" }}>Email</th>
              <th style={{ width: "150px" }}>Số điện thoại</th>
              <th style={{ width: "100px" }}>
                Vai trò{" "}
                <Dropdown menu={roleMenu} trigger={["click"]}>
                  <FilterOutlined
                    style={{
                      cursor: "pointer",
                      color: roleFilter ? "#FFFF99" : "inherit", // xanh khi có filter
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
                <td
                  colSpan={6}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  Đang tải...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  Không có nhân viên nào
                </td>
              </tr>
            ) : (
              currentEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.employeeCode}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phoneNumber}</td>
                  <td>{employee.role}</td>
                  <td>
                    <QuickViewButton
                      onClick={() => handleOpenView(employee.id)}
                    >
                      Xem
                    </QuickViewButton>
                    <EditButton onClick={() => handleOpenEdit(employee)}>
                      Sửa
                    </EditButton>
                    <DeleteButton onClick={() => handleDelete(employee.id)}>
                      Xoá
                    </DeleteButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </BaseTable>
      </div>
      {/* Modal sửa nhân viên */}
      <CustomModal
        open={openEdit}
        title="Chỉnh sửa nhân viên"
        onClose={() => setOpenEdit(false)}
        onSubmit={handleEditSubmit}
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
        <FormDatePicker
          name="dateOfBirth"
          label="Ngày sinh"
          placeholder="Chọn ngày sinh"
        />
        <FormInput name="citizenId" label="CMND/CCCD" />
      </CustomModal>

      <CustomModal
        open={openView}
        title="Thông tin nhân viên"
        onClose={() => setOpenView(false)}
        onSubmit={() => {}}
        initialValues={{}}
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

      <div>
        <Pagination
          totalItems={employees.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
