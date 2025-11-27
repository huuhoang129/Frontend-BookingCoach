//src/templates/adminTemplates.tsx
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { stopInactivityTimer } from "../utils/inactivityLogout.ts";
import axios from "axios";
import { List } from "antd";
import { Layout, Menu, Badge, Avatar, Dropdown, Typography } from "antd";
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  CarOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./adminTemplate.scss";
import menuIcon from "../assets/icon/menu.svg";
import LogoHuongDuong from "../assets/logo/Logo-HuongDuong.jpg";
import AvatarImg from "../assets/avatar/avatar.jpg";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface AdminTemplateProps {
  Component: React.ComponentType<any>;
}

interface BookingNotification {
  id: number;
  bookingCode: string;
  customerName: string;
  phone: string;
  routeName: string;
  createdAt: string;
  isNew?: boolean;
}

export const AdminTemplate: React.FC<AdminTemplateProps> = ({ Component }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Danh sách thông báo đặt vé
  const [notifications, setNotifications] = useState<BookingNotification[]>([]);
  const [refundNotifications] = useState<any[]>([]);
  const [loadingNoti, setLoadingNoti] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Hiển thị danh sách thông báo theo nhóm
  const [viewType, setViewType] = useState<"overview" | "booking" | "refund">(
    "overview"
  );

  // Số lượng thông báo chưa đọc
  const [unreadCount, setUnreadCount] = useState(0);

  // Lưu ID đã xem để phân biệt thông báo mới
  const [lastSeenIds, setLastSeenIds] = useState<number[]>([]);
  const reportedIdsRef = useRef<number[]>([]);

  // Kiểm soát chỉ chạy logic khi load lần đầu
  const firstLoadRef = useRef(true);

  // Danh sách ID đã xem
  const seenIdsRef = useRef<number[]>([]);

  // Lưu số lần click vào từng thông báo
  const clickCountRef = useRef<Record<number, number>>({});

  const navigate = useNavigate();
  const location = useLocation();

  // Xác định menu đang mở dựa vào URL
  const getOpenKey = (path: string): string => {
    if (
      path.includes("trip") ||
      path.includes("schedule") ||
      path.includes("ticket-pricing")
    )
      return "route-list";

    if (path.includes("booking") || path.includes("ticket-status"))
      return "ticket-manage";

    if (path.includes("vehicle") || path.includes("driver"))
      return "vehicle-manage";

    if (path.includes("location") || path.includes("route-list"))
      return "station-manage";

    if (
      path.includes("banner") ||
      path.includes("news") ||
      path.includes("homepage")
    )
      return "system-manage";

    if (
      path.includes("revenue") ||
      path.includes("sales") ||
      path.includes("cancellation")
    )
      return "statistics & reports";

    if (
      path.includes("user") ||
      path.includes("employee") ||
      path.includes("account")
    )
      return "users-manage";

    return "";
  };

  const currentPath = location.pathname;
  const [openKeys, setOpenKeys] = useState<string[]>([getOpenKey(currentPath)]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    stopInactivityTimer();
    navigate("/");
    alert("Bạn đã đăng xuất thành công!");
  };

  // Menu avatar (thông tin cá nhân + đăng xuất)
  const avatarMenu = (
    <Menu>
      <Menu.Item key="profile" disabled>
        <UserOutlined /> Thông tin cá nhân
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item key="logout" onClick={handleLogout} danger>
        <LogoutOutlined /> Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // Tải danh sách thông báo đặt vé
  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      if (!isMounted) return;

      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/bookings-notification/new"
        );

        if (res.data.errCode !== 0) return;

        const data: BookingNotification[] = res.data.data || [];

        // Xử lý lần fetch đầu tiên
        if (firstLoadRef.current) {
          setNotifications(data);
          seenIdsRef.current = data.map((i) => i.id);
          reportedIdsRef.current = [...seenIdsRef.current];
          firstLoadRef.current = false;
          setUnreadCount(0);
          return;
        }

        // Lọc ra thông báo mới
        const newOnes = data.filter(
          (d) =>
            !seenIdsRef.current.includes(d.id) &&
            !reportedIdsRef.current.includes(d.id)
        );

        // Nếu có thông báo mới, tăng số lượng chưa đọc
        if (newOnes.length > 0) {
          setUnreadCount((prev) => prev + newOnes.length);
          reportedIdsRef.current.push(...newOnes.map((n) => n.id));
        }

        // Cập nhật danh sách thông báo và đánh dấu mới
        setNotifications((prev) => {
          const prevMap = new Map(prev.map((p) => [p.id, p.isNew === true]));
          const newIds = new Set(newOnes.map((n) => n.id));

          return data.map((item) => ({
            ...item,
            isNew: prevMap.get(item.id) || newIds.has(item.id),
          }));
        });
      } catch (e) {
        console.error("Lỗi tải thông báo", e);
      }
    };

    // Tải mỗi 10 giây
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const themeColor = "#4d940e";

  // Dropdown hiển thị thông báo đặt vé
  const notificationDropdown = (
    <div
      style={{
        width: 360,
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        borderRadius: 12,
        padding: 14,
      }}
    >
      {/* Chế độ tổng quan */}
      {viewType === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            onClick={() => {
              setViewType("booking");

              // Khi mở danh sách vé thì đánh dấu đã xem toàn bộ
              setUnreadCount(0);
              seenIdsRef.current = notifications.map((n) => n.id);
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, isNew: false }))
              );
            }}
            style={{
              background: `${themeColor}15`,
              border: `1px solid ${themeColor}40`,
              borderRadius: 10,
              padding: "14px 16px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                color: themeColor,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Đặt vé mới
            </div>

            <Typography.Text style={{ fontSize: 13, color: "#333" }}>
              {unreadCount > 0
                ? `Có ${unreadCount} khách hàng vừa đặt vé mới.`
                : "Chưa có khách hàng mới nào."}
            </Typography.Text>
          </div>
        </div>
      )}

      {/* Hiển thị chi tiết từng vé */}
      {viewType === "booking" && (
        <div>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Typography.Text strong style={{ fontSize: 15, color: themeColor }}>
              Danh sách đặt vé
            </Typography.Text>

            <Typography.Link
              style={{ color: themeColor }}
              onClick={() => setViewType("overview")}
            >
              Quay lại
            </Typography.Link>
          </div>

          {/* Banner khi có vé mới */}
          {unreadCount > 0 && (
            <div
              style={{
                background: `${themeColor}15`,
                border: `1px solid ${themeColor}40`,
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 10,
              }}
            >
              Có {unreadCount} vé mới chưa xem.
            </div>
          )}

          {/* Danh sách vé */}
          <List
            loading={loadingNoti}
            dataSource={notifications}
            locale={{ emptyText: "Không có dữ liệu." }}
            style={{
              maxHeight: 400,
              overflowY: "auto",
              borderTop: "1px solid #f0f0f0",
            }}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                onClick={() => {
                  if (item.isNew) {
                    setNotifications((prev) =>
                      prev.map((n) =>
                        n.id === item.id ? { ...n, isNew: false } : n
                      )
                    );

                    setUnreadCount((prev) => Math.max(prev - 1, 0));
                  }

                  navigate("/admin/booking-tickets");
                }}
                style={{
                  border: item.isNew
                    ? `1px solid ${themeColor}`
                    : "1px solid #f0f0f0",
                  backgroundColor: item.isNew ? `${themeColor}10` : "#fff",
                  borderRadius: 8,
                  margin: "6px 0",
                  padding: "12px 8px",
                }}
              >
                <List.Item.Meta
                  title={
                    <Typography.Text
                      strong={item.isNew}
                      style={{
                        color: item.isNew ? themeColor : "#333",
                        fontSize: item.isNew ? 15 : 14,
                      }}
                    >
                      {item.customerName} ({item.phone})
                    </Typography.Text>
                  }
                  description={
                    <>
                      <div style={{ color: "#666" }}>{item.routeName}</div>
                      <div style={{ fontSize: 12, color: "#999" }}>
                        Mã vé: {item.bookingCode} •{" "}
                        {dayjs(item.createdAt).format("HH:mm DD/MM/YYYY")}
                      </div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );

  return (
    <Layout className="admin-template" style={{ minHeight: "100vh" }}>
      {/* Thanh bên trái */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={250}
        collapsedWidth={70}
        className="admin-sider"
      >
        {/* Header sidebar */}
        <div className="logo">
          <img
            src={menuIcon}
            alt="menu"
            className={`menu-toggle ${collapsed ? "collapsed" : ""}`}
            onClick={() => setCollapsed(!collapsed)}
          />

          <div className="logo-wrapper">
            <Link to="/admin">
              <img
                src={LogoHuongDuong}
                alt="logo"
                className={`logo-img ${collapsed ? "collapsed" : "expanded"}`}
              />
            </Link>
          </div>
        </div>

        {/* Menu sidebar */}
        <Menu
          key="admin-menu"
          className="menu-admin"
          mode="inline"
          selectedKeys={[currentPath]}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys as string[])}
        >
          <SubMenu
            key="users-manage"
            icon={<UserOutlined />}
            title="Quản lý người dùng"
          >
            <Menu.Item key="/admin/user-manage">
              <Link to="/admin/user-manage">Quản lý khách hàng</Link>
            </Menu.Item>

            <Menu.Item key="/admin/employee-manage">
              <Link to="/admin/employee-manage">Quản lý tài xế</Link>
            </Menu.Item>

            <Menu.Item key="/admin/account-manage">
              <Link to="/admin/account-manage">Khóa hoặc mở tài khoản</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="route-list"
            icon={<CarOutlined />}
            title="Quản lý chuyến xe"
          >
            <Menu.Item key="/admin/trip-list">
              <Link to="/admin/trip-list">Danh sách chuyến xe</Link>
            </Menu.Item>

            <Menu.Item key="/admin/schedule">
              <Link to="/admin/schedule">Lịch trình</Link>
            </Menu.Item>

            <Menu.Item key="/admin/ticket-pricing">
              <Link to="/admin/ticket-pricing">Giá vé theo tuyến</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="ticket-manage"
            icon={<FileTextOutlined />}
            title="Quản lý vé"
          >
            <Menu.Item key="/admin/booking-tickets">
              <Link to="/admin/booking-tickets">Quản lý đặt vé</Link>
            </Menu.Item>
            <Menu.Item key="/admin/ticket-status">
              <Link to="/admin/ticket-status">Quản lý thanh toán</Link>
            </Menu.Item>
            <Menu.Item key="/admin/cancellation-ticket">
              <Link to="/admin/cancellation-ticket">Quản lý hoàn hủy</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="vehicle-manage"
            icon={<TeamOutlined />}
            title="Quản lý xe và tài xế"
          >
            <Menu.Item key="/admin/vehicle-list">
              <Link to="/admin/vehicle-list">Danh sách phương tiện</Link>
            </Menu.Item>

            <Menu.Item key="/admin/vehicle-condition">
              <Link to="/admin/vehicle-condition">
                Tình trạng và bảo dưỡng xe
              </Link>
            </Menu.Item>

            <Menu.Item key="/admin/driver-schedule">
              <Link to="/admin/driver-schedule">Lịch làm việc tài xế</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="station-manage"
            icon={<EnvironmentOutlined />}
            title="Quản lý bến và điểm dừng"
          >
            <Menu.Item key="/admin/location-list">
              <Link to="/admin/location-list">Danh sách điểm dừng</Link>
            </Menu.Item>

            <Menu.Item key="/admin/route-list">
              <Link to="/admin/route-list">Quản lý tuyến đường</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="system-manage"
            icon={<SettingOutlined />}
            title="Quản lý hệ thống"
          >
            <Menu.Item key="/admin/banner-manage">
              <Link to="/admin/banner-manage">Quản lý banner</Link>
            </Menu.Item>

            <Menu.Item key="/admin/news-manage">
              <Link to="/admin/news-manage">Quản lý tin tức</Link>
            </Menu.Item>

            <Menu.Item key="/admin/homepage-manage">
              <Link to="/admin/homepage-manage">
                Quản lý nội dung trang chủ
              </Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="statistics & reports"
            icon={<BarChartOutlined />}
            title="Thống kê và báo cáo"
          >
            <Menu.Item key="/admin/revenue-reports">
              <Link to="/admin/revenue-reports">Doanh thu</Link>
            </Menu.Item>

            <Menu.Item key="/admin/ticket-sales">
              <Link to="/admin/ticket-sales">Số lượng vé bán ra</Link>
            </Menu.Item>

            <Menu.Item key="/admin/cancellation-rates">
              <Link to="/admin/cancellation-rates">Tỷ lệ hủy vé</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>

      {/* Nội dung chính */}
      <Layout className="layout-main">
        <Header className="custom-admin-header">
          <div className="header-left">
            <h3>
              <span className="greeting">Chào mừng,</span>{" "}
              <span className="username">Quản trị viên</span>
            </h3>
            <p className="subtitle">Báo cáo hiệu suất trong tuần này</p>
          </div>

          <div className="header-right">
            {/* Hiển thị ngày hiện tại */}
            <div className="date-box">{dayjs().format("DD/MM/YYYY")}</div>

            {/* Chuông thông báo */}
            <Dropdown
              overlay={notificationDropdown}
              placement="bottomRight"
              arrow
              trigger={["click"]}
              onOpenChange={(open) => {
                if (!open) {
                  setViewType("overview");
                }
              }}
            >
              <Badge count={unreadCount} size="small" overflowCount={99}>
                <BellOutlined
                  className="icon-notification"
                  style={{ cursor: "pointer", fontSize: 20, color: "#555" }}
                />
              </Badge>
            </Dropdown>

            {/* Avatar admin */}
            <Dropdown overlay={avatarMenu} placement="bottomRight" arrow>
              <div className="avatar-wrapper" style={{ cursor: "pointer" }}>
                <Avatar src={AvatarImg} size={40} />
                <Typography.Text style={{ marginLeft: 8 }}>
                  Admin
                </Typography.Text>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: "20px" }}>
          <Component />
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Copyright ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminTemplate;
