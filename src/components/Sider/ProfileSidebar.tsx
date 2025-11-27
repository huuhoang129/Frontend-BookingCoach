import {
  UserOutlined,
  CreditCardOutlined,
  StopOutlined,
} from "@ant-design/icons";
import "../styles/Sider/ProfileSidebar.scss";

interface SidebarProps {
  activeTab: "info" | "history" | "cancellation";
  onChangeTab: (tab: "info" | "history" | "cancellation") => void;
}

export default function ProfileSidebar({
  activeTab,
  onChangeTab,
}: SidebarProps) {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">User Profile</h2>

      {/* Thông tin cá nhân */}
      <div
        className={`sidebar-item ${activeTab === "info" ? "active" : ""}`}
        onClick={() => onChangeTab("info")}
      >
        <UserOutlined />
        <span>Thông tin cá nhân</span>
      </div>

      {/* Lịch sử chuyến đi */}
      <div
        className={`sidebar-item ${activeTab === "history" ? "active" : ""}`}
        onClick={() => onChangeTab("history")}
      >
        <CreditCardOutlined />
        <span>Lịch sử chuyến đi</span>
      </div>

      {/* Yêu cầu hủy vé */}
      <div
        className={`sidebar-item ${
          activeTab === "cancellation" ? "active" : ""
        }`}
        onClick={() => onChangeTab("cancellation")}
      >
        <StopOutlined />
        <span>Yêu cầu hủy vé</span>
      </div>
    </div>
  );
}
