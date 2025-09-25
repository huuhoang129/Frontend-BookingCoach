import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ---------- PROVINCES ----------
const getAllProvinces = () => {
  return axios.get(`${API_URL}/provinces`);
};

const getProvinceById = (id: number | string) => {
  return axios.get(`${API_URL}/provinces/${id}`);
};

const createProvince = (data: any) => {
  return axios.post(`${API_URL}/provinces`, data);
};

const deleteProvince = (id: number | string) => {
  return axios.delete(`${API_URL}/provinces/${id}`);
};

// ---------- LOCATIONS ----------
const getAllLocations = () => {
  return axios.get(`${API_URL}/locations`);
};

const getLocationById = (id: number | string) => {
  return axios.get(`${API_URL}/locations/${id}`);
};

const createLocation = (data: any) => {
  return axios.post(`${API_URL}/locations`, data);
};

const deleteLocation = (id: number | string) => {
  return axios.delete(`${API_URL}/locations/${id}`);
};

export {
  getAllProvinces,
  getProvinceById,
  createProvince,
  deleteProvince,
  getAllLocations,
  getLocationById,
  createLocation,
  deleteLocation,
};
