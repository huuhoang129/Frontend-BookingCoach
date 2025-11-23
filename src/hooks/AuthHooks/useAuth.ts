// src/hooks/AuthHooks/useAuth.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../../services/userServices/authService";

import {
  startInactivityTimer,
  stopInactivityTimer,
} from "../../utils/inactivityLogout";

export function useAuth() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<any>(null);

  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openVerifyOtp, setOpenVerifyOtp] = useState(false);

  // Khi reload trang → khôi phục user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        startInactivityTimer(() => {
          handleLogout();
        });
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // login
  const handleLogin = async (values: any) => {
    try {
      const res = await login({
        email: values.email,
        password: values.password,
      });

      const data = res.data;

      if (data.errCode !== 0) {
        alert(data.errMessage || "Đăng nhập thất bại!");
        return;
      }

      const user = data.user;
      const token = data.token;

      if (!user || !token) {
        alert("Đăng nhập thất bại! Không có token hoặc user.");
        return;
      }

      // Lưu vào localStorage
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // Bắt đầu đếm thời gian không hoạt động
      startInactivityTimer(() => {
        handleLogout();
      });

      // Chuyển trang theo role
      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "Driver") navigate("/driver/dashboard");
      else navigate("/");

      setOpenLogin(false);
    } catch {
      alert("Đăng nhập thất bại! Vui lòng thử lại.");
    }
  };

  // register
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

  // forgot password
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

  const handleVerifyOtp = async (values: any) => {
    if (!values.otp) {
      alert("Vui lòng nhập OTP!");
      return;
    }

    setOtp(values.otp);
    setOpenVerifyOtp(false);
    setOpenResetPassword(true);
  };

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

  // logout
  const handleLogout = () => {
    try {
      stopInactivityTimer();

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("bookingData");
      localStorage.removeItem("bookings");

      setCurrentUser(null);

      window.location.replace("/");
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    }
  };

  return {
    currentUser,
    setCurrentUser,

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

    handlers: {
      handleLogin,
      handleRegister,
      handleForgotPassword,
      handleVerifyOtp,
      handleResetPassword,
      handleLogout,
    },
  };
}
