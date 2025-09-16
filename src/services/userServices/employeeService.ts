import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ✅ Lấy tất cả nhân viên
export const getAllEmployees = async () => {
  return axios.get(`${API_URL}/get-all-employee`);
};

// ✅ Lấy chi tiết nhân viên theo id
export const getEmployeeById = async (id: number) => {
  return axios.get(`${API_URL}/get-employee-by-id`, {
    params: { id }, // gửi query param
  });
};

// ✅ Tạo nhân viên mới
export const createEmployee = async (data: any) => {
  return axios.post(`${API_URL}/create-employee`, data);
};

// ✅ Sửa thông tin nhân viên
export const editEmployee = async (data: any) => {
  return axios.put(`${API_URL}/edit-employee`, data);
};

// ✅ Xoá nhân viên
export const deleteEmployee = async (id: number) => {
  return axios.delete(`${API_URL}/delete-employee`, {
    data: { id }, // 👈 gửi id qua body
  });
};
