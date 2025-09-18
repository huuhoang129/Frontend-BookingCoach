// hooks/useEmployees.ts
import { useState, useEffect } from "react";
import {
  getAllEmployees,
  createEmployee,
  editEmployee,
  deleteEmployee,
  getEmployeeById,
} from "../services/userServices/employeeService.ts";

export interface Employee {
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

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);

  // Fetch all employees
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

  // Create
  const handleCreateSubmit = async (values: any) => {
    try {
      await createEmployee(values);
      alert("Thêm mới nhân viên thành công!");
      fetchEmployees();
    } catch (error) {
      console.error("❌ Lỗi thêm mới:", error);
      alert("Thêm mới thất bại!");
    }
  };

  // Edit
  const handleEditSubmit = async (values: any, id: number) => {
    try {
      await editEmployee({ id, ...values });
      alert("Cập nhật nhân viên thành công!");
      fetchEmployees();
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };

  // Delete
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

  // View detail
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
    } catch (error) {
      console.error("❌ Lỗi khi lấy nhân viên:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    viewEmployee,
    fetchEmployees,
    handleCreateSubmit,
    handleEditSubmit,
    handleDelete,
    handleOpenView,
  };
}
