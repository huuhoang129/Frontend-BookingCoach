// src/components/Notification/AppNotification.tsx
import { notification } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

export function AppNotification() {
  const [api, contextHolder] = notification.useNotification();
  const open = (
    type: "success" | "warning" | "error" | "info",
    message: string,
    description?: string
  ) => {
    // mapping màu theo loại thông báo
    const colorMap: Record<string, string> = {
      success: "#4d940e",
      warning: "#faad14",
      error: "#ff4d4f",
      info: "#1677ff",
    };

    // mapping icon theo loại
    const iconMap: Record<string, React.ReactNode> = {
      success: (
        <CheckCircleOutlined
          style={{ color: colorMap.success, fontSize: 22 }}
        />
      ),
      warning: (
        <ExclamationCircleOutlined
          style={{ color: colorMap.warning, fontSize: 22 }}
        />
      ),
      error: (
        <CloseCircleOutlined style={{ color: colorMap.error, fontSize: 22 }} />
      ),
      info: (
        <InfoCircleOutlined style={{ color: colorMap.info, fontSize: 22 }} />
      ),
    };

    // gọi thông báo
    api.open({
      message: (
        <span
          style={{
            fontWeight: 600,
            fontFamily: "Lexend, sans-serif",
            fontSize: 15,
          }}
        >
          {message}
        </span>
      ),
      description: description ? (
        <span
          style={{
            fontFamily: "Lexend, sans-serif",
            color: "#555",
            fontSize: 13.5,
          }}
        >
          {description}
        </span>
      ) : null,

      icon: iconMap[type],
      placement: "topRight",
      duration: 3.5,

      // popup
      style: {
        borderRadius: 10,
        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
        background: "#fff",
        borderLeft: `5px solid ${colorMap[type]}`,
        padding: "10px 16px",
      },
    });
  };

  // hàm gọi từng loại
  const notifySuccess = (msg: string, desc?: string) =>
    open("success", msg, desc);
  const notifyWarning = (msg: string, desc?: string) =>
    open("warning", msg, desc);
  const notifyError = (msg: string, desc?: string) => open("error", msg, desc);
  const notifyInfo = (msg: string, desc?: string) => open("info", msg, desc);

  // trả về các hàm
  return {
    contextHolder,
    api,
    notifySuccess,
    notifyWarning,
    notifyError,
    notifyInfo,
  };
}
