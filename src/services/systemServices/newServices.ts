import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

const getAllNews = () => {
  return axios.get(`${API_URL}/news`);
};

const getNewsById = (id: number) => {
  return axios.get(`${API_URL}/news/${id}`);
};

const createNews = (data: any) => {
  return axios.post(`${API_URL}/news`, data);
};

const updateNews = (data: any) => {
  return axios.put(`${API_URL}/news`, data);
};

const deleteNews = (id: number) => {
  return axios.delete(`${API_URL}/news/${id}`);
};

export { getAllNews, getNewsById, createNews, updateNews, deleteNews };
