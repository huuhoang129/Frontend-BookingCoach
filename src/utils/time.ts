// src/utils/time.ts
import dayjs from "dayjs";

// Định dạng thời lượng "HH:mm" thành dạng rút gọn
export function formatDuration(totalTime?: string) {
  if (!totalTime) return "";
  const [h, m] = totalTime.split(":").map(Number);
  return m === 0 ? `${h}h` : `${h}h${m}`;
}

// Tính giờ kết thúc từ giờ bắt đầu + tổng thời gian
export function calcEndTime(startTime: string, totalTime?: string) {
  if (!startTime || !totalTime) return "";
  const [h, m] = totalTime.split(":").map(Number);
  return dayjs(startTime, "HH:mm:ss")
    .add(h, "hour")
    .add(m, "minute")
    .format("HH:mm");
}

// Đổi "HH:mm:ss" → "HH:mm"
export function formatStartTime(startTime?: string) {
  if (!startTime) return "";
  return dayjs(startTime, "HH:mm:ss").format("HH:mm");
}
