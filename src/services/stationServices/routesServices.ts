import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ---------- ROUTES ----------
const getAllRoutes = () => {
  return axios.get(`${API_URL}/routes`);
};

const getRouteById = (id: number | string) => {
  return axios.get(`${API_URL}/routes/${id}`);
};

const createRoute = (data: {
  fromLocationId: number | string;
  toLocationId: number | string;
  imageRouteCoach?: string;
}) => {
  return axios.post(`${API_URL}/routes`, data);
};

const updateRoute = (id: number | string, data: any) => {
  return axios.put(`${API_URL}/routes/${id}`, data);
};

const deleteRoute = (id: number | string) => {
  return axios.delete(`${API_URL}/routes/${id}`);
};

export { getAllRoutes, getRouteById, createRoute, deleteRoute, updateRoute };
