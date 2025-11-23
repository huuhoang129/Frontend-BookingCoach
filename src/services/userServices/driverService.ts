// src/services/userServices/driverService.ts
import requestAPI from "../../api/requestAPI";

// Lấy tất cả tài xế
const getAllDrivers = () => {
  return requestAPI.get("/drivers");
};

// Lấy chi tiết tài xế theo id
const getDriverById = (id: number) => {
  return requestAPI.get(`/drivers/${id}`);
};

// Tạo tài xế mới
const createDriver = (data: any) => {
  return requestAPI.post("/drivers", data);
};

// Cập nhật thông tin tài xế
const editDriver = (id: number, data: any) => {
  return requestAPI.put(`/drivers/${id}`, data);
};

// Xoá tài xế
const deleteDriver = (id: number) => {
  return requestAPI.delete(`/drivers/${id}`);
};

export { getAllDrivers, getDriverById, createDriver, editDriver, deleteDriver };
