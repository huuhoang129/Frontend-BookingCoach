import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

const uploadImage = (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_URL}/upload/${folder}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const getStaticPage = (pageKey: string) => {
  return axios.get(`${API_URL}/static-page/${pageKey}`);
};

const updateStaticPage = (pageKey: string, blocks: any[]) => {
  return axios.put(`${API_URL}/static-page/${pageKey}`, { blocks });
};

export { uploadImage, getStaticPage, updateStaticPage };
