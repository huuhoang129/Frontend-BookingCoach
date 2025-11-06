import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1";

export const createPaymentQR = (data: any) => {
  return axios.post(`${BASE_URL}/payments/create-banking-qr`, data);
};

export const createPayment = (data: any) => {
  return axios.post(`${BASE_URL}/bookings/payments`, data);
};
