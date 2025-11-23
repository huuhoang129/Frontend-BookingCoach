// src/services/vehicleServices/driverScheduleServices.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== DRIVER SCHEDULE ====================

// Lấy toàn bộ lịch làm việc tài xế
const getAllDriverSchedules = () => axios.get(`${API_URL}/driver-schedules`);

// Lấy chi tiết lịch theo ID
const getDriverScheduleById = (id: number | string) =>
  axios.get(`${API_URL}/driver-schedules/${id}`);

// Tạo mới lịch làm việc
const createDriverSchedule = (data: any) =>
  axios.post(`${API_URL}/driver-schedules`, data);

// Cập nhật lịch làm việc
const updateDriverSchedule = (id: number | string, data: any) =>
  axios.put(`${API_URL}/driver-schedules`, { id, ...data });

// Xóa lịch làm việc
const deleteDriverSchedule = (id: number | string) =>
  axios.delete(`${API_URL}/driver-schedules/${id}`);

const getAllDrivers = () => axios.get(`${API_URL}/drivers-all`);

export {
  getAllDriverSchedules,
  getDriverScheduleById,
  createDriverSchedule,
  updateDriverSchedule,
  deleteDriverSchedule,
  getAllDrivers,
};
