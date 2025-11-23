// src/services/systemServices/newServices.ts
import requestAPI from "../../api/requestAPI";

// ==================== NEWS ====================

// Lấy tất cả tin tức
const getAllNews = () => {
  return requestAPI.get(`/news`);
};

// Lấy tin tức theo id
const getNewsById = (id: number) => {
  return requestAPI.get(`/news/${id}`);
};

// Thêm mới tin tức
const createNews = (data: any) => {
  return requestAPI.post(`/news`, data);
};

// Cập nhật tin tức
const updateNews = (data: any) => {
  return requestAPI.put(`/news`, data);
};

// Xóa tin tức
const deleteNews = (id: number) => {
  return requestAPI.delete(`/news/${id}`);
};

export { getAllNews, getNewsById, createNews, updateNews, deleteNews };
