// src/hooks/common/useDynamicTitle.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook thay đổi tiêu đề trang theo đường dẫn hiện tại.
 * Áp dụng cho giao diện Client, Admin, Driver.
 */
export default function useDynamicTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Danh sách đường dẫn và tiêu đề tương ứng
    const titles: Record<string, string> = {
      // CLIENT
      "/": "Trang chủ | Nhà Xe Hương Dương",
      "/about": "Giới thiệu | Nhà Xe Hương Dương",
      "/contact": "Liên hệ | Nhà Xe Hương Dương",
      "/booking": "Đặt vé xe | Nhà Xe Hương Dương",
      "/checkout": "Thanh toán | Nhà Xe Hương Dương",
      "/payment-result": "Kết quả thanh toán | Nhà Xe Hương Dương",
      "/checkout-success": "Thanh toán thành công | Nhà Xe Hương Dương",
      "/checkout-failed": "Thanh toán thất bại | Nhà Xe Hương Dương",
      "/profile/info": "Thông tin cá nhân | Nhà Xe Hương Dương",
      "/profile/history": "Lịch sử đặt vé | Nhà Xe Hương Dương",
      "/term": "Điều khoản sử dụng | Nhà Xe Hương Dương",
      "/privacy_policy": "Chính sách bảo mật | Nhà Xe Hương Dương",
      "/refund_policy": "Chính sách hoàn tiền | Nhà Xe Hương Dương",
      "/payment_policy": "Chính sách thanh toán | Nhà Xe Hương Dương",
      "/cancellation_policy": "Chính sách hủy vé | Nhà Xe Hương Dương",
      "/shipping_policy": "Chính sách vận chuyển | Nhà Xe Hương Dương",
      "/news": "Tin tức | Nhà Xe Hương Dương",
      "/test": "Trang kiểm thử | Nhà Xe Hương Dương",

      // ADMIN
      "/admin": "Bảng điều khiển | Quản trị Hương Dương",
      "/admin/banner-manage": "Quản lý banner | Quản trị Hương Dương",
      "/admin/homepage-manage": "Quản lý trang chủ | Quản trị Hương Dương",
      "/admin/news-manage": "Quản lý tin tức | Quản trị Hương Dương",
      "/admin/location-list": "Quản lý địa điểm | Quản trị Hương Dương",
      "/admin/route-list": "Quản lý tuyến đường | Quản trị Hương Dương",
      "/admin/vehicle-list": "Quản lý phương tiện | Quản trị Hương Dương",
      "/admin/vehicle-condition": "Tình trạng xe | Quản trị Hương Dương",
      "/admin/driver-schedule": "Lịch tài xế | Quản trị Hương Dương",
      "/admin/trip-list": "Danh sách chuyến xe | Quản trị Hương Dương",
      "/admin/schedule": "Lịch trình | Quản trị Hương Dương",
      "/admin/ticket-pricing": "Giá vé | Quản trị Hương Dương",
      "/admin/booking-tickets": "Quản lý đặt vé | Quản trị Hương Dương",
      "/admin/ticket-status": "Trạng thái thanh toán | Quản trị Hương Dương",
      "/admin/revenue-reports": "Báo cáo doanh thu | Quản trị Hương Dương",
      "/admin/ticket-sales": "Thống kê vé bán | Quản trị Hương Dương",
      "/admin/cancellation-rates": "Tỷ lệ hủy vé | Quản trị Hương Dương",
      "/admin/user-manage": "Quản lý khách hàng | Quản trị Hương Dương",
      "/admin/employee-manage": "Quản lý nhân viên | Quản trị Hương Dương",
      "/admin/account-manage": "Quản lý tài khoản | Quản trị Hương Dương",

      // DRIVER
      "/driver/dashboard": "Bảng điều khiển tài xế | Nhà Xe Hương Dương",
    };

    // Các trang có tham số động (ví dụ /news/:id)
    if (pathname.startsWith("/news/")) {
      document.title = "Chi tiết tin tức | Nhà Xe Hương Dương";
      return;
    }

    // Gán tiêu đề theo đường dẫn
    if (titles[pathname]) {
      document.title = titles[pathname];
    } else {
      // Tiêu đề mặc định
      document.title = "Nhà Xe Hương Dương";
    }
  }, [pathname]);
}
