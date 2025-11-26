//src/templates/driverTemplate.tsx
import { Layout, Menu, Avatar, Dropdown, Drawer, Button } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BusFront,
  Gauge,
  Menu as MenuIcon,
  LogOut,
  UserRound,
} from "lucide-react";
import "./driverTemplate.scss";

const { Header, Content } = Layout;

interface DriverTemplateProps {
  Component: React.ComponentType<any>;
}

export default function DriverTemplate({ Component }: DriverTemplateProps) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <Gauge size={18} strokeWidth={1.5} />,
      label: "Lịch làm việc",
      onClick: () => {
        navigate("/driver/dashboard");
        setDrawerOpen(false);
      },
    },
  ];

  const userMenu = (
    <Menu
      items={[
        {
          key: "profile",
          icon: <UserRound size={16} strokeWidth={1.5} />,
          label: "Thông tin cá nhân",
          onClick: () => navigate("/driver/profile"),
        },
        { type: "divider" },
        {
          key: "logout",
          icon: <LogOut size={16} color="#ff4d4f" strokeWidth={1.5} />,
          label: <span style={{ color: "#ff4d4f" }}>Đăng xuất</span>,
          onClick: handleLogout,
        },
      ]}
    />
  );

  return (
    <Layout className="driver-layout">
      {/* Header */}
      <Header className="driver-header">
        <div className="header-left">
          <Button
            className="menu-toggle"
            type="text"
            icon={<MenuIcon size={22} />}
            onClick={() => setDrawerOpen(true)}
          />
          <div
            className="logo-mini"
            onClick={() => navigate("/driver/dashboard")}
          >
            <BusFront size={26} strokeWidth={1.6} color="#4d940e" />
            <span>Huong Duong</span>
          </div>
        </div>

        <div className="driver-header-right">
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div className="driver-info">
              <span className="driver-name">
                {user?.firstName || "Tài xế"} {user?.lastName || ""}
              </span>
              <Avatar
                size="large"
                className="driver-avatar"
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${
                  user?.firstName || "driver"
                }`}
              />
            </div>
          </Dropdown>
        </div>
      </Header>

      {/* Drawer cho mobile */}
      <Drawer
        title="Bảng điều khiển"
        placement="left"
        closable
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0 }}
      >
        <div className="drawer-logo">
          <BusFront size={28} strokeWidth={1.5} />
          <span>DRIVER PANEL</span>
        </div>
        <Menu
          mode="inline"
          items={menuItems}
          defaultSelectedKeys={["dashboard"]}
        />
      </Drawer>

      {/* Content */}
      <Content className="driver-content">
        <div className="driver-page-container">
          <Component />
        </div>
      </Content>
    </Layout>
  );
}
