import { UserOutlined, CreditCardOutlined } from "@ant-design/icons";
import "../styles/Sider/ProfileSidebar.scss";

interface SidebarProps {
  activeTab: "info" | "history";
  onChangeTab: (tab: "info" | "history") => void;
}

export default function ProfileSidebar({
  activeTab,
  onChangeTab,
}: SidebarProps) {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">User Profile</h2>

      <div
        className={`sidebar-item ${activeTab === "info" ? "active" : ""}`}
        onClick={() => onChangeTab("info")}
      >
        <UserOutlined />
        <span>Thông tin cá nhân</span>
      </div>

      <div
        className={`sidebar-item ${activeTab === "history" ? "active" : ""}`}
        onClick={() => onChangeTab("history")}
      >
        <CreditCardOutlined />
        <span>Lịch sử chuyến đi</span>
      </div>
    </div>
  );
}
