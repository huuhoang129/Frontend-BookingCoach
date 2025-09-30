import dayjs from "dayjs";

/**
 * Định dạng lại thời lượng (VD: "04:00:00" -> "4h", "03:30:00" -> "3h30")
 */
export function formatDuration(totalTime?: string) {
  if (!totalTime) return "";
  const [h, m] = totalTime.split(":").map(Number);
  if (m === 0) return `${h}h`;
  return `${h}h${m}`;
}

/**
 * Tính giờ kết thúc từ giờ bắt đầu + totalTime
 */
export function calcEndTime(startTime: string, totalTime?: string) {
  if (!startTime || !totalTime) return "";
  const [h, m] = totalTime.split(":").map(Number);
  return dayjs(startTime, "HH:mm:ss")
    .add(h, "hour")
    .add(m, "minute")
    .format("HH:mm");
}

/**
 * Chuyển "HH:mm:ss" -> "HH:mm"
 */
export function formatStartTime(startTime?: string) {
  if (!startTime) return "";
  return dayjs(startTime, "HH:mm:ss").format("HH:mm");
}
