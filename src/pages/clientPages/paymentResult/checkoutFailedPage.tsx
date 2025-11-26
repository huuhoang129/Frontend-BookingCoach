//src/pages/clientPages/paymentResult/checkoutFailedPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CloseCircleOutlined } from "@ant-design/icons";
import "./checkoutResultPage.scss";

export default function CheckoutFailedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Tự động quay về trang chủ sau 3 giây
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="checkout-result-page failed">
      <div className="result-card animate-fade">
        <CloseCircleOutlined className="result-icon" />
        <h2>Thanh toán thất bại</h2>
        <p>Giao dịch không thành công hoặc đã bị hủy. Vui lòng thử lại.</p>
        <button className="primary-btn" onClick={() => navigate("/checkout")}>
          Thử lại
        </button>
        <p className="auto-return-text">
          (Bạn sẽ được chuyển về trang chủ sau 3 giây)
        </p>
      </div>
    </div>
  );
}
