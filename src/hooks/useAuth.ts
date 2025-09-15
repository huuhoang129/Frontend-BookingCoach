import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../services/userServices/authService";
import {
  startSessionTimeout,
  clearSessionTimeout,
} from "../utils/sessionTimeout";

// Hook: useAuth
export function useAuth() {
  const navigate = useNavigate();

  // User state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Modal states
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openVerifyOtp, setOpenVerifyOtp] = useState(false);

  // Handlers
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
        localStorage.setItem("token", res.data.token);

        if (user.role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        // timeout session
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

  const handleLogout = () => {
    setCurrentUser(null);
    clearSessionTimeout();
    localStorage.removeItem("user");
    navigate("/");
  };

  // Return API
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
