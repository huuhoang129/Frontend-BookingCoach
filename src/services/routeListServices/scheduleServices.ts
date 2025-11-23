// src/services/routeListServices/scheduleServices.ts
import requestAPI from "../../api/requestAPI";

// Lấy tất cả lịch trình
const getAllSchedules = () => {
  return requestAPI.get(`/schedules`);
};

// Lấy lịch trình theo id
const getScheduleById = (id: number | string) => {
  return requestAPI.get(`/schedules/${id}`);
};

// Tạo lịch trình mới
const createSchedule = (data: any) => {
  return requestAPI.post(`/schedules`, data);
};

// Cập nhật lịch trình
const updateSchedule = (id: number | string, data: any) => {
  return requestAPI.put(`/schedules/${id}`, data);
};

// Xóa lịch trình
const deleteSchedule = (id: number | string) => {
  return requestAPI.delete(`/schedules/${id}`);
};

// Sinh chuyến từ lịch trình
const generateTripsFromSchedules = () => {
  return requestAPI.post(`/schedules/generate-trips`);
};

export {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  generateTripsFromSchedules,
};
