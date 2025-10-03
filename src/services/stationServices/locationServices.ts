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

const updateProvince = (id: number | string, data: any) => {
  return axios.put(`${API_URL}/provinces/${id}`, data);
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

const updateLocation = (id: number | string, data: any) => {
  return axios.put(`${API_URL}/locations/${id}`, data);
};

const deleteLocation = (id: number | string) => {
  return axios.delete(`${API_URL}/locations/${id}`);
};

const getLocationsTree = () => {
  return axios.get(`${API_URL}/locations-tree`);
};

export {
  getAllProvinces,
  getProvinceById,
  createProvince,
  updateProvince,
  deleteProvince,
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationsTree,
};
