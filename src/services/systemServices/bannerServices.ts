import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

const getAllBanners = () => {
  return axios.get(`${API_URL}/get-banner`);
};

const getAllBannerById = (id: number) => {
  return axios.get(`${API_URL}/get-banner-by-id?id=${id}`);
};

const editBanner = (data: any) => {
  return axios.put(`${API_URL}/edit-banner`, data);
};
const createBanner = (values: any) => {
  return axios.post(`${API_URL}/create-banner`, values);
};
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
