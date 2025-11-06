import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";
import "./checkoutResultPage.scss";

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  useEffect(() => {
    if (bookingId) {
      console.log("[CheckoutSuccessPage] Tải hóa đơn cho booking:", bookingId);
      const link = document.createElement("a");
      link.href = `http://localhost:8080/api/v1/bookings/${bookingId}/invoice`;

      link.setAttribute("download", `invoice-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn("⚠️ Không có bookingId để tải hóa đơn!");
    }

    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [bookingId, navigate]);

  return (
    <div className="checkout-result-page success">
      <div className="result-card animate-fade">
        <CheckCircleOutlined className="result-icon" />
        <h2>🎉 Thanh toán thành công!</h2>
        <p>
          Cảm ơn bạn đã sử dụng dịch vụ của <strong>Hương Dương Coach</strong>.
        </p>
        <p>
          Hóa đơn đang được tải xuống... Bạn sẽ được chuyển về trang chủ sau ít
          giây.
        </p>
        <button className="primary-btn" onClick={() => navigate("/")}>
          Về trang chủ ngay
        </button>
      </div>
    </div>
  );
}
