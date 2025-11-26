//src/templates/adminTemplates.tsx
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { stopInactivityTimer } from "../utils/inactivityLogout.ts";
import axios from "axios";
import { List, Layout, Menu, Badge, Avatar, Dropdown, Typography } from "antd";
import {
  BellOutlined,
  UserOutlined,
  CarOutlined,
  FileTextOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  SettingOutlined,
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
  // Tổng số vé mới chưa xem
  const [unreadCount, setUnreadCount] = useState(0);
  // Quản lý chế độ xem
  const [viewType, setViewType] = useState<"overview" | "booking">("overview");
  // Lưu ID của vé đã xem
  const seenIdsRef = useRef<number[]>([]);
  const reportedIdsRef = useRef<number[]>([]);
  const firstLoadRef = useRef(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định menu đang mở theo URL
  const getOpenKey = (path: string): string => {
    if (path.includes("trip") || path.includes("schedule")) return "route-list";
    if (path.includes("booking") || path.includes("ticket-status"))
      return "ticket-manage";
    if (path.includes("vehicle") || path.includes("driver"))
      return "vehicle-manage";
    if (path.includes("location")) return "station-manage";
    if (path.includes("banner") || path.includes("news"))
      return "system-manage";
    if (path.includes("revenue") || path.includes("sales"))
      return "statistics & reports";
    if (path.includes("user") || path.includes("account"))
      return "users-manage";
    return "";
  };

  // Submenu
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

  // Menu avatar
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

  // Fetch thông báo vé
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

        // Ghi nhận danh sách nhưng KHÔNG báo mới
        if (firstLoadRef.current) {
          setNotifications(data);
          seenIdsRef.current = data.map((i) => i.id);
          reportedIdsRef.current = [...seenIdsRef.current];
          firstLoadRef.current = false;
          setUnreadCount(0);
          return;
        }

        // Lọc các vé mới thật sự
        const newOnes = data.filter(
          (d) =>
            !seenIdsRef.current.includes(d.id) &&
            !reportedIdsRef.current.includes(d.id)
        );

        // Nếu có vé mới → cập nhật số lượng
        if (newOnes.length > 0) {
          setUnreadCount((prev) => prev + newOnes.length);
          reportedIdsRef.current.push(...newOnes.map((n) => n.id));
        }

        // Cập nhật danh sách + đánh dấu vé mới
        setNotifications((prev) => {
          const newIds = new Set(newOnes.map((n) => n.id));
          return data.map((item) => ({
            ...item,
            isNew: newIds.has(item.id),
          }));
        });
      } catch (err) {
        console.error("[LỖI FETCH THÔNG BÁO]", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Drop thông báo
  const themeColor = "#4d940e";
  const notificationDropdown = (
    <div
      style={{
        width: 360,
        padding: 14,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      }}
    >
      {/* --- Màn hình tổng quan --- */}
      {viewType === "overview" && (
        <div
          onClick={() => {
            // Khi mở danh sách → reset unreadCount và đánh dấu tất cả đã xem
            setViewType("booking");
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
            padding: 14,
            cursor: "pointer",
          }}
        >
          <div style={{ fontWeight: 600, color: themeColor }}>
            🟢 Đặt vé mới
          </div>

          <Typography.Text>
            {unreadCount > 0
              ? `Có ${unreadCount} khách vừa đặt vé mới`
              : "Chưa có khách đặt vé mới"}
          </Typography.Text>
        </div>
      )}

      {/* --- Màn hình danh sách vé mới --- */}
      {viewType === "booking" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography.Text strong style={{ color: themeColor }}>
              🟢 Danh sách đặt vé
            </Typography.Text>

            <Typography.Link onClick={() => setViewType("overview")}>
              ← Quay lại
            </Typography.Link>
          </div>

          {/* Danh sách vé */}
          <List
            dataSource={notifications}
            locale={{ emptyText: "Chưa có vé nào" }}
            style={{ maxHeight: 400, overflowY: "auto", marginTop: 10 }}
            renderItem={(item) => (
              <List.Item
                onClick={() => {
                  // Khi click vé → đánh dấu đã xem
                  if (item.isNew) {
                    setNotifications((prev) =>
                      prev.map((n) =>
                        n.id === item.id ? { ...n, isNew: false } : n
                      )
                    );
                  }

                  navigate("/admin/booking-tickets");
                }}
                style={{
                  background: item.isNew ? `${themeColor}10` : "#fff",
                  border: item.isNew
                    ? `1px solid ${themeColor}`
                    : "1px solid #f0f0f0",
                  borderRadius: 8,
                  padding: 12,
                  margin: "6px 0",
                  cursor: "pointer",
                }}
              >
                <List.Item.Meta
                  title={
                    <Typography.Text
                      strong={item.isNew}
                      style={{
                        color: item.isNew ? themeColor : "#333",
                      }}
                    >
                      {item.customerName} ({item.phone})
                    </Typography.Text>
                  }
                  description={
                    <>
                      <div>🚍 {item.routeName}</div>
                      <div style={{ fontSize: 12, color: "#777" }}>
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
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        width={250}
        collapsedWidth={70}
        trigger={null}
      >
        <div className="logo">
          <img
            src={menuIcon}
            alt="menu"
            className="menu-toggle"
            onClick={() => setCollapsed(!collapsed)}
          />

          <Link to="/admin">
            <img src={LogoHuongDuong} className="logo-img" />
          </Link>
        </div>

        {/* MENU */}
        <Menu
          selectedKeys={[currentPath]}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys as string[])}
          mode="inline"
        >
          {/* Các submenu (giữ nguyên không thêm comment vì tự rõ nghĩa) */}
          {/* ... */}
        </Menu>
      </Sider>

      {/* MAIN LAYOUT */}
      <Layout>
        <Header className="custom-admin-header">
          <div className="header-left">
            <h3>Chào mừng, Quản trị viên</h3>
            <p>Tóm tắt hoạt động tuần này</p>
          </div>

          <div className="header-right">
            <div className="date-box">{dayjs().format("DD/MM/YYYY")}</div>

            {/* Chuông thông báo */}
            <Dropdown
              overlay={notificationDropdown}
              placement="bottomRight"
              trigger={["click"]}
              onOpenChange={(open) => {
                if (!open) setViewType("overview");
              }}
            >
              <Badge count={unreadCount}>
                <BellOutlined className="icon-notification" />
              </Badge>
            </Dropdown>

            {/* Avatar admin */}
            <Dropdown overlay={avatarMenu} placement="bottomRight">
              <div className="avatar-wrapper">
                <Avatar src={AvatarImg} size={40} />
                <Typography.Text>Admin</Typography.Text>
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
