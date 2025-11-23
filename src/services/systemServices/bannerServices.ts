// src/services/systemServices/bannerServices.ts
import requestAPI from "../../api/requestAPI";

// lấy danh sách banner
const getAllBanners = () => {
  return requestAPI.get(`/get-banner`);
};

// lấy banner theo id
const getAllBannerById = (id: number) => {
  return requestAPI.get(`/get-banner-by-id?id=${id}`);
};

// thêm mới banner
const createBanner = (values: any) => {
  return requestAPI.post(`/create-banner`, values);
};

// cập nhật banner
const editBanner = (data: any) => {
  return requestAPI.put(`/edit-banner`, data);
};

// xóa banner
const deleteBanner = (id: number) => {
  return requestAPI.delete(`/delete-banner`, {
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
