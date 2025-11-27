import requestAPI from "../../api/requestAPI";

// Lấy tất cả yêu cầu
export const getAllCancellations = () => {
  return requestAPI.get("/booking-cancellations");
};

// Lấy theo ID
export const getCancellationById = (id: number | string) => {
  return requestAPI.get(`/booking-cancellations/${id}`);
};

// Tạo (ít dùng ở admin)
export const createCancellation = (data: any) => {
  return requestAPI.post("/booking-cancellations", data);
};

// Update trạng thái
export const updateCancellation = (id: number, data: any) => {
  return requestAPI.put(`/booking-cancellations/${id}`, data);
};

// Xóa yêu cầu
export const deleteCancellation = (id: number) => {
  return requestAPI.delete(`/booking-cancellations/${id}`);
};
