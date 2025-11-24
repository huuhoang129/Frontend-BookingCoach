import { notification } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

export function useAppNotification() {
  const [api, contextHolder] = notification.useNotification();

  const open = (
    type: "success" | "warning" | "error" | "info",
    message: string,
    description?: string
  ) => {
    const colorMap: Record<string, string> = {
      success: "#4d940e",
      warning: "#faad14",
      error: "#ff4d4f",
      info: "#1677ff",
    };

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
      style: {
        borderRadius: 10,
        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
        background: "#fff",
        borderLeft: `5px solid ${colorMap[type]}`,
        padding: "10px 16px",
      },
    });
  };

  return {
    contextHolder,
    notifySuccess: (msg: string, desc?: string) => open("success", msg, desc),
    notifyWarning: (msg: string, desc?: string) => open("warning", msg, desc),
    notifyError: (msg: string, desc?: string) => open("error", msg, desc),
    notifyInfo: (msg: string, desc?: string) => open("info", msg, desc),
  };
}
