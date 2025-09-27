import { CustomModal } from "../../components/ui/Modal/Modal";
import { FormInput } from "../../components/ui/Form/FormInput";
import CheckBox from "../../components/ui/CheckBox/CheckBox";

// Props
interface AuthModalsProps {
  openLogin: boolean;
  setOpenLogin: (open: boolean) => void;
  openRegister: boolean;
  setOpenRegister: (open: boolean) => void;
  openForgotPassword: boolean;
  setOpenForgotPassword: (open: boolean) => void;
  openResetPassword: boolean;
  setOpenResetPassword: (open: boolean) => void;
  openVerifyOtp: boolean;
  setOpenVerifyOtp: (open: boolean) => void;
  handlers: {
    handleLogin: (values: any) => void;
    handleRegister: (values: any) => void;
    handleForgotPassword: (values: any) => void;
    handleVerifyOtp: (values: any) => void;
    handleResetPassword: (values: any) => void;
  };
}

// AuthModals
export default function AuthModals({
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
}: AuthModalsProps) {
  return (
    <>
      {/* Modal đăng nhập */}
      <CustomModal
        open={openLogin}
        title="Đăng nhập"
        onClose={() => setOpenLogin(false)}
        onSubmit={handlers.handleLogin}
        width={400}
        okText="Đăng nhập"
        cancelText="Đóng"
      >
        <FormInput name="email" label="Email" placeholder="Nhập Email" />
        <FormInput
          name="password"
          label="Mật khẩu"
          placeholder="Nhập Mật Khẩu"
        />
        <CheckBox label="Remember me" />
        <div className="forgot-password">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setOpenLogin(false);
              setOpenForgotPassword(true);
            }}
          >
            Quên mật khẩu?
          </a>
        </div>
      </CustomModal>

      {/* Modal đăng ký */}
      <CustomModal
        open={openRegister}
        title="Đăng ký"
        onClose={() => setOpenRegister(false)}
        onSubmit={handlers.handleRegister}
        width={400}
        okText="Đăng Kí"
        cancelText="Đóng"
      >
        <FormInput name="email" label="Email" placeholder="Nhập Email" />
        <FormInput
          name="password"
          label="Mật Khẩu"
          placeholder="Nhập Mật Khẩu"
        />
        <FormInput name="firstName" label="Tên" placeholder="Nhập Tên" />
        <FormInput name="lastName" label="Họ" placeholder="Nhập Họ" />
        <FormInput
          name="phoneNumber"
          label="Số Điện Thoại"
          placeholder="Nhập Số Điện Thoại"
        />
      </CustomModal>

      {/* Modal quên mật khẩu */}
      <CustomModal
        open={openForgotPassword}
        title="Quên mật khẩu"
        onClose={() => setOpenForgotPassword(false)}
        onSubmit={handlers.handleForgotPassword}
        width={400}
        okText="Xác nhận"
        cancelText="Đóng"
      >
        <FormInput name="email" label="Nhập email để khôi phục" />
      </CustomModal>

      {/* Modal OTP */}
      <CustomModal
        open={openVerifyOtp}
        title="Xác thực OTP"
        onClose={() => setOpenVerifyOtp(false)}
        onSubmit={handlers.handleVerifyOtp}
        width={400}
        okText="Xác nhận"
        cancelText="Đóng"
      >
        <FormInput name="otp" label="Nhập mã OTP" />
      </CustomModal>

      {/* Modal reset mật khẩu */}
      <CustomModal
        open={openResetPassword}
        title="Đặt lại mật khẩu"
        onClose={() => setOpenResetPassword(false)}
        onSubmit={handlers.handleResetPassword}
        width={400}
      >
        <FormInput name="newPassword" label="Mật khẩu mới" />
        <FormInput name="confirmPassword" label="Xác nhận mật khẩu" />
      </CustomModal>
    </>
  );
}
