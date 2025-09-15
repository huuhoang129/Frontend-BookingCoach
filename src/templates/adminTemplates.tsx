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
const { SubMenu } = Menu; // 👉 nếu bạn dùng AntD v4

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
              <Link to="#">Danh sách người dùng</Link>
            </Menu.Item>
            <Menu.Item key="driver-employee-list" disabled>
              Đang phát triển...
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="system-manage"
            icon={<SettingOutlined />}
            title="Quản lý hệ thống"
          >
            <Menu.Item key="banner-manage">
              <Link to="#">Quản lý banner</Link>
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
