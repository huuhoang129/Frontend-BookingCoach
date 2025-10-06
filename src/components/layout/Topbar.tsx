import type { JSX } from "react/jsx-runtime";
import { useState } from "react";
import { Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./topbar.scss";

// Assets
import emailIcon from "../../assets/icon/email.svg";
import phoneIcon from "../../assets/icon/call-phone.svg";

// Components & Hooks
import AuthModals from "../../containers/ModalsCollect/AuthModals";
import { useAuth } from "../../hooks/AuthHooks/useAuth";

export default function Topbar(): JSX.Element {
  const {
    currentUser,
    openLogin,
    setOpenLogin,
    openRegister,
    setOpenRegister,
    openForgotPassword,
    setOpenForgotPassword,
    openResetPassword,
    setOpenResetPassword,
    openVerifyOtp,
    setOpenVerifyOtp,
    handlers,
  } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "profile":
        window.location.href = "/profile/info";
        break;
      case "history":
        window.location.href = "/profile/history";
        break;
      case "logout":
        handlers.handleLogout();
        break;
      default:
        break;
    }
  };

  const userMenu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: "greeting",
          label: (
            <div className="menu-greeting">
              Xin chào,{" "}
              <strong>
                {currentUser?.firstName} {currentUser?.lastName}
              </strong>
            </div>
          ),
          disabled: true,
        },
        { type: "divider" },
        {
          key: "profile",
          label: "Thông tin cá nhân",
        },
        {
          key: "history",
          label: "Lịch sử đặt vé",
        },
        { type: "divider" },
        {
          key: "logout",
          label: <span style={{ color: "#ff4d4f" }}>Đăng xuất</span>,
        },
      ]}
    />
  );

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-contact">
          <div className="topbar-email">
            <img src={emailIcon} alt="Email" className="icon" />
            <a href="mailto:congtyhuongduong@gmail.com">
              Congtyhuongduong@gmail.com
            </a>
          </div>
          <span>/</span>
          <div className="topbar-phone">
            <img src={phoneIcon} alt="Hotline" className="icon" />
            <a href="tel:02033 991991">Hotline Hà Nội: 02033 991991</a>
          </div>
        </div>

        <div className="auth-links">
          {!currentUser ? (
            <>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenLogin(true);
                }}
              >
                Đăng nhập
              </a>
              <span className="sep">|</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenRegister(true);
                }}
              >
                Đăng ký
              </a>
            </>
          ) : (
            <Dropdown
              overlay={userMenu}
              trigger={["click"]}
              placement="bottomRight"
              open={openMenu}
              onOpenChange={setOpenMenu}
            >
              <div className="user-icon">
                <UserOutlined style={{ fontSize: 18, cursor: "pointer" }} />
              </div>
            </Dropdown>
          )}
        </div>
      </div>

      <AuthModals
        openLogin={openLogin}
        setOpenLogin={setOpenLogin}
        openRegister={openRegister}
        setOpenRegister={setOpenRegister}
        openForgotPassword={openForgotPassword}
        setOpenForgotPassword={setOpenForgotPassword}
        openResetPassword={openResetPassword}
        setOpenResetPassword={setOpenResetPassword}
        openVerifyOtp={openVerifyOtp}
        setOpenVerifyOtp={setOpenVerifyOtp}
        handlers={{
          handleLogin: handlers.handleLogin,
          handleRegister: handlers.handleRegister,
          handleForgotPassword: handlers.handleForgotPassword,
          handleVerifyOtp: handlers.handleVerifyOtp,
          handleResetPassword: handlers.handleResetPassword,
        }}
      />
    </div>
  );
}
