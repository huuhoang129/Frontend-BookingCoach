// src/services/systemServices/staticPageServices.ts
import requestAPI from "../../api/requestAPI";

// Tải lên hình ảnh
const uploadImage = (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("file", file);

  return requestAPI.post(`/upload/${folder}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Lấy nội dung trang tĩnh theo pageKey
const getStaticPage = (pageKey: string) => {
  return requestAPI.get(`/static-page/${pageKey}`);
};

// Cập nhật nội dung trang tĩnh theo pageKey
const updateStaticPage = (pageKey: string, blocks: any[]) => {
  return requestAPI.put(`/static-page/${pageKey}`, { blocks });
};

export { uploadImage, getStaticPage, updateStaticPage };
