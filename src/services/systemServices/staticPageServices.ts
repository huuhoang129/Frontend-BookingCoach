import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

const uploadImage = (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_URL}/upload/${folder}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const getAboutPage = () => {
  return axios.get(`${API_URL}/get-about-page`);
};

// const createAboutPage = (blocks: any) => {
//   return axios.post(`${API_URL}/create-about-page`, { blocks });
// };

const updateAboutPage = (blocks: any) => {
  return axios.put(`${API_URL}/update-about-page`, { blocks });
};

const getConditionsPage = () => {
  return axios.get(`${API_URL}/get-conditions-page`);
};

const updateConditionsPage = (blocks: any) => {
  return axios.put(`${API_URL}/update-conditions-page`, { blocks });
};

const getPrivacyPolicyPage = () => {
  return axios.get(`${API_URL}/get-privacy-policy-page`);
};

const updatePrivacyPolicyPage = (blocks: any) => {
  return axios.put(`${API_URL}/update-privacy-policy-page`, { blocks });
};

const getRefundPolicyPage = () => {
  return axios.get(`${API_URL}/get-refund-policy-page`);
};

const updateRefundPolicyPage = (blocks: any) => {
  return axios.put(`${API_URL}/update-refund-policy-page`, { blocks });
};

const getPaymentPolicyPage = () => {
  return axios.get(`${API_URL}/get-payment-policy-page`);
};

const updatePaymentPolicyPage = (blocks: any) => {
  return axios.put(`${API_URL}/update-payment-policy-page`, { blocks });
};

const getCancellationPolicyPage = () => {
  return axios.get(`${API_URL}/get-cancellation-policy-page`);
};

const updateCancellationPolicyPage = (blocks: any) => {
  return axios.put(`${API_URL}/update-cancellation-policy-page`, { blocks });
};

const getShippingPolicyPage = () => {
  return axios.get(`${API_URL}/get-shipping-policy-page`);
};

const updateShippingPolicyPage = (blocks: any) => {
  return axios.put(`${API_URL}/update-shipping-policy-page`, { blocks });
};

export {
  getAboutPage,
  updateAboutPage,
  uploadImage,
  getConditionsPage,
  updateConditionsPage,
  getPrivacyPolicyPage,
  updatePrivacyPolicyPage,
  getRefundPolicyPage,
  updateRefundPolicyPage,
  getPaymentPolicyPage,
  updatePaymentPolicyPage,
  getCancellationPolicyPage,
  updateCancellationPolicyPage,
  getShippingPolicyPage,
  updateShippingPolicyPage,
};
