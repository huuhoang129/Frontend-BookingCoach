import { useState } from "react";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { clearSessionTimeout } from "../utils/sessionTimeout.ts";
import { Layout, Menu, Input, Badge, Avatar } from "antd";
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

export const AdminTemplate: React.FC<AdminTemplateProps> = ({ Component }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    clearSessionTimeout();
    navigate("/");
    alert("Bạn đã đăng xuất thành công!");
  };

  return (
    <Layout className="admin-template" style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={250}
        collapsedWidth={70}
        className="admin-sider"
      >
        <div className="logo">
          <img
            src={menuIcon}
            alt="menu"
            className={`menu-toggle ${collapsed ? "collapsed" : ""}`}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div className="logo-wrapper">
            <img
              src={LogoHuongDuong}
              alt="logo"
              className={`logo-img ${collapsed ? "collapsed" : "expanded"}`}
            />
          </div>
        </div>

        <Menu key="admin-menu" className="menu-admin" mode="inline">
          <SubMenu
            key="users-manage"
            icon={<UserOutlined />}
            title="Quản lý người dùng"
          >
            <Menu.Item key="user-list">
              <Link to="/admin/user-manage">Danh sách người dùng</Link>
            </Menu.Item>
            <Menu.Item key="driver-employee-list">
              <Link to="/admin/employee-manage">Danh sách nhân viên</Link>
            </Menu.Item>
            <Menu.Item key="lock-unlock-account">
              <Link to="/admin/account-manage">Khóa/mở tài khoản</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="trip-manage"
            icon={<CarOutlined />}
            title="Quản lý chuyến xe"
          >
            <Menu.Item key="trip-list" disabled>
              Đang phát triển.....
              {/* <Link to="#">Danh sách chuyến xe</Link> */}
            </Menu.Item>
            <Menu.Item key="schedule" disabled>
              Đang phát triển.....
              {/* <Link to="#">Lịch trình</Link> */}
            </Menu.Item>
            <Menu.Item key="bus-type" disabled>
              Đang phát triển.....
              {/* <Link to="#">Loại xe</Link> */}
            </Menu.Item>
            <Menu.Item key="ticket-pricing" disabled>
              Đang phát triển.....
              {/* <Link to="#">Giá vé theo tuyến</Link> */}
            </Menu.Item>
            <Menu.Item key="seat-configuration" disabled>
              Đang phát triển.....
              {/* <Link to="#">Số lượng ghế / sơ đồ ghế</Link> */}
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="ticket-manage"
            icon={<FileTextOutlined />}
            title="Quản lý vé"
          >
            <Menu.Item key="booked-tickets" disabled>
              Đang phát triển.....
              {/* <Link to="#">Danh sách vé đã đặt</Link> */}
            </Menu.Item>
            <Menu.Item key="available-tickets" disabled>
              Đang phát triển.....
              {/* <Link to="#">Vé còn trống</Link> */}
            </Menu.Item>
            <Menu.Item key="ticket-status" disabled>
              Đang phát triển.....
              {/* <Link to="#">Tình trạng vé</Link> */}
            </Menu.Item>
            <Menu.Item key="refund-cancel" disabled>
              Đang phát triển.....
              {/* <Link to="#">Xử lý hoàn / hủy vé</Link> */}
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="booking-manage"
            icon={<CreditCardOutlined />}
            title="Quản lý đặt chỗ & thanh toán"
          >
            <Menu.Item key="booking-list" disabled>
              Đang phát triển.....
              {/* <Link to="#">Lịch sử giao dịch thanh toán</Link> */}
            </Menu.Item>
            <Menu.Item key="payment-status" disabled>
              Đang phát triển.....
              {/* <Link to="#">Trạng thái thanh toán</Link> */}
            </Menu.Item>
            <Menu.Item key="payment-methods" disabled>
              Đang phát triển.....
              {/* <Link to="#">Quản lý phương thức thanh toán</Link> */}
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="vehicle-manage"
            icon={<TeamOutlined />}
            title="Quản lý xe & tài xế"
          >
            <Menu.Item key="vehicle-list" disabled>
              Đang phát triển.....
              {/* <Link to="#">Danh sách xe</Link> */}
            </Menu.Item>
            <Menu.Item key="vehicle-condition" disabled>
              Đang phát triển.....
              {/* <Link to="#">Bảo dưỡng, tình trạng xe</Link> */}
            </Menu.Item>
            <Menu.Item key="driver-schedule" disabled>
              Đang phát triển.....
              {/* <Link to="#">Lịch làm việc của tài xế</Link> */}
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="station-manage"
            icon={<EnvironmentOutlined />}
            title="Quản lý bến & tuyến đường"
          >
            <Menu.Item key="station-list" disabled>
              Đang phát triển.....
              {/* <Link to="#">Danh sách bến xe</Link> */}
            </Menu.Item>
            <Menu.Item key="route-list" disabled>
              Đang phát triển.....
              {/* <Link to="#">Các tuyến đường chính</Link> */}
            </Menu.Item>
            <Menu.Item key="default-ticket-pricing" disabled>
              Đang phát triển.....
              {/* <Link to="#">Giá vé mặc định cho từng tuyến</Link> */}
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="promotion-manage"
            icon={<GiftOutlined />}
            title="Quản lý khuyến mãi & mã giảm giá"
          >
            <Menu.Item key="create-promo-code" disabled>
              Đang phát triển.....
              {/* <Link to="#">Tạo mã khuyến mãi</Link> */}
            </Menu.Item>
            <Menu.Item key="manage-promo-programs" disabled>
              Đang phát triển.....
              {/* <Link to="#">Quản lý chương trình giảm giá</Link> */}
            </Menu.Item>
            <Menu.Item key="track-promo-usage" disabled>
              Đang phát triển.....
              {/* <Link to="#">Theo dõi lượt sử dụng mã</Link> */}
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="system-manage"
            icon={<SettingOutlined />}
            title="Quản lý hệ thống"
          >
            <Menu.Item key="banner-manage">
              <Link to="/admin/banner-manage">Quản lý banner</Link>
            </Menu.Item>
            <Menu.Item key="news-manage">
              <Link to="/admin/news-manage">Quản lý tin tức</Link>
            </Menu.Item>
            <Menu.Item key="notification-manage" disabled>
              Đang phát triển.....
              {/* <Link to="#">Quản lý thông báo</Link> */}
            </Menu.Item>
            <Menu.Item key="homepage-content">
              <Link to="/admin/homepage-manage">
                Quản lý nội dung trang chủ
              </Link>
            </Menu.Item>
            <Menu.Item key="email-settings" disabled>
              Đang phát triển.....
              {/* <Link to="#">Cài đặt email</Link> */}
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="support-manage"
            icon={<CustomerServiceOutlined />}
            title="Hỗ trợ khách hàng"
          >
            <Menu.Item key="support-requests" disabled>
              Đang phát triển.....
              {/* <Link to="#">Yêu cầu hỗ trợ</Link> */}
            </Menu.Item>
            <Menu.Item key="faqs" disabled>
              Đang phát triển.....
              {/* <Link to="#">Chat/Email phản hồi khách</Link> */}
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="statistics & reports"
            icon={<BarChartOutlined />}
            title="Thống kê & báo cáo"
          >
            <Menu.Item key="revenue-reports" disabled>
              Đang phát triển.....
              {/* <Link to="#">Doanh thu</Link> */}
            </Menu.Item>
            <Menu.Item key="ticket-sales" disabled>
              Đang phát triển.....
              {/* <Link to="#">Số lượng vé bán ra</Link> */}
            </Menu.Item>
            <Menu.Item key="cancellation-rates" disabled>
              Đang phát triển.....
              {/* <Link to="#">Tỷ lệ hủy vé</Link> */}
            </Menu.Item>
            <Menu.Item key="top-performing-trips" disabled>
              Đang phát triển.....
              {/* <Link to="#">Chuyến xe nổi bật</Link> */}
            </Menu.Item>
          </SubMenu>
        </Menu>

        <div className="logout-button" onClick={handleLogout}>
          <LogoutOutlined className="logout-icon" />
          {!collapsed && <span className="logout-text">Đăng xuất</span>}
        </div>
      </Sider>

      {/* MAIN LAYOUT */}
      <Layout className="layout-main">
        <Header className="custom-admin-header">
          <div className="header-left">
            <h3>
              <span className="greeting">Good Morning,</span>{" "}
              <span className="username">John Doe</span>
            </h3>
            <p className="subtitle">Your performance summary this week</p>
          </div>
          <div className="header-right">
            <Input
              className="search-box"
              prefix={<SearchOutlined />}
              placeholder="Search..."
            />
            <div className="date-box">{dayjs().format("DD/MM/YYYY")}</div>
            <Badge count={5} size="small">
              <BellOutlined className="icon-notification" />
            </Badge>
            <div className="avatar-wrapper">
              <Avatar src={AvatarImg} size={40} />
            </div>
          </div>
        </Header>

        <Content style={{ margin: "20px" }}>
          <Component />
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Copyright ©{new Date().getFullYear()}. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminTemplate;
