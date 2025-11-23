// src/services/vehicleServices/vehicleStatusServices.ts
import requestAPI from "../../api/requestAPI";

// ==================== VEHICLE STATUS ====================

// Lấy danh sách tình trạng xe
const getAllVehicleStatus = () => {
  return requestAPI.get(`/vehicle-status`);
};

// Lấy tình trạng xe theo id
const getVehicleStatusById = (id: number | string) => {
  return requestAPI.get(`/vehicle-status/${id}`);
};

// Tạo hoặc cập nhật tình trạng xe
const createOrUpdateVehicleStatus = (data: any) => {
  return requestAPI.post(`/vehicle-status`, data);
};

// Xoá tình trạng xe
const deleteVehicleStatus = (id: number | string) => {
  return requestAPI.delete(`/vehicle-status/${id}`);
};

export {
  getAllVehicleStatus,
  getVehicleStatusById,
  createOrUpdateVehicleStatus,
  deleteVehicleStatus,
};
