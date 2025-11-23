//src/services/systemServices/bannerServices.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== BANNER ====================

// lấy danh sách banner
const getAllBanners = () => {
  return axios.get(`${API_URL}/get-banner`);
};

// lấy banner theo id
const getAllBannerById = (id: number) => {
  return axios.get(`${API_URL}/get-banner-by-id?id=${id}`);
};

// thêm mới banner
const createBanner = (values: any) => {
  return axios.post(`${API_URL}/create-banner`, values);
};

// cập nhật banner
const editBanner = (data: any) => {
  return axios.put(`${API_URL}/edit-banner`, data);
};

// xóa banner
const deleteBanner = (id: number) => {
  return axios.delete(`${API_URL}/delete-banner`, {
    data: { id },
  });
};

export {
  getAllBanners,
  getAllBannerById,
  createBanner,
  editBanner,
  deleteBanner,
};
