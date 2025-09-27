import type { JSX } from "react/jsx-runtime";
import "./topbar.scss";

// Assets
import emailIcon from "../../assets/icon/email.svg";
import phoneIcon from "../../assets/icon/call-phone.svg";

// Components & Hooks
import AuthModals from "../../containers/ModalsCollect/AuthModals";
import { useAuth } from "../../hooks/useAuth";

export default function Topbar(): JSX.Element {
  // Auth state & handlers
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

  return (
    <div className="topbar">
      <div className="topbar-inner">
        {/* ========================
            Liên hệ (email & hotline)
        ======================== */}
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

        {/* ========================
            Auth links 
        ======================== */}
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
            <>
              <span>
                Xin chào, {currentUser.lastName} {currentUser.firstName}
              </span>
              <span className="sep">|</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlers.handleLogout();
                }}
              >
                Đăng xuất
              </a>
            </>
          )}
        </div>
      </div>

      {/* ========================
          Modal (Login, Register, OTP, Reset Password)
      ======================== */}
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
