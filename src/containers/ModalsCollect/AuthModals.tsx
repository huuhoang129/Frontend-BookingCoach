//src/containers/ModalsCollect/AuthModals.tsx
import { Modal, Form, Input, Button, Typography, Space } from "antd";
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import "./authModals.scss";
import { useState } from "react";

const { Title, Text } = Typography;

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
  const [form] = Form.useForm();

  // Loading trạng thái từng hành động
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingForgot, setLoadingForgot] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  // Xử lý đăng nhập
  const handleLoginSubmit = (values: any) => {
    setLoadingLogin(true);
    setTimeout(() => {
      handlers.handleLogin(values);
      setLoadingLogin(false);
    }, 3000);
  };

  // Xử lý đăng ký
  const handleRegisterSubmit = (values: any) => {
    setLoadingRegister(true);
    setTimeout(() => {
      handlers.handleRegister(values);
      setLoadingRegister(false);
    }, 3000);
  };

  // Xử lý quên mật khẩu
  const handleForgotSubmit = (values: any) => {
    setLoadingForgot(true);
    setTimeout(() => {
      handlers.handleForgotPassword(values);
      setLoadingForgot(false);
    }, 3000);
  };

  // Đặt lại mật khẩu
  const handleResetSubmit = (values: any) => {
    setLoadingReset(true);
    setTimeout(() => {
      handlers.handleResetPassword(values);
      setLoadingReset(false);
    }, 3000);
  };

  // Style chung
  const modalStyle: React.CSSProperties = {
    position: "relative",
    borderRadius: 12,
    padding: 24,
  };

  return (
    <>
      {/* Modal đăng nhập */}
      <Modal
        open={openLogin}
        footer={null}
        onCancel={() => setOpenLogin(false)}
        width={400}
        centered
      >
        <div style={modalStyle}>
          <LoadingOverlay spinning={loadingLogin} text="Đang đăng nhập..." />

          <Title level={3} className="auth-title">
            Đăng nhập
          </Title>

          <Form layout="vertical" form={form} onFinish={handleLoginSubmit}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>

            {/* Mở modal quên mật khẩu */}
            <div className="auth-forgot">
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

            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={loadingLogin}
            >
              Đăng nhập
            </Button>

            {/* Chuyển sang đăng ký */}
            <div className="auth-switch">
              <Text>Chưa có tài khoản? </Text>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenLogin(false);
                  setOpenRegister(true);
                }}
              >
                Đăng ký ngay
              </a>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Modal đăng ký */}
      <Modal
        open={openRegister}
        footer={null}
        onCancel={() => setOpenRegister(false)}
        width={420}
        centered
      >
        <div style={modalStyle}>
          <LoadingOverlay
            spinning={loadingRegister}
            text="Đang tạo tài khoản..."
          />

          <Title level={3} className="auth-title">
            Tạo tài khoản mới
          </Title>

          <Form layout="vertical" onFinish={handleRegisterSubmit}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>

            <Space size="small" style={{ display: "flex" }}>
              <Form.Item
                name="firstName"
                label="Tên"
                style={{ flex: 1 }}
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Tên" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Họ"
                style={{ flex: 1 }}
                rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Họ" />
              </Form.Item>
            </Space>

            {/* Số điện thoại */}
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Nhập số điện thoại"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={loadingRegister}
            >
              Đăng ký
            </Button>

            {/* Chuyển sang đăng nhập */}
            <div className="auth-switch">
              <Text>Đã có tài khoản? </Text>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenRegister(false);
                  setOpenLogin(true);
                }}
              >
                Đăng nhập
              </a>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Modal quên mật khẩu */}
      <Modal
        open={openForgotPassword}
        footer={null}
        onCancel={() => setOpenForgotPassword(false)}
        width={400}
        centered
      >
        <div style={modalStyle}>
          <LoadingOverlay
            spinning={loadingForgot}
            text="Đang gửi mã xác thực..."
          />

          <Title level={4} className="auth-title">
            Khôi phục mật khẩu
          </Title>

          <Form layout="vertical" onFinish={handleForgotSubmit}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Nhập email của bạn!" }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập email" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={loadingForgot}
            >
              Gửi mã xác thực
            </Button>
          </Form>
        </div>
      </Modal>

      {/* Modal nhập OTP */}
      <Modal
        open={openVerifyOtp}
        footer={null}
        onCancel={() => setOpenVerifyOtp(false)}
        width={400}
        centered
      >
        <div style={modalStyle}>
          <Title level={4} className="auth-title">
            Xác thực OTP
          </Title>

          <Form layout="vertical" onFinish={handlers.handleVerifyOtp}>
            <Form.Item
              name="otp"
              label="Nhập mã OTP"
              rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
            >
              <Input
                prefix={<SafetyCertificateOutlined />}
                placeholder="Nhập mã gồm 6 chữ số"
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Xác nhận
            </Button>
          </Form>
        </div>
      </Modal>

      {/* Modal đặt lại mật khẩu */}
      <Modal
        open={openResetPassword}
        footer={null}
        onCancel={() => setOpenResetPassword(false)}
        width={400}
        centered
      >
        <div style={modalStyle}>
          <LoadingOverlay
            spinning={loadingReset}
            text="Đang đặt lại mật khẩu..."
          />

          <Title level={4} className="auth-title">
            Đặt lại mật khẩu
          </Title>

          <Form layout="vertical" onFinish={handleResetSubmit}>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[{ required: true, message: "Nhập mật khẩu mới!" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              rules={[{ required: true, message: "Xác nhận lại mật khẩu!" }]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={loadingReset}
            >
              Xác nhận
            </Button>
          </Form>
        </div>
      </Modal>
    </>
  );
}
