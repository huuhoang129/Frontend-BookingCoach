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
  startSessionTimeout,
  clearSessionTimeout,
} from "../../utils/sessionTimeout";

export function useAuth() {
  const navigate = useNavigate();

  // Trạng thái người dùng hiện tại
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Trạng thái các modal
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openVerifyOtp, setOpenVerifyOtp] = useState(false);

  // Khôi phục user từ localStorage khi load ứng dụng
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Xử lý đăng nhập
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
      if (!user) {
        alert("Không tìm thấy thông tin người dùng!");
        return;
      }

      // Lưu thông tin vào localStorage
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.token);

      // Điều hướng theo vai trò
      if (user.role === "Admin") {
        navigate("/admin");
      } else if (user.role === "Driver") {
        navigate("/driver/dashboard");
      } else {
        navigate("/");
      }

      // Thiết lập tự động đăng xuất khi hết phiên
      startSessionTimeout(() => {
        setCurrentUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      });

      setOpenLogin(false);
    } catch {
      alert("Đăng nhập thất bại! Vui lòng thử lại.");
    }
  };

  // Xử lý đăng ký
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

  // Gửi OTP
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

  // Xác minh OTP
  const handleVerifyOtp = async (values: any) => {
    if (!values.otp) {
      alert("Vui lòng nhập OTP!");
      return;
    }

    setOtp(values.otp);
    setOpenVerifyOtp(false);
    setOpenResetPassword(true);
  };

  // Đặt lại mật khẩu
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

  // Đăng xuất
  const handleLogout = () => {
    try {
      console.log("Bắt đầu đăng xuất...");
      console.log("Dữ liệu trước khi xóa:", { ...localStorage });

      // Xóa dữ liệu lưu trữ
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("bookingData");
      localStorage.removeItem("bookings");

      clearSessionTimeout();
      setCurrentUser(null);

      console.log("Dữ liệu sau khi xóa:", { ...localStorage });
      console.log("Chuyển về trang chủ...");

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
