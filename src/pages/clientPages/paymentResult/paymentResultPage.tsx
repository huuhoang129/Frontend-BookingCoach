//src/pages/clientPages/paymentResult/paymentResultPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import "./PaymentResultPage.scss";

export default function PaymentResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");

  useEffect(() => {
    // Lấy mã kết quả và mã đơn từ URL trả về
    const code = searchParams.get("code");
    const bookingId = searchParams.get("bookingId");

    // Không có mã kết quả
    if (!code) {
      setMessage("Không tìm thấy mã kết quả thanh toán.");
      return;
    }
    // Thanh toán thành công
    if (code === "00") {
      setMessage("Thanh toán thành công. Đang chuyển hướng...");
      setTimeout(() => {
        navigate("/checkout-success", { state: { bookingId } });
      }, 1500);
    } else {
      // Thanh toán thất bại
      setMessage("Thanh toán thất bại. Đang chuyển hướng...");
      setTimeout(() => {
        navigate("/checkout-failed");
      }, 1500);
    }
  }, [navigate, searchParams]);

  return (
    <div className="payment-result-page">
      <Spin size="large" />
      <p>{message}</p>
    </div>
  );
}
