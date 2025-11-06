import { Spin } from "antd";
import "./loadingOverlay.scss";

interface LoadingOverlayProps {
  spinning: boolean;
  text?: string;
  fullscreen?: boolean; // true = che toàn màn hình, false = che khu vực
}

export default function LoadingOverlay({
  spinning,
  text = "Đang xử lý...",
  fullscreen = false,
}: LoadingOverlayProps) {
  if (!spinning) return null;

  return (
    <div className={`loading-overlay ${fullscreen ? "fullscreen" : ""}`}>
      <Spin size="large" tip={text} />
    </div>
  );
}
