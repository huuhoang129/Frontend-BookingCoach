// src/services/paymentServices/vnpayService.ts
import axios from "axios";

// ==================== VNPay PAYMENTS ====================

// Tạo thanh toán VNPay cho đơn đặt vé
const createVNPayPayment = async ({
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

export { createVNPayPayment };
