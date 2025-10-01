import axios from "axios";

const API_URL = "http://localhost:8080/api/v1"; // sửa lại nếu BE khác port

export const createPaymentQR = (data: any) => {
  return axios.post(`${API_URL}/payments/create-banking-qr`, data);
};
