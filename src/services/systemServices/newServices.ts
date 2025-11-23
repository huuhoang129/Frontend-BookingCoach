// src/services/systemServices/newServices.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== NEWS ====================

// Lấy tất cả tin tức
const getAllNews = () => {
  return axios.get(`${API_URL}/news`);
};

// Lấy tin tức theo id
const getNewsById = (id: number) => {
  return axios.get(`${API_URL}/news/${id}`);
};

// Thêm mới tin tức
const createNews = (data: any) => {
  return axios.post(`${API_URL}/news`, data);
};

// Cập nhật tin tức
const updateNews = (data: any) => {
  return axios.put(`${API_URL}/news`, data);
};

// Xóa tin tức
const deleteNews = (id: number) => {
  return axios.delete(`${API_URL}/news/${id}`);
};

export { getAllNews, getNewsById, createNews, updateNews, deleteNews };
