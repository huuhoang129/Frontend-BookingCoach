import { useEffect, useState } from "react";
import { Avatar, Input, Button } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../../../components/Sider/ProfileSidebar";
import "./InformationClientPage.scss";

export default function ProfileInfoPage() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  if (!user)
    return (
      <div className="profile-empty">
        Vui lòng đăng nhập để xem hồ sơ cá nhân.
      </div>
    );

  return (
    <div className="profile-container">
      <ProfileSidebar
        activeTab="info"
        onChangeTab={(tab) => navigate(`/profile/${tab}`)}
      />

      <div className="main-content">
        <div className="user-info-form">
          <div className="user-header">
            <Avatar
              size={90}
              src="https://i.pravatar.cc/100"
              icon={<UserOutlined />}
              className="user-avatar"
            />
            <div className="user-basic">
              <h3>
                {user.firstName} {user.lastName}
              </h3>
              <p className="user-email">{user.email}</p>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-field">
              <label>Họ</label>
              <Input value={user.lastName} prefix={<UserOutlined />} />
            </div>
            <div className="info-field">
              <label>Tên</label>
              <Input value={user.firstName} prefix={<UserOutlined />} />
            </div>
            <div className="info-field">
              <label>Email</label>
              <Input value={user.email} prefix={<MailOutlined />} />
            </div>
            <div className="info-field">
              <label>Số điện thoại</label>
              <Input
                value={user.phoneNumber || ""}
                prefix={<PhoneOutlined />}
              />
            </div>
          </div>

          <Button type="primary" className="save-btn">
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
}
