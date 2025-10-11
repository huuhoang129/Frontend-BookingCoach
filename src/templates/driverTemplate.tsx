import { Layout, Menu, Avatar, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import {
  BusFront,
  Gauge,
  CalendarClock,
  UserRound,
  LogOut,
} from "lucide-react";
import "./driverTemplate.scss";

const { Header, Sider, Content } = Layout;

interface DriverTemplateProps {
  Component: React.ComponentType<any>;
}

export default function DriverTemplate({ Component }: DriverTemplateProps) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
      onClick: () => navigate("/driver/dashboard"),
    },
    // {
    //   key: "schedule",
    //   icon: <CalendarClock size={18} strokeWidth={1.5} />,
    //   label: "Lịch làm việc",
    //   onClick: () => navigate("/driver/schedule"),
    // },
    // {
    //   key: "vehicles",
    //   icon: <BusFront size={18} strokeWidth={1.5} />,
    //   label: "Xe được phân công",
    //   onClick: () => navigate("/driver/vehicles"),
    // },
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
      {/* Sidebar */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={240}
        className="driver-sider"
      >
        <div
          className="driver-logo"
          onClick={() => navigate("/driver/dashboard")}
        >
          <div className="logo-icon">
            <BusFront size={28} strokeWidth={1.5} />
          </div>
          <span className="logo-text">DRIVER PANEL</span>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          defaultSelectedKeys={["dashboard"]}
        />
      </Sider>

      {/* Main layout */}
      <Layout>
        <Header className="driver-header">
          <div className="driver-header-right">
            <div className="driver-info">
              <span className="driver-name">
                {user?.firstName || "Tài xế"} {user?.lastName || ""}
              </span>
              <Dropdown overlay={userMenu} placement="bottomRight">
                <Avatar
                  size="large"
                  className="driver-avatar"
                  src={`https://api.dicebear.com/7.x/personas/svg?seed=${
                    user?.firstName || "driver"
                  }`}
                />
              </Dropdown>
            </div>
          </div>
        </Header>

        <Content className="driver-content">
          <div className="driver-page-container">
            <Component />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
