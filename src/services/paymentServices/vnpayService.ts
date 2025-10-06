import axios from "axios";

export const createVNPayPayment = async ({
  bookingId,
  amount,
  bankCode,
}: {
  bookingId: number;
  amount: number;
  bankCode?: string;
}) => {
  return axios.post("http://localhost:8080/api/v1/payments/vnpay", {
    bookingId,
    amount,
    bankCode,
  });
};
