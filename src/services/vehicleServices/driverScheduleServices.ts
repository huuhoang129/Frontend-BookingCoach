// src/services/vehicleServices/driverScheduleServices.ts
import requestAPI from "../../api/requestAPI";

// Lấy toàn bộ lịch làm việc tài xế
const getAllDriverSchedules = () => {
  return requestAPI.get("/driver-schedules");
};

// Lấy chi tiết lịch theo ID
const getDriverScheduleById = (id: number | string) => {
  return requestAPI.get(`/driver-schedules/${id}`);
};

// Tạo mới lịch làm việc
const createDriverSchedule = (data: any) => {
  return requestAPI.post("/driver-schedules", data);
};

// Cập nhật lịch làm việc
const updateDriverSchedule = (id: number | string, data: any) => {
  return requestAPI.put("/driver-schedules", { id, ...data });
};

// Xóa lịch làm việc
const deleteDriverSchedule = (id: number | string) => {
  return requestAPI.delete(`/driver-schedules/${id}`);
};

// Lấy danh sách tất cả tài xế
const getAllDrivers = () => {
  return requestAPI.get("/drivers-all");
};

export {
  getAllDriverSchedules,
  getDriverScheduleById,
  createDriverSchedule,
  updateDriverSchedule,
  deleteDriverSchedule,
  getAllDrivers,
};
