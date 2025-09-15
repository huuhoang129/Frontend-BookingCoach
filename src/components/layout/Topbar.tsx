import type { JSX } from "react/jsx-runtime";
import "./topbar.scss";
import emailIcon from "../../assets/icon/email.svg";
import phoneIcon from "../../assets/icon/call-phone.svg";
import AuthModals from "../../containers/AuthModals";
import { useState } from "react";
import {
  startSessionTimeout,
  clearSessionTimeout,
} from "../../utils/sessionTimeout.ts";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../../services/userServices/authService.ts";
import { useNavigate } from "react-router-dom";

export default function Topbar(): JSX.Element {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openVerifyOtp, setOpenVerifyOtp] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate(); // ✅ v6

  // ✅ Xử lý đăng nhập
  const handleLogin = async (values: any) => {
    try {
      const res = await login({
        email: values.email,
        password: values.password,
      });

      if (res.data?.user) {
        const user = res.data.user;
        setCurrentUser(user);

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", res.data.token); // nếu có token

        // ✅ Điều hướng theo role
        if (user.role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        startSessionTimeout(() => {
          setCurrentUser(null);
          localStorage.removeItem("user");
          alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        });
      }
      setOpenLogin(false);
    } catch {
      alert("Đăng nhập thất bại!");
    }
  };

  // ✅ Đăng ký
  const handleRegister = async (values: any) => {
    try {
      await register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      });
      alert("Đăng ký thành công!");
      setOpenRegister(false);
    } catch {
      alert("Đăng ký thất bại!");
    }
  };

  // ✅ Quên mật khẩu
  const handleForgotPassword = async (values: any) => {
    try {
      await forgotPassword(values.email);
      alert("OTP đã được gửi tới email!");
      setResetEmail(values.email);
      setOpenForgotPassword(false);
      setOpenVerifyOtp(true);
    } catch {
      alert("Không thể gửi OTP!");
    }
  };

  // ✅ Xác thực OTP
  const handleVerifyOtp = async (values: any) => {
    if (!values.otp) {
      alert("Vui lòng nhập OTP!");
      return;
    }
    setOtp(values.otp);
    setOpenVerifyOtp(false);
    setOpenResetPassword(true);
  };

  // ✅ Đặt lại mật khẩu
  const handleResetPassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }
    try {
      await resetPassword({
        email: resetEmail,
        otp: otp,
        newPassword: values.newPassword,
      });
      alert("Đặt lại mật khẩu thành công!");
      setOpenResetPassword(false);
    } catch {
      alert("Không thể đặt lại mật khẩu!");
    }
  };

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
            <>
              <span>
                Xin chào, {currentUser.lastName} {currentUser.firstName}
              </span>
              <span className="sep">|</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentUser(null);
                  clearSessionTimeout();
                  localStorage.removeItem("user");
                  navigate("/"); // ✅ thay history.push
                }}
              >
                Đăng xuất
              </a>
            </>
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
          handleLogin,
          handleRegister,
          handleForgotPassword,
          handleVerifyOtp,
          handleResetPassword,
        }}
      />
    </div>
  );
}
