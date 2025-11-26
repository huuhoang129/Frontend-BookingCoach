//src/routes/UserHomeRedirect.tsx
import HomePage from "../pages/clientPages/HomePage";

export default function UserHomeRedirect() {
  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Nếu là Admin → chuyển sang trang quản trị
  if (user?.role === "Admin") {
    window.location.href = "/admin";
    return null;
  }

  // Nếu là Tài xế → chuyển sang dashboard tài xế
  if (user?.role === "Driver") {
    window.location.href = "/driver/dashboard";
    return null;
  }

  // Người dùng thường → hiển thị trang chủ
  return <HomePage />;
}
