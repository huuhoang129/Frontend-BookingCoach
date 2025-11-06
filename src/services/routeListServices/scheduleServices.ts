import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ---------- SCHEDULES ----------

// Lấy tất cả lịch trình
const getAllSchedules = () => axios.get(`${API_URL}/schedules`);

// Lấy lịch trình theo id
const getScheduleById = (id: number | string) =>
  axios.get(`${API_URL}/schedules/${id}`);

// Tạo lịch trình mới
const createSchedule = (data: any) => axios.post(`${API_URL}/schedules`, data);

// Cập nhật lịch trình
const updateSchedule = (id: number | string, data: any) =>
  axios.put(`${API_URL}/schedules/${id}`, data);

// Xóa lịch trình
const deleteSchedule = (id: number | string) =>
  axios.delete(`${API_URL}/schedules/${id}`);

// Sinh chuyến từ lịch trình
const generateTripsFromSchedules = () =>
  axios.post(`${API_URL}/schedules/generate-trips`);

export {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  generateTripsFromSchedules,
};
