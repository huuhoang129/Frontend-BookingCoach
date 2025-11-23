// src/services/systemServices/staticPageServices.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== STATIC PAGE ====================

// Tải lên hình ảnh
const uploadImage = (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_URL}/upload/${folder}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Lấy nội dung trang tĩnh theo pageKey
const getStaticPage = (pageKey: string) => {
  return axios.get(`${API_URL}/static-page/${pageKey}`);
};

// Cập nhật nội dung trang tĩnh theo pageKey
const updateStaticPage = (pageKey: string, blocks: any[]) => {
  return axios.put(`${API_URL}/static-page/${pageKey}`, { blocks });
};

export { uploadImage, getStaticPage, updateStaticPage };
